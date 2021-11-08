# Gosia's House of Games API

## Welcome to my API! 🌵🎮 🎲 

This document provides a summary of the project as well as guidelines and examples on how to best use this API. 

---

## YOU CAN FIND MY HOSTED VERION HERE: 

### https://nc-games-by-gosia.herokuapp.com/api

---

## SUMMARY OF THE PROJECT

The intention of this project was to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

This API is written using:
- `Node.js`
- `PostgreSQL` to create the database
- `jest`, `jest-sorted` and `supertest` for testing purposes


It aims to demonstrate the knowledge on:

- `Callback functions`,
- `RESTful endpoints`,
- `MVC Pattern (Model-View-Controller)`,
- `Use of routers`,
- `Advanced error handling`,
- `Seeding`,
- `Complex queries`.

---
## MINIMUM SETUP REQUIREMENTS

Please make sure you have the following installed in order to use this API:

- **Node.js v16.9.1** - Instructions on how to intall [here](https://nodejs.dev/learn/how-to-install-nodejs)
- **PostgreSQL 12.8** - Instructions on how to install [here](https://www.postgresql.org/docs/9.3/tutorial-install.html)

---
## SETUP INSTRUCTIONS


1. **`Clone this repo`** - Paste the below command into your terminal (in the directory of your choosing):
    
        git clone https://github.com/gosiamaria/Northcoders-be-games.git

2. **`Open the repo in a code editor`** such as VSCode, then open your integrated terminal.

3. **`Install all required dependencies`** by pasting the below code into your terminal:

        npm install
        npm install --dev

4. **`Setup the development and test databases`** by pasting the below command into the terminal: 

        npm run setup-dbs

5. **`Create the below two .env files`** in order to link to the correct database when testing or using the API. They can just live in Northcoders-be-games folder

- .env.test - open the file and paste the below line inside. Save the file

```http
PGDATABASE=nc_games_test
```
 - .env.development - open the file and paste the below line inside. Save the file
```http
PGDATABASE=nc_games
```
6. **`Populate the database`** - Paste the below code into your terminal:

        npm run seed

7. **`Test`** the API by using the included tests in the __tests__ folder and running the below command:

        npm test app

---
## VOILA!
Hope you enjoy this API, feel free to drop me a msg with any questions!


