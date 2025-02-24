# API

Summary of the Lingomio API:

#### Views and PRG (Post/Redirect/Get)

- **GET /**: Renders the index page.
- **GET /login**: Renders the login page if the user is not logged in, otherwise redirects to the index page.
- **POST /login**: Authenticates the user and redirects to the index page if successful, otherwise re-renders the login page with an error.
- **GET /register**: Renders the registration page if the user is not logged in, otherwise redirects to the index page.
- **POST /register**: Registers a new user, logs them in, and redirects to the index page if successful, otherwise re-renders the registration page with an error.
- **POST /logout**: Logs out the user and redirects to the index page.

#### JSON API

- **GET /api**: Returns a success response.
- **GET /api/user**: Returns the authenticated user's information.
- **POST /api/register**: Registers a new user and logs them in, returning the registration result.
- **POST /api/login**: Authenticates the user and returns the login result.
- **POST /api/logout**: Logs out the user and returns a success response.

#### Books API

- **GET /api/books**: Returns a list of books for the authenticated user.
- **GET /api/book/:cuid**: Returns the details of a specific book for the authenticated user.
- **POST /api/book/:cuid**: Creates or updates a book for the authenticated user.