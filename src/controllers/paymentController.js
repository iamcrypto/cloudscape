import connection from "../config/connectDB";
import axios from 'axios';
import moment from "moment";
import crypto from "crypto";
import querystring from "querystring"


let timeNow = Date.now();

const PaymentStatusMap = {
    PENDING: 0,
    SUCCESS: 1,
    CANCELLED: 2
}

const PaymentMethodsMap = {
    UPI_GATEWAY: "upi_gateway",
    UPI_MANUAL: "upi_manual",
    USDT_MANUAL: "usdt_manual",
    WOW_PAY: "wow_pay",
    USDT: "usdt",
}

const initiateManualUPIPayment = async (req, res) => {

    const query = req.query
    const auth = req.cookies.auth;
    const [rows] = await connection.execute('SELECT * FROM `users` WHERE `token` = ?', [auth]);

    const [bank_recharge_momo] = await connection.query("SELECT * FROM bank_recharge WHERE phone = ?", [rows[0].phone]);

    let bank_recharge_momo_data
    if (bank_recharge_momo.length) {
        bank_recharge_momo_data = bank_recharge_momo[0]
    }

    const momo = {
        bank_name: bank_recharge_momo_data?.name_bank || "",
        username: bank_recharge_momo_data?.name_user || "",
        upi_id: bank_recharge_momo_data?.stk || "",
        usdt_wallet_address: bank_recharge_momo_data?.qr_code_image || "",
    }
    const user_admin_invitor = await get_user_invitor(rows[0].phone,query?.am);
    const [bank_recharge] = await connection.query("SELECT * FROM bank_recharge WHERE phone = ?", [user_admin_invitor]);
    var upi_address = '';
    var upi_image = '';
    if(bank_recharge[0].colloborator_action == "off")
    {
        const [f_admin] = await connection.query('SELECT *  FROM users WHERE `level` = 1 ');
        var invite_phone = f_admin[0].phone;
        const [bank_recharge12] = await connection.query("SELECT * FROM bank_recharge WHERE phone = ?", [invite_phone]);
        upi_address = bank_recharge12[0].stk;
        upi_image = bank_recharge12[0].qr_code_image.toString().trim();
    }
    else{
        upi_address = bank_recharge[0].stk;
        upi_image = bank_recharge[0].qr_code_image.toString().trim();
    }
    
    return res.render("wallet/manual_payment.ejs", {
        Amount: query?.am,
        UpiId: momo.upi_id,
        upi_address_image:upi_image.replace(/\\/g, "/").replace("src/public",""),
        dynamic_upi_Addr:upi_address,
        upi_user_phone:user_admin_invitor,
    });
}

const get_user_invitor = async (phone_num, amount) => {
    let phone = phone_num;
    let invite_phone = "";
    let invite_role = "";
    const [f1s] = await connection.query('SELECT * FROM users WHERE `phone` = ? ', [phone]);
    if(phone != "8895203112"){
    const [f1s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f1s[0].invite]);
      if(parseInt(f1s_inv[0].level) != 2 && parseInt(f1s_inv[0].level) != 1)
      { 
        const [f2s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f1s_inv[0].invite]);
        if(parseInt(f2s_inv[0].level) != 2 && parseInt(f2s_inv[0].level) != 1)
        { 
          const [f3s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f2s_inv[0].invite]);
          if(parseInt(f3s_inv[0].level) != 2 && parseInt(f3s_inv[0].level) != 1)
          {
            const [f4s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f3s_inv[0].invite]);
            if(parseInt(f4s_inv[0].level) != 2 && parseInt(f4s_inv[0].level) != 1)
            {
              const [f5s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f4s_inv[0].invite]);
              if(parseInt(f5s_inv[0].level) != 2 && parseInt(f5s_inv[0].level) != 1)
              {
                const [f6s_inv] = await connection.query('SELECT * FROM users WHERE `code` = ? ', [f5s_inv[0].invite]);
                if(parseInt(f6s_inv[0].level) != 2 && parseInt(f6s_inv[0].level) != 1)
                {
                  const [f_admin] = await connection.query('SELECT *  FROM users WHERE `level` = 1 ');
                  invite_role = 'admin';
                  invite_phone = f_admin[0].phone;
                }
                else{
                  invite_role = f6s_inv[0].level == 2 ? "colloborator" : "admin";
                  invite_phone = f6s_inv[0].phone ;
                }
              }
              else{
                invite_role = f5s_inv[0].level == 2 ? "colloborator" : "admin";
                invite_phone = f5s_inv[0].phone ;
              }
            }
            else{
              invite_role = f4s_inv[0].level == 2 ? "colloborator" : "admin";
              invite_phone = f4s_inv[0].phone ;
            }
          }
          else{
            invite_role = f3s_inv[0].level == 2 ? "colloborator" : "admin";
            invite_phone = f3s_inv[0].phone ;
          }
        }
        else{
          invite_role = f2s_inv[0].level == 2 ? "colloborator" : "admin";
          invite_phone = f2s_inv[0].phone ;
        }
      }
      else{
        invite_role = f1s_inv[0].level == 2 ? "colloborator" : "admin";
        invite_phone = f1s_inv[0].phone ;
      }
    }
    else{
      invite_role = "admin";
      invite_phone =  phone_num;
    }
    if(invite_role = "colloborator")
    {
        const [rows] = await connection.execute('SELECT * FROM `point_list` WHERE `phone` = ? ', [invite_phone]);
        let coll_rech_limit = rows[0].recharge;
        if(parseInt(coll_rech_limit) >= amount)
        {
            invite_phone =  invite_phone;   
        }
        else
        {
            const [f_admin] = await connection.query('SELECT *  FROM users WHERE `level` = 1 ');
            invite_role = 'admin';
            invite_phone = f_admin[0].phone;  
        }
    }
    return invite_phone;
  }
  

const initiateManualUSDTPayment = async (req, res) => {
    const query = req.query
    const auth = req.cookies.auth;
    const [rows] = await connection.execute('SELECT `token`,`level`, `status` FROM `users` WHERE `token` = ? AND veri = 1', [auth]);

    const [bank_recharge_momo] = await connection.query("SELECT * FROM bank_recharge WHERE  `phone` = ?", [rows[0].phone]);

    let bank_recharge_momo_data
    if (bank_recharge_momo.length) {
        bank_recharge_momo_data = bank_recharge_momo[0]
    }

    const momo = {
        bank_name: bank_recharge_momo_data?.name_bank || "",
        username: bank_recharge_momo_data?.name_user || "",
        upi_id: bank_recharge_momo_data?.stk || "",
        usdt_wallet_address: bank_recharge_momo_data?.qr_code_image || "",
    }

    return res.render("wallet/usdt_manual_payment.ejs", {
        Amount: query?.am,
        UsdtWalletAddress: momo.usdt_wallet_address,
    });
}

const addManualUPIPaymentRequest = async (req, res) => {
    try {
        const data = req.body
        let auth = req.cookies.auth;
        let money = parseInt(data.money);
        let utr = parseInt(data.utr);
        let upi_user = (data.upi_user);
        const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY)

        if (!money || !(money >= minimumMoneyAllowed)) {
            return res.status(400).json({
                message: `Money is Required and it should be ₹${minimumMoneyAllowed} or above!`,
                status: false,
                timeStamp: timeNow,
            })
        }

        if (!utr && utr?.length != 12) {
            return res.status(400).json({
                message: `UPI Ref No. or UTR is Required And it should be 12 digit long`,
                status: false,
                timeStamp: timeNow,
            })
        }

        const user = await getUserDataByAuthToken(auth)

        const pendingRechargeList = await rechargeTable.getRecordByPhoneAndStatus({ phone: user.phone, status: PaymentStatusMap.PENDING, type: PaymentMethodsMap.UPI_GATEWAY })

        if (pendingRechargeList.length !== 0) {
            const deleteRechargeQueries = pendingRechargeList.map(recharge => {
                return rechargeTable.cancelById(recharge.id)
            });

            await Promise.all(deleteRechargeQueries)
        }

        const orderId = getRechargeOrderId()
        const [rows] = await connection.execute('SELECT * FROM `users` WHERE `phone` = ? ', [upi_user]);
        const upi_user_level = rows[0].level;
        var newRecharge
        if(upi_user_level == 1)
        {
            newRecharge = {
                orderId: orderId,
                transactionId: 'NULL',
                utr: utr,
                phone: user.phone,
                money: money,
                type: PaymentMethodsMap.UPI_MANUAL,
                status: 0,
                today: rechargeTable.getCurrentTimeForTodayField(),
                url: "NULL",
                time: timeNow,
                redirect_to:"",
            }
        }
        if(upi_user_level == 2){
            const [rows] = await connection.execute('SELECT * FROM `point_list` WHERE `phone` = ? ', [upi_user]);
            let coll_rech_limit = rows[0].recharge;
            if(parseInt(coll_rech_limit) >= money)
            {
                await connection.query(`UPDATE point_list SET recharge = recharge - ? WHERE level = 2 and phone = ?`, [money, upi_user]);
                newRecharge = {
                    orderId: orderId,
                    transactionId: 'NULL',
                    utr: utr,
                    phone: user.phone,
                    money: money,
                    type: PaymentMethodsMap.UPI_MANUAL,
                    status: 0,
                    today: rechargeTable.getCurrentTimeForTodayField(),
                    url: "NULL",
                    time: timeNow,
                    redirect_to:"colloborator",
                }    
            }
            else{
                newRecharge = {
                    orderId: orderId,
                    transactionId: 'NULL',
                    utr: utr,
                    phone: user.phone,
                    money: money,
                    type: PaymentMethodsMap.UPI_MANUAL,
                    status: 0,
                    today: rechargeTable.getCurrentTimeForTodayField(),
                    url: "NULL",
                    time: timeNow,
                    redirect_to:"admin",
                }    
            }
        }

        const recharge = await rechargeTable.create(newRecharge)

        return res.status(200).json({
            message: 'Payment Requested successfully Your Balance will update shortly!',
            recharge: recharge,
            status: true,
            timeStamp: timeNow,
        });
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: false,
            message: "Something went wrong!",
            timestamp: timeNow
        })
    }
}

const addManualUSDTPaymentRequest = async (req, res) => {
    try {
        const data = req.body
        let auth = req.cookies.auth;
        let money_usdt = parseInt(data.money);
        let money = money_usdt * 92;
        let utr = parseInt(data.utr);
        const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY)

        if (!money || !(money >= minimumMoneyAllowed)) {
            return res.status(400).json({
                message: `Money is Required and it should be ₹${minimumMoneyAllowed} or ${(minimumMoneyAllowed / 92).toFixed(2)} or above!`,
                status: false,
                timeStamp: timeNow,
            })
        }

        if (!utr) {
            return res.status(400).json({
                message: `Ref No. or UTR is Required`,
                status: false,
                timeStamp: timeNow,
            })
        }

        const user = await getUserDataByAuthToken(auth)

        const pendingRechargeList = await rechargeTable.getRecordByPhoneAndStatus({ phone: user.phone, status: PaymentStatusMap.PENDING, type: PaymentMethodsMap.UPI_GATEWAY })

        if (pendingRechargeList.length !== 0) {
            const deleteRechargeQueries = pendingRechargeList.map(recharge => {
                return rechargeTable.cancelById(recharge.id)
            });

            await Promise.all(deleteRechargeQueries)
        }

        const orderId = getRechargeOrderId()

        const newRecharge = {
            orderId: orderId,
            transactionId: 'NULL',
            utr: utr,
            phone: user.phone,
            money: money,
            type: PaymentMethodsMap.USDT_MANUAL,
            status: 0,
            today: rechargeTable.getCurrentTimeForTodayField(),
            url: "NULL",
            time: timeNow,
            redirect_to:"",
        }

        const recharge = await rechargeTable.create(newRecharge)

        return res.status(200).json({
            message: 'Payment Requested successfully Your Balance will update shortly!',
            recharge: recharge,
            status: true,
            timeStamp: timeNow,
        });
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: false,
            message: "Something went wrong!",
            timestamp: timeNow
        })
    }
}

const initiateUPIPayment = async (req, res) => {
    const type = PaymentMethodsMap.UPI_GATEWAY
    let auth = req.cookies.auth;
    let money = parseInt(req.body.money);

    const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY)

    if (!money || !(money >= minimumMoneyAllowed)) {
        return res.status(400).json({
            message: `Money is Required and it should be ₹${minimumMoneyAllowed} or above!`,
            status: false,
            timeStamp: timeNow,
        })
    }

    try {
        const user = await getUserDataByAuthToken(auth)

        const pendingRechargeList = await rechargeTable.getRecordByPhoneAndStatus({ phone: user.phone, status: PaymentStatusMap.PENDING, type: PaymentMethodsMap.UPI_GATEWAY })

        if (pendingRechargeList.length !== 0) {
            const deleteRechargeQueries = pendingRechargeList.map(recharge => {
                return rechargeTable.cancelById(recharge.id)
            });

            await Promise.all(deleteRechargeQueries)
        }

        const orderId = getRechargeOrderId()

        const ekqrResponse = await axios.post('https://api.ekqr.in/api/create_order', {
            key: process.env.UPI_GATEWAY_PAYMENT_KEY,
            client_txn_id: orderId,
            amount: String(money),
            p_info: process.env.PAYMENT_INFO,
            customer_name: user.username,
            customer_email: process.env.PAYMENT_EMAIL,
            customer_mobile: user.phone,
            redirect_url: `${process.env.APP_BASE_URL}/wallet/verify/upi`,
            udf1: process.env.APP_NAME,
        })

        const ekqrData = ekqrResponse?.data

        if (ekqrData === undefined || ekqrData.status === false) {
            throw Error("Gateway er!#ror from ekqr!")
        }

        const newRecharge = {
            orderId: orderId,
            transactionId: 'NULL',
            utr: null,
            phone: user.phone,
            money: money,
            type: type,
            status: 0,
            today: rechargeTable.getCurrentTimeForTodayField(),
            url: ekqrData.data.payment_url,
            time: timeNow,
            redirect_to:"",
        }

        const recharge = await rechargeTable.create(newRecharge)

        console.log(ekqrData)

        return res.status(200).json({
            message: 'Payment Initiated successfully',
            recharge: recharge,
            urls: {
                web_url: ekqrData.data.payment_url,
                bhim_link: ekqrData.data?.upi_intent?.bhim_link || "",
                phonepe_link: ekqrData.data?.upi_intent?.phonepe_link || "",
                paytm_link: ekqrData.data?.upi_intent?.paytm_link || "",
                gpay_link: ekqrData.data?.upi_intent?.gpay_link || "",
            },
            status: true,
            timeStamp: timeNow,
        });
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: false,
            message: "Something went wrong!",
            timestamp: timeNow
        })
    }
}

const verifyUPIPayment = async (req, res) => {
    const type = PaymentMethodsMap.UPI_GATEWAY
    let auth = req.cookies.auth;
    let orderId = req.query.client_txn_id;

    if (!auth || !orderId) {
        return res.status(400).json({
            message: `orderId is Required!`,
            status: false,
            timeStamp: timeNow,
        })
    }
    try {
        const user = await getUserDataByAuthToken(auth)

        const recharge = await rechargeTable.getRechargeByOrderId({ orderId })

        if (!recharge) {
            return res.status(400).json({
                message: `Unable to find recharge with this order id!`,
                status: false,
                timeStamp: timeNow,
            })
        }

        const ekqrResponse = await axios.post('https://api.ekqr.in/api/check_order_status', {
            key: process.env.UPI_GATEWAY_PAYMENT_KEY,
            client_txn_id: orderId,
            txn_date: rechargeTable.getDMYDateOfTodayFiled(recharge.today),
        });

        const ekqrData = ekqrResponse?.data

        if (ekqrData === undefined || ekqrData.status === false) {
            throw Error("Gateway error from ekqr!")
        }

        if (ekqrData.data.status === "created") {
            return res.status(200).json({
                message: 'Your payment request is just created',
                status: false,
                timeStamp: timeNow,
            });
        }

        if (ekqrData.data.status === "scanning") {
            return res.status(200).json({
                message: 'Waiting for confirmation',
                status: false,
                timeStamp: timeNow,
            });
        }

        if (ekqrData.data.status === 'success') {

            if (recharge.status === PaymentStatusMap.PENDING || recharge.status === PaymentStatusMap.CANCELLED) {

                await rechargeTable.setStatusToSuccessByIdAndOrderId({
                    id: recharge.id,
                    orderId: recharge.orderId
                })

                await addUserAccountBalance({
                    phone: user.phone,
                    money: recharge.money,
                    code: user.code,
                    invite: user.invite,
                })
            }

            // return res.status(200).json({
            //     status: true,
            //     message: "Payment verified",
            //     timestamp: timeNow
            // })
            return res.redirect("/wallet/rechargerecord")
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: false,
            message: "Something went wrong!",
            timestamp: timeNow
        })
    }
}

const initiatePiPayment = async (req, res) => {
    const type = PaymentMethodsMap.WOW_PAY
    let auth = req.cookies.auth;
    let money = parseInt(req.query.money);

    // const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY)

    // if (!money || !(money >= minimumMoneyAllowed)) {
    //     return res.status(400).json({
    //         message: `Money is Required and it must be ₹${minimumMoneyAllowed} or above!`,
    //         status: false,
    //         timeStamp: timeNow,
    //     })
    // }

    try {
        const user = await getUserDataByAuthToken(auth)
        const query = req.query
        const [rows] = await connection.execute('SELECT * FROM `users` WHERE `token` = ? ', [auth]);
        const [bank_recharge_momo] = await connection.query("SELECT * FROM bank_recharge WHERE `phone` = ?", [rows[0].phone]);
    
        let bank_recharge_momo_data
        if (bank_recharge_momo.length) {
            bank_recharge_momo_data = bank_recharge_momo[0]
        }
    
        const momo = {
            bank_name: bank_recharge_momo_data?.name_bank || "",
            username: bank_recharge_momo_data?.name_user || "",
            upi_id: bank_recharge_momo_data?.stk || "",
            usdt_wallet_address: bank_recharge_momo_data?.qr_code_image || "",
        }
    
        return res.render("wallet/pipay.ejs", {
            Amount: query?.am,
            UsdtWalletAddress: momo.usdt_wallet_address,
        });
    
       
    } catch (error) {
       
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Something went wrong!",
            timestamp: timeNow
        })
     }
}


const verifyPiPayment = async (req, res) => {
    try {
        const type = PaymentMethodsMap.WOW_PAY
        let data = req.body;

        if (!req.body) {
            data = req.query;
        }

        console.log(data)

        let merchant_key = process.env.WOWPAY_MERCHANT_KEY;

        const params = {
            mchId: process.env.WOWPAY_MERCHANT_ID,
            amount: data.amount || '',
            mchOrderNo: data.mchOrderNo || '',
            merRetMsg: data.merRetMsg || '',
            orderDate: data.orderDate || '',
            orderNo: data.orderNo || '',
            oriAmount: data.oriAmount || '',
            tradeResult: data.tradeResult || '',
            signType: data.signType || '',
            sign: data.sign || '',
        };

        let signStr = "";
        signStr += "amount=" + params.amount + "&";
        signStr += "mchId=" + params.mchId + "&";
        signStr += "mchOrderNo=" + params.mchOrderNo + "&";
        signStr += "merRetMsg=" + params.merRetMsg + "&";
        signStr += "orderDate=" + params.orderDate + "&";
        signStr += "orderNo=" + params.orderNo + "&";
        signStr += "oriAmount=" + params.oriAmount + "&";
        signStr += "tradeResult=" + params.tradeResult;

        let flag = wowpay.validateSignByKey(signStr, merchant_key, params.sign);

        if (!flag) {
            console.log({
                status: false,
                message: "Something went wrong!",
                flag,
                timestamp: timeNow
            })
            return res.status(400).json({
                status: false,
                message: "Something went wrong!",
                flag,
                timestamp: timeNow
            })
        }

        const newRechargeParams = {
            orderId: params.mchOrderNo,
            transactionId: 'NULL',
            utr: null,
            phone: params.merRetMsg,
            money: params.amount,
            type: type,
            status: PaymentStatusMap.SUCCESS,
            today: rechargeTable.getCurrentTimeForTodayField(),
            url: 'NULL',
            time: timeNow,
            redirect_to:"",
        }


        const recharge = await rechargeTable.getRechargeByOrderId({ orderId: newRechargeParams.orderId })

        if (!!recharge) {
            console.log({
                message: `Recharge already verified!`,
                status: true,
                timeStamp: timeNow,
            })
            return res.status(400).json({
                message: `Recharge already verified!`,
                status: true,
                timeStamp: timeNow,
            })
        }

        const newRecharge = await rechargeTable.create(newRechargeParams)

        await addUserAccountBalance({
            phone: user.phone,
            money: recharge.money,
            code: user.code,
            invite: user.invite,
        })

        return res.redirect("/wallet/rechargerecord")
    } catch (error) {
        console.log({
            status: false,
            message: "Something went wrong!",
            timestamp: timeNow
        })
        return res.status(500).json({
            status: false,
            message: "Something went wrong!",
            timestamp: timeNow
        })
    }
}


// helpers ---------------
const getUserDataByAuthToken = async (authToken) => {
    let [users] = await connection.query('SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `token` = ? ', [authToken]);
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


const getRechargeOrderId = () => {
    const date = new Date();
    let id_time = date.getUTCFullYear() + '' + date.getUTCMonth() + 1 + '' + date.getUTCDate();
    let id_order = Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) + 10000000000000;

    return id_time + id_order
}

const rechargeTable = {
    getRecordByPhoneAndStatus: async ({ phone, status, type }) => {
        if (![PaymentStatusMap.SUCCESS, PaymentStatusMap.CANCELLED, PaymentStatusMap.PENDING].includes(status)) {
            throw Error("Invalid Payment Status!")
        }

        let recharge

        if (type) {
            [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = ? AND type = ?', [phone, status, type]);
        } else {
            [recharge] = await connection.query('SELECT * FROM recharge WHERE phone = ? AND status = ?', [phone, status]);
        }

        return recharge.map((item) => ({
            id: item.id,
            orderId: item.id_order,
            transactionId: item.transaction_id,
            utr: item.utr,
            phone: item.phone,
            money: item.money,
            type: item.type,
            status: item.status,
            today: item.today,
            url: item.url,
            time: item.time,
        }))
    },
    getRechargeByOrderId: async ({ orderId }) => {
        const [recharge] = await connection.query('SELECT * FROM recharge WHERE id_order = ?', [orderId]);

        if (recharge.length === 0) {
            return null
        }

        return recharge.map((item) => ({
            id: item.id,
            orderId: item.id_order,
            transactionId: item.transaction_id,
            utr: item.utr,
            phone: item.phone,
            money: item.money,
            type: item.type,
            status: item.status,
            today: item.today,
            url: item.url,
            time: item.time,
        }))?.[0]
    },
    cancelById: async (id) => {
        if (typeof id !== "number") {
            throw Error("Invalid Recharge 'id' expected a number!")
        }


        await connection.query('UPDATE recharge SET status = 2 WHERE id = ?', [id]);
    },
    setStatusToSuccessByIdAndOrderId: async ({ id, orderId }) => {
        if (typeof id !== "number") {
            throw Error("Invalid Recharge 'id' expected a number!")
        }


        console.log(id, orderId)

        const [re] = await connection.query('UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ?', [id, orderId]);
        console.log(re)
    },
    getCurrentTimeForTodayField: () => {
        return moment().format("YYYY-DD-MM h:mm:ss A")
    },
    getDMYDateOfTodayFiled: (today) => {
        return moment(today, "YYYY-DD-MM h:mm:ss A").format("DD-MM-YYYY")
    },
    create: async (newRecharge) => {

        if (newRecharge.url === undefined || newRecharge.url === null) {
            newRecharge.url = "0"
        }

        await connection.query(
            `INSERT INTO recharge SET id_order = ?, transaction_id = ?, phone = ?, money = ?, type = ?, status = ?, today = ?, url = ?, time = ?, utr = ?, redirect_to = ?`,
            [newRecharge.orderId, newRecharge.transactionId, newRecharge.phone, newRecharge.money, newRecharge.type, newRecharge.status, newRecharge.today, newRecharge.url, newRecharge.time, newRecharge?.utr || "NULL", newRecharge?.redirect_to || "NULL"]
        );
        

        const [recharge] = await connection.query('SELECT * FROM recharge WHERE id_order = ?', [newRecharge.orderId]);

        if (recharge.length === 0) {
            throw Error("Unable to create recharge!")
        }

        return recharge[0]
    }
}






module.exports = {
    initiateUPIPayment,
    verifyUPIPayment,
    initiatePiPayment,
    verifyPiPayment,
    initiateManualUPIPayment,
    addManualUPIPaymentRequest,
    addManualUSDTPaymentRequest,
    initiateManualUSDTPayment,
}