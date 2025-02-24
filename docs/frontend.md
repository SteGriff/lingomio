# Frontend

## Functionality

Summary of the frontend functionality:

#### Service Worker

- **Service Worker Registration**: Checks if the browser supports service workers and registers one if available (currently commented out).

#### Constants and Factories

- **CONTENT**: Key for storing the current book in local storage.
- **USER**: Key for storing the user model in local storage.
- **elementFactory**: Instance of `ElementFactory` for creating elements.
- **nameFactory**: Instance of `NameFactory` for generating names.

#### Utility Functions

- **storageLoad(key)**: Loads and parses JSON data from local storage by key.
- **newBook()**: Creates a new book object with a generated name, unique ID, and initial elements.
- **timeSince(uts)**: Calculates the time elapsed since a given Unix timestamp and returns a human-readable string.

#### PetiteVue Application

- **Data Properties**:
  - `message`, `dialog`, `menu`, `copied`, `books`, `currentBook`, `selected`, `selectedWord`, `addPoint`, `addToolLocation`, `sortLocal`, `pasteFailContent`, `importing`, `importContent`, `userModel`, `username`, `password`

- **Lifecycle Hooks**:
  - `mounted()`: Initializes the application, sets up event listeners, checks the user session, and loads data from local storage.

- **Computed Properties**:
  - `maxOrdinal()`: Returns the maximum order value among the current book's elements.
  - `nextOrdinal()`: Returns the next available order value for a new element.
  - `orderedElements()`: Returns the current book's elements sorted by order.
  - `allVocab()`: Returns all vocabulary words from the current book's elements, optionally sorted by local or foreign language.

- **Methods**:
  - `select(element, word)`: Selects an element and optionally a word within it.
  - `hideElementTools()`: Hides the element tools.
  - `toggleTools(element)`: Toggles the visibility of the element tools.
  - `add(elementType)`: Adds a new element of the specified type to the current book.
  - `remove(element)`: Removes an element from the current book.
  - `addWord(element)`: Adds a new word to an element.
  - `removeWord(element, wordId)`: Removes a word from an element.
  - `moveUp(element)`: Moves an element up in the order.
  - `moveDown(element)`: Moves an element down in the order.
  - `blur()`: Saves the current book.
  - `save()`: Saves the current book to local storage and the server.
  - `saveName()`: Saves the current book's name and closes the dialog.
  - `copy(content, label)`: Copies content to the clipboard and shows a toast message.
  - `copyText()`, `copyVocab()`, `copyJson()`: Copies the current book's content, vocabulary, or JSON representation to the clipboard.
  - `load()`: Loads elements from the import content.
  - `toast(msg)`: Shows a toast message.
  - `untoast()`: Hides the toast message.
  - `login()`: Logs in the user and sets the user model.
  - `logout()`: Logs out the user and clears the user model.
  - `setUser(model)`: Sets the user model and loads the user's books.
  - `checkSession()`: Checks the user session and sets the user model if authenticated.
  - `booksDialog()`: Opens the books dialog and loads the user's books.
  - `getBooksList()`: Fetches the list of books for the authenticated user.
  - `postBook()`: Saves the current book to the server.
  - `startNew()`: Saves the current book and creates a new one.
  - `loadBook(book)`: Loads a book by its unique ID.
