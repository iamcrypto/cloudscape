
import 'dotenv/config'

import express from 'express';
import configViewEngine from './src/config/configEngine';
import routes from './src/routes/web';
import cronJobContronler from './src/controllers/cronJobContronler';
import socketIoController from './src/controllers/socketIoController';
const cors = require('cors');
import fileUpload from 'express-fileupload';
var AWS = require('aws-sdk');



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
app.use(fileUpload())
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port =   process.env.PORT;

app.use(cookieParser());

app.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;
    let c_rate;
    let c_username;
    let c_upi_id;
    let c_upi_wallet;
    let c_image;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    sampleFile = req.files.fileUploaded;
    c_rate = req.body.edit_rate;
    c_username = req.body.edit_username;
    c_upi_id = req.body.edit_qr_id;
    c_upi_wallet = req.body.edit_upi_id;
    c_image = req.body.qr_code_image_hdd;
    console.log(c_rate);
    console.log(c_username);
    console.log(c_upi_id);
    console.log(c_upi_wallet);
    console.log(sampleFile.name);
    console.log(c_image);
    uploadPath = __dirname + '/src/public/qr_code_collo/' + sampleFile.name;
  
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
      console.log("uploaded");
    });


  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey:process.env.AWS_SEREATEACCESSKEY
  });
  


  const s3 = new AWS.S3();

  // Binary data base64
  const fileContent  = Buffer.from(req.files.fileUploaded.data, 'binary');

  // Setting up S3 upload parameters
  const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: sampleFile.name, // File name you want to save as in S3
      Body: fileContent 
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      res.send({
          "response_code": 200,
          "response_message": "Success",
          "response_data": data
      });
  });


  });


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
