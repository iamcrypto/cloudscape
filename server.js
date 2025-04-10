
import 'dotenv/config'
import connection from "./src/config/connectDB";
import express from 'express';
import configViewEngine from './src/config/configEngine';
import routes from './src/routes/web';
import cronJobContronler from './src/controllers/cronJobContronler';
import socketIoController from './src/controllers/socketIoController';
const cors = require('cors');
import fileUpload from 'express-fileupload';
const path = require('path');

import { S3Client, CreateBucketCommand,DeleteObjectCommand,PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({region: process.env.AWS_REGION,  
  credentials: {
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey:process.env.AWS_SEREATEACCESSKEY,
},
});
export { s3Client };


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


const deleteBankRechargeById = async (id) => {

  const [recharge] = await connection.query("DELETE FROM bank_recharge WHERE id = ?", [id]);

  return recharge
}

app.post('/upload', async function(req, res) {
    let sampleFile;
    let uploadPath;
    let c_rate;
    let c_username;
    let c_upi_id;
    let c_upi_wallet;
    let c_image;
    let auth ;

    c_rate = req.body.edit_rate;
    c_username = req.body.edit_username;
    c_upi_id = req.body.edit_qr_id;
    c_upi_wallet = req.body.edit_upi_id;
    c_image = req.body.qr_code_image_hdd;
    auth = req.cookies.auth;
  
    const [users] = await connection.query('SELECT * FROM users WHERE token = ?', [auth]);
    if (!req.files || Object.keys(req.files).length === 0) {
      const [bank_recharge] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ? AND status = 0;`, [users[0].phone]);
      var transfer_mode = '';
      if(bank_recharge.length != 0)
      {
          transfer_mode = bank_recharge[0].transfer_mode;
      }
      else{
          transfer_mode = "manual";
      }
      let file_name1 = c_image;
      const deleteRechargeQueries = bank_recharge.map(recharge => {
          return deleteBankRechargeById(recharge.id)
      });

     await Promise.all(deleteRechargeQueries)
      let timeNow = Date.now();
      await connection.query("INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, upi_wallet = ?, transfer_mode = ?,phone=?, colloborator_action = ?, time = ?, type = 'momo', status = 0;", [
          c_rate, c_username, c_upi_id, file_name1, c_upi_wallet,transfer_mode,users[0].phone, "off", timeNow
      ]);

      return res.status(200).json({
          message: 'Successfully changed',
          status: true,
          datas: [],
      });
    }
    else
    {
      sampleFile = req.files.fileUploaded;
      const [bank_recharge] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ? AND status = 0;`, [users[0].phone]);
      var transfer_mode = '';
      if(bank_recharge.length != 0)
      {
        transfer_mode = bank_recharge[0].transfer_mode;
      }
      else{
          transfer_mode = "manual";
      }
      let file_name1 = path.parse(sampleFile.name).name + "_" + users[0].id_user + "_" + users[0].phone + path.parse(sampleFile.name).ext;
      //let file_url = process.env.AWS_BUCKET_URL+ file_name1;
      const deleteRechargeQueries = bank_recharge.map(async recharge => {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: recharge.qr_code_image.toString().trim()
        },function (err,data){}))
        
          return deleteBankRechargeById(recharge.id);
      });

     await Promise.all(deleteRechargeQueries)
      let timeNow = Date.now();
      await connection.query("INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, upi_wallet = ?, transfer_mode = ?,phone=?, colloborator_action = ?, time = ?, type = 'momo', status = 0;", [
          c_rate, c_username, c_upi_id, file_name1, c_upi_wallet,transfer_mode,users[0].phone, "off", timeNow
      ]);
      const fileContent  = Buffer.from(req.files.fileUploaded.data, 'binary');
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Key:file_name1,
        Body: fileContent,
    };
      try {
        const results = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("uploaded");
      } catch (err) {
        console.log("Error", err);
      }
      return res.status(200).json({
        message: 'Successfully changed',
        status: true,
        datas: [],
    });
    }
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
