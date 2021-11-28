# Scholarly

This repository contains the code for Scholarly website, a learning platform developed as a part of Microsoft Engage 2021.

The link to the website: https://scholarly-app-74aa37wu.netlify.app/

## Prerequisites
* Node.js (tested with v14.18.0) and npm

## Setup Instructions

Following are the steps to be followed for different actions

1. Install the dependencies and run the server
    ```
    $ cd server
    $ npm install
    $ npm run start
    ```

2. Install the dependencies and run the React app
    ```
    $ cd frontend
    $ npm install
    $ npm run start
    ```

3. Run the lint tests for the server or frontend
    ```
    $ cd <server/frontend>
    $ npm run lint
    ```

## Configuration Environment variables used

```
DATABASE_CLIENT_URL (To connect to MongoDB server)
JWT_KEY
BBB_URL
BBB_SECRET (To connect to Big blue button server)
REACT_APP_BACKEND_URL
REACT_APP_GOOGLE_CLIENT_ID (For Google OAuth)
```

## Code Structure

```
```bash
├── .github
|   └── workflows # github actions definitions
|── frontend
    ├── public # (to be added)
    │   └── # static files 
    ├── src
    │   ├── services
    │   │   └── *.js # define different API callers here
    │   ├── components
    │   │   └── *.js # define different react components here
    │   └── index.js
    ├── package.json
    ├── .env
|── server
    ├── db
    |   └── # different models
    ├── middleware
    |   └── **/*.js # middlewares
    ├── routes
    │   └── # different routers
    ├── services
    |   └── # business logic goes here
    ├── index.js
    ├── config.js
    ├── Logger.js
    ├── package.json
    ├── .env
|── server
    ├── # Postman API tests
├── .gitignore
└── README.md
```

## Project Architecture
![image](https://user-images.githubusercontent.com/43881774/143779362-cab44090-5a5d-496f-81fd-0a8fc27edcc6.png)

## ER Diagram
![image](https://user-images.githubusercontent.com/43881774/143779398-53143d08-5cac-44a3-9ae1-e93671698849.png)

For more details, read the design document
