# Concepts in Lingomio

## Elements

 - **Element**: a component or unit within a book. Each element can contain various types of content, such as text, vocabulary words, or phrases. Elements are ordered within the book and can be manipulated (added, removed, moved) by the user. Each element has properties like `id`, `order`, and `words`, which help in organizing and managing the content within the book.

## Words

 - **Words**: within an element refer to individual vocabulary words or phrases that are part of the element's content. An element can contain multiple words, and these words have properties such as `id`, `foreign`, `local`, and `phrase`. The words are used to build vocabulary lists and can be displayed in the following ways:

1. **Vocabulary List**: A list of all words within the current book, optionally sorted by local or foreign language.
2. **Element View**: Words are displayed within their respective elements, showing both the foreign and local translations.
3. **Usage Examples**: Words can be linked to phrases or sentences that demonstrate their usage.


## Books

- **Books**: A book is a collection of elements. Each book has properties such as `name`, `cuid` (a unique identifier), and `elements`. Users can create, update, and manage multiple books.

## Users

- **Users**: Users are authenticated entities that can log in, register, and manage their books. User information is stored in the session and can be accessed via the API.

## Sessions

- **Sessions**: Sessions are used to maintain user authentication state across requests. The app uses `express-session` with a SQLite store to manage sessions securely.

## API Endpoints

- **API Endpoints**: The app provides various API endpoints for user authentication, book management, and session handling. These endpoints return JSON responses and are protected by authentication middleware where necessary.

See `api.md`

## Views and PRG (Post/Redirect/Get)

- **Views and PRG**: The app uses server-side rendering for views such as the index, login, and registration pages. The Post/Redirect/Get pattern is used to handle form submissions and redirects.

## Local Storage

- **Local Storage**: The app uses the browser's local storage to save the current book and user model. This allows for offline access and persistence of data between sessions.

## PetiteVue

- **PetiteVue**: The frontend is built using PetiteVue, a lightweight version of Vue.js. It provides reactive data binding and component-based architecture for managing the app's state and UI.

## ElementFactory and NameFactory

- **ElementFactory**: A factory class responsible for creating new elements and words. It provides methods for initializing elements and generating element strings.
- **NameFactory**: A factory class responsible for generating names for books and other entities.

## Utility Functions

- **Utility Functions**: Various utility functions are used throughout the app, such as `storageLoad` for loading data from local storage, `timeSince` for calculating elapsed time, and `trySetSessionUser` for setting the session user after authentication.
