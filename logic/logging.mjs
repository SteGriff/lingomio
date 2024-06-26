export const writeLog = (db, eventKey, key, text) => {
  const dbResult = db
    .prepare(
      "insert into [Logging] (Created, Event, Key, Text) values (unixepoch(), ?, ?, ?)"
    )
    .run(eventKey, key, text);
};

export const EVT_LOGIN = "LOGIN";
export const EVT_REGISTER = "REGISTER";
export const EVT_BOOK_CREATE = "BOOKCREATE";
export const EVT_BOOK_UPDATE = "BOOKUPDATE";