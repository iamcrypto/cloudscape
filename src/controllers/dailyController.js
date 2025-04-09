import connection from "../config/connectDB";
import jwt from 'jsonwebtoken'
import md5 from "md5";
require('dotenv').config();

import path from 'path';
var multer  = require('multer');
import formidable from "formidable";
import fs from 'fs';

import {
  getStartOfWeekTimestamp,
  getTimeBasedOnDate,
  getTodayStartTime,
  monthTime,
  yesterdayTime,
} from "../helpers/games.js";

let timeNow = Date.now();

const dailyPage = async(req, res) => {
    return res.render("daily/statistical.ejs"); 
}

const listMeber = async(req, res) => {
    return res.render("daily/members.ejs"); 
}

const profileMember = async(req, res) => {
    return res.render("daily/profileMember.ejs"); 
}

const settingPage = async(req, res) => {
    return res.render("daily/settings.ejs"); 
}

const listRecharge = async(req, res) => {
    return res.render("daily/listRecharge.ejs"); 
}

const listWithdraw = async(req, res) => {
    return res.render("daily/listWithdraw.ejs"); 
}

const pageInfo = async(req, res) => {
    let phone = req.params.phone;
    return res.render("daily/profileMember.ejs", {phone}); 
}

const giftPage = async(req, res) => {
    let auth = req.cookies.auth;
    const [rows] = await connection.execute('SELECT `phone` FROM `users` WHERE `token` = ? AND veri = 1', [auth]);
    let money = 0;
    let money2 = 0;
    if(rows.length != 0) {
        const [point_list] = await connection.execute('SELECT `money`, `money_us` FROM `point_list` WHERE `phone` = ?', [rows[0].phone]);
        money = point_list[0].money;
        money2 = point_list[0].money_us;
    }
    return res.render("daily/giftPage.ejs", {money, money2}); 
}

const support = async(req, res) => {
    return res.render("daily/support.ejs"); 
}

const deleteBankRechargeById = async (id) => {
    const [recharge] = await connection.query("DELETE FROM bank_recharge WHERE id = ?", [id]);

    return recharge
}

let path_dir = path.dirname(path.basename(__dirname));
const uploadDir = path.join(path_dir + '/src/public/qr_code');
let uploaded_fileName = '';
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: function(req, file, cb){
        uploaded_fileName = file.originalname;
        cb(null, file.originalname);
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 //give no. of bytes
    },
}).single('qr_code');



const settingCollo_Details = async (req, res) => {
    try {
        let name_bank = req.body.name_bank;
        let name = req.body.name;
        let info = req.body.info;
        let qr =  req.body.qr;
        let typer =  req.body.typer;
        let auth = req.cookies.auth;
        let file_exits = req.body.file_exits;
        let file_name = req.body.file_name;

        if (!auth || !typer) {
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            });
        }
        const [users] = await connection.query('SELECT * FROM users WHERE token = ?', [auth]);
        if (typer == 'bank') {
            await connection.query(`UPDATE bank_recharge SET name_bank = ?, name_user = ?, stk = ? WHERE type = 'bank' AND phone = ?`, [name_bank, name, info, users[0].phone]);
            return res.status(200).json({
                message: 'Successful change',
                status: true,
                datas: recharge,
            });
        }

        if (typer == 'momo') {
            const [bank_recharge] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ? AND status = 0;`, [users[0].phone]);
            var transfer_mode = '';
            if(bank_recharge.length != 0)
            {
                transfer_mode = bank_recharge[0].transfer_mode;
            }
            else{
                transfer_mode = "manual";
            }

            let file_name1 = req.body.file_name;
            const uploadDir1 = path.join(path_dir + '/src/public/qr_code/'+file_name1);

            const deleteRechargeQueries = bank_recharge.map(recharge => {
                if(recharge.qr_code_image.toString().trim() != uploadDir1)
                {
                    if (fs.existsSync(recharge.qr_code_image.toString().trim())) {
                        fs.unlink(recharge.qr_code_image.toString().trim(),function(err){
                        if(err) return console.log(err);
                        console.log('file deleted successfully');
                    });  
                    };
                }
                return deleteBankRechargeById(recharge.id)
            });

           await Promise.all(deleteRechargeQueries)

            //await connection.query(`UPDATE bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ? WHERE type = 'upi'`, [name_bank, name, info, qr]);

 
            const bankName = req.body.bank_name;
            const username =  req.body.username;
            const upiId =  req.body.upi_id;
            const usdtWalletAddress =  req.body.usdt_wallet_address;
            let timeNow = Date.now();

            await connection.query("INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, upi_wallet = ?, transfer_mode = ?,phone=?, colloborator_action = ?, time = ?, type = 'momo', status = 0;", [
                bankName, username, upiId, uploadDir1, usdtWalletAddress,transfer_mode,users[0].phone, "off", timeNow
            ]);

            return res.status(200).json({
                message: 'Successfully changed',
                status: true,
                datas: [],
            });
       }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Something went wrong!',
            status: false,
        });
    }
};


const settingGet = async (req, res) => {
    try {
        let auth = req.cookies.auth;
        if (!auth) {
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            });
        }
        const [rows] = await connection.execute('SELECT * FROM `users` WHERE `token` = ? AND veri = 1', [auth]);
        const [bank_recharge] = await connection.query("SELECT * FROM bank_recharge where `phone` = ? AND status= 1", [rows[0].phone]);
        const [bank_recharge_momo] = await connection.query("SELECT * FROM bank_recharge WHERE type = 'momo' AND `phone` = ? AND status= 1", [rows[0].phone]);
        const [settings] = await connection.query('SELECT * FROM point_list where `phone` = ?;', [rows[0].phone]);

        let bank_recharge_momo_data
        if (bank_recharge_momo.length) {
            bank_recharge_momo_data = bank_recharge_momo[0]
        }
        return res.status(200).json({
            message: 'Success',
            status: true,
            settings: settings,
            datas: bank_recharge,
            momo: {
                bank_name: bank_recharge_momo_data?.name_bank || "",
                username: bank_recharge_momo_data?.name_user || "",
                upi_id: bank_recharge_momo_data?.stk || "",
                usdt_wallet_address: bank_recharge_momo_data?.upi_wallet || "",
                qr_code_image: bank_recharge_momo_data?.qr_code_image || "",
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed',
            status: false,
        });
    }
}

const getUserDataByPhone = async (phone) => {
    let [users] = await connection.query('SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `phone` = ? ', [phone]);
    const user = users?.[0]


    if (user === undefined || user === null) {
        throw Error("Unable to get user data!")
    }

    return {
        phone: user.phone,
        code: user.code,
        username: user.name_user,
        invite: user.invite,
    }
}


const addUserAccountBalance = async ({ money, phone, invite }) => {
    const user_money = money + (money / 100) * 5
    const inviter_money = (money / 100) * 5

    await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE `phone` = ?', [user_money, user_money, phone]);

    const [inviter] = await connection.query('SELECT phone FROM users WHERE `code` = ?', [invite]);

    if (inviter.length) {
        console.log(inviter)
        console.log(inviter_money, inviter_money, invite, inviter?.[0].phone)
        await connection.query('UPDATE users SET money = money + ?, total_money = total_money + ? WHERE `code` = ? AND `phone` = ?', [inviter_money, inviter_money, invite, inviter?.[0].phone]);
        console.log("SUCCESSFULLY ADD MONEY TO inviter")
    }
}


const collo_rechargeDuyet = async (req, res) => {
    let auth = req.cookies.auth;
    let id = req.body.id;
    let type = req.body.type;
    if (!auth || !id || !type) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    if (type == 'confirm') {
        await connection.query(`UPDATE recharge SET status = 1 WHERE id = ?`, [id]);

        const [info] = await connection.query(`SELECT * FROM recharge WHERE id = ?`, [id]);
        const [receiinfo] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [info?.[0]?.phone]);
        if(info?.[0]?.type.trim() == 'wallet')
        {
            const [withdrainfo] = await connection.query(`SELECT * FROM withdraw WHERE id_order = ?`, [info?.[0]?.id_order]);
            let withInfo = withdrainfo[0];
            const [senderinfo] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [withInfo.phone]);
            await connection.query(`UPDATE withdraw SET status = 1 WHERE id_order = ?`, [info?.[0]?.id_order]);
            await connection.query('UPDATE users SET money = money + ? WHERE phone = ?', [info?.[0]?.money, info?.[0]?.phone]);
            await connection.query(`UPDATE users SET money = money - ? WHERE phone = ?`, [info?.[0]?.money, withInfo.phone]);
            let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?'; 
            await connection.query(sql_noti, [receiinfo?.[0]?.id, "Congrates! you received an reward of "+info?.[0]?.money+" from your friend " + senderinfo?.[0]?.code +".", '0', "Recharge"]);
            let sql_noti1 = "INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?";
            let withdrdesc = "Amount of "+ info?.[0]?.money+ " have been transferred successfully.";
            await connection.query(sql_noti1, [senderinfo?.[0]?.id, withdrdesc , "0", "Withdraw"]);
        }
        else{
            
            const user = await getUserDataByPhone(info?.[0]?.phone)
            addUserAccountBalance({
                money: info[0].money,
                phone: user.phone,
                invite: user.invite
            });
            let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
            await connection.query(sql_noti, [receiinfo?.[0]?.id, "Recharge of Amount "+info?.[0]?.money+" is Successfull. ", '0', "Recharge"]);
        }
        return res.status(200).json({
            message: 'Successful application confirmation',
            status: true,
            datas: [],
        });
    }
    if (type == 'delete') {
        const [rows] = await connection.query('SELECT * FROM users WHERE `token` = ? ', [auth]);
        const [info] = await connection.query(`SELECT * FROM recharge WHERE id = ?`, [id]);
        await connection.query(`UPDATE point_list SET recharge = recharge + ? WHERE level = 2 and phone = ?`, [info[0].money, rows[0].phone]);
        await connection.query(`UPDATE recharge SET status = 2 WHERE id = ?`, [id]);

        return res.status(200).json({
            message: 'Cancellation successful',
            status: true,
            datas: [],
        });
    }
}

const collo_handlWithdraw = async (req, res) => {
    let auth = req.cookies.auth;
    let id = req.body.id;
    let type = req.body.type;
    if (!auth || !id || !type) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    if (type == 'confirm') {
        await connection.query(`UPDATE withdraw SET status = 1 WHERE id = ?`, [id]);
        const [winfo] = await connection.query(`SELECT * FROM withdraw WHERE id = ?`, [id]);
        let withInfo = winfo[0];
        const [senderinfo] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [withInfo.phone]);
        if(withInfo.with_type.trim() == 'transfer')
        {
            await connection.query(`UPDATE withdraw SET status = 1 WHERE id = ?`, [id]);
            const [recharge] = await connection.query(`SELECT * FROM recharge WHERE id_order = ?`, [withInfo.id_order]);
            let rechInfo = recharge[0];
            const [receiinfo] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [rechInfo.phone]);
            await connection.query(`UPDATE recharge SET status = 1 WHERE id_order = ?`, [withInfo.id_order]);
            await connection.query('UPDATE users SET money =  money - ? WHERE phone = ?', [withInfo.money, withInfo.phone]);
            await connection.query(`UPDATE users SET money = money + ? WHERE phone = ?`, [withInfo.money, rechInfo.phone]);
            let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
            await connection.query(sql_noti, [receiinfo?.[0]?.id, "Congrates! you received an reward of "+rechInfo.money+" from your friend " + senderinfo?.[0]?.code +".", '0', "Recharge"]);
            let sql_noti1 = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
            await connection.query(sql_noti1, [senderinfo?.[0]?.id, "Amount of "+withInfo.money+ " have been transferred successfully.", '0', "Withdraw"]);
        }
        else
        {
            let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
            await connection.query(sql_noti, [senderinfo?.[0]?.id, "Your withdraw of amoount "+withInfo.money+" approved my admin.", '0', "Withdraw"]);
        }
        return res.status(200).json({
            message: 'Successful application confirmation',
            status: true,
            datas: [],
        });
    }
    if (type == 'delete') {
        await connection.query(`UPDATE withdraw SET status = 2 WHERE id = ?`, [id]);
        const [info] = await connection.query(`SELECT * FROM withdraw WHERE id = ?`, [id]);
        await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [info[0].money, info[0].phone]);
        return res.status(200).json({
            message: 'Cancel successfully',
            status: true,
            datas: [],
        });
    }
}


const settings = async(req, res) => {
    let auth = req.cookies.auth;
    let type = req.body.type;
    let value = req.body.value;
    let whatsapp = req.body.whatsapp;

    const [rows] = await connection.execute('SELECT `phone` FROM `users` WHERE `token` = ? AND veri = 1', [auth]);
    if (rows.length == 0) {
        return res.status(200).json({
            message: 'Error',
            status: false,
        });
    }
    if (!type) {
        const [point_list] = await connection.execute('SELECT `telegram`,`whatsapp` FROM `point_list` WHERE phone = ?', [rows[0].phone]);
        const [settings] = await connection.execute('SELECT `telegram` FROM `admin`');
        let telegram = settings[0].telegram;
        let telegram2 = point_list[0].telegram;
        let whatsapp = point_list[0].whatsapp;
        return res.status(200).json({
            message: 'Get success',
            status: true,
            telegram: telegram,
            telegram2: telegram2,
            whatsapp:whatsapp,
        });
    } else {
        await connection.execute('UPDATE `point_list` SET telegram = ?, whatsapp= ? WHERE phone = ?', [value,whatsapp ,rows[0].phone]);
        return res.status(200).json({
            message: 'Successfully edited',
            status: true,
        });
    }
}

// xác nhận admin
const middlewareDailyController = async(req, res, next) => {
    // xác nhận token
    const auth = req.cookies.auth;
    if (!auth) {
        return res.redirect("/login");
    }
    const [rows] = await connection.execute('SELECT `token`,`level`, `status` FROM `users` WHERE `token` = ? AND veri = 1', [auth]);
    if (!rows) {
        return res.redirect("/login");
    }
    try {
        if (auth == rows[0].token && rows[0].status == 1) {
            if (rows[0].level == 2) {
                next();
            } else {
                return res.redirect("/home");
            }
        } else {
            return res.redirect("/login");
        }
    } catch (error) {
        return res.redirect("/login");
    }
}

const statistical = async(req, res) => {
    const auth = req.cookies.auth;
    
    const [user] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    let userInfo = user[0];
    // cấp dưới trực tiếp all
    const [f1s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [userInfo.code]);

    // cấp dưới trực tiếp hôm nay 
    let f1_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_time = f1s[i].time; // Mã giới thiệu f1
        let check = (timerJoin(f1_time) == timerJoin()) ? true : false;
        if(check) {
            f1_today += 1;
        }
    }

    // tất cả cấp dưới hôm nay 
    let f_all_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const f1_time = f1s[i].time; // time f1
        let check_f1 = (timerJoin(f1_time) == timerJoin()) ? true : false;
        if(check_f1) f_all_today += 1;
        // tổng f1 mời đc hôm nay
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code; // Mã giới thiệu f2
            const f2_time = f2s[i].time; // time f2
            let check_f2 = (timerJoin(f2_time) == timerJoin()) ? true : false;
            if(check_f2) f_all_today += 1;
            // tổng f2 mời đc hôm nay
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code; // Mã giới thiệu f3
                const f3_time = f3s[i].time; // time f3
                let check_f3 = (timerJoin(f3_time) == timerJoin()) ? true : false;
                if(check_f3) f_all_today += 1;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f3_code]);
                // tổng f3 mời đc hôm nay
                for (let i = 0; i < f4s.length; i++) {
                    const f4_code = f4s[i].code; // Mã giới thiệu f4
                    const f4_time = f4s[i].time; // time f4
                    let check_f4 = (timerJoin(f4_time) == timerJoin()) ? true : false;
                    if(check_f4) f_all_today += 1;
                    // tổng f3 mời đc hôm nay
                }
            }
        }
    }
    
    // Tổng số f2
    let f2 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        f2 += f2s.length;
    }
    
    // Tổng số f3
    let f3 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f2_code]);
            if(f3s.length > 0) f3 += f3s.length;
        }
    }
    
    // Tổng số f4
    let f4 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f3_code]);
                if(f4s.length > 0) f4 += f4s.length;
            }
        }
    }

    // const [recharge] = await connection.query('SELECT SUM(`money`) as total FROM recharge WHERE phone = ? AND status = 1 ', [phone]);
    // const [withdraw] = await connection.query('SELECT SUM(`money`) as total FROM withdraw WHERE phone = ? AND status = 1 ', [phone]);
    // const [bank_user] = await connection.query('SELECT * FROM user_bank WHERE phone = ? ', [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,    
        f1: f1s.length,
        f2: f2,
        f3: f3,
        f4: f4,
    });
}

function formateT(params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
    }
    
function timerJoin(params = '', addHours = 0) {
        let date = '';
        if (params) {
            date = new Date(Number(params));
        } else {
            date = new Date();
        }
    
        date.setHours(date.getHours() + addHours);
    
        let years = formateT(date.getFullYear());
        let months = formateT(date.getMonth() + 1);
        let days = formateT(date.getDate());
    
        let hours = date.getHours() % 12;
        hours = hours === 0 ? 12 : hours;
        let ampm = date.getHours() < 12 ? "AM" : "PM";
    
        let minutes = formateT(date.getMinutes());
        let seconds = formateT(date.getSeconds());
    
        return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    }


const userInfo = async(req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    if (!phone) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);
    const [auths] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0 || auths.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let { token, password, otp, level,...userInfo } = user[0];

    if (auths[0].phone != userInfo.ctv) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    // cấp dưới trực tiếp all
    const [f1s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [userInfo.code]);

    // cấp dưới trực tiếp hôm nay 
    let f1_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_time = f1s[i].time; // Mã giới thiệu f1
        let check = (timerJoin(f1_time) == timerJoin()) ? true : false;
        if(check) {
            f1_today += 1;
        }
    }

    // tất cả cấp dưới hôm nay 
    let f_all_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const f1_time = f1s[i].time; // time f1
        let check_f1 = (timerJoin(f1_time) == timerJoin()) ? true : false;
        if(check_f1) f_all_today += 1;
        // tổng f1 mời đc hôm nay
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code; // Mã giới thiệu f2
            const f2_time = f2s[i].time; // time f2
            let check_f2 = (timerJoin(f2_time) == timerJoin()) ? true : false;
            if(check_f2) f_all_today += 1;
            // tổng f2 mời đc hôm nay
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code; // Mã giới thiệu f3
                const f3_time = f3s[i].time; // time f3
                let check_f3 = (timerJoin(f3_time) == timerJoin()) ? true : false;
                if(check_f3) f_all_today += 1;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f3_code]);
                // tổng f3 mời đc hôm nay
                for (let i = 0; i < f4s.length; i++) {
                    const f4_code = f4s[i].code; // Mã giới thiệu f4
                    const f4_time = f4s[i].time; // time f4
                    let check_f4 = (timerJoin(f4_time) == timerJoin()) ? true : false;
                    if(check_f4) f_all_today += 1;
                    // tổng f3 mời đc hôm nay
                }
            }
        }
    }
    
    // Tổng số f2
    let f2 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        f2 += f2s.length;
    }
    
    // Tổng số f3
    let f3 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f2_code]);
            if(f3s.length > 0) f3 += f3s.length;
        }
    }
    
    // Tổng số f4
    let f4 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f3_code]);
                if(f4s.length > 0) f4 += f4s.length;
            }
        }
    }

    const [recharge] = await connection.query('SELECT SUM(`money`) as total FROM recharge WHERE phone = ? AND status = 1 ', [phone]);
    const [withdraw] = await connection.query('SELECT SUM(`money`) as total FROM withdraw WHERE phone = ? AND status = 1 ', [phone]);
    const [bank_user] = await connection.query('SELECT * FROM user_bank WHERE phone = ? ', [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: userInfo,
        total_r: recharge,
        total_w: withdraw,
        f1: f1s.length,
        f2: f2,
        f3: f3,
        f4: f4,
        bank_user: bank_user,
    });
}

function timerJoin1(params = '', addHours = 0) {
    let date = '';
    if (params) {
        date = new Date(Number(params));
    } else {
        date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return years + '-' + months + '-' + days;
}

const infoCtv = async(req, res) => {
    const auth = req.cookies.auth;
     
    const [user] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Phone Error',
            status: false,
        });
    }
    let userInfo = user[0];
    let phone = userInfo.phone;
    // cấp dưới trực tiếp all
    const [f1s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [userInfo.code]);

    // cấp dưới trực tiếp hôm nay  
    let f1_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_time = f1s[i].time; // Mã giới thiệu f1
        let check = (timerJoin1(f1_time) == timerJoin1()) ? true : false;
        if(check) {
            f1_today += 1;
        }
    }

    // tất cả cấp dưới hôm nay 
    let f_all_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const f1_time = f1s[i].time; // time f1
        let check_f1 = (timerJoin1(f1_time) == timerJoin1()) ? true : false;
        if(check_f1) f_all_today += 1;
        // tổng f1 mời đc hôm nay
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code; // Mã giới thiệu f2
            const f2_time = f2s[i].time; // time f2
            let check_f2 = (timerJoin1(f2_time) == timerJoin1()) ? true : false;
            if(check_f2) f_all_today += 1;
            // tổng f2 mời đc hôm nay
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code; // Mã giới thiệu f3
                const f3_time = f3s[i].time; // time f3
                let check_f3 = (timerJoin1(f3_time) == timerJoin1()) ? true : false;
                if(check_f3) f_all_today += 1;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f3_code]);
                // tổng f3 mời đc hôm nay
                for (let i = 0; i < f4s.length; i++) {
                    const f4_code = f4s[i].code; // Mã giới thiệu f4
                    const f4_time = f4s[i].time; // time f4
                    let check_f4 = (timerJoin1(f4_time) == timerJoin1()) ? true : false;
                    if(check_f4) f_all_today += 1;
                    // tổng f3 mời đc hôm nay
                }
            }
        }
    }
    
    // Tổng số f2
    let f2 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        f2 += f2s.length;
    }
    
    // Tổng số f3
    let f3 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f2_code]);
            if(f3s.length > 0) f3 += f3s.length;
        }
    }
    
    // Tổng số f4
    let f4 = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code;
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite` FROM users WHERE `invite` = ? ', [f3_code]);
                if(f4s.length > 0) f4 += f4s.length;
            }
        }
    }

    const [list_mem] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [phone]);
    const [list_mem_baned] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 2 AND veri = 1 ', [phone]);
    let total_recharge = 0;
    let total_withdraw = 0;
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;
        const [recharge] = await connection.query('SELECT SUM(money) as money FROM recharge WHERE phone = ? AND status = 1 ', [phone]);
        const [withdraw] = await connection.query('SELECT SUM(money) as money FROM withdraw WHERE phone = ? AND status = 1 ', [phone]);
        if (recharge[0].money) {
            total_recharge += Number(recharge[0].money);
        }
        if (withdraw[0].money) {
            total_withdraw += Number(withdraw[0].money);
        }
    }

    let total_recharge_today = 0;
    let total_withdraw_today = 0;
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;

        const [recharge_today] = await connection.query('SELECT `money`, `time` FROM recharge WHERE phone = ? AND status = 1 ', [phone]);
        const [withdraw_today] = await connection.query('SELECT `money`, `time` FROM withdraw WHERE phone = ? AND status = 1 ', [phone]);
        for (let i = 0; i < recharge_today.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(recharge_today[i].time);
            if (time == today) {
                total_recharge_today += recharge_today[i].money;
            }
        }
        for (let i = 0; i < withdraw_today.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(withdraw_today[i].time);
            if (time == today) {
                total_withdraw_today += withdraw_today[i].money;
            }
        }
    }

    let win = 0;
    let loss = 0;
    let wingowin= 0;
    let wingoloss= 0;
    let k3win= 0;
    let k3loss= 0;
    let d5win= 0;
    let d5loss= 0;
    let trxwin= 0;
    let trxloss= 0;
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;
        const [wingo_wins] = await connection.query('SELECT `get`, `time` FROM minutes_1 WHERE phone = ? AND status = 1 ', [phone]);
        const [wingo_losses] = await connection.query('SELECT `money`, `time` FROM minutes_1 WHERE phone = ? AND status = 2 ', [phone]);
        for (let i = 0; i < wingo_wins.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(wingo_wins[i].time);
            if (time == today) {
                wingowin += wingo_wins[i].get;
            }
        }
        for (let i = 0; i < wingo_losses.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(wingo_losses[i].time);
            if (time == today) {
                wingoloss += wingo_losses[i].money;
            }
        }

        const [k3_wins] = await connection.query('SELECT `get`, `time` FROM result_k3 WHERE phone = ? AND status = 1 ', [phone]);
        const [k3_losses] = await connection.query('SELECT `money`, `time` FROM result_k3 WHERE phone = ? AND status = 2 ', [phone]);
        for (let i = 0; i < k3_wins.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(k3_wins[i].time);
            if (time == today) {
                k3win += k3_wins[i].get;
            }
        }
        for (let i = 0; i < k3_losses.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(k3_losses[i].time);
            if (time == today) {
                k3loss += k3_losses[i].money;
            }
        }

        const [d5_wins] = await connection.query('SELECT `get`, `time` FROM result_5d WHERE phone = ? AND status = 1 ', [phone]);
        const [d5_losses] = await connection.query('SELECT `money`, `time` FROM result_5d WHERE phone = ? AND status = 2 ', [phone]);
        for (let i = 0; i < d5_wins.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(d5_wins[i].time);
            if (time == today) {
                d5win += d5_wins[i].get;
            }
        }
        for (let i = 0; i < d5_losses.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(d5_losses[i].time);
            if (time == today) {
                d5loss += d5_losses[i].money;
            }
        }

        const [trx_wins] = await connection.query('SELECT `get`, `time` FROM trx_wingo_bets WHERE phone = ? AND status = 1 ', [phone]);
        const [trx_losses] = await connection.query('SELECT `money`, `time` FROM trx_wingo_bets WHERE phone = ? AND status = 2 ', [phone]);
        for (let i = 0; i < trx_wins.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(trx_wins[i].time);
            if (time == today) {
                trxwin += trx_wins[i].get;
            }
        }
        for (let i = 0; i < trx_losses.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(trx_losses[i].time);
            if (time == today) {
                trxloss += trx_losses[i].money;
            }
        }
    }

    win =  parseInt(wingowin) + parseInt(k3win) + parseInt(d5win) + parseInt(trxwin);
    loss =  parseInt(wingoloss) + parseInt(k3loss) + parseInt(d5loss) + parseInt(trxloss);

    
    let list_mems = [];
    const [list_mem_today] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [phone]);
    for (let i = 0; i < list_mem_today.length; i++) {
        let today = timerJoin1();
        let time = timerJoin1(list_mem_today[i].time);
        if (time == today) {
            const [phone_invites] = await connection.query('SELECT `phone` FROM users WHERE code = ? ', [list_mem_today[i].invite]);
            let phone_invite = phone_invites[0].phone;
            let data = {
                ...list_mem_today[i],
                phone_invite: phone_invite,
            };
            list_mems.push(data);
        }
    }

    const [point_list] = await connection.query('SELECT * FROM point_list WHERE phone = ? ', [phone]);
    let moneyCTV = point_list[0].money;
    let moneyRecharge = point_list[0].recharge;

    let list_recharge_news = [];
    let list_withdraw_news = [];
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;
        const [recharge_today] = await connection.query('SELECT `id`, `status`, `type`,`phone`, `money`, `time` FROM recharge WHERE phone = ? AND status = 1 ', [phone]);
        const [withdraw_today] = await connection.query('SELECT `id`, `status`,`phone`, `money`, `time` FROM withdraw WHERE phone = ? AND status = 1 ', [phone]);
        for (let i = 0; i < recharge_today.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(recharge_today[i].time);
            if (time == today) {
                list_recharge_news.push(recharge_today[i]);
            }
        }
        for (let i = 0; i < withdraw_today.length; i++) {
            let today = timerJoin1();
            let time = timerJoin1(withdraw_today[i].time);
            if (time == today) {
                list_withdraw_news.push(withdraw_today[i]);
            }
        }
    }

    const [redenvelopes_used] = await connection.query('SELECT * FROM redenvelopes_used WHERE phone = ? ', [phone]);
    let redenvelopes_used_today = [];
    for (let i = 0; i < redenvelopes_used.length; i++) {
        let today = timerJoin1();
        let time = timerJoin1(redenvelopes_used[i].time);
        if (time == today) {
            redenvelopes_used_today.push(redenvelopes_used[i]);
        }
    }

    const [financial_details] = await connection.query('SELECT * FROM financial_details WHERE phone = ? ', [phone]);
    let financial_details_today = [];
    for (let i = 0; i < financial_details.length; i++) {
        let today = timerJoin1();
        let time = timerJoin1(financial_details[i].time);
        if (time == today) {
            financial_details_today.push(financial_details[i]);
        }
    }

    const startOfWeek = getStartOfWeekTimestamp();
    const commissions = await getCommissionStatsByTime(startOfWeek, phone);

    const totalCommissions = commissions?.total_commission || 0;
    const totalCommissionsThisWeek = commissions?.last_week_commission || 0;
    const totalCommissionsYesterday = commissions?.yesterday_commission || 0;
    
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,
        comm_total:totalCommissions, 
        comm_week:totalCommissionsThisWeek, 
        comm_today:totalCommissionsYesterday, 
        f1: f1s.length,
        f2: f2,
        f3: f3,
        f4: f4,
        list_mems: list_mems,
        total_recharge: total_recharge,
        total_withdraw: total_withdraw,
        total_recharge_today: total_recharge_today,
        total_withdraw_today: total_withdraw_today,
        list_mem_baned: list_mem_baned.length,
        win: win,
        loss: loss,
        list_recharge_news: list_recharge_news,
        list_withdraw_news: list_withdraw_news, 
        moneyCTV: moneyCTV,
        moneyRecharge:moneyRecharge,
        redenvelopes_used: redenvelopes_used_today,
        financial_details_today: financial_details_today,
    });
}

const getCommissionStatsByTime = async (time, phone) => {
    const { startOfYesterdayTimestamp, endOfYesterdayTimestamp } =
      yesterdayTime();
    const [commissionRow] = await connection.execute(
      `
        SELECT
            time,
            SUM(COALESCE(c.money, 0)) AS total_commission,
            SUM(CASE 
                WHEN c.time >= ? 
                THEN COALESCE(c.money, 0)
                ELSE 0 
            END) AS last_week_commission,
            SUM(CASE 
                WHEN c.time > ? AND c.time <= ?
                THEN COALESCE(c.money, 0)
                ELSE 0 
            END) AS yesterday_commission
        FROM
            commissions c
        WHERE
            c.phone = ?
        `,
      [time, startOfYesterdayTimestamp, endOfYesterdayTimestamp, phone],
    );
    return commissionRow?.[0] || {};
  };
  


const infoCtv2 = async(req, res) => {
    const auth = req.cookies.auth;
    const timeDate = req.body.timeDate;
     
    function formateT(params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
    }
    
    function timerJoin(params = '', addHours = 0) {
        let date = '';
        if (params) {
            date = new Date(Number(params));
        } else {
            date = new Date();
        }
    
        date.setHours(date.getHours() + addHours);
    
        let years = formateT(date.getFullYear());
        let months = formateT(date.getMonth() + 1);
        let days = formateT(date.getDate());
    
        let hours = date.getHours() % 12;
        hours = hours === 0 ? 12 : hours;
        let ampm = date.getHours() < 12 ? "AM" : "PM";
    
        let minutes = formateT(date.getMinutes());
        let seconds = formateT(date.getSeconds());
    
        return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    }

    
    const [user] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Phone Error',
            status: false,
        });
    }
    let userInfo = user[0];

    let phone = userInfo.phone;
    const [list_mem] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [phone]);

    let list_mems = [];
    const [list_mem_today] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [phone]);
    for (let i = 0; i < list_mem_today.length; i++) {
        let today = timeDate;
        let time = timerJoin(list_mem_today[i].time);
        if (time == today) {
            const [phone_invites] = await connection.query('SELECT `phone` FROM users WHERE code = ? ', [list_mem_today[i].invite]);
            let phone_invite = phone_invites[0].phone;
            let data = {
                ...list_mem_today[i],
                phone_invite: phone_invite,
            };
            list_mems.push(data);
        }
    }

    let list_recharge_news = [];
    let list_withdraw_news = [];
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;
        const [recharge_today] = await connection.query('SELECT `id`, `status`, `type`,`phone`, `money`, `time` FROM recharge WHERE phone = ? AND status = 1 ', [phone]);
        const [withdraw_today] = await connection.query('SELECT `id`, `status`,`phone`, `money`, `time` FROM withdraw WHERE phone = ? AND status = 1 ', [phone]);
        for (let i = 0; i < recharge_today.length; i++) {
            let today = timeDate;
            let time = timerJoin(recharge_today[i].time);
            if (time == today) {
                list_recharge_news.push(recharge_today[i]);
            }
        }
        for (let i = 0; i < withdraw_today.length; i++) {
            let today = timeDate;
            let time = timerJoin(withdraw_today[i].time);
            if (time == today) {
                list_withdraw_news.push(withdraw_today[i]);
            }
        }
    }

    const [redenvelopes_used] = await connection.query('SELECT * FROM redenvelopes_used WHERE phone = ? ', [phone]);
    let redenvelopes_used_today = [];
    for (let i = 0; i < redenvelopes_used.length; i++) {
        let today = timeDate;
        let time = timerJoin(redenvelopes_used[i].time);
        if (time == today) {
            redenvelopes_used_today.push(redenvelopes_used[i]);
        }
    }
    const [financial_details] = await connection.query('SELECT * FROM financial_details WHERE phone = ? ', [phone]);
    let financial_details_today = [];
    for (let i = 0; i < financial_details.length; i++) {
        let today = timeDate;
        let time = timerJoin(financial_details[i].time);
        if (time == today) {
            financial_details_today.push(financial_details[i]);
        }
    }

    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,
        list_mems: list_mems,
        list_recharge_news: list_recharge_news,
        list_withdraw_news: list_withdraw_news,
        redenvelopes_used: redenvelopes_used_today,
        financial_details_today: financial_details_today,
    });
}


const createBonus = async(req, res) => {
    const randomString = (length) => {
        var result = '';
        var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
function formateT(params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
    }
    
function timerJoin(params = '', addHours = 0) {
        let date = '';
        if (params) {
            date = new Date(Number(params));
        } else {
            date = new Date();
        }
    
        date.setHours(date.getHours() + addHours);
    
        let years = formateT(date.getFullYear());
        let months = formateT(date.getMonth() + 1);
        let days = formateT(date.getDate());
    
        let hours = date.getHours() % 12;
        hours = hours === 0 ? 12 : hours;
        let ampm = date.getHours() < 12 ? "AM" : "PM";
    
        let minutes = formateT(date.getMinutes());
        let seconds = formateT(date.getSeconds());
    
        return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    }
    const d = new Date();
    const time = d.getTime();
    let auth = req.cookies.auth;
    let money = req.body.money;


    if (!money || !auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    const [user] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let userInfo = user[0];
    const [point_list] = await connection.query('SELECT * FROM point_list WHERE phone = ? ', [userInfo.phone]);
    if (point_list.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let ctv = point_list[0];

    if (ctv.money - money >= 0) {
        let id_redenvelops = randomString(16);
        await connection.execute('UPDATE `point_list` SET money = money - ? WHERE phone = ?', [money ,ctv.phone]);
        let sql = `INSERT INTO redenvelopes SET id_redenvelope = ?, phone = ?, money = ?, used = ?, amount = ?, status = ?, time = ?`;
        await connection.query(sql, [id_redenvelops, userInfo.phone, money, 1, 1, 0, time]);
        const [point_list] = await connection.query('SELECT `money` FROM point_list WHERE phone = ? ', [userInfo.phone]);
        return res.status(200).json({
            message: 'Successful gift creation',
            status: true,
            id: id_redenvelops,
            money: point_list[0].money,
        });
    } else {
        return res.status(200).json({
            message: 'The balance is not enough to create gifts',
            status: false,
        });
    }
}

const listRedenvelops = async(req, res) => {
    let auth = req.cookies.auth;
    const [user] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let userInfo = user[0];
    let [redenvelopes] = await connection.query('SELECT * FROM redenvelopes WHERE phone = ? ORDER BY id DESC', [userInfo.phone]);
    return res.status(200).json({
        message: 'Successful change',
        status: true,
        redenvelopes: redenvelopes,
    });
}

const listMember = async(req, res) => {
    let auth = req.cookies.auth;
    let {pageno, limit } = req.body;

    let [checkInfo] = await connection.execute('SELECT * FROM users WHERE token = ?', [auth]);

    if(checkInfo.length == 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    let userInfo = checkInfo[0];

    if (!pageno || !limit) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (pageno < 0 || limit < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    const [users] = await connection.query(`SELECT id_user, phone, money, total_money, status, time FROM users WHERE veri = 1 AND level = 0 AND ctv = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [userInfo.phone]);
    const [total_users] = await connection.query(`SELECT * FROM users WHERE veri = 1 AND level = 0 AND ctv = ? `, [userInfo.phone]);
    return res.status(200).json({ 
        message: 'Success',
        status: true,
        datas: users,
        page_total: Math.ceil(total_users.length / limit)
    });
}

const listRechargeP = async(req, res) => {
    let auth = req.cookies.auth;
    const [user] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);
    const [bank_user] = await connection.query('SELECT * FROM bank_recharge WHERE phone = ? ', [user[0].phone]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let userInfo = user[0];

    const [list_mem] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [userInfo.phone]);
    let list_recharge_news = [];
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;
        const [recharge_today] = await connection.query('SELECT * FROM recharge WHERE `phone` = ? AND `redirect_to` = ? ORDER BY id DESC LIMIT 100', [phone, "colloborator"]);
        for (let i = 0; i < recharge_today.length; i++) {
            list_recharge_news.push(recharge_today[i]);
        }
    }
    
    return res.status(200).json({
        message: 'Failed',
        status: true, 
        list_recharge_news: list_recharge_news,
        timeStamp: timeNow,
        pay_status: bank_user[0].colloborator_action
    });
}

const listWithdrawP = async(req, res) => {
    let auth = req.cookies.auth;
    const [user] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);
    const [bank_user] = await connection.query('SELECT * FROM bank_recharge WHERE phone = ? ', [user[0].phone]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let userInfo = user[0];

    const [list_mem] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [userInfo.phone]);
    let list_withdraw_news = [];
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;
        const [withdraw_today] = await connection.query('SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT 100', [phone]);
        for (let i = 0; i < withdraw_today.length; i++) {
            list_withdraw_news.push(withdraw_today[i]);
        }
    }
    return res.status(200).json({
        message: 'Failed',
        status: true, 
        list_withdraw_news: list_withdraw_news,
        timeStamp: timeNow,
        pay_status: bank_user[0].colloborator_action
    });
}

const listRechargeMem = async(req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let {pageno, limit } = req.body;

    if (!pageno || !limit) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (pageno < 0 || limit < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (!phone) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);
    const [auths] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0 || auths.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let { token, password, otp, level,...userInfo } = user[0];

    if (auths[0].phone != userInfo.ctv) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [recharge] = await connection.query(`SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [phone]);
    const [total_users] = await connection.query(`SELECT * FROM recharge WHERE phone = ?`, [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: recharge,
        page_total: Math.ceil(total_users.length / limit)
    });
}

const listWithdrawMem = async(req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let {pageno, limit } = req.body;

    if (!pageno || !limit) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (pageno < 0 || limit < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (!phone) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);
    const [auths] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0 || auths.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let { token, password, otp, level,...userInfo } = user[0];

    if (auths[0].phone != userInfo.ctv) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [withdraw] = await connection.query(`SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [phone]);
    const [total_users] = await connection.query(`SELECT * FROM withdraw WHERE phone = ?`, [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: withdraw,
        page_total: Math.ceil(total_users.length / limit)
    });
}

const listRedenvelope = async(req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let {pageno, limit } = req.body;

    if (!pageno || !limit) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (pageno < 0 || limit < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (!phone) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);
    const [auths] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0 || auths.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let { token, password, otp, level,...userInfo } = user[0];

    if (auths[0].phone != userInfo.ctv) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [redenvelopes_used] = await connection.query(`SELECT * FROM redenvelopes_used WHERE phone_used = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [phone]);
    const [total_users] = await connection.query(`SELECT * FROM redenvelopes_used WHERE phone_used = ?`, [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: redenvelopes_used,
        page_total: Math.ceil(total_users.length / limit)
    });
}

const listBet = async(req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let {pageno, limit } = req.body;

    if (!pageno || !limit) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (pageno < 0 || limit < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (!phone) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);
    const [auths] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (user.length == 0 || auths.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }
    let { token, password, otp, level,...userInfo } = user[0];

    if (auths[0].phone != userInfo.ctv) {
        return res.status(200).json({
            message: 'Failed',
            status: false, 
            timeStamp: timeNow,
        });
    }

    const [listBet] = await connection.query(`SELECT * FROM minutes_1 WHERE phone = ? AND status != 0 ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [phone]);
    const [total_users] = await connection.query(`SELECT * FROM minutes_1 WHERE phone = ? AND status != 0`, [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: listBet,
        page_total: Math.ceil(total_users.length / limit)
    });
}

const buffMoney = async(req, res) => {
    let auth = req.cookies.auth;
    let phone = req.body.username;
    let select = req.body.select;
    let money = req.body.money;

    if (!phone || !select || !money) {
        return res.status(200).json({
            message: 'Fail',
            status: false,
        });
    }

    const [users] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);
    const [auths] = await connection.query('SELECT * FROM users WHERE token = ? ', [auth]);

    if (users.length == 0) {
        return res.status(200).json({
            message: 'Account does not exist',
            status: false,
        });
    }
    let userInfo = users[0];
    let authInfo = auths[0];

    const [point_list] = await connection.query('SELECT `money_us` FROM point_list WHERE phone = ? ', [authInfo.phone]);

    let check = point_list[0].money_us;

    if (select == '1') {
        if (check - money >= 0) {
            const d = new Date();
            const time = d.getTime();
            await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [money, userInfo.phone]);
            await connection.query('UPDATE point_list SET money_us = money_us - ? WHERE phone = ? ', [money, authInfo.phone]);
            let sql = 'INSERT INTO financial_details SET phone = ?, phone_used = ?, money = ?, type = ?, time = ?';
            await connection.query(sql, [authInfo.phone, userInfo.phone, money, '1', time]);
        
            const [moneyN] = await connection.query('SELECT `money_us` FROM point_list WHERE phone = ? ', [authInfo.phone]);
            return res.status(200).json({
                message: 'Success',
                status: true,
                money: moneyN[0].money_us,
            });
        } else {
            return res.status(200).json({
                message: 'Insufficient balance',
                status: false,
            });
        }
    } else {
        const d = new Date();
        const time = d.getTime();
        await connection.query('UPDATE users SET money = money - ? WHERE phone = ? ', [money, userInfo.phone]);
        await connection.query('UPDATE point_list SET money = money + ? WHERE phone = ? ', [money, authInfo.phone]);
        let sql = 'INSERT INTO financial_details SET phone = ?, phone_used = ?, money = ?, type = ?, time = ?';
        await connection.query(sql, [authInfo.phone, userInfo.phone, money, '2', time]);
        return res.status(200).json({
            message: 'Success',
            status: true,
        });
    }
}

const upload_qr_code = async (req, res) => {
    try
    {
        let uploadfile = await upload(req, res, (err) =>{
            if(err){
                console.log(err);
            }else{
                console.log('file uploaded succcessfully');
            }
        });
        return res.status(200).json({
            message: 'Success',
            status: true,
            datas: 'uploaded',  
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed',
            status: false,
        });
    }
}
  
module.exports = {
    collo_handlWithdraw,
    collo_rechargeDuyet,
    buffMoney,
    dailyPage,
    middlewareDailyController,
    userInfo,
    statistical,
    listMeber,
    profileMember,
    infoCtv,
    infoCtv2,
    settingPage,
    giftPage,
    support,
    settings,
    createBonus,
    listRedenvelops,
    listMember,
    listRecharge,
    listWithdraw,
    listRechargeP,
    listWithdrawP,
    pageInfo,
    listRechargeMem,
    listWithdrawMem,
    listRedenvelope,
    listBet,
    settingCollo_Details,
    settingGet,
    upload_qr_code
}