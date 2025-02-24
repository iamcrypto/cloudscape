import 'dotenv/config'

import express from 'express';
import configViewEngine from './src/config/configEngine';
import routes from './src/routes/web';
import cronJobContronler from './src/controllers/cronJobContronler';
import socketIoController from './src/controllers/socketIoController';
const cors = require('cors');

const corsOptions = {
    origin: 'https://api.bulkcampaigns.com', // Allow only requests from this origin
    methods: 'GET,POST', // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'] ,
    optionsSuccessStatus: 200 // Allow only these headers
};

require('dotenv').config();
let cookieParser = require('cookie-parser');



const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server);




const port =   process.env.PORT;

app.use(cookieParser());


// app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup viewEngine
configViewEngine(app);


// init Web Routes
routes.initWebRouter(app);

// Cron game 1 Phut 
cronJobContronler.cronJobGame1p(io);

// Check xem ai connect vào sever 
socketIoController.sendMessageAdmin(io);

// app.all('*', (req, res) => {
//     return res.render("404.ejs"); 
// });

server.listen(port, () => {
    console.log("http://localhost:" + port);
});

