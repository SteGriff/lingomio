import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Hello query @", __dirname);

console.log("Connect DB");
const db = new Database(".data/app.db");
db.pragma("journal_mode = WAL");

console.log("USERS");
db.prepare("select ID, Username, Active from [User]").all().forEach((r) => {
  console.log(r);
});

console.log("BOOKS");
db.prepare("select Cuid, Name, OwnerId, Updated from [Book]").all().forEach((r) => {
  console.log(r);
});
