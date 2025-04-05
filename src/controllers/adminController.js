import connection from "../config/connectDB";
import jwt from 'jsonwebtoken'
import md5 from "md5";
import "dotenv/config";
import moment from "moment";
import path from 'path';
var multer  = require('multer');
import formidable from "formidable";
import fs from 'fs';
import {
  REWARD_STATUS_TYPES_MAP,
  REWARD_TYPES_MAP,
} from "../constants/reward_types.js";


let timeNow = Date.now();

const adminPage = async (req, res) => {
    return res.render("manage/index.ejs");
}

const adminmainpage = async (req, res) => {
    return res.render("manage/dashboard.ejs");
}

const adminPage3 = async (req, res) => {
    return res.render("manage/a-index-bet/index3.ejs");
}

const adminPage5 = async (req, res) => {
    return res.render("manage/a-index-bet/index5.ejs");
}

const adminPage10 = async (req, res) => {
    return res.render("manage/a-index-bet/index10.ejs");
}

const adminPage5d = async (req, res) => {
    return res.render("manage/5d.ejs");
}

const adminPageK3 = async (req, res) => {
    return res.render("manage/k3.ejs");
}

const adminPageTrx = async (req, res) => {
    return res.render("manage/manaJtrx.ejs");
} 

const ctvProfilePage = async (req, res) => {
    var phone = req.params.phone;
    return res.render("manage/profileCTV.ejs", { phone });
}

const giftPage = async (req, res) => {
    return res.render("manage/giftPage.ejs");
}

const membersPage = async (req, res) => {
    return res.render("manage/members.ejs");
}

const adminChatPage = async (req, res) => {
   var f_api= process.env.Firebase_Apikey;
   var f_authdomain= process.env.Firebase_AuthDomain;
   var f_dburl= process.env.Firebase_Dburl;
   var f_projid= process.env.Firebase_ProjId;
   var f_stobck= process.env.Firebase_StorageBucket;
   var f_messId= process.env.Firebase_MessageSenId;
   var f_appid= process.env.Firebase_AppId;
   var f_mesuareId= process.env.Firebase_MeasurementId;
return res.render("manage/aChat.ejs",{d_f_api: f_api, d_f_authdomain :f_authdomain,d_f_dburl:f_dburl,d_f_projid:f_projid,d_f_stobck:f_stobck,d_f_messId:f_messId,d_f_appid:f_appid,d_f_mesuareId:f_mesuareId });
}

const k3chatPage = async (req, res) => {
    var f_api= process.env.Firebase_Apikey;
    var f_authdomain= process.env.Firebase_AuthDomain;
    var f_dburl= process.env.Firebase_Dburl;
    var f_projid= process.env.Firebase_ProjId;
    var f_stobck= process.env.Firebase_StorageBucket;
    var f_messId= process.env.Firebase_MessageSenId;
    var f_appid= process.env.Firebase_AppId;
    var f_mesuareId= process.env.Firebase_MeasurementId;
    return res.render("manage/ChatK3.ejs",{d_f_api: f_api, d_f_authdomain :f_authdomain,d_f_dburl:f_dburl,d_f_projid:f_projid,d_f_stobck:f_stobck,d_f_messId:f_messId,d_f_appid:f_appid,d_f_mesuareId:f_mesuareId}
    );
}

const d5chatPage = async (req, res) => {
    var f_api= process.env.Firebase_Apikey;
    var f_authdomain= process.env.Firebase_AuthDomain;
    var f_dburl= process.env.Firebase_Dburl;
    var f_projid= process.env.Firebase_ProjId;
    var f_stobck= process.env.Firebase_StorageBucket;
    var f_messId= process.env.Firebase_MessageSenId;
    var f_appid= process.env.Firebase_AppId;
    var f_mesuareId= process.env.Firebase_MeasurementId;
    return res.render("manage/Chat5d.ejs",  {d_f_api: f_api, d_f_authdomain :f_authdomain,d_f_dburl:f_dburl,d_f_projid:f_projid,d_f_stobck:f_stobck,d_f_messId:f_messId,d_f_appid:f_appid,d_f_mesuareId:f_mesuareId});
}

const ctvPage = async (req, res) => {
    return res.render("manage/ctv.ejs");
}

const infoMember = async (req, res) => {
    let phone = req.params.id;
    return res.render("manage/profileMember.ejs", { phone });
}

const statistical = async (req, res) => {
    return res.render("manage/statistical.ejs");
}

const rechargePage = async (req, res) => {
    return res.render("manage/recharge.ejs");
}

const rechargeRecord = async (req, res) => {
    return res.render("manage/rechargeRecord.ejs");
}

const withdraw = async (req, res) => {
    return res.render("manage/withdraw.ejs");
}

const levelSetting = async (req, res) => {
    return res.render("manage/levelSetting.ejs");
}

const CreatedSalaryRecord = async (req, res) => {
    return res.render("manage/CreatedSalaryRecord.ejs");
}

const withdrawRecord = async (req, res) => {
    return res.render("manage/withdrawRecord.ejs");
}
const settings = async (req, res) => {
    return res.render("manage/settings.ejs");
}


// xác nhận admin
const middlewareAdminController = async (req, res, next) => {
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
            if (rows[0].level == 1) {
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

const totalJoin = async (req, res) => {
    let auth = req.cookies.auth;
    let typeid = req.body.typeid;
    if (!typeid) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    let game = '';
    if (typeid == '1') game = 'wingo';
    if (typeid == '2') game = 'wingo3';
    if (typeid == '3') game = 'wingo5';
    if (typeid == '4') game = 'wingo10';

    const [rows] = await connection.query('SELECT * FROM users WHERE `token` = ? ', [auth]);

    if (rows.length > 0) {
        const [wingoall] = await connection.query(`SELECT * FROM minutes_1 WHERE game = "${game}" AND status = 0 AND level = 0 ORDER BY id ASC `, [auth]);
        const [winGo1] = await connection.execute(`SELECT * FROM wingo WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `, []);
        const [winGo10] = await connection.execute(`SELECT * FROM wingo WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10 `, []);
        const [setting] = await connection.execute(`SELECT * FROM admin `, []);

        return res.status(200).json({
            message: 'Success',
            status: true,
            datas: wingoall,
            lotterys: winGo1,
            list_orders: winGo10,
            setting: setting,
            timeStamp: timeNow,
        });
    } else {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
}

const listMember = async (req, res) => {
    let { pageno, limit } = req.body;

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
    const [users] = await connection.query(`SELECT * FROM users WHERE veri = 1  ORDER BY id DESC LIMIT ${pageno}, ${limit}; `);
    const [total_users] = await connection.query(`SELECT * FROM users WHERE veri = 1 ; `);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: users,
        page_total: Math.ceil(total_users.length / limit)
    });
}
const getCollotoogle = async (req, res) => {
    let coll_phone = req.body.coll_phone;
    let collo_pen_req_no = 0;
    const [collo_sett] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ?`, [coll_phone]);
    const [collo_pend_req] = await connection.query('SELECT COUNT(*) AS `count` FROM bank_recharge WHERE phone = ? AND status=0', [coll_phone]);
    collo_pen_req_no = collo_pend_req[0].count || 0;
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: collo_sett[0].colloborator_action,
        collo_upi: collo_sett[0].stk,
        req_count:collo_pen_req_no,
        collo_wallet:collo_sett[0].upi_wallet,
    });
}

const listCTV = async (req, res) => {
    let { pageno, pageto } = req.body;

    if (!pageno || !pageto) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (pageno < 0 || pageto < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    const [wingo] = await connection.query(`SELECT * FROM users WHERE veri = 1 AND level = 2 ORDER BY id DESC LIMIT ${pageno}, ${pageto} `);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: wingo,
    });
}

function formateT2(params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
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

    var currentdate = new Date();
    var cur_month = formateT(currentdate.getMonth() + 1);
    var cur_day =formateT(currentdate.getDate());
    var cur_year = formateT(currentdate.getFullYear());

    var result = "";
    if(cur_month==months && days >= cur_day)
    {
        result = "match";
    }
    else
    {
        result = "no";
    }    
    return result;
}


function timerJoin2(params = '', addHours = 0) {
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

function timerJoin3(params = '', addHours = 0) {
    let date = '';
    if (params) {
        date = new Date(Number(params));
    } else {
        date = new Date();
    }

    date.setHours(date.getHours() + addHours);

    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate()-1);

    let hours = date.getHours() % 12;
    hours = hours === 0 ? 12 : hours;
    let ampm = date.getHours() < 12 ? "AM" : "PM";

    let minutes = formateT(date.getMinutes());
    let seconds = formateT(date.getSeconds());

    return years + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
}
const statistical2 = async (req, res) => {
    const [wingo] = await connection.query(`SELECT SUM(money) as total FROM minutes_1 WHERE status = 1 `);
    const [wingo2] = await connection.query(`SELECT SUM(money) as total FROM minutes_1 WHERE status = 2 `);
    const [users] = await connection.query(`SELECT COUNT(id) as total FROM users WHERE status = 1 `);
    const [users2] = await connection.query(`SELECT COUNT(id) as total FROM users WHERE status = 0 `);
    const [recharge] = await connection.query(`SELECT SUM(money) as total FROM recharge WHERE status = 1 `);
    const [withdraw] = await connection.query(`SELECT SUM(money) as total FROM withdraw WHERE status = 1 `);

    const [recharge_today] = await connection.query(`SELECT SUM(money) as total FROM recharge WHERE status = 1 AND today = ?`, [timerJoin2()]);
    const [withdraw_today] = await connection.query(`SELECT SUM(money) as total FROM withdraw WHERE status = 1 AND today = ?`, [timerJoin2()]);

    let win = wingo[0].total;
    let loss = wingo2[0].total;
    let usersOnline = users[0].total;
    let usersOffline = users2[0].total;
    let recharges = recharge[0].total;
    let withdraws = withdraw[0].total;
    return res.status(200).json({
        message: 'Success',
        status: true,
        win: win,
        loss: loss,
        usersOnline: usersOnline,
        usersOffline: usersOffline,
        recharges: recharges,
        withdraws: withdraws,
        rechargeToday: recharge_today[0].total,
        withdrawToday: withdraw_today[0].total,
    });
}

const changeAdmin = async (req, res) => {
    let auth = req.cookies.auth;
    let value = req.body.value;
    let type = req.body.type;
    let typeid = req.body.typeid;

    if (!value || !type || !typeid) return res.status(200).json({
        message: 'Failed',
        status: false,
        timeStamp: timeNow,
    });;
    let game = '';
    let bs = '';
    if (typeid == '1') {
        game = 'wingo1';
        bs = 'bs1';
    }
    if (typeid == '2') {
        game = 'wingo3';
        bs = 'bs3';
    }
    if (typeid == '3') {
        game = 'wingo5';
        bs = 'bs5';
    }
    if (typeid == '4') {
        game = 'wingo10';
        bs = 'bs10';
    }
    switch (type) {
        case 'change-wingo1':
            await connection.query(`UPDATE admin SET ${game} = ? `, [value]);
            return res.status(200).json({
                message: 'Editing results successfully',
                status: true,
                timeStamp: timeNow,
            });
            break;
        case 'change-win_rate':
            await connection.query(`UPDATE admin SET ${bs} = ? `, [value]);
            return res.status(200).json({
                message: 'Editing win rate successfully',
                status: true,
                timeStamp: timeNow,
            });
            break;

        default:
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            });
            break;
    }

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

const userInfo = async (req, res) => {
    let auth = req.cookies.auth;
    let phone = req.body.phone;
    if (!phone) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    let userInfo = user[0];
    // direct subordinate all
    const [f1s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [userInfo.code]);

    // cấp dưới trực tiếp hôm nay 
    let f1_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_time = f1s[i].time; // Mã giới thiệu f1
        let check = (timerJoin(f1_time) == timerJoin()) ? true : false;
        if (check) {
            f1_today += 1;
        }
    }

    // tất cả cấp dưới hôm nay 
    let f_all_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const f1_time = f1s[i].time; // time f1
        let check_f1 = (timerJoin(f1_time) == timerJoin()) ? true : false;
        if (check_f1) f_all_today += 1;
        // tổng f1 mời đc hôm nay
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code; // Mã giới thiệu f2
            const f2_time = f2s[i].time; // time f2
            let check_f2 = (timerJoin(f2_time) == timerJoin()) ? true : false;
            if (check_f2) f_all_today += 1;
            // tổng f2 mời đc hôm nay
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code; // Mã giới thiệu f3
                const f3_time = f3s[i].time; // time f3
                let check_f3 = (timerJoin(f3_time) == timerJoin()) ? true : false;
                if (check_f3) f_all_today += 1;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f3_code]);
                // tổng f3 mời đc hôm nay
                for (let i = 0; i < f4s.length; i++) {
                    const f4_code = f4s[i].code; // Mã giới thiệu f4
                    const f4_time = f4s[i].time; // time f4
                    let check_f4 = (timerJoin(f4_time) == timerJoin()) ? true : false;
                    if (check_f4) f_all_today += 1;
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
            if (f3s.length > 0) f3 += f3s.length;
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
                if (f4s.length > 0) f4 += f4s.length;
            }
        }
    }
    const [recharge] = await connection.query('SELECT SUM(`money`) as total FROM recharge WHERE phone = ? AND status = 1 ', [phone]);
    const [withdraw] = await connection.query('SELECT SUM(`money`) as total FROM withdraw WHERE phone = ? AND status = 1 ', [phone]);
    const [bank_user] = await connection.query('SELECT * FROM user_bank WHERE phone = ? ', [phone]);
    const [telegram_ctv] = await connection.query('SELECT `telegram` FROM point_list WHERE phone = ? ', [userInfo.ctv]);
    const [ng_moi] = await connection.query('SELECT `phone` FROM users WHERE code = ? ', [userInfo.invite]);

    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,
        total_r: recharge,
        total_w: withdraw,
        f1: f1s.length,
        f2: f2,
        f3: f3,
        f4: f4,
        bank_user: bank_user,
        telegram: telegram_ctv[0],
        ng_moi: ng_moi[0],
        daily: userInfo.ctv,
    });
}



const recharge = async (req, res) => {
    let auth = req.cookies.auth;
    if (!auth) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }

    const [recharge] = await connection.query('SELECT * FROM recharge WHERE status = 0 ');
    const [recharge2] = await connection.query('SELECT * FROM recharge WHERE status != 0 ');
    const [withdraw] = await connection.query('SELECT * FROM withdraw WHERE status = 0 ');
    const [withdraw2] = await connection.query('SELECT * FROM withdraw WHERE status != 0 ');
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: recharge,
        datas2: recharge2,
        datas3: withdraw,
        datas4: withdraw2,
    });
}

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
        const [bank_recharge] = await connection.query("SELECT * FROM bank_recharge where `phone` = ?", [rows[0].phone]);
        const [bank_recharge_momo] = await connection.query("SELECT * FROM bank_recharge WHERE type = 'momo' AND `phone` = ?", [rows[0].phone]);
        const [settings] = await connection.query('SELECT * FROM admin ');

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

const rechargeDuyet = async (req, res) => {
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
        await connection.query(`UPDATE recharge SET status = 2 WHERE id = ?`, [id]);

        return res.status(200).json({
            message: 'Cancellation successful',
            status: true,
            datas: [],
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

const updateLevel = async (req, res) => {
    try {
        let id = req.body.id;
        let f1 = req.body.f1;
        let f2 = req.body.f2;
        let f3 = req.body.f3;
        let f4 = req.body.f4;

        console.log("level : " + id, f1, f2, f3, f4);

        await connection.query(
            'UPDATE `level` SET `f1`= ? ,`f2`= ? ,`f3`= ? ,`f4`= ?  WHERE `id` = ?',
            [f1, f2, f3, f4, id]
        );

        // Send a success response to the client
        res.status(200).json({
            message: 'Update successful',
            status: true,
        });
    } catch (error) {
        console.error('Error updating level:', error);

        // Send an error response to the client
        res.status(500).json({
            message: 'Update failed',
            status: false,
            error: error.message,
        });
    }
};


const handlWithdraw = async (req, res) => {
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
            datas: recharge,
        });
    }
    if (type == 'delete') {
        await connection.query(`UPDATE withdraw SET status = 2 WHERE id = ?`, [id]);
        const [info] = await connection.query(`SELECT * FROM withdraw WHERE id = ?`, [id]);
        await connection.query('UPDATE users SET money = money + ? WHERE phone = ? ', [info[0].money, info[0].phone]);
        return res.status(200).json({
            message: 'Cancel successfully',
            status: true,
            datas: recharge,
        });
    }
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


const settingBank = async (req, res) => {
    try {
        
        let uploadfile = await upload(req, res, (err) =>{
            if(err){
                console.log(err);
            }else{
                console.log('file uploaded succcessfully');
            }
        });

        const form = formidable({});
        let fields;

        [fields] = await form.parse(req);
        let auth = req.cookies.auth;


        let name_bank = fields["name_bank"];
        let name =fields["name"];
        let info = fields["info"];
        let qr = fields["qr"];
        let typer =  fields["typer"];

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
            
            const [bank_recharge] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ?;`, [users[0].phone]);
            var transfer_mode = '';
            if(bank_recharge.length != 0)
            {
                transfer_mode = bank_recharge[0].transfer_mode;
            }
            else{
                transfer_mode = "manual";
            }
            let file_name1 = fields["file_name"];
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

            const bankName = fields["bank_name"];
            const username = fields["username"]
            const upiId =  fields["upi_id"]
            const usdtWalletAddress =  fields["usdt_wallet_address"]
            let timeNow = Date.now();

            await connection.query("INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, upi_wallet = ?, transfer_mode = ?,phone=?, colloborator_action = ?, time = ?, type = 'momo', status = 1;", [
                bankName, username, upiId, uploadDir1, usdtWalletAddress,transfer_mode,users[0].phone, "off", timeNow
            ])

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
}

const deleteBankRechargeById = async (id) => {

    const [recharge] = await connection.query("DELETE FROM bank_recharge WHERE id = ?", [id]);

    return recharge
}

const tranfermode = async (req, res) => {
    let auth = req.cookies.auth;
    let tran_mode = req.body.mode_tran;
    const [rows] = await connection.query('SELECT * FROM users WHERE `token` = ? ', [auth]);
    let user = rows[0];
    await connection.execute("UPDATE bank_recharge SET transfer_mode = ?  WHERE `phone` = ? ", [tran_mode,user.phone] );
    return res.status(200).json({
        message: 'Submitted successfully',
        status: true,
        });
    } 

const settingCskh = async (req, res) => {
    let auth = req.cookies.auth;
    let telegram = req.body.telegram;
    let whatsapp = req.body.whatsapp;
    let cskh = req.body.cskh;
    let myapp_web = req.body.myapp_web;
    if (!auth || !cskh || !telegram) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    await connection.query(`UPDATE admin SET telegram = ?,whatsapp = ?, cskh = ?, app = ?`, [telegram,whatsapp, cskh, myapp_web]);
    return res.status(200).json({
        message: 'Successful change',
        status: true,
    });
}

const banned = async (req, res) => {
    let auth = req.cookies.auth;
    let id = req.body.id;
    let type = req.body.type;
    if (!auth || !id) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    if (type == 'open') {
        await connection.query(`UPDATE users SET status = 1 WHERE id = ?`, [id]);
    }
    if (type == 'close') {
        await connection.query(`UPDATE users SET status = 2 WHERE id = ?`, [id]);
    }
    return res.status(200).json({
        message: 'Successful change',
        status: true,
    });
}

const on_off_colloborator = async (req, res) => {
    let auth = req.cookies.auth;
    let id = req.body.id;
    let type = req.body.type;
    if (!auth || !id) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    if (type == 'on') {
        await connection.query(`UPDATE bank_recharge SET colloborator_action = 'on' WHERE phone = ?`, [id]);
    }
    if (type == 'off') {
        await connection.query(`UPDATE bank_recharge SET colloborator_action = 'off' WHERE phone = ?`, [id]);
    }
    return res.status(200).json({
        message: 'Successful change',
        status: true,
    });
}



const createBonus = async (req, res) => {
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
    let type = req.body.type;


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

    if (type == 'all') {
        let select = req.body.select;
        if (select == '1') {
            await connection.query(`UPDATE point_list SET money = money + ? WHERE level = 2`, [money]);
        } else {
            await connection.query(`UPDATE point_list SET money = money - ? WHERE level = 2`, [money]);
        }
        return res.status(200).json({
            message: 'successful change',
            status: true,
        });
    }

    if (type == 'two') {
        let select = req.body.select;
        if (select == '1') {
            await connection.query(`UPDATE point_list SET money_us = money_us + ? WHERE level = 2`, [money]);
        } else {
            await connection.query(`UPDATE point_list SET money_us = money_us - ? WHERE level = 2`, [money]);
        }
        return res.status(200).json({
            message: 'successful change',
            status: true,
        });
    }

    if (type == 'limit') {
        let select = req.body.select;
        let phone = req.body.phone;
        const [user] = await connection.query('SELECT * FROM point_list WHERE phone = ? ', [phone]);
        if (user.length == 0) {
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            });
        }
        if (select == '1') {
            await connection.query(`UPDATE point_list SET recharge = recharge + ? WHERE level = 2 and phone = ?`, [money, phone]);
        } else {
            await connection.query(`UPDATE point_list SET recharge = recharge - ? WHERE level = 2 and phone = ?`, [money, phone]);
        }
        return res.status(200).json({
            message: 'successful change',
            status: true,
        });
    }

    if (type == 'one') {
        let select = req.body.select;
        let phone = req.body.phone;
        const [user] = await connection.query('SELECT * FROM point_list WHERE phone = ? ', [phone]);
        if (user.length == 0) {
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            });
        }
        if (select == '1') {
            await connection.query(`UPDATE point_list SET money = money + ? WHERE level = 2 and phone = ?`, [money, phone]);
        } else {
            await connection.query(`UPDATE point_list SET money = money - ? WHERE level = 2 and phone = ?`, [money, phone]);
        }
        return res.status(200).json({
            message: 'successful change',
            status: true,
        });
    }

    if (type == 'three') {
        let select = req.body.select;
        let phone = req.body.phone;
        const [user] = await connection.query('SELECT * FROM point_list WHERE phone = ? ', [phone]);
        if (user.length == 0) {
            return res.status(200).json({
                message: 'account does not exist',
                status: false,
                timeStamp: timeNow,
            });
        }
        if (select == '1') {
            await connection.query(`UPDATE point_list SET money_us = money_us + ? WHERE level = 2 and phone = ?`, [money, phone]);
        } else {
            await connection.query(`UPDATE point_list SET money_us = money_us - ? WHERE level = 2 and phone = ?`, [money, phone]);
        }
        return res.status(200).json({
            message: 'successful change',
            status: true,
        });
    }

    if (!type) {
        let id_redenvelops = randomString(16);
        let sql = `INSERT INTO redenvelopes SET id_redenvelope = ?, phone = ?, money = ?, used = ?, amount = ?, status = ?, time = ?`;
        await connection.query(sql, [id_redenvelops, userInfo.phone, money, 1, 1, 0, time]);
        return res.status(200).json({
            message: 'Successful change',
            status: true,
            id: id_redenvelops,
        });
    }
}

const listRedenvelops = async (req, res) => {
    let auth = req.cookies.auth;

    let [redenvelopes] = await connection.query('SELECT * FROM redenvelopes WHERE status = 0 ');
    return res.status(200).json({
        message: 'Successful change',
        status: true,
        redenvelopes: redenvelopes,
    });
}

const settingbuff = async (req, res) => {
    let auth = req.cookies.auth;
    let id_user = req.body.id_user;
    let buff_acc = req.body.buff_acc;
    let money_value = req.body.money_value;
    if (!id_user || !buff_acc || !money_value) {
        return res.status(200).json({
            message: 'Failed',
            status: false,
            timeStamp: timeNow,
        });
    }
    const [user_id] = await connection.query(`SELECT * FROM users WHERE id_user = ?`, [id_user]);

    if (user_id.length > 0) {
        if (buff_acc == '1') {
            await connection.query(`UPDATE users SET money = money + ? WHERE id_user = ?`, [money_value, id_user]);
        }
        if (buff_acc == '2') {
            await connection.query(`UPDATE users SET money = money - ? WHERE id_user = ?`, [money_value, id_user]);
        }
        return res.status(200).json({
            message: 'Successful change',
            status: true,
        });
    } else {
        return res.status(200).json({
            message: 'Successful change',
            status: false,
        });
    }
}
const randomNumber = (min, max) => {
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

const randomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const ipAddress = (req) => {
    let ip = '';
    if (req.headers['x-forwarded-for']) {
        ip = req.headers['x-forwarded-for'].split(",")[0];
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    } else {
        ip = req.ip;
    }
    return ip;
}

const timeCreate = () => {
    const d = new Date();
    const time = d.getTime();
    return time;
}



const register = async (req, res) => {
    let { username, password,invitecode } = req.body;
    let id_user = randomNumber(10000, 99999);
    let name_user = "Member" + randomNumber(10000, 99999);
    let code = randomString(5) + randomNumber(10000, 99999);
    let ip = ipAddress(req);
    let time = timeCreate();

    invitecode = '2cOCs36373';

    if (!username || !password || !invitecode) {
        return res.status(200).json({
            message: 'ERROR!!!',
            status: false
        });
    }

    if (!username) {
        return res.status(200).json({
            message: 'phone error',
            status: false
        });
    }

    try {
        const [check_u] = await connection.query('SELECT * FROM users WHERE phone = ? ', [username]);
        if (check_u.length == 1) {
            return res.status(200).json({
                message: 'register account', //Số điện thoại đã được đăng ký
                status: false
            });
        } else {
            const sql = `INSERT INTO users SET 
            id_user = ?,
            phone = ?,
            name_user = ?,
            password = ?,
            money = ?,
            level = ?,
            code = ?,
            invite = ?,
            veri = ?,
            ip_address = ?,
            status = ?,
            time = ?`;
            await connection.execute(sql, [id_user, username, name_user, md5(password), 0, 2, code, invitecode, 1, ip, 1, time]);
            await connection.execute('INSERT INTO point_list SET phone = ?, level = 2', [username]);
            return res.status(200).json({
                message: 'registration success',//Register Sucess
                status: true
            });
        }
    } catch (error) {
        if (error) console.log(error);
    }

}

const profileUser = async (req, res) => {
    let phone = req.body.phone;
    if (!phone) {
        return res.status(200).json({
            message: 'Phone Error',
            status: false,
            timeStamp: timeNow,
        });
    }
    let [user] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [phone]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Phone Error',
            status: false,
            timeStamp: timeNow,
        });
    }
    let [recharge] = await connection.query(`SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT 10`, [phone]);
    let [withdraw] = await connection.query(`SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT 10`, [phone]);
    return res.status(200).json({
        message: 'Get success',
        status: true,
        recharge: recharge,
        withdraw: withdraw,
    });
}

const infoCtv = async (req, res) => {
    const phone = req.body.phone;

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Phone Error',
            status: false,
        });
    }
    let userInfo = user[0];
    // cấp dưới trực tiếp all
    const [f1s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [userInfo.code]);

    // cấp dưới trực tiếp hôm nay 
    let f1_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_time = f1s[i].time; // Mã giới thiệu f1
        let check = (timerJoin(f1_time) == timerJoin()) ? true : false;
        if (check) {
            f1_today += 1;
        }
    }

    // tất cả cấp dưới hôm nay 
    let f_all_today = 0;
    for (let i = 0; i < f1s.length; i++) {
        const f1_code = f1s[i].code; // Mã giới thiệu f1
        const f1_time = f1s[i].time; // time f1
        let check_f1 = (timerJoin(f1_time) == timerJoin()) ? true : false;
        if (check_f1) f_all_today += 1;
        // tổng f1 mời đc hôm nay
        const [f2s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f1_code]);
        for (let i = 0; i < f2s.length; i++) {
            const f2_code = f2s[i].code; // Mã giới thiệu f2
            const f2_time = f2s[i].time; // time f2
            let check_f2 = (timerJoin(f2_time) == timerJoin()) ? true : false;
            if (check_f2) f_all_today += 1;
            // tổng f2 mời đc hôm nay
            const [f3s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f2_code]);
            for (let i = 0; i < f3s.length; i++) {
                const f3_code = f3s[i].code; // Mã giới thiệu f3
                const f3_time = f3s[i].time; // time f3
                let check_f3 = (timerJoin(f3_time) == timerJoin()) ? true : false;
                if (check_f3) f_all_today += 1;
                const [f4s] = await connection.query('SELECT `phone`, `code`,`invite`, `time` FROM users WHERE `invite` = ? ', [f3_code]);
                // tổng f3 mời đc hôm nay
                for (let i = 0; i < f4s.length; i++) {
                    const f4_code = f4s[i].code; // Mã giới thiệu f4
                    const f4_time = f4s[i].time; // time f4
                    let check_f4 = (timerJoin(f4_time) == timerJoin()) ? true : false;
                    if (check_f4) f_all_today += 1;
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
            if (f3s.length > 0) f3 += f3s.length;
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
                if (f4s.length > 0) f4 += f4s.length;
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
            let today = timerJoin();
            let time = timerJoin(recharge_today[i].time);
            if (time == today) {
                total_recharge_today += recharge_today[i].money;
            }
        }
        for (let i = 0; i < withdraw_today.length; i++) {
            let today = timerJoin();
            let time = timerJoin(withdraw_today[i].time);
            if (time == today) {
                total_withdraw_today += withdraw_today[i].money;
            }
        }
    }

    let win = 0;
    let loss = 0;
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;
        const [wins] = await connection.query('SELECT `money`, `time` FROM minutes_1 WHERE phone = ? AND status = 1 ', [phone]);
        const [losses] = await connection.query('SELECT `money`, `time` FROM minutes_1 WHERE phone = ? AND status = 2 ', [phone]);
        for (let i = 0; i < wins.length; i++) {
            let today = timerJoin();
            let time = timerJoin(wins[i].time);
            if (time == today) {
                win += wins[i].money;
            }
        }
        for (let i = 0; i < losses.length; i++) {
            let today = timerJoin();
            let time = timerJoin(losses[i].time);
            if (time == today) {
                loss += losses[i].money;
            }
        }
    }
    let list_mems = [];
    const [list_mem_today] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [phone]);
    for (let i = 0; i < list_mem_today.length; i++) {
        let today = timerJoin();
        let time = timerJoin(list_mem_today[i].time);
        if (time == today) {
            list_mems.push(list_mem_today[i]);
        }
    }

    const [point_list] = await connection.query('SELECT * FROM point_list WHERE phone = ? ', [phone]);
    let moneyCTV = point_list[0].money;

    let list_recharge_news = [];
    let list_withdraw_news = [];
    for (let i = 0; i < list_mem.length; i++) {
        let phone = list_mem[i].phone;
        const [recharge_today] = await connection.query('SELECT `id`, `status`, `type`,`phone`, `money`, `time` FROM recharge WHERE phone = ? AND status = 1 ', [phone]);
        const [withdraw_today] = await connection.query('SELECT `id`, `status`,`phone`, `money`, `time` FROM withdraw WHERE phone = ? AND status = 1 ', [phone]);
        for (let i = 0; i < recharge_today.length; i++) {
            let today = timerJoin();
            let time = timerJoin(recharge_today[i].time);
            if (time == today) {
                list_recharge_news.push(recharge_today[i]);
            }
        }
        for (let i = 0; i < withdraw_today.length; i++) {
            let today = timerJoin();
            let time = timerJoin(withdraw_today[i].time);
            if (time == today) {
                list_withdraw_news.push(withdraw_today[i]);
            }
        }
    }

    const [redenvelopes_used] = await connection.query('SELECT * FROM redenvelopes_used WHERE phone = ? ', [phone]);
    let redenvelopes_used_today = [];
    for (let i = 0; i < redenvelopes_used.length; i++) {
        let today = timerJoin();
        let time = timerJoin(redenvelopes_used[i].time);
        if (time == today) {
            redenvelopes_used_today.push(redenvelopes_used[i]);
        }
    }

    const [financial_details] = await connection.query('SELECT * FROM financial_details WHERE phone = ? ', [phone]);
    let financial_details_today = [];
    for (let i = 0; i < financial_details.length; i++) {
        let today = timerJoin();
        let time = timerJoin(financial_details[i].time);
        if (time == today) {
            financial_details_today.push(financial_details[i]);
        }
    }


    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: user,
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
        redenvelopes_used: redenvelopes_used_today,
        financial_details_today: financial_details_today,
    });
}

const infoCtv2 = async (req, res) => {
    const phone = req.body.phone;
    const timeDate = req.body.timeDate;

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

    const [user] = await connection.query('SELECT * FROM users WHERE phone = ? ', [phone]);

    if (user.length == 0) {
        return res.status(200).json({
            message: 'Phone Error',
            status: false,
        });
    }
    let userInfo = user[0];
    const [list_mem] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [phone]);

    let list_mems = [];
    const [list_mem_today] = await connection.query('SELECT * FROM users WHERE ctv = ? AND status = 1 AND veri = 1 ', [phone]);
    for (let i = 0; i < list_mem_today.length; i++) {
        let today = timeDate;
        let time = timerJoin(list_mem_today[i].time);
        if (time == today) {
            list_mems.push(list_mem_today[i]);
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

const listRechargeMem = async (req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let { pageno, limit } = req.body;

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
    let { token, password, otp, level, ...userInfo } = user[0];

    const [recharge] = await connection.query(`SELECT * FROM recharge WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [phone]);
    const [total_users] = await connection.query(`SELECT * FROM recharge WHERE phone = ?`, [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: recharge,
        page_total: Math.ceil(total_users.length / limit)
    });
}

const listWithdrawMem = async (req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let { pageno, limit } = req.body;

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
    let { token, password, otp, level, ...userInfo } = user[0];

    const [withdraw] = await connection.query(`SELECT * FROM withdraw WHERE phone = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [phone]);
    const [total_users] = await connection.query(`SELECT * FROM withdraw WHERE phone = ?`, [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: withdraw,
        page_total: Math.ceil(total_users.length / limit)
    });
}

const listRedenvelope = async (req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let { pageno, limit } = req.body;

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
    let { token, password, otp, level, ...userInfo } = user[0];

    const [redenvelopes_used] = await connection.query(`SELECT * FROM redenvelopes_used WHERE phone_used = ? ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [phone]);
    const [total_users] = await connection.query(`SELECT * FROM redenvelopes_used WHERE phone_used = ?`, [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: redenvelopes_used,
        page_total: Math.ceil(total_users.length / limit)
    });
}
// Level Setting get

const getLevelInfo = async (req, res) => {

    const [rows] = await connection.query('SELECT * FROM `level`');

    if (!rows) {
        return res.status(200).json({
            message: 'Failed',
            status: false,

        });
    }
    console.log("asdasdasd : " + rows)
    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {

        },
        rows: rows
    });

    // const [recharge] = await connection.query('SELECT * FROM recharge WHERE `phone` = ? AND status = 1', [rows[0].phone]);
    // let totalRecharge = 0;
    // recharge.forEach((data) => {
    //     totalRecharge += data.money;
    // });
    // const [withdraw] = await connection.query('SELECT * FROM withdraw WHERE `phone` = ? AND status = 1', [rows[0].phone]);
    // let totalWithdraw = 0;
    // withdraw.forEach((data) => {
    //     totalWithdraw += data.money;
    // });

    // const { id, password, ip, veri, ip_address, status, time, token, ...others } = rows[0];
    // return res.status(200).json({
    //     message: 'Success',
    //     status: true,
    //     data: {
    //         code: others.code,
    //         id_user: others.id_user,
    //         name_user: others.name_user,
    //         phone_user: others.phone,
    //         money_user: others.money,
    //     },
    //     totalRecharge: totalRecharge,
    //     totalWithdraw: totalWithdraw,
    //     timeStamp: timeNow,
    // });


}

const listBet = async (req, res) => {
    let auth = req.cookies.auth;
    let phone = req.params.phone;
    let { pageno, limit } = req.body;

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
    let { token, password, otp, level, ...userInfo } = user[0];

    const [listBet] = await connection.query(`SELECT * FROM minutes_1 WHERE phone = ? AND status != 0 ORDER BY id DESC LIMIT ${pageno}, ${limit} `, [phone]);
    const [total_users] = await connection.query(`SELECT * FROM minutes_1 WHERE phone = ? AND status != 0`, [phone]);
    return res.status(200).json({
        message: 'Success',
        status: true,
        datas: listBet,
        page_total: Math.ceil(total_users.length / limit)
    });
}

const listOrderOld = async (req, res) => {
    let { gameJoin } = req.body;
    let internet_bet = req.body.join_al;
    let checkGame = ['1', '3', '5', '10'].includes(String(gameJoin));
    if (!checkGame) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    let game = Number(gameJoin);

    let join = '';
    if (game == 1) join = 'k5d';
    if (game == 3) join = 'k5d3';
    if (game == 5) join = 'k5d5';
    if (game == 10) join = 'k5d10';

    const [k5d] = await connection.query(`SELECT * FROM d5 WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10 `);
    const [period] = await connection.query(`SELECT period FROM d5 WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `);
    const [waiting] = await connection.query(`SELECT phone, money, price, amount, bet, join_bet FROM result_5d WHERE status = 0 AND level = 0 AND game = '${game}' AND join_bet = '${internet_bet}' ORDER BY id ASC `);
    const [settings] = await connection.query(`SELECT ${join} FROM admin`);
    if (k5d.length == 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    if (!k5d[0] || !period[0]) {
        return res.status(200).json({
            message: 'Error!',
            status: false
        });
    }
    return res.status(200).json({
        code: 0,
        msg: "Get success",
        data: {
            gameslist: k5d,
        },
        bet: waiting,
        settings: settings,
        join: join,
        period: period[0].period,
        status: true
    });
}

const listOrderOldK3 = async (req, res) => {
    let { gameJoin } = req.body;

    let checkGame = ['1', '3', '5', '10'].includes(String(gameJoin));
    if (!checkGame) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    let game = Number(gameJoin);

    let join = '';
    if (game == 1) join = 'k3d';
    if (game == 3) join = 'k3d3';
    if (game == 5) join = 'k3d5';
    if (game == 10) join = 'k3d10';

    const [k5d] = await connection.query(`SELECT * FROM k3 WHERE status != 0 AND game = '${game}' ORDER BY id DESC LIMIT 10 `);
    const [period] = await connection.query(`SELECT period FROM k3 WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1 `);
    const [waiting] = await connection.query(`SELECT phone, money, price, typeGame, amount, bet FROM result_k3 WHERE status = 0 AND level = 0 AND game = '${game}' ORDER BY id ASC `);
    const [settings] = await connection.query(`SELECT ${join} FROM admin`);
    if (k5d.length == 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    if (!k5d[0] || !period[0]) {
        return res.status(200).json({
            message: 'Error!',
            status: false
        });
    }
    return res.status(200).json({
        code: 0,
        msg: "Get Success",
        data: {
            gameslist: k5d,
        },
        bet: waiting,
        settings: settings,
        join: join,
        period: period[0].period,
        status: true
    });
}

const editResult = async (req, res) => {
    let { game, list } = req.body;

    if (!list || !game) {
        return res.status(200).json({
            message: 'ERROR!!!',
            status: false
        });
    }

    let join = '';
    if (game == 1) join = 'k5d';
    if (game == 3) join = 'k5d3';
    if (game == 5) join = 'k5d5';
    if (game == 10) join = 'k5d10';

    const sql = `UPDATE admin SET ${join} = ?`;
    await connection.execute(sql, [list]);
    return res.status(200).json({
        message: 'Editing is successful',//Register Sucess
        status: true
    });

}

const editResult2 = async (req, res) => {
    let { game, list } = req.body;

    if (!list || !game) {
        return res.status(200).json({
            message: 'ERROR!!!',
            status: false
        });
    }

    let join = '';
    if (game == 1) join = 'k3d';
    if (game == 3) join = 'k3d3';
    if (game == 5) join = 'k3d5';
    if (game == 10) join = 'k3d10';

    const sql = `UPDATE admin SET ${join} = ?`;
    await connection.execute(sql, [list]);
    return res.status(200).json({
        message: 'Editing is successful',//Register Sucess
        status: true
    });

}

const CreatedSalary = async (req, res) => {
    try {
        const phone = req.body.phone;
        const amount = req.body.amount;
        const type = req.body.type;
        const now = new Date();
        const formattedTime = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        // Check if the phone number is a 10-digit number
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                message: 'ERROR!!! Invalid phone number. Please provide a 10-digit phone number.',
                status: false
            });
        }

        // Check if user with the given phone number exists
        const checkUserQuery = 'SELECT * FROM `users` WHERE phone = ?';
        const [existingUser] = await connection.execute(checkUserQuery, [phone]);

        if (existingUser.length === 0) {
            // If user doesn't exist, return an error
            return res.status(400).json({
                message: 'ERROR!!! User with the provided phone number does not exist.',
                status: false
            });
        }

        // If user exists, update the 'users' table
        const updateUserQuery = 'UPDATE `users` SET `money` = `money` + ? WHERE phone = ?';
        await connection.execute(updateUserQuery, [amount, phone]);


        // Insert record into 'salary' table
        const insertSalaryQuery = 'INSERT INTO salary (phone, amount, type, time) VALUES (?, ?, ?, ?)';
        await connection.execute(insertSalaryQuery, [phone, amount, type, formattedTime]);

        res.status(200).json({ message: 'Salary record created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getSalary = async (req, res) => {
    const [rows] = await connection.query(`SELECT * FROM salary ORDER BY time DESC`);

    if (!rows) {
        return res.status(200).json({
            message: 'Failed',
            status: false,

        });
    }
    console.log("asdasdasd : " + rows)
    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {

        },
        rows: rows
    })
};


const gettranfermode = async (req, res) => {
    let auth = req.cookies.auth;
    const [user] = await connection.execute('SELECT `phone` FROM `users` WHERE `token` = ?', [auth]);
    const [rows] = await connection.query('SELECT transfer_mode FROM bank_recharge WHERE `phone` = ? ', [user[0].phone]);

    if (!rows) {
        return res.status(200).json({
            message: 'Failed',
            status: false,

        });
    }
    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {

        },
        rows: rows
    })
};


const getdashboardInfo = async (req, res) => {
    let auth = req.cookies.auth;
    let totaltodayUsers = 0;
    let totaltodayRecharge = 0;
    let totaltodayWithdrawal = 0;
    let usersBalanace = 0;
    let totalUsers = 0;
    let peningRecharge = 0; 
    let sucessRecharge = 0; 
    let monthRecharge = 0; 
    let monthRecharge_no = 0;
    let totalwithdrawal = 0; 
    let totalwithdrawal_amt = 0; 
    let totalwithdrawal_no = 0;
    let withdrawalRequest = 0;
    let totalBet = 0;
    let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    let totalWinning = 0;
    let totalProfit = 0;
    let win_total_w = 0;
    let win_total_k3 = 0;
    let win_total_5d = 0;
    let win_total_trx = 0;
    let vip_level_bonus = 0;
    let vip_month_reward = 0;
    const today = moment().startOf("day").valueOf();
    const yesterday = moment().subtract(1, "days").valueOf();
    const [today_minutes_1] = await connection.query("SELECT SUM(money) AS `sum` FROM minutes_1 WHERE  `time` >= ?;", [yesterday]);
    const [today_k3_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_k3 WHERE  `time` >= ?;", [yesterday]);
    const [today_d5_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_5d WHERE  `time` >= ?;", [yesterday]);
    const [today_trx_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE  `time` >= ?;", [yesterday]);
    total_w = today_minutes_1[0].sum || 0;
    total_k3 = today_k3_bet_money[0].sum || 0;
    total_5d = today_d5_bet_money[0].sum || 0;
    total_trx = today_trx_bet_money[0].sum || 0;
    totalBet += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d) + parseInt(total_trx);

    const [win_today_minutes_1] = await connection.query("SELECT SUM(get) AS `sum` FROM minutes_1 WHERE  `time` >= ?;", [yesterday]);
    const [win_today_k3_bet_money] = await connection.query("SELECT SUM(get) AS `sum` FROM result_k3 WHERE  `time` >= ?;", [yesterday]);
    const [win_today_d5_bet_money] = await connection.query("SELECT SUM(get) AS `sum` FROM result_5d WHERE  `time` >= ?;", [yesterday]);
    const [win_today_trx_bet_money] = await connection.query("SELECT SUM(get) AS `sum` FROM trx_wingo_bets WHERE  `time` >= ?;", [yesterday]);
    win_total_w = win_today_minutes_1[0].sum || 0;
    win_total_k3 = win_today_k3_bet_money[0].sum || 0;
    win_total_5d = win_today_d5_bet_money[0].sum || 0;
    win_total_trx = win_today_trx_bet_money[0].sum || 0;
    totalWinning += parseInt(win_total_w) + parseInt(win_total_k3) + parseInt(win_total_5d) + parseInt(win_total_trx);

    totalProfit = totalBet -totalWinning
    const [list_recharge_users_today] = await connection.query("SELECT * FROM recharge WHERE `status`=1 AND `time`>= ? ORDER BY `id` DESC;", [yesterday]);
    let today_bonus_amt = 0;
    for (let i = 0; i < list_recharge_users_today.length; i++) {
        const user_money_td =  (parseInt(list_recharge_users_today[i].money) / 100) * 5;
        const inviter_money_td = (parseInt(list_recharge_users_today[i].money) / 100) * 5;
        today_bonus_amt = today_bonus_amt + user_money_td;
        const [list_mem_td] = await connection.query('SELECT * FROM users WHERE phone = ? ', [list_recharge_users_today[i].phone]);
        const [list_mem_in_td] = await connection.query('SELECT * FROM users WHERE code = ? ', [list_mem_td[0].invite]);
        if(list_mem_in_td.length != 0)
        {
            today_bonus_amt = today_bonus_amt + inviter_money_td;
        }
    }

    const [list_gift_code_today] = await connection.query("SELECT SUM(money) AS `sum` FROM redenvelopes_used WHERE `time`>= ? ORDER BY `id` DESC;", [yesterday]);
    const today_gift_code = list_gift_code_today[0].sum || 0;

    const [list_vip_level_today] = await connection.query("SELECT SUM(amount) AS `sum` FROM claimed_rewards WHERE `type` = ? AND `time`>= ? ORDER BY `id` DESC;", [REWARD_TYPES_MAP.VIP_LEVEL_UP_BONUS,yesterday]);
    const today_vip_level = list_vip_level_today[0].sum || 0;

    const [list_vip_month_rwd_today] = await connection.query("SELECT SUM(amount) AS `sum` FROM claimed_rewards WHERE `type` = ? AND `time`>= ? ORDER BY `id` DESC;", [REWARD_TYPES_MAP.VIP_MONTHLY_REWARD,yesterday]);
    const today_vip_month_rwd_level = list_vip_month_rwd_today[0].sum || 0;

    const [list_stake_amt_list_today] = await connection.query("SELECT SUM(amount) AS `sum` FROM claimed_rewards WHERE `type` = 136 AND `status`=1 AND `to_date` = ? ORDER BY `id` DESC;", [timerJoin3()]);
    const total_stake_amt_today = list_stake_amt_list_today[0].sum || 0;

    const [list_stake_list_today] = await connection.query("SELECT SUM(stake_amnt) AS `sum` FROM claimed_rewards WHERE `type` = 136 AND `status`=1 AND `to_date` = ? ORDER BY `id` DESC;", [timerJoin3()]);
    const total_stake_today = list_stake_list_today[0].sum || 0;

    const stake_rwrd_today = parseInt(total_stake_amt_today) - parseInt(total_stake_today);

    const total_today_expen = parseInt(today_bonus_amt) + parseInt(today_gift_code) + parseInt(today_vip_level) + parseInt(today_vip_month_rwd_level) + parseInt(stake_rwrd_today);

    const profit_after_exp = parseInt(totalProfit) - parseInt(total_today_expen);

    const [users_join_today] = await connection.query("SELECT COUNT(*) AS `count` FROM users WHERE  `time` >= ?;", [today]);
    totaltodayUsers = users_join_today[0].count || 0;

    const [users_recharge_today] = await connection.query("SELECT SUM(money) AS `sum` FROM recharge WHERE  `time` >= ? AND `status` = ?;", [today, 1]);
    totaltodayRecharge = users_recharge_today[0].sum || 0;

    const [users_withdraw_today] = await connection.query("SELECT SUM(money) AS `sum` FROM withdraw WHERE  `time` >= ? AND `status` = ?;", [today, 1]);
    totaltodayWithdrawal = users_withdraw_today[0].sum || 0;

    const [users_total] = await connection.query("SELECT COUNT(*) AS `count` FROM users;", []);
    totalUsers = users_total[0].count || 0;

    const [users_balance] = await connection.query("SELECT SUM(money) AS `sum` FROM users;", []);
    usersBalanace = users_balance[0].sum || 0;

    const [list_pending_recharge] = await connection.query("SELECT COUNT(*) AS `count` FROM recharge WHERE  `status` = ?;", [0]);
    peningRecharge = list_pending_recharge[0].count || 0;

    const [list_success_recharge] = await connection.query("SELECT COUNT(*) AS `count` FROM recharge WHERE  `status` = ? ", [1]);
    sucessRecharge = list_success_recharge[0].count || 0;

    const [list_success_recharge_month] = await connection.query("SELECT SUM(money) AS `sum` FROM recharge WHERE  `status` = ? AND MONTH(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = MONTH(CURRENT_DATE()) AND YEAR(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;", [1]);
    monthRecharge = list_success_recharge_month[0].sum || 0;

    const [list_success_recharge_month_no] = await connection.query("SELECT COUNT(*) AS `count` FROM recharge WHERE  `status` = ? AND MONTH(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = MONTH(CURRENT_DATE()) AND YEAR(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;", [1]);
    monthRecharge_no = list_success_recharge_month_no[0].count || 0;

    const [list_pending_withdraw] = await connection.query("SELECT COUNT(*) AS `count` FROM withdraw WHERE  `status` = ?;", [0]);
    withdrawalRequest = list_pending_withdraw[0].count || 0;

    const [list_success_withdraw] = await connection.query("SELECT COUNT(*) AS `count` FROM withdraw WHERE  `status` = ?;", [1]);
    totalwithdrawal = list_success_withdraw[0].count || 0;

    const [list_success_withdraw_amt] = await connection.query("SELECT SUM(`money`) AS `sum` FROM withdraw WHERE  `status` = ? AND MONTH(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = MONTH(CURRENT_DATE()) AND YEAR(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;", [1]);
    totalwithdrawal_amt = list_success_withdraw_amt[0].sum || 0;

    const [list_success_withdraw_no] = await connection.query("SELECT COUNT(*) AS `count` FROM withdraw WHERE  `status` = ? AND MONTH(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = MONTH(CURRENT_DATE()) AND YEAR(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;", [1]);
    totalwithdrawal_no = list_success_withdraw_no[0].count || 0;

    let monthkyturnover = 0;
    const [list_month_turn_over] = await connection.query("SELECT SUM(daily_turn_over) AS `sum` FROM turn_over WHERE MONTH(`date_time`) = MONTH(CURRENT_DATE()) AND YEAR(`date_time`) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;");
    monthkyturnover = list_month_turn_over[0].sum || 0;
    let monthrechagebonus = 0;
    const [list_month_recharge] = await connection.query("SELECT SUM(`money`) AS `sum` FROM recharge WHERE `status`=1 AND MONTH(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = MONTH(CURRENT_DATE()) AND YEAR(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;");
    const monthrecharge_23 = list_month_recharge[0].sum || 0;
    const [list_recharge_users] = await connection.query("SELECT * FROM recharge WHERE `status`=1 AND MONTH(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = MONTH(CURRENT_DATE()) AND YEAR(STR_TO_DATE(`today`, '%Y-%d-%m %h:%i:%s %p')) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;");
    let bonus_amt = 0;
    for (let i = 0; i < list_recharge_users.length; i++) {
        const user_money =  (parseInt(list_recharge_users[i].money) / 100) * 5;
        const inviter_money = (parseInt(list_recharge_users[i].money) / 100) * 5;
        bonus_amt = bonus_amt + user_money;
        const [list_mem] = await connection.query('SELECT * FROM users WHERE phone = ? ', [list_recharge_users[i].phone]);
        const [list_mem_in] = await connection.query('SELECT * FROM users WHERE code = ? ', [list_mem[0].invite]);
        if(list_mem_in.length != 0)
        {
            bonus_amt = bonus_amt + inviter_money;
        }
    }
    monthrechagebonus =  parseInt(monthrecharge_23) + parseInt(bonus_amt);
    let monthstakingamount = 0;
    const [list_month_stakes] = await connection.query("SELECT SUM(`amount`) AS `sum` FROM claimed_rewards WHERE `reward_id`=136 AND MONTH(`to_date`) = MONTH(CURRENT_DATE()) AND YEAR(`to_date`) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;");
    monthstakingamount = list_month_stakes[0].sum || 0;

    let monthstakingcount = 0;
    const [list_month_stakes_c] = await connection.query("SELECT SUM(`stake_amnt`) AS `sum` FROM claimed_rewards WHERE `reward_id`=136 AND MONTH(`to_date`) = MONTH(CURRENT_DATE()) AND YEAR(`to_date`) = YEAR(CURRENT_DATE()) ORDER BY `id` DESC;");
    monthstakingcount = list_month_stakes_c[0].sum || 0;

    let active_stakes_count = 0;
    const [list_active_stakes] = await connection.query("SELECT COUNT(*) AS `count` FROM claimed_rewards WHERE `reward_id`=136 AND `status`= 2 ORDER BY `id` DESC;");
    active_stakes_count = list_active_stakes[0].count || 0;

    let active_stakes_amt = 0;
    const [list_active_stakes_amt] = await connection.query("SELECT SUM(`amount`) AS `sum` FROM claimed_rewards WHERE `reward_id`=136 AND `status`= 2 ORDER BY `id` DESC;");
    active_stakes_amt = list_active_stakes_amt[0].sum || 0;

    let giftcodevalue = 0;
    const [list_redenvelopes_used] = await connection.query("SELECT * FROM redenvelopes_used;");
    for (let i = 0; i < list_redenvelopes_used.length; i++) {
        const re_dev_used_time = list_redenvelopes_used[i].time;
        let check = timerJoin1(re_dev_used_time);
        if(check == "match")
        {
            giftcodevalue +=  parseInt(list_redenvelopes_used[i].money);
        }
    }

    const colloboratordata =  await getcolloboratorData();

    let stakeROI = parseFloat(monthstakingamount).toFixed(2) - parseFloat(monthstakingcount).toFixed(2);


    const [list_vip_level_month] = await connection.query('SELECT DATE_FORMAT(FROM_UNIXTIME(t.time), "%Y-%m") AS "_Month", SUM(amount) as `sum` FROM claimed_rewards as t where `type` = ? GROUP BY _Month;', [REWARD_TYPES_MAP.VIP_LEVEL_UP_BONUS]);
    try{
        vip_level_bonus = list_vip_level_month[0].sum || 0;
    }
    catch(err){}

    const [list_vip_month_rwd_month] = await connection.query('SELECT DATE_FORMAT(FROM_UNIXTIME(t.time), "%Y-%m") AS "_Month", SUM(amount) as `sum` FROM claimed_rewards as t where `type` = ? GROUP BY _Month;', [REWARD_TYPES_MAP.VIP_MONTHLY_REWARD]);
    try{
        vip_month_reward = list_vip_month_rwd_month[0].sum || 0;
    }
    catch(err){}

    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {
            a_usersJoin:totaltodayUsers,
            a_TodaysRecharge:totaltodayRecharge,
            a_TodaysWithdrawal:totaltodayWithdrawal,
            a_UserBalance:usersBalanace,
            a_TotalUsers:totalUsers - 1,
            a_PendingRecharge:peningRecharge,
            a_SuccessRecharge:sucessRecharge,
            a_TotalRecharge_No:monthRecharge_no,
            a_TotalRechargeMonth:monthRecharge,
            a_TotalWithdrawal:totalwithdrawal,
            a_TotalWithdrawal_No:totalwithdrawal_no,
            a_TotalWithdrawal_AMT:totalwithdrawal_amt,
            a_WithdrawalRequests:withdrawalRequest,
            a_TodaysTotalBets:totalBet,
            a_TodaysTotalWin:totalWinning,
            a_TodaysProfit:totalProfit,
            a_TodaysProfit_EXP:profit_after_exp,
            a_month_colloborator:colloboratordata.result_val,
            a_month_turnover:monthkyturnover,
            a_month_gift_redeem:giftcodevalue,
            a_month_recharge_bonus:monthrechagebonus,
            a_month_staking_amt: parseFloat(monthstakingamount).toFixed(2),
            a_month_staking_rewards:stakeROI,
            a_active_stakes:active_stakes_count,
            a_roi_active_stakes:parseFloat(active_stakes_amt).toFixed(2),
            a_vipLevelBonus:vip_level_bonus,
            a_vipMonthReward:vip_month_reward
        },
    })
}

const getcolloboratorData = async () => {

    let result = 0;
    const [rows] = await connection.query('SELECT * FROM users WHERE `level` = 2');
    for (let i = 0; i < rows.length; i++) {
        const phone = rows[i].phone;
        let user_salary = 0;
        const [list_user_sal_amt] = await connection.query("SELECT SUM(`amount`) AS `sum` FROM salary WHERE Month(STR_TO_DATE(`time`, '%m/%d/%Y, %h:%i:%s %p')) = MONTH(CURRENT_DATE()) AND YEAR(STR_TO_DATE(`time`, '%m/%d/%Y, %h:%i:%s %p')) = YEAR(CURRENT_DATE()) AND `phone` = ? ORDER BY `id` DESC;", [phone]);
        user_salary = list_user_sal_amt[0].sum || 0;
        let giftcodevalue = 0;
        const [list_redenvelopes_used] = await connection.query("SELECT * FROM redenvelopes_used where `phone_used` = ?;", [phone]);
        for (let i = 0; i < list_redenvelopes_used.length; i++) {
            const re_dev_used_time = list_redenvelopes_used[i].time;
            let check = timerJoin1(re_dev_used_time);
            if(check == "match"){
                giftcodevalue +=  parseInt(list_redenvelopes_used[i].money);
            }
        }
        var total_wingo_bet = 0;
        var total_k3_bet = 0;
        var total_trx_bet = 0;
        var total_d5_bet = 0;
        var total_wingo_win_amt = 0;
        var total_k3_win_amt = 0;
        var total_d5_win_amt = 0;
        var total_trx_win_amt = 0;
        var total_bet_amt = 0;
        var total_win_loss = 0 ;
        var total_win_amt = 0;
        [[total_wingo_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM minutes_1 WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE())  ORDER BY `id` DESC', [phone]);
        [[total_k3_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_k3 WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE())  ORDER BY `id` DESC', [phone]);
        [[total_d5_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM result_5d WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE())  ORDER BY `id` DESC', [phone]);
        [[total_trx_bet]] = await connection.query('SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE())  ORDER BY `id` DESC', [phone]);
        [[total_wingo_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM minutes_1 WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_k3_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_k3 WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_d5_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM result_5d WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        [[total_trx_win_amt]] = await connection.query('SELECT SUM(get) AS `sum` FROM trx_wingo_bets WHERE `phone` = ? AND MONTH(`today`) = MONTH(CURRENT_DATE()) AND YEAR(`today`) = YEAR(CURRENT_DATE()) AND `status` = 1  ORDER BY `id` DESC', [phone]);
        var tt_wingo_bets = total_wingo_bet.sum || 0 ;
        var tt_k3_bets = total_k3_bet.sum || 0 ;
        var tt_d5_bets = total_d5_bet.sum || 0 ;
        var tt_trx_bets = total_trx_bet.sum || 0 ;
        var ttw_wingo_bets = total_wingo_win_amt.sum || 0 ;
        var ttw_k3_bets = total_k3_win_amt.sum || 0 ;
        var ttw_d5_bets = total_d5_win_amt.sum || 0 ;
        var ttw_trx_bets = total_trx_win_amt.sum || 0 ; 
        total_bet_amt +=  parseInt(tt_wingo_bets) + parseInt(tt_k3_bets) + parseInt(tt_d5_bets) + parseInt(tt_trx_bets);
        total_win_amt +=  parseInt(ttw_wingo_bets) + parseInt(ttw_k3_bets) + parseInt(ttw_d5_bets) + parseInt(ttw_trx_bets);
        total_win_loss = parseInt(total_win_amt) - parseInt(total_bet_amt);
        result = parseInt(user_salary) + parseInt(giftcodevalue) + parseInt(total_win_loss);       
    }
    return {
        result_val: result,
    }
}

const makecolloborator = async (req, res) => {
    let auth = req.cookies.auth;
    let u_phone = req.body.u_phone;
    const [rows] = await connection.query('SELECT * FROM users WHERE `phone` = ?', [u_phone]);
    await connection.query('UPDATE users SET level = 2  WHERE phone = ?', [u_phone]);
    await connection.query('UPDATE point_list SET level = 2  WHERE phone = ?', [u_phone]);
    await connection.query('UPDATE users SET ctv = ?  WHERE invite = ?', [u_phone, rows[0].code]);
    const [bank_recharge] = await connection.query("SELECT * FROM bank_recharge where `phone` = ?", [u_phone]);
    const deleteRechargeQueries = bank_recharge.map(recharge => {
        return deleteBankRechargeById(recharge.id)
    });

    await Promise.all(deleteRechargeQueries)
    
    let sql_bank_rech = "INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ? , type = ? , time = ? , transfer_mode = ? , phone = ? , colloborator_action = ?, status= 1";
    await connection.query(sql_bank_rech, ['','','','','','','manual',u_phone,'off']);

    return res.status(200).json({
        message: 'Success',
        status: true,
        data: {

        }
    })
};


const getbankRequest = async (req, res) => {
    try {
        let auth = req.cookies.auth;
        let phone = req.body.id;
        if (!auth) {
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            });
        }
        const [rows] = await connection.execute('SELECT * FROM `users` WHERE `phone` = ?', [phone]);
        const [bank_recharge] = await connection.query("SELECT * FROM bank_recharge where `phone` = ? AND status= 0", [rows[0].phone]);

        return res.status(200).json({
            message: 'Success',
            status: true,
            datas: bank_recharge,
            
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed',
            status: false,
        });
    }

}

const ReqAcceptReject = async (req, res) => {
    try {
        let auth = req.cookies.auth;
        let phone = req.body.id;
        let type = req.body.type;
        let comments = req.body.comments;
        const [rows] = await connection.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if (!auth) {
            return res.status(200).json({
                message: 'Failed',
                status: false,
                timeStamp: timeNow,
            });
        }
        if(type == 'accept')
        {
            const [bank_recharge] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ? AND status = 1;`, [phone]);
            const deleteRechargeQueries = bank_recharge.map(recharge => {
                if (fs.existsSync(recharge.qr_code_image.toString().trim())) {
                    fs.unlink(recharge.qr_code_image.toString().trim(),function(err){
                    if(err) return console.log(err);
                        console.log('file deleted successfully');
                });  
                };
                return deleteBankRechargeById(recharge.id)
            });
            await Promise.all(deleteRechargeQueries);
            await connection.execute('UPDATE `bank_recharge` SET `status` = ? WHERE `phone` = ? ', [1, phone]);
        }
        else if(type == 'reject')
        {
            const [bank_recharge] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ? AND status = 0;`, [phone]);
            const deleteRechargeQueries = bank_recharge.map(recharge => {
                if (fs.existsSync(recharge.qr_code_image.toString().trim())) {
                    fs.unlink(recharge.qr_code_image.toString().trim(),function(err){
                    if(err) return console.log(err);
                        console.log('file deleted successfully');
                });  
                };
                return deleteBankRechargeById(recharge.id)
            });
            await Promise.all(deleteRechargeQueries);
            let sql_noti = 'INSERT INTO notification SET recipient = ?, description = ?, isread = ?, noti_type = ?';
            await connection.query(sql_noti, [rows[0].id, comments, '0', "Settings"]);
        }

        return res.status(200).json({
            message: 'Success',
            status: true,
            datas: 'updated',
            
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Failed',
            status: false,
        });
    }

}


module.exports = {
    on_off_colloborator,
    getCollotoogle,
    adminChatPage,
    adminPage,
    adminPage3,
    adminPage5,
    adminPage10,
    adminPageTrx,
    totalJoin,
    middlewareAdminController,
    changeAdmin,
    membersPage,
    k3chatPage,
    d5chatPage,
    listMember,
    infoMember,
    userInfo,
    statistical,
    statistical2,
    rechargePage,
    recharge,
    tranfermode,
    rechargeDuyet,
    rechargeRecord,
    withdrawRecord,
    withdraw,
    levelSetting,
    handlWithdraw,
    settings,
    editResult2,
    settingBank,
    settingGet,
    settingCskh,
    settingbuff,
    register,
    ctvPage,
    listCTV,
    profileUser,
    ctvProfilePage,
    infoCtv,
    infoCtv2,
    giftPage,
    createBonus,
    listRedenvelops,
    banned,
    listRechargeMem,
    listWithdrawMem,
    getLevelInfo,
    listRedenvelope,
    listBet,
    adminPage5d,
    adminmainpage,
    listOrderOld,
    listOrderOldK3,
    editResult,
    adminPageK3,
    updateLevel,
    CreatedSalaryRecord,
    CreatedSalary,
    getSalary,
    gettranfermode,
    makecolloborator,
    getdashboardInfo,
    getbankRequest,
    ReqAcceptReject
}