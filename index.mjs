import express from "express";
import Database from "better-sqlite3";
import createSqliteStore from "better-sqlite3-session-store";
import session from "express-session";
import * as dotenv from "dotenv";
import path from "path";
import { sste } from "./sste.js";
import { fileURLToPath } from "url";
import { authenticateUser, createUser, auth } from "./logic/auth.mjs";
import { getSuccess, getError, isSuccess } from "./results.mjs";
import { createOrUpdateBook, getBook, getBooks } from "./logic/books.mjs";
import { LLM, TTS, checkAndIncreaseUsage } from "./logic/quota.mjs";
import { explain } from "./logic/explain/explain.mjs";
import { getUserQuota } from "./logic/quota.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up Express
const app = express();

// Parse application/x-www-form-urlencoded and application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Gets NODE_ENV, which defaults to development.
const isDev = app.get("env") === "development";
if (!isDev) app.set('trust proxy', true);

// Set the view engine to our custom engine
app.engine('htm', sste);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'htm');

dotenv.config();

app.use(express.static("public"));

// DB and Auth
const db = new Database(".data/app.db");
db.pragma("journal_mode = WAL");

const SqliteStore = createSqliteStore(session);

// https://jscrambler.com/blog/best-practices-for-secure-session-management-in-node
app.use(
  session({
    store: new SqliteStore({
      client: db,
      expired: {
        clear: true,
        intervalMs: 900000, //ms = 15min
      },
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "lingomio",
    cookie: {
      httpOnly: true,
      secure: !isDev,
      sameSite: true,
      maxAge: 600_000, // ms
    },
  })
);

// Reusable bits

const trySetSessionUser = async (req) => {
  const result = await authenticateUser(
    db,
    req.body.username,
    req.body.password
  );
  req.session.user = result.model;
  return result;
};

const getModel = (req) => {
  return { user: req.session?.user };
};

// Routes
// - Views and PRG

app.get("/", (req, res) => res.render("index", getModel(req)));

app.get("/login", (req, res) => {
  if (req.session.user) res.redirect("/");
  else res.render("login", getModel(req));
});
app.post("/login", async (req, res) => {
  const loginResult = await trySetSessionUser(req);
  if (isSuccess(loginResult)) res.redirect("/");
  else res.render("login", loginResult);
});

app.get("/register", (req, res) => {
  if (req.session.user) res.redirect("/");
  else res.render("register", getModel(req));
});
app.post("/register", async (req, res) => {
  const registrationResult = await createUser(db, req.body);
  if (isSuccess(registrationResult)) {
    await trySetSessionUser(req);
    res.redirect("/");
  } else res.render("register", registrationResult);
});

app.post("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// - JSON API

app.get("/api", async (_, res) => {
  return res.json(getSuccess());
});

app.get("/api/user", auth, async (req, res) => {
  return res.json(getSuccess(req.session.user));
});

app.get("/api/quota", auth, async (req, res) => {
  const userId = req.session.user.id;
  const periodStart = getCurrentPeriodStart(db);
  const userQuota = getUserQuota(db, userId, periodStart);

  if (!userQuota) {
    return res.status(404).json(getError("Quota not found"));
  }

  return res.json(getSuccess(userQuota));
});

app.post("/api/register", async (req, res) => {
  const registrationResult = await createUser(db, req.body);
  if (isSuccess(registrationResult))
    await trySetSessionUser(req);
  return res.json(registrationResult);
});

app.post("/api/login", async (req, res) => {
  const response = await trySetSessionUser(req);
  return res.json(response);
});

app.post("/api/logout", async (req, res) => {
  req.session.destroy();
  const response = getSuccess();
  return res.json(response);
});

// Books
app.get("/api/books", auth, async (req, res) => {
  const userId = req.session.user.id;
  return res.json(getBooks(db, userId, true));
});

app.get("/api/book/:cuid", auth, async (req, res) => {
  const bookCuid = req.params.cuid;
  const userId = req.session.user.id;
  console.log("GET book", bookCuid)
  const result = getBook(
    db,
    bookCuid,
    userId
  );
  return res.json(result);
});

app.post("/api/book/:cuid", auth, async (req, res) => {
  const bookCuid = req.params.cuid;
  const userId = req.session.user.id;
  console.log("POST book", bookCuid, userId)
  const knownLanguage = req.body.knownLanguage ?? "en";
  const learningLanguage = req.body.learningLanguage ?? "es";
  const result = createOrUpdateBook(
    db,
    bookCuid,
    req.body.name,
    userId,
    req.body.elements,
    knownLanguage,
    learningLanguage
  );
  return res.json(result);
});

// Explain endpoint
app.post("/api/explain", auth, async (req, res) => {
  const userId = req.session.user.id;

  if (!checkAndIncreaseUsage(db, userId, LLM)) {
    return res.status(403).send(getError("Quota exceeded"));
  }
  const text = req.body.text;
  const languageCode = req.body.learningLanguage;
  const apiName = process.env.LLM;

  console.log("explain", apiName, languageCode, text);
  const explanation = await explain(text, apiName);
  const response = getSuccess(explanation);
  return res.json(response);
});

// Speak endpoint
app.post("/api/speak", auth, async (req, res) => {
  const userId = req.session.user.id;

  if (!checkAndIncreaseUsage(db, userId, TTS)) {
    return res.status(403).send(getError("Quota exceeded"));
  }

  // TODO: Use Azure Cognitive Services to speak in the learningLanguage of the book
  // Picking an appropriate voice profile
  const response = getSuccess("Not implemented");
  return res.json(response);
});

// Start server
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/, isDev:${isDev}`);
});
