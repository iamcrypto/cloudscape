package.json

The package.json file is the configuration file for the Node.js project. It defines the project's metadata, scripts, and dependencies.

Key Sections:
Metadata:
```{
    "name": "cloudscape",
    "version": "2.0.0",
    "description": "This project is blockchain based contract taking web3 app",
    "main": "server.js",
    "author": "",
    "license": "ISC"
}
```

name: The name of the project.
version: The version of the project.
main: The entry point file for the project.
license: The license for the project.

```{
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "database": "nodemon --exec ./node_modules/.bin/babel-node src/modal/CreateDatabase.js",
        "start": "nodemon --exec ./node_modules/.bin/babel-node server.js"
    }
}
```

test: A script placeholder for running tests.
database: A script to run the CreateDatabase.js script using nodemon and babel-node.
start: A script to start the server using nodemon and babel-node.

Dependencies:
```{
    "dependencies": {
        "@babel/core": "7.15.5",
        "@babel/node": "7.15.4",
        "@babel/preset-env": "7.15.6",
        "92lottery": "file:",
        "axios": "^1.6.7",
        "babel-core": "^7.0.0-bridge.0",
        "body-parser": "^1.20.2",
        "connect-redis": "^8.0.1",
        "cookie-parser": "^1.4.6",
        "cors": "^2.8.5",
        "dotenv": "^16.4.5",
        "ejs": "^3.1.8",
        "express": "^4.17.1",
        "express-session": "^1.18.1",
        "i18n": "^0.15.1",
        "iconv-lite": "^0.6.3",
        "jsonwebtoken": "^9.0.2",
        "lodash": "^4.17.21",
        "md5": "^2.3.0",
        "moment": "^2.30.1",
        "mysql2": "^3.12.0",
        "node-cron": "^3.0.0",
        "nodemon": "^3.1.9",
        "querystring": "^0.2.1",
        "request": "^2.88.2",
        "socket.io": "^4.4.1",
        "uuid": "^9.0.1"
    }
}
```
Lists all the dependencies required for the project.

server.js
The server.js file is the main entry point for the server of the cloudscape web application. It sets up the server, configures middleware, and initializes routes and controllers.

Workflow:
Imports and Requires:
```js
import 'dotenv/config'
import express from 'express';
import configViewEngine from './src/config/configEngine';
import routes from './src/routes/web';
import cronJobContronler from './src/controllers/cronJobContronler';
import socketIoController from './src/controllers/socketIoController';
const cors = require('cors');
require('dotenv').config();
let cookieParser = require('cookie-parser');
```
Loads environment variables, Express framework, custom modules, and middleware.

CORS Configuration:
```js
const corsOptions = {
    origin: 'https://api.bulkcampaigns.com',
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
```
Configures CORS to allow requests only from https://api.bulkcampaigns.com.

Express Application Setup:

```js
const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server);
```
Creates an instance of an Express app.
Uses CORS middleware.
Sets up HTTP server and Socket.io server.
Middleware Configuration:

```js
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

Uses cookie parsing middleware.
Configures Express to parse URL-encoded and JSON request bodies.

View Engine and Routes:

```js
configViewEngine(app);
routes.initWebRouter(app);
```
Sets up the view engine using configViewEngine.
Initializes web routes with routes.initWebRouter.

Socket.io and Cron Jobs:

```js
cronJobContronler.cronJobGame1p(io);
socketIoController.sendMessageAdmin(io);
```
Initializes a cron job for a game using cronJobContronler.
Monitors connections to the server with socketIoController.

Server Initialization:
```js
const port = process.env.PORT;
server.listen(port, () => {
    console.log("http://localhost:" + port);
});
```
Starts the server on the port specified in the environment variables.










