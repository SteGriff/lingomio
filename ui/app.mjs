import cuid from "cuid";
import { ElementFactory } from "./elements.mjs";
import { NameFactory } from "./names";
import { getTimeSince } from "./time";
if ("serviceWorker" in navigator) {
  //navigator.serviceWorker.register("sw.js");
}
const CONTENT = "savedBook";
const USER = "user";
const elementFactory = new ElementFactory();
const nameFactory = new NameFactory();

const storageLoad = (key) => {
  console.log("storageLoad");
  const json = window.localStorage.getItem(key);
  if (json) {
    const saved = JSON.parse(json);
    return saved || null;
  }
};

const newBook = () => {
  return {
    name: nameFactory.nameForA("book"),
    cuid: cuid(),
    elements: elementFactory.initElements(),
    knownLanguage: 'en',
    learningLanguage: 'es'
  }
};

PetiteVue.createApp({
  message: null,
  dialog: null,
  menu: false,
  copied: null,
  books: [],
  currentBook: newBook(),
  selected: null,
  selectedWord: null,
  addPoint: 0,
  addToolLocation: null,
  sortLocal: false,
  pasteFailContent: "",
  importContent: "",
  userModel: null,
  username: '',
  password: '',
  explanation: null,
  explaining: false,
  elementFactory,
  nameFactory,
  async mounted() {
    console.log("mounted");
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.dialog) this.dialog = null;
        else if (this.menu) this.menu = false;
      }
    });

    // Check session
    await this.checkSession();

    // Load from LS
    this.currentBook = storageLoad(CONTENT) || this.currentBook();
    this.userModel = storageLoad(USER) || this.userModel;
    // Set up
    this.addPoint = this.nextOrdinal();
  },
  // Computed
  maxOrdinal() {
    const max = Math.max(...this.currentBook.elements.map((e) => e.order)) || 0;
    return max;
  },
  nextOrdinal() {
    if (!this.currentBook.elements?.length) this.bookBroken();
    const max = Math.max(...this.currentBook.elements.map((e) => e.order)) || 0;
    console.log("nextOrdinal", max + 1);
    return max + 1;
  },
  orderedElements() {
    console.log("orderedElements", this.currentBook.elements?.length)
    if (!this.currentBook.elements?.length) this.bookBroken();
    return this.currentBook.elements.sort((a, b) => a.order - b.order);
  },
  bookBroken() {
    console.log("bookBroken");
    this.toast("This book is broken - paste a valid JSON book, or load another.");
    this.dialog = "IMPORT";
  },
  allVocab() {
    const all = [...this.currentBook.elements].flatMap((e) => e.words);
    const allWords = all.filter((e) => e.foreign > "");
    const allUsages = all.filter((e) => e.phrase > "");
    if (this.sortLocal) allWords.sort((a, b) => a.local.localeCompare(b.local));
    else allWords.sort((a, b) => a.foreign.localeCompare(b.foreign));

    allWords.forEach((w) => {
      w.usages = allUsages.filter(
        (u) => u.phrase.search(new RegExp(w.foreign, "i")) !== -1
      );
    });
    return allWords;
  },
  isSel(element) {
    return element.id === this.selected;
  },
  showTools(element) {
    const isOpenOnElement =
      this.addToolLocation === "ELEMENT" &&
      this.isSel(element) &&
      this.addPoint === element.order;
    const isOpenAtEnd =
      this.addToolLocation === "END" && element.order === this.maxOrdinal();
    return isOpenOnElement || isOpenAtEnd;
  },
  // Methods
  select(element, word) {
    this.menu = false;
    const prevSelected = this.selected;
    this.selected = element.id;
    if (word) this.selectedWord = word.id;
    if (this.selected !== prevSelected) this.hideElementTools();
  },
  hideElementTools() {
    if (this.addToolLocation === "ELEMENT") this.addToolLocation = null;
    console.log("hideElementTools", this.addToolLocation, this.addPoint);
  },
  toggleTools(element) {
    this.menu = false;
    const toolLocationTarget = element ? "ELEMENT" : "END";
    this.addPoint = element ? element.order : this.nextOrdinal();
    this.addToolLocation =
      this.addToolLocation === toolLocationTarget ? null : toolLocationTarget;
    console.log("toggleTools", this.addToolLocation, this.addPoint);
  },
  add(elementType) {
    this.menu = false;
    const order =
      this.addToolLocation === "END" ? this.maxOrdinal() : this.addPoint;

    // Shunt down existing elements
    const newOrdinal = order + 1;
    this.currentBook.elements
      .filter((e) => e.order >= newOrdinal)
      .forEach((e) => (e.order += 1));

    // Add new element
    const newEl = this.elementFactory.createElement(
      elementType || this.elementFactory.gloss,
      newOrdinal
    );
    this.currentBook.elements.push(newEl);
    console.log("add", order, elementType);
    this.save();
  },
  remove(element) {
    const removeIndex = this.currentBook.elements.findIndex((e) => e.id === element.id);
    console.log("remove removeIndex", removeIndex, this.currentBook.elements);
    this.currentBook.elements.splice(removeIndex, 1);
    // Renumber elements to remove ordinal gaps
    this.currentBook.elements
      .sort((a, b) => a.order - b.order)
      .forEach((el, index) => {
        el.order = index;
      });
    this.save();
  },
  addWord(element) {
    const newWord = this.elementFactory.createWord();
    element.words.push(newWord);
    this.select(element, newWord);
    this.save();
  },
  removeWord(element, wordId) {
    const removeIndex = element.words.findIndex((w) => w.id === wordId);
    console.log("removeWord removeIndex", removeIndex, element.words);
    element.words.splice(removeIndex, 1);
    this.save();
  },
  moveUp(element) {
    const newOrder = element.order - 1;
    const swapElement = this.currentBook.elements.find((e) => e.order === newOrder);
    if (swapElement) swapElement.order += 1;
    element.order = newOrder;
  },
  moveDown(element) {
    const newOrder = element.order + 1;
    const swapElement = this.currentBook.elements.find((e) => e.order === newOrder);
    if (swapElement) swapElement.order -= 1;
    element.order = newOrder;
  },
  async explain(element) {
    if (element.words[0].explanation) {
      this.explanation = element.words[0].explanation;
      this.dialog = "EXPLAIN";
      return;
    }

    this.explaining = true;
    const data = {
      text: element.words[0].phrase,
      learningLanguage: this.currentBook.learningLanguage
    };
    const url = "/api/explain/";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    this.explaining = false;
    if (response.status === 401) {
      this.setUser(null);
      return;
    }
    if (response.status === 403) {
      this.message = json.message;
      return;
    }
    const json = await response.json();
    if (json.status !== "OK")
      this.message = json.message;

    console.log("explained", json);
    this.explanation = json.model;
    element.words[0].explanation = json.model;
    this.dialog = "EXPLAIN";
  },
  blur() {
    this.save();
  },
  save() {
    if (!this.currentBook.cuid)
      this.currentBook.cuid = cuid();

    console.log("Save", this.currentBook.cuid);

    // Save to LS
    const json = JSON.stringify(this.currentBook);
    window.localStorage.setItem(CONTENT, json);

    // Save to server if we're logged in
    // and the elements have been changed from initial book
    const hasChanged = !this.elementFactory.isUnchangedElements(this.currentBook.elements);
    if (this.userModel && hasChanged) {
      this.postBook();
    }
  },
  saveName() {
    this.save();
    this.dialog = null;
  },
  copy(content, label) {
    try {
      navigator.clipboard.writeText(content);
      this.copied = label;
      window.setTimeout(() => (this.copied = null), 3000);
    } catch (e) {
      this.pasteFailContent = content;
      this.copied = false;
    }
  },
  copyText() {
    const allLinesContent = this.currentBook.elements
      .map((e) => this.elementFactory.elementString(e))
      .join("\r\n");
    this.copy(allLinesContent, "TEXT");
  },
  copyVocab() {
    const allVocabContent = this.allVocab()
      .map((w) => this.elementFactory.vocabString(w))
      .join("\r\n");
    this.copy(allVocabContent, "VOCAB");
  },
  copyJson() {
    const json = JSON.stringify(this.currentBook.elements);
    this.copy(json, "JSON");
  },
  load(overwrite) {
    if (!overwrite) {
      // Save the current book, get a new one, 
      this.save();
      this.currentBook = newBook();
    }
    // Overwrite current book (or new one we just made), and save to server
    this.currentBook.elements = JSON.parse(this.importContent);
    this.importContent = "";
    this.save();
  },
  toast(msg) {
    this.message = msg;
    window.setTimeout(this.untoast, 3000);
  },
  untoast() { this.message = null; },
  async login() {
    const data = { "username": this.username, "password": this.password };
    const response = await fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const json = await response.json();
    if (json.status === "OK") {
      this.setUser(json.model);
      this.username = '';
      this.password = '';
      this.message = null;
      this.menu = false;
    }
    else {
      this.message = json.message;
    }
  },
  async logout() {
    console.log("logout");
    await fetch("/api/logout/", {
      method: "POST"
    });
    this.userModel = null;
    // TODO - Clear all books/data?
  },
  setUser(model) {
    console.log("setUser", model);
    this.userModel = model;
    if (model) {
      this.dialog = null;
      this.getBooksList();
      this.save(); // Newly reg user - save their book
    }
    else
      this.toast("Log in to sync data");
  },
  async checkSession() {
    try {
      const response = await fetch("/api/user");
      if (response.status === 401) {
        this.setUser(null);
        return;
      }
      const json = await response.json();
      if (json.status === "OK") {
        this.setUser(json.model);
      }
    } catch (error) {
      console.log("Catch checkSession", error);
    }
  },
  booksDialog() {
    this.dialog = "BOOKS";
    this.getBooksList();
  },
  async getBooksList() {
    const response = await fetch("/api/books");
    if (response.status === 401) {
      this.setUser(null);
      return;
    }
    const json = await response.json();
    console.log("getBooksList", json);
    if (json.status === "OK") {
      this.books = json.model;
    }
  },
  async postBook() {
    const data = this.currentBook;
    const url = "/api/book/" + data.cuid;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.status === 401) {
      this.setUser(null);
      return;
    }
    const json = await response.json();
    if (json.status !== "OK")
      this.message = json.message;
  },
  async startNew() {
    this.save();
    if (!this.userModel) {
      this.dialog = "LOGIN";
      return;
    }
    const lastBookName = this.currentBook.name;
    this.currentBook = newBook();
    this.toast(`Saved ${lastBookName} and created ${this.currentBook.name} ✨`);
  },
  async loadBook(book) {
    this.save();
    console.log("load", book.cuid);
    if (!this.userModel) {
      this.dialog = "LOGIN";
      return;
    }
    const response = await fetch("/api/book/" + book.cuid);
    const json = await response.json();
    const bookModel = json.model;
    bookModel.elements = JSON.parse(bookModel.elementsJson);
    delete bookModel["elementsJson"];
    this.currentBook = bookModel;
    this.toast(`Loaded ${this.currentBook.name}`);
    this.dialog = null;
    this.menu = false;
  },
  timeSince(uts) { return getTimeSince(uts) }
}).mount();
