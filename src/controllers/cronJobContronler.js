import connection from "../config/connectDB";
import winGoController from "./winGoController";
import k5Controller from "./k5Controller";
import k3Controller from "./k3Controller";
import vipController from "./vipController.js";
import paymentController1 from "./paymentController1.js";
import trxWingoController, {
    TRX_WINGO_GAME_TYPE_MAP,
  } from "./trxWingoController.js";
import cron from 'node-cron';
import md5 from "md5";

const cronJobGame1p = (io) => {
    cron.schedule('*/1 * * * *', async() => {

        await trxWingoController.addTrxWingo(1);
        await trxWingoController.handlingTrxWingo1P(1);
        const [trxWingo] = await connection.execute(
          `SELECT * FROM trx_wingo_game WHERE game = '${TRX_WINGO_GAME_TYPE_MAP.MIN_1}' ORDER BY id DESC LIMIT 2`,
          [],
        );
        io.emit("data-server-trx-wingo", { data: trxWingo });

        await winGoController.addWinGo(1);
        await winGoController.handlingWinGo1P(1);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });
        io.emit('data-server-chat', { data: data, 'game': '1' });

        await k5Controller.add5D(1);
        await k5Controller.handling5D(1);
        const [k5D] = await connection.execute('SELECT * FROM d5 WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '1' });
        io.emit('data-server-chat5d', { data: data2, 'game': '1' });

        await k3Controller.addK3(1);
        await k3Controller.handlingK3(1);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 1 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '1' });
        io.emit('data-server-chatk3', { data: data3, 'game': '1' });

    });

    cron.schedule('*/3 * * * *', async() => {

        await trxWingoController.addTrxWingo(3);
        await trxWingoController.handlingTrxWingo1P(3);
        const [trxWingo] = await connection.execute(
          `SELECT * FROM trx_wingo_game WHERE game = '${TRX_WINGO_GAME_TYPE_MAP.MIN_3}' ORDER BY id DESC LIMIT 2`,
          [],
        );
        io.emit("data-server-trx-wingo", { data: trxWingo });


        await winGoController.addWinGo(3);
        await winGoController.handlingWinGo1P(3);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo3" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });

        await k5Controller.add5D(3);
        await k5Controller.handling5D(3);
        const [k5D] = await connection.execute('SELECT * FROM d5 WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '3' });

        await k3Controller.addK3(3);
        await k3Controller.handlingK3(3);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 3 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '3' });

        //test_register();
        //test_recharge();
        //test_accept_recharge();
        //test_wingo_join();

        //test_k3_join();
        //test_5d_join();
        //test_trx_join();

       // await winGoController.distributeCommission();
        // await k3Controller.distributeCommission(),
        // await k5Controller.distributeCommission(),
        // await trxWingoController.distributeCommission()

    });

    cron.schedule('*/5 * * * *', async() => {

        await trxWingoController.addTrxWingo(5);
        await trxWingoController.handlingTrxWingo1P(5);
        const [trxWingo] = await connection.execute(
          `SELECT * FROM trx_wingo_game WHERE game = '${TRX_WINGO_GAME_TYPE_MAP.MIN_5}' ORDER BY id DESC LIMIT 2`,
          [],
        );
        io.emit("data-server-trx-wingo", { data: trxWingo });

        await winGoController.addWinGo(5);
        await winGoController.handlingWinGo1P(5);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo5" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });

        await k5Controller.add5D(5);
        await k5Controller.handling5D(5);
        const [k5D] = await connection.execute('SELECT * FROM d5 WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '5' });

        await k3Controller.addK3(5);
        await k3Controller.handlingK3(5);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 5 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '5' });
    });
    
    cron.schedule('*/10 * * * *', async() => {

        await trxWingoController.addTrxWingo(10);
        await trxWingoController.handlingTrxWingo1P(10);
        const [trxWingo] = await connection.execute(
          `SELECT * FROM trx_wingo_game WHERE game = '${TRX_WINGO_GAME_TYPE_MAP.MIN_10}' ORDER BY id DESC LIMIT 2`,
          [],
        );
        io.emit("data-server-trx-wingo", { data: trxWingo });
        
        await winGoController.addWinGo(10);
        await winGoController.handlingWinGo1P(10);
        const [winGo1] = await connection.execute('SELECT * FROM `wingo` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2 ', []);
        const data = winGo1; // Cầu mới chưa có kết quả
        io.emit('data-server', { data: data });

        
        await k5Controller.add5D(10);
        await k5Controller.handling5D(10);
        const [k5D] = await connection.execute('SELECT * FROM d5 WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2 ', []);
        const data2 = k5D; // Cầu mới chưa có kết quả
        io.emit('data-server-5d', { data: data2, 'game': '10' });

        await k3Controller.addK3(10);
        await k3Controller.handlingK3(10);
        const [k3] = await connection.execute('SELECT * FROM k3 WHERE `game` = 10 ORDER BY `id` DESC LIMIT 2 ', []);
        const data3 = k3; // Cầu mới chưa có kết quả
        io.emit('data-server-k3', { data: data3, 'game': '10' });

    });

    cron.schedule('0 1 * * *', async() => {
        await connection.execute('UPDATE users SET roses_today = ?', [0]);
        await connection.execute('UPDATE point_list SET money = ?', [0]);
        await connection.execute('UPDATE turn_over SET daily_turn_over = ?', [0]);
    });

    cron.schedule("0 2 1 * *", async () => {
      vipController.releaseVIPLevel();
    });
    cron.schedule(
      "0 0 * * *",
      async () => {
        await winGoController.distributeCommission(),
        await k3Controller.distributeCommission(),
        await k5Controller.distributeCommission(),
        await trxWingoController.distributeCommission()
      }
    );
}

const randomNumber = (min, max) => {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

const isNumber = (params) => {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
}

function formateT(params) {
  let result = (params < 10) ? "0" + params : params;
  return result;
}

const wingorosesPlus = async (auth, money) => {
  const [level] = await connection.query('SELECT * FROM level ');

  const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `user_level`, `total_money` FROM users WHERE phone = ? AND veri = 1 LIMIT 1 ', [auth]);
  let userInfo = user[0];
  const [f1] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [userInfo.invite]);
  if (userInfo.total_money >= 100) {
      if (f1.length > 0) {
          let infoF1 = f1[0];
          for (let levelIndex = 1; levelIndex <= 6; levelIndex++) {
              let rosesF = 0;
              if (infoF1.user_level >= levelIndex && infoF1.total_money >= 100) {
                  rosesF = (money / 100) * level[levelIndex - 1].f1;
                  if (rosesF > 0) {
                      await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF, rosesF, rosesF, infoF1.phone]);
                      let timeNow = Date.now();
                      const sql2 = `INSERT INTO roses SET 
                          phone = ?,
                          code = ?,
                          invite = ?,
                          f1 = ?,
                          time = ?`;
                      await connection.execute(sql2, [infoF1.phone, infoF1.code, infoF1.invite, rosesF, timeNow]);

                      const sql3 = `
                          INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                          VALUES (?, ?, ?, ?, ?)
                          ON DUPLICATE KEY UPDATE
                          daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                          total_turn_over = total_turn_over + VALUES(total_turn_over)
                          `;

                      await connection.execute(sql3, [infoF1.phone, infoF1.code, infoF1.invite, money, money]);
                  }
              }
              const [fNext] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [infoF1.invite]);
              if (fNext.length > 0) {
                  infoF1 = fNext[0];
              } else {
                  break;
              }
          }
      }
  }
}


let timeNow = Date.now();

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

const timeCreate = () => {
  const d = new Date();
  const time = d.getTime();
  return time;
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

const test_register = async () => {
  var array = ['"7985567013"', '"2821663285"', '"9505220547"', '"2086308157"', '"6257880724"', '"2447685403"', '"2814466995"', '"6958661889"', '"4990170806"', '"6517315419"', '"2200837080"', '"6556669194"', '"4796075927"', '"2558295751"', '"4696454216"', '"6938617683"', '"1434220505"', '"8645903048"', '"4874912103"', '"4398308408"', '"6686663097"', '"6343399949"', '"4067951640"', '"7736431000"', '"9751580935"', '"6495059654"', '"3783299081"', '"7593581797"', '"3037943194"', '"9115632844"', '"4256392024"', '"1015677533"', '"8207505540"', '"1746617177"', '"5675713930"', '"9750572554"', '"9481184604"', '"3601160707"', '"2247242357"', '"2600235760"', '"6747339480"', '"7540199576"', '"7111702621"', '"9177668510"', '"6239355581"', '"2289416814"', '"7960464447"', '"3914817379"', '"5680561313"', '"3235793343"', '"3123113020"', '"1728094552"', '"4421676670"', '"2715806804"', '"4924129673"', '"2957780726"', '"6401239502"', '"7531863338"', '"4948971767"', '"2934514607"', '"1962199949"', '"4324372816"', '"5540347579"', '"3169331441"', '"8953465863"', '"5196200632"', '"3317922559"', '"5553189935"', '"2528420324"', '"6674529799"', '"2210306742"', '"1310037756"', '"4624037320"', '"1904249311"', '"7730015281"', '"4941476638"', '"3439704969"', '"1283821004"', '"5450434625"', '"4293598820"', '"8673947385"', '"1124416280"', '"5663808183"', '"3603614717"', '"8050314388"', '"1478646299"', '"1718069901"', '"1250206561"', '"7235142967"', '"8326618872"', '"6963523191"', '"3417534754"', '"7697087713"', '"7885424385"', '"7740498379"', '"1674934973"', '"4533384473"', '"7631422527"', '"7907340377"', '"8925410596"']
  for (let i = 0; i < array.length; i++) {
    let username = parseInt(array[i].replace("'", "").replace('"', '').replace('"', ''))
    console.log(username);
    let pwd = '123456'
    let invitecode= 'uVxnY75353'
    let countrycode= '+91'
    let id_user = randomNumber(10000, 99999);
    let otp2 = randomNumber(100000, 999999);
    let name_user = "Member" + randomNumber(10000, 99999);
    let code = randomString(5) + randomNumber(10000, 99999);
    let time = timeCreate();

    if (!username || !pwd || !invitecode) {
      console.log("ERROR!!!");
    }

    if (!isNumber(username)) {
        console.log("phone error");
    }

    try {
        const [check_u] = await connection.query('SELECT * FROM users WHERE phone = ?', [username]);
        const [check_i] = await connection.query('SELECT * FROM users WHERE code = ? ', [invitecode]);

        if (check_u.length == 1 && check_u[0].veri == 1) {
            console.log("Registered phone number")
        } else {
            if (check_i.length == 1) {
                    let ctv = '';
                    if (check_i[0].level == 2) {
                        ctv = check_i[0].phone;
                    } else {
                        ctv = check_i[0].ctv;
                    }
                    const sql = "INSERT INTO users SET id_user = ?,phone = ?,name_user = ?,password = ?, plain_password = ?, money = ?,code = ?,invite = ?,ctv = ?,veri = ?,otp = ?,ip_address = ?,status = ?,time = ?,dial_code = ?";
                    await connection.execute(sql, [id_user, username, name_user, md5(pwd), pwd, 0, code, invitecode, ctv, 1, otp2, "", 1, time, countrycode]);
                    await connection.execute('INSERT INTO point_list SET phone = ?', [username]);
                    let [check_code] = await connection.query('SELECT * FROM users WHERE invite = ? ', [invitecode]);
                    if(check_i.name_user !=='Admin'){
                        let levels = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44];
                        for (let i = 0; i < levels.length; i++) {
                            if (check_code.length >= levels[i]) {
                                let [mainUser] = await connection.query('SELECT * FROM users WHERE code = ? ', [invitecode]);
                                if(parseInt(mainUser[0].user_level) != parseInt(i + 1))
                                {
                                  await connection.execute('UPDATE users SET user_level = ? WHERE code = ?', [i + 1, invitecode]);
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    let sql4 = 'INSERT INTO turn_over SET phone = ?, code = ?, invite = ?';
                    await connection.query(sql4, [username, code, invitecode]);
                    console.log("Registered successfully");
               
            } else {
              console.log("Referrer code does not exist");
            }
        }
    } catch (error) {
        if (error) console.log(error);
    }
  }
}

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

const test_recharge = async () => {
  var array = ['"7985567013"', '"2821663285"', '"9505220547"', '"2086308157"', '"6257880724"', '"2447685403"', '"2814466995"', '"6958661889"', '"4990170806"', '"6517315419"', '"2200837080"', '"6556669194"', '"4796075927"', '"2558295751"', '"4696454216"', '"6938617683"', '"1434220505"', '"8645903048"', '"4874912103"', '"4398308408"', '"6686663097"', '"6343399949"', '"4067951640"', '"7736431000"', '"9751580935"', '"6495059654"', '"3783299081"', '"7593581797"', '"3037943194"', '"9115632844"', '"4256392024"', '"1015677533"', '"8207505540"', '"1746617177"', '"5675713930"', '"9750572554"', '"9481184604"', '"3601160707"', '"2247242357"', '"2600235760"', '"6747339480"', '"7540199576"', '"7111702621"', '"9177668510"', '"6239355581"', '"2289416814"', '"7960464447"', '"3914817379"', '"5680561313"', '"3235793343"', '"3123113020"', '"1728094552"', '"4421676670"', '"2715806804"', '"4924129673"', '"2957780726"', '"6401239502"', '"7531863338"', '"4948971767"', '"2934514607"', '"1962199949"', '"4324372816"', '"5540347579"', '"3169331441"', '"8953465863"', '"5196200632"', '"3317922559"', '"5553189935"', '"2528420324"', '"6674529799"', '"2210306742"', '"1310037756"', '"4624037320"', '"1904249311"', '"7730015281"', '"4941476638"', '"3439704969"', '"1283821004"', '"5450434625"', '"4293598820"', '"8673947385"', '"1124416280"', '"5663808183"', '"3603614717"', '"8050314388"', '"1478646299"', '"1718069901"', '"1250206561"', '"7235142967"', '"8326618872"', '"6963523191"', '"3417534754"', '"7697087713"', '"7885424385"', '"7740498379"', '"1674934973"', '"4533384473"', '"7631422527"', '"7907340377"', '"8925410596"']
  for (let i = 0; i < array.length; i++) {
    let phone = parseInt(array[i].replace("'", "").replace('"', '').replace('"', ''));
    const [userInfo] = await connection.query('SELECT * FROM users WHERE phone = ?', [phone]);
    let auth = userInfo[0].token;
    let money = parseInt(500);
    let utr = parseInt('123456789023');
    const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY)

    if (!money || !(money >= minimumMoneyAllowed)) {
       console.log("Money is Required and it should be ₹${minimumMoneyAllowed} or above!");
    }

    if (!utr && utr?.length != 12) {
        console.log("UPI Ref No. or UTR is Required And it should be 12 digit long");
    }

  //const user = await paymentController1.getUserDataByAuthToken(auth)

    const pendingRechargeList = await paymentController1.rechargeTable.getRecordByPhoneAndStatus({ phone: userInfo[0].phone, status: PaymentStatusMap.PENDING, type: PaymentMethodsMap.UPI_GATEWAY })

    if (pendingRechargeList.length !== 0) {
        const deleteRechargeQueries = pendingRechargeList.map(recharge => {
            return rechargeTable.cancelById(recharge.id)
        });

        await Promise.all(deleteRechargeQueries)
    }

    const orderId = paymentController1.getRechargeOrderId()

    const newRecharge = {
        orderId: orderId,
        transactionId: 'NULL',
        utr: utr,
        phone: userInfo[0].phone,
        money: money,
        type: PaymentMethodsMap.UPI_MANUAL,
        status: 0,
        today: paymentController1.rechargeTable.getCurrentTimeForTodayField(),
        url: "NULL",
        time: timeNow,
    }

    const recharge = await paymentController1.rechargeTable.create(newRecharge)

    console.log("Payment Requested successfully Your Balance will update shortly!'")

  }
}

const validateBet = async (join, list_join, x, money, game) => {
  let checkJoin = isNumber(list_join);
  let checkX = isNumber(x);
  const checks = ['a', 'b', 'c', 'd', 'e', 'total'].includes(join);
  const checkGame = ['1', '3', '5', '10'].includes(String(game));
  const checkMoney = ['1', '10', '100', '1000'].includes(money);

  if (!checks || list_join.length > 10 || !checkX || !checkMoney || !checkGame) {
      return false;
  }

  if (checkJoin) {
      let arr = list_join.split('');
      let length = arr.length;
      for (let i = 0; i < length; i++) {
          const joinNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(arr[i]);
          if (!joinNum) {
              return false;
          }
      }
  } else {
      let arr = list_join.split('');
      let length = arr.length;
      for (let i = 0; i < length; i++) {
          const joinStr = ["c", "l", "b", "s"].includes(arr[i]);
          if (!joinStr) {
              return false;
          }
      }

  }

  return true;
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

const test_accept_recharge = async () => {
  var array = ['"7985567013"', '"2821663285"', '"9505220547"', '"2086308157"', '"6257880724"', '"2447685403"', '"2814466995"', '"6958661889"', '"4990170806"', '"6517315419"', '"2200837080"', '"6556669194"', '"4796075927"', '"2558295751"', '"4696454216"', '"6938617683"', '"1434220505"', '"8645903048"', '"4874912103"', '"4398308408"', '"6686663097"', '"6343399949"', '"4067951640"', '"7736431000"', '"9751580935"', '"6495059654"', '"3783299081"', '"7593581797"', '"3037943194"', '"9115632844"', '"4256392024"', '"1015677533"', '"8207505540"', '"1746617177"', '"5675713930"', '"9750572554"', '"9481184604"', '"3601160707"', '"2247242357"', '"2600235760"', '"6747339480"', '"7540199576"', '"7111702621"', '"9177668510"', '"6239355581"', '"2289416814"', '"7960464447"', '"3914817379"', '"5680561313"', '"3235793343"', '"3123113020"', '"1728094552"', '"4421676670"', '"2715806804"', '"4924129673"', '"2957780726"', '"6401239502"', '"7531863338"', '"4948971767"', '"2934514607"', '"1962199949"', '"4324372816"', '"5540347579"', '"3169331441"', '"8953465863"', '"5196200632"', '"3317922559"', '"5553189935"', '"2528420324"', '"6674529799"', '"2210306742"', '"1310037756"', '"4624037320"', '"1904249311"', '"7730015281"', '"4941476638"', '"3439704969"', '"1283821004"', '"5450434625"', '"4293598820"', '"8673947385"', '"1124416280"', '"5663808183"', '"3603614717"', '"8050314388"', '"1478646299"', '"1718069901"', '"1250206561"', '"7235142967"', '"8326618872"', '"6963523191"', '"3417534754"', '"7697087713"', '"7885424385"', '"7740498379"', '"1674934973"', '"4533384473"', '"7631422527"', '"7907340377"', '"8925410596"']
  for (let i = 0; i < array.length; i++) {
    let phone = parseInt(array[i].replace("'", "").replace('"', '').replace('"', ''));
    const [userInfo] = await connection.query('SELECT * FROM users WHERE phone = ?', [phone]);
    let auth = userInfo[0].token;
    const [rechInfo] = await connection.query('SELECT * FROM recharge WHERE phone = ? ', [userInfo[0].phone]);
    let id = rechInfo[0].id;
    let type = 'confirm';
    if (!auth || !id || !type) {
        console.log("Failed");
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
        console.log("Successful application confirmation");
    }
    if (type == 'delete') {
        await connection.query(`UPDATE recharge SET status = 2 WHERE id = ?`, [id]);
        console.log("Cancellation successful");
    }
  }
}

const test_wingo_join = async () => {
  var array = ['"7985567013"', '"2821663285"', '"9505220547"', '"2086308157"', '"6257880724"', '"2447685403"', '"2814466995"', '"6958661889"', '"4990170806"', '"6517315419"', '"2200837080"', '"6556669194"', '"4796075927"', '"2558295751"', '"4696454216"', '"6938617683"', '"1434220505"', '"8645903048"', '"4874912103"', '"4398308408"', '"6686663097"', '"6343399949"', '"4067951640"', '"7736431000"', '"9751580935"', '"6495059654"', '"3783299081"', '"7593581797"', '"3037943194"', '"9115632844"', '"4256392024"', '"1015677533"', '"8207505540"', '"1746617177"', '"5675713930"', '"9750572554"', '"9481184604"', '"3601160707"', '"2247242357"', '"2600235760"', '"6747339480"', '"7540199576"', '"7111702621"', '"9177668510"', '"6239355581"', '"2289416814"', '"7960464447"', '"3914817379"', '"5680561313"', '"3235793343"', '"3123113020"', '"1728094552"', '"4421676670"', '"2715806804"', '"4924129673"', '"2957780726"', '"6401239502"', '"7531863338"', '"4948971767"', '"2934514607"', '"1962199949"', '"4324372816"', '"5540347579"', '"3169331441"', '"8953465863"', '"5196200632"', '"3317922559"', '"5553189935"', '"2528420324"', '"6674529799"', '"2210306742"', '"1310037756"', '"4624037320"', '"1904249311"', '"7730015281"', '"4941476638"', '"3439704969"', '"1283821004"', '"5450434625"', '"4293598820"', '"8673947385"', '"1124416280"', '"5663808183"', '"3603614717"', '"8050314388"', '"1478646299"', '"1718069901"', '"1250206561"', '"7235142967"', '"8326618872"', '"6963523191"', '"3417534754"', '"7697087713"', '"7885424385"', '"7740498379"', '"1674934973"', '"4533384473"', '"7631422527"', '"7907340377"', '"8925410596"']
  for (let i = 0; i < array.length; i++) {
    let phone = parseInt(array[i].replace("'", "").replace('"', '').replace('"', ''));
    const [userInfo1] = await connection.query('SELECT * FROM users WHERE phone = ?', [phone]);
    let auth = userInfo1[0].token;
    let typeid = 5;
    let join = 'x'
    let x = 1;
    let money = 100;
    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
      console.log("Error!");
    }
    let gameJoin = '';
    if (typeid == 1) gameJoin = 'wingo';
    if (typeid == 3) gameJoin = 'wingo3';
    if (typeid == 5) gameJoin = 'wingo5';
    if (typeid == 10) gameJoin = 'wingo10';
    const [winGoNow] = await connection.query(`SELECT period FROM wingo WHERE status = 0 AND game = '${gameJoin}' ORDER BY id DESC LIMIT 1 `);
    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ', [userInfo1[0].phone]);
    if (!winGoNow[0] || !user[0] || !isNumber(x) || !isNumber(money)) {
        console.log("Error!");
    }

    let userInfo = user[0];
    let period = winGoNow[0].period;
    let fee = (x * money) * 0.02;
    let total = (x * money) - fee;
    let timeNow = Date.now();
    let check = userInfo.money - total;
    let date = new Date();
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let id_product = years + months + days + Math.floor(Math.random() * 1000000000000000);

    let formatTime = timerJoin();

    let color = '';
    if (join == 'l') {
        color = 'big';
    } else if (join == 'n') {
        color = 'small';
    } else if (join == 't') {
        color = 'violet';
    } else if (join == 'd') {
        color = 'red';
    } else if (join == 'x') {
        color = 'green';
    } else if (join == '0') {
        color = 'red-violet';
    } else if (join == '5') {
        color = 'green-violet';
    } else if (join % 2 == 0) {
        color = 'red';
    } else if (join % 2 != 0) {
        color = 'green';
    }

    let checkJoin = '';

    if (!isNumber(join) && join == 'l' || join == 'n') {
        checkJoin = `
        <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
            <img src="/images/${(join == 'n') ? 'small' : 'big'}.png" class="van-image__img">
        </div>
        `
    } else {
        checkJoin =
            `
        <span data-v-a9660e98="">${(isNumber(join)) ? join : ''}</span>
        `
    }


    let result = `
    <div data-v-a9660e98="" issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
        <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="result">
                <div data-v-a9660e98="" class="select select-${(color)}">
                    ${checkJoin}
                </div>
            </div>
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${period}
                    </div>
                    <div data-v-a9660e98="" class="tiem">${formatTime}</div>
                </div>
            </div>
        </div>
        <!---->
    </div>
    `;

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
    let checkTime = timerJoin(date.getTime());
    if (check >= 0) {
        const sql = `INSERT INTO minutes_1 SET 
        id_product = ?,
        phone = ?,
        code = ?,
        invite = ?,
        stage = ?,
        level = ?,
        money = ?,
        amount = ?,
        fee = ?,
        get = ?,
        game = ?,
        bet = ?,
        status = ?,
        today = ?,
        time = ?`;
        await connection.execute(sql, [id_product, userInfo.phone, userInfo.code, userInfo.invite, period, userInfo.level, total, x, fee, 0, gameJoin, join, 0, checkTime, timeNow]);
        await connection.execute('UPDATE `users` SET `money` = `money` - ? WHERE `phone` = ? ', [money * x, userInfo.phone]);
        const [users] = await connection.query('SELECT `money`, `level` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ', [userInfo.phone]);
        await wingorosesPlus(userInfo.phone, money * x);
    //     // const [level] = await connection.query('SELECT * FROM level ');
    //     // let level0 = level[0];
    //     // const sql2 = `INSERT INTO roses SET 
    //     // phone = ?,
    //     // code = ?,
    //     // invite = ?,
    //     // f1 = ?,
    //     // f2 = ?,
    //     // f3 = ?,
    //     // f4 = ?,
    //     // time = ?`;
    //     // let total_m = money * x;
    //     // let f1 = (total_m / 100) * level0.f1;
    //     // let f2 = (total_m / 100) * level0.f2;
    //     // let f3 = (total_m / 100) * level0.f3;
    //     // let f4 = (total_m / 100) * level0.f4;
    //     // await connection.execute(sql2, [userInfo.phone, userInfo.code, userInfo.invite, f1, f2, f3, f4, timeNow]);
    //     // console.log(level);
        console.log("Successful bet");
    } else {
      console.log("The amount is not enough");
    }
  }
}


const k3_rosesPlus = async (auth, money) => {
  const [level] = await connection.query('SELECT * FROM level ');
  let level0 = level[0];

  const [user] = await connection.query('SELECT `phone`, `code`, `invite` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ', [auth]);
  let userInfo = user[0];
  const [f1] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [userInfo.invite]);
  if (money >= 10000) {
      if (f1.length > 0) {
          let infoF1 = f1[0];
          let rosesF1 = (money / 100) * level0.f1;
          const sql6 = `
          INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
          total_turn_over = total_turn_over + VALUES(total_turn_over)
          `;
          await connection.execute(sql6, [infoF1.phone, infoF1.code, infoF1.invite, money, money]);
          await connection.query('UPDATE users SET money = money + ?, roses_f1 = roses_f1 + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF1, rosesF1, rosesF1, rosesF1, infoF1.phone]);
          const [f2] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF1.invite]);
          if (f2.length > 0) {
              let infoF2 = f2[0];
              let rosesF2 = (money / 100) * level0.f2;
              await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF2, rosesF2, rosesF2, infoF2.phone]);
              const [f3] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF2.invite]);
              if (f3.length > 0) {
                  let infoF3 = f3[0];
                  let rosesF3 = (money / 100) * level0.f3;
                  await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF3, rosesF3, rosesF3, infoF3.phone]);
                  const [f4] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF3.invite]);
                  if (f4.length > 0) {
                      let infoF4 = f4[0];
                      let rosesF4 = (money / 100) * level0.f4;
                      await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF4, rosesF4, rosesF4, infoF4.phone]);
                  }
              }
          }

      }
  }
}


const test_k3_join = async () => {
  var array = ['"7985567013"', '"2821663285"', '"9505220547"', '"2086308157"', '"6257880724"', '"2447685403"', '"2814466995"', '"6958661889"', '"4990170806"', '"6517315419"', '"2200837080"', '"6556669194"', '"4796075927"', '"2558295751"', '"4696454216"', '"6938617683"', '"1434220505"', '"8645903048"', '"4874912103"', '"4398308408"', '"6686663097"', '"6343399949"', '"4067951640"', '"7736431000"', '"9751580935"', '"6495059654"', '"3783299081"', '"7593581797"', '"3037943194"', '"9115632844"', '"4256392024"', '"1015677533"', '"8207505540"', '"1746617177"', '"5675713930"', '"9750572554"', '"9481184604"', '"3601160707"', '"2247242357"', '"2600235760"', '"6747339480"', '"7540199576"', '"7111702621"', '"9177668510"', '"6239355581"', '"2289416814"', '"7960464447"', '"3914817379"', '"5680561313"', '"3235793343"', '"3123113020"', '"1728094552"', '"4421676670"', '"2715806804"', '"4924129673"', '"2957780726"', '"6401239502"', '"7531863338"', '"4948971767"', '"2934514607"', '"1962199949"', '"4324372816"', '"5540347579"', '"3169331441"', '"8953465863"', '"5196200632"', '"3317922559"', '"5553189935"', '"2528420324"', '"6674529799"', '"2210306742"', '"1310037756"', '"4624037320"', '"1904249311"', '"7730015281"', '"4941476638"', '"3439704969"', '"1283821004"', '"5450434625"', '"4293598820"', '"8673947385"', '"1124416280"', '"5663808183"', '"3603614717"', '"8050314388"', '"1478646299"', '"1718069901"', '"1250206561"', '"7235142967"', '"8326618872"', '"6963523191"', '"3417534754"', '"7697087713"', '"7885424385"', '"7740498379"', '"1674934973"', '"4533384473"', '"7631422527"', '"7907340377"', '"8925410596"']
  for (let i = 0; i < array.length; i++) {
    let phone = parseInt(array[i].replace("'", "").replace('"', '').replace('"', ''));
    const [userInfo1] = await connection.query('SELECT * FROM users WHERE phone = ?', [phone]);
    let auth = userInfo1[0].phone;
    let listJoin = '9';
    let game = '1';
    let gameJoin = '1';
    let xvalue = '1';
    let money = '100';
    const [k3Now] = await connection.query(`SELECT period FROM k3 WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1 `);
    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ', [auth]);
    console.log(k3Now.length);
    console.log(user.length);
    if (k3Now.length < 1 || user.length < 1) {
      console.log("Error!");
    }
    let userInfo = user[0];
    let period = k3Now[0];

    let date = new Date();
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let id_product = years + months + days + Math.floor(Math.random() * 1000000000000000);

    let total = 0;
    if (gameJoin == 1) {
        total = money * xvalue * (String(listJoin).split(',').length);
    } else if (gameJoin == 2) {
        let twoSame = listJoin.split('@')[0]; // Chọn 2 số phù hợp
        let motDuyNhat = listJoin.split('@')[1]; // Chọn một cặp số duy nhất
        if (twoSame.length > 0) {
            twoSame = twoSame.split(',').length;
        }
        let lengthArr = 0;
        let count = 0;
        if (motDuyNhat.length > 0) {
            let arr = motDuyNhat.split('&');
            for (let i = 0; i < arr.length; i++) {
                motDuyNhat = arr[i].split('|');
                count = motDuyNhat[1].split(',').length;
            }
            lengthArr = arr.length;
            count = count;
        }
        total = money * xvalue * (lengthArr * count) + (twoSame * money * xvalue);
    } else if (gameJoin == 3) {
        let baDuyNhat = listJoin.split('@')[0]; // Chọn 3 số duy nhất
        let countBaDuyNhat = 0;
        if (baDuyNhat.length > 0) {
            countBaDuyNhat = baDuyNhat.split(',').length;
        }
        let threeSame = listJoin.split('@')[1].length; // Chọn 3 số giống nhau
        total = money * xvalue * countBaDuyNhat + (threeSame * money * xvalue);
    } else if (gameJoin == 4) {
        let threeNumberUnlike = listJoin.split('@')[0]; // Chọn 3 số duy nhất
        let twoLienTiep = listJoin.split('@')[1]; // Chọn 3 số liên tiếp
        let twoNumberUnlike = listJoin.split('@')[2]; // Chọn 3 số duy nhất

        let threeUn = 0;
        if (threeNumberUnlike.length > 0) {
            let arr = threeNumberUnlike.split(',').length;
            if (arr <= 4) {
                threeUn += xvalue * (money * arr);
            }
            if (arr == 5) {
                threeUn += xvalue * (money * arr) * 2;
            }
            if (arr == 6) {
                threeUn += xvalue * (money * 5) * 4;
            }
        }
        let twoUn = 0;
        if (twoNumberUnlike.length > 0) {
            let arr = twoNumberUnlike.split(',').length;
            if (arr <= 3) {
                twoUn += xvalue * (money * arr);
            }
            if (arr == 4) {
                twoUn += xvalue * (money * arr) * 1.5;
            }
            if (arr == 5) {
                twoUn += xvalue * (money * arr) * 2;
            }
            if (arr == 6) {
                twoUn += xvalue * (money * arr * 2.5);
            }
        }
        let UnlienTiep = 0;
        if (twoLienTiep == 'u') {
            UnlienTiep += xvalue * money;
        }
        total = threeUn + twoUn + UnlienTiep;
    }
    let fee = total * 0.02;
    let price = total - fee;

    let typeGame = '';
    if (gameJoin == 1) typeGame = 'total';
    if (gameJoin == 2) typeGame = 'two-same';
    if (gameJoin == 3) typeGame = 'three-same';
    if (gameJoin == 4) typeGame = 'unlike';
    console.log(userInfo);
    let check = userInfo.money - total;

    if (check >= 0) {
        let timeNow = Date.now();
        let checkTime = timerJoin(date.getTime());
        const sql = `INSERT INTO result_k3 SET id_product = ?,phone = ?,code = ?,invite = ?,stage = ?,level = ?,money = ?,price = ?,amount = ?,fee = ?,game = ?,join_bet = ?, typeGame = ?,bet = ?,status = ?,time = ?,today = ?`;
        await connection.execute(sql, [id_product, userInfo.phone, userInfo.code, userInfo.invite, period.period, userInfo.level, total, price, xvalue, fee, game, gameJoin, typeGame, listJoin, 0, timeNow, checkTime]);
        await connection.execute('UPDATE `users` SET `money` = `money` - ? WHERE `phone` = ? ', [total, auth]);
        const [users] = await connection.query('SELECT `money`, `level` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ', [auth]);
        await k3_rosesPlus(auth, total);
        const [level] = await connection.query('SELECT * FROM level ');
        let level0 = level[0];
        const sql2 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,time = ?`;
        let total_m = total;
        let f1 = (total_m / 100) * level0.f1;
        let f2 = (total_m / 100) * level0.f2;
        let f3 = (total_m / 100) * level0.f3;
        let f4 = (total_m / 100) * level0.f4;
        await connection.execute(sql2, [userInfo.phone, userInfo.code, userInfo.invite, f1, f2, f3, f4, timeNow]);
        console.log("Successful bet");
    } else {
      console.log("The amount is not enough");
    }
  }
}

const d5_rosesPlus = async (auth, money) => {
  const [level] = await connection.query('SELECT * FROM level ');
  let level0 = level[0];

  const [user] = await connection.query('SELECT `phone`, `code`, `invite` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ', [auth]);
  let userInfo = user[0];
  const [f1] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [userInfo.invite]);
  if (money >= 10000) {
      if (f1.length > 0) {
          let infoF1 = f1[0];
          let rosesF1 = (money / 100) * level0.f1;
          const sql6 = `
                          INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                          VALUES (?, ?, ?, ?, ?)
                          ON DUPLICATE KEY UPDATE
                          daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                          total_turn_over = total_turn_over + VALUES(total_turn_over)
                          `;

          await connection.execute(sql6, [infoF1.phone, infoF1.code, infoF1.invite, money, money]);
          await connection.query('UPDATE users SET money = money + ?, roses_f1 = roses_f1 + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF1, rosesF1, rosesF1, rosesF1, infoF1.phone]);
          const [f2] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF1.invite]);
          if (f2.length > 0) {
              let infoF2 = f2[0];
              let rosesF2 = (money / 100) * level0.f2;
              await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF2, rosesF2, rosesF2, infoF2.phone]);
              const [f3] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF2.invite]);
              if (f3.length > 0) {
                  let infoF3 = f3[0];
                  let rosesF3 = (money / 100) * level0.f3;
                  await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF3, rosesF3, rosesF3, infoF3.phone]);
                  const [f4] = await connection.query('SELECT `phone`, `code`, `invite`, `rank` FROM users WHERE code = ? AND veri = 1  LIMIT 1 ', [infoF3.invite]);
                  if (f4.length > 0) {
                      let infoF4 = f4[0];
                      let rosesF4 = (money / 100) * level0.f4;
                      await connection.query('UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF4, rosesF4, rosesF4, infoF4.phone]);
                  }
              }
          }

      }
  }
}

const test_5d_join = async () => {
  var array = ['"7985567013"', '"2821663285"', '"9505220547"', '"2086308157"', '"6257880724"', '"2447685403"', '"2814466995"', '"6958661889"', '"4990170806"', '"6517315419"', '"2200837080"', '"6556669194"', '"4796075927"', '"2558295751"', '"4696454216"', '"6938617683"', '"1434220505"', '"8645903048"', '"4874912103"', '"4398308408"', '"6686663097"', '"6343399949"', '"4067951640"', '"7736431000"', '"9751580935"', '"6495059654"', '"3783299081"', '"7593581797"', '"3037943194"', '"9115632844"', '"4256392024"', '"1015677533"', '"8207505540"', '"1746617177"', '"5675713930"', '"9750572554"', '"9481184604"', '"3601160707"', '"2247242357"', '"2600235760"', '"6747339480"', '"7540199576"', '"7111702621"', '"9177668510"', '"6239355581"', '"2289416814"', '"7960464447"', '"3914817379"', '"5680561313"', '"3235793343"', '"3123113020"', '"1728094552"', '"4421676670"', '"2715806804"', '"4924129673"', '"2957780726"', '"6401239502"', '"7531863338"', '"4948971767"', '"2934514607"', '"1962199949"', '"4324372816"', '"5540347579"', '"3169331441"', '"8953465863"', '"5196200632"', '"3317922559"', '"5553189935"', '"2528420324"', '"6674529799"', '"2210306742"', '"1310037756"', '"4624037320"', '"1904249311"', '"7730015281"', '"4941476638"', '"3439704969"', '"1283821004"', '"5450434625"', '"4293598820"', '"8673947385"', '"1124416280"', '"5663808183"', '"3603614717"', '"8050314388"', '"1478646299"', '"1718069901"', '"1250206561"', '"7235142967"', '"8326618872"', '"6963523191"', '"3417534754"', '"7697087713"', '"7885424385"', '"7740498379"', '"1674934973"', '"4533384473"', '"7631422527"', '"7907340377"', '"8925410596"']
  for (let i = 0; i < array.length; i++) {
    let phone = parseInt(array[i].replace("'", "").replace('"', '').replace('"', ''));
    const [userInfo1] = await connection.query('SELECT * FROM users WHERE phone = ?', [phone]);
        let join = "a";
        let list_join = "3";
        let x = "1";
        let money = "100";
        let game = "5";
        let auth = userInfo1[0].phone;
        
        let validate = await validateBet(join, list_join, x, money, game);

        if (!validate) {
            console.log("Invalid bet");
        }

        const [k5DNow] = await connection.query(`SELECT period FROM d5 WHERE status = 0 AND game = ${game} ORDER BY id DESC LIMIT 1 `);
        const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ', [auth]);
        if (k5DNow.length < 1 || user.length < 1) {
            console.log("Successful bet");
        }
        let userInfo = user[0];
        let period = k5DNow[0];

        let date = new Date();
        let years = formateT(date.getFullYear());
        let months = formateT(date.getMonth() + 1);
        let days = formateT(date.getDate());
        let id_product = years + months + days + Math.floor(Math.random() * 1000000000000000);

        let total = money * x * (String(list_join).split('').length);
        let fee = total * 0.02;
        let price = total - fee;

        let check = userInfo.money - total;
        console.log(check);
        if (check >= 0) {
            let timeNow = Date.now();
            let checkTime = timerJoin(date.getTime());
            const sql = `INSERT INTO result_5d SET id_product = ?,phone = ?,code = ?,invite = ?,stage = ?,level = ?,money = ?,price = ?,amount = ?,fee = ?,game = ?,join_bet = ?,bet = ?,status = ?,time = ?,today = ?`;
            await connection.execute(sql, [id_product, userInfo.phone, userInfo.code, userInfo.invite, period.period, userInfo.level, total, price, x, fee, game, join, list_join, 0, timeNow, checkTime]);
            await connection.execute('UPDATE `users` SET `money` = `money` - ? WHERE `phone` = ? ', [total, auth]);
            const [users] = await connection.query('SELECT `money`, `level` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ', [auth]);
            await d5_rosesPlus(auth, money * x);
            const [level] = await connection.query('SELECT * FROM level ');
            let level0 = level[0];
            const sql2 = `INSERT INTO roses SET phone = ?,code = ?,invite = ?,f1 = ?,f2 = ?,f3 = ?,f4 = ?,time = ?`;
            let total_m = total;
            let f1 = (total_m / 100) * level0.f1;
            let f2 = (total_m / 100) * level0.f2;
            let f3 = (total_m / 100) * level0.f3;
            let f4 = (total_m / 100) * level0.f4;
            await connection.execute(sql2, [userInfo.phone, userInfo.code, userInfo.invite, f1, f2, f3, f4, timeNow]);
            console.log("Successful bet");
        } else {
          console.log("The amount is not enough");
      }
  }
}

const trx_rosesPlus = async (auth, money) => {
  const [level] = await connection.query("SELECT * FROM level ");

  const [user] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `user_level`, `total_money` FROM users WHERE phone = ? AND veri = 1 LIMIT 1 ",
    [auth],
  );
  let userInfo = user[0];
  const [f1] = await connection.query(
    "SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ",
    [userInfo.invite],
  );

  if (userInfo.total_money >= 100) {
    if (f1.length > 0) {
      let infoF1 = f1[0];
      for (let levelIndex = 1; levelIndex <= 6; levelIndex++) {
        let rosesF = 0;
        if (infoF1.user_level >= levelIndex && infoF1.total_money >= 100) {
          rosesF = (money / 100) * level[levelIndex - 1].f1;
          if (rosesF > 0) {
            await connection.query(
              "UPDATE users SET money = money + ?, roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ",
              [rosesF, rosesF, rosesF, infoF1.phone],
            );
            let timeNow = Date.now();
            const sql2 = `INSERT INTO roses SET 
                            phone = ?,
                            code = ?,
                            invite = ?,
                            f1 = ?,
                            time = ?`;
            await connection.query(sql2, [
              infoF1.phone,
              infoF1.code,
              infoF1.invite,
              rosesF,
              timeNow,
            ]);

            const sql3 = `
                            INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                            VALUES (?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                            total_turn_over = total_turn_over + VALUES(total_turn_over)
                            `;

            await connection.query(sql3, [
              infoF1.phone,
              infoF1.code,
              infoF1.invite,
              money,
              money,
            ]);
          }
        }
        const [fNext] = await connection.query(
          "SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ",
          [infoF1.invite],
        );
        if (fNext.length > 0) {
          infoF1 = fNext[0];
        } else {
          break;
        }
      }
    }
  }
};

const test_trx_join = async () => {
  var array = ['"7985567013"', '"2821663285"', '"9505220547"', '"2086308157"', '"6257880724"', '"2447685403"', '"2814466995"', '"6958661889"', '"4990170806"', '"6517315419"', '"2200837080"', '"6556669194"', '"4796075927"', '"2558295751"', '"4696454216"', '"6938617683"', '"1434220505"', '"8645903048"', '"4874912103"', '"4398308408"', '"6686663097"', '"6343399949"', '"4067951640"', '"7736431000"', '"9751580935"', '"6495059654"', '"3783299081"', '"7593581797"', '"3037943194"', '"9115632844"', '"4256392024"', '"1015677533"', '"8207505540"', '"1746617177"', '"5675713930"', '"9750572554"', '"9481184604"', '"3601160707"', '"2247242357"', '"2600235760"', '"6747339480"', '"7540199576"', '"7111702621"', '"9177668510"', '"6239355581"', '"2289416814"', '"7960464447"', '"3914817379"', '"5680561313"', '"3235793343"', '"3123113020"', '"1728094552"', '"4421676670"', '"2715806804"', '"4924129673"', '"2957780726"', '"6401239502"', '"7531863338"', '"4948971767"', '"2934514607"', '"1962199949"', '"4324372816"', '"5540347579"', '"3169331441"', '"8953465863"', '"5196200632"', '"3317922559"', '"5553189935"', '"2528420324"', '"6674529799"', '"2210306742"', '"1310037756"', '"4624037320"', '"1904249311"', '"7730015281"', '"4941476638"', '"3439704969"', '"1283821004"', '"5450434625"', '"4293598820"', '"8673947385"', '"1124416280"', '"5663808183"', '"3603614717"', '"8050314388"', '"1478646299"', '"1718069901"', '"1250206561"', '"7235142967"', '"8326618872"', '"6963523191"', '"3417534754"', '"7697087713"', '"7885424385"', '"7740498379"', '"1674934973"', '"4533384473"', '"7631422527"', '"7907340377"', '"8925410596"']
  for (let i = 0; i < array.length; i++) {
    let phone = parseInt(array[i].replace("'", "").replace('"', '').replace('"', ''));
    const [userInfo1] = await connection.query('SELECT * FROM users WHERE phone = ?', [phone]);
    let auth = userInfo1[0].phone;

    let typeid = '5';
    let join = '7';
    let x = '1';
    let money = '100';

    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
      console.log("Error!");
    }

    let gameJoin = "";
    if (typeid == 1) gameJoin = "trx_wingo";
    if (typeid == 3) gameJoin = "trx_wingo3";
    if (typeid == 5) gameJoin = "trx_wingo5";
    if (typeid == 10) gameJoin = "trx_wingo10";
    const [trxWingoNow] = await connection.query(
      `SELECT period FROM trx_wingo_game WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1 `,
      [gameJoin],
    );
    const [user] = await connection.query(
      "SELECT `phone`, `code`, `invite`, `level`, `money` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ",
      [auth],
    );
    if (!trxWingoNow[0] || !user[0] || !isNumber(x) || !isNumber(money)) {
      console.log("Error!");
    }

    let userInfo = user[0];
    let period = trxWingoNow[0].period;
    let fee = x * money * 0.02;
    let total = x * money - fee;
    let timeNow = Date.now();
    let check = userInfo.money - total;

    let date = new Date();
    let years = formateT(date.getFullYear());
    let months = formateT(date.getMonth() + 1);
    let days = formateT(date.getDate());
    let id_product =
      years + months + days + Math.floor(Math.random() * 1000000000000000);

    let formatTime = timerJoin();

    let color = "";
    if (join == "l") {
      color = "big";
    } else if (join == "n") {
      color = "small";
    } else if (join == "t") {
      color = "violet";
    } else if (join == "d") {
      color = "red";
    } else if (join == "x") {
      color = "green";
    } else if (join == "0") {
      color = "red-violet";
    } else if (join == "5") {
      color = "green-violet";
    } else if (join % 2 == 0) {
      color = "red";
    } else if (join % 2 != 0) {
      color = "green";
    }

    let checkJoin = "";

    if ((!isNumber(join) && join == "l") || join == "n") {
      checkJoin = `
        <div data-v-a9660e98="" class="van-image" style="width: 30px; height: 30px;">
            <img src="/images/${join == "n" ? "small" : "big"}.png" class="van-image__img">
        </div>
        `;
    } else {
      checkJoin = `
        <span data-v-a9660e98="">${isNumber(join) ? join : ""}</span>
        `;
    }

    let result = `
    <div data-v-a9660e98="" issuenumber="${period}" addtime="${formatTime}" rowid="1" class="hb">
        <div data-v-a9660e98="" class="item c-row">
            <div data-v-a9660e98="" class="result">
                <div data-v-a9660e98="" class="select select-${color}">
                    ${checkJoin}
                </div>
            </div>
            <div data-v-a9660e98="" class="c-row c-row-between info">
                <div data-v-a9660e98="">
                    <div data-v-a9660e98="" class="issueName">
                        ${period}
                    </div>
                    <div data-v-a9660e98="" class="tiem">${formatTime}</div>
                </div>
            </div>
        </div>
        <!---->
    </div>
    `;

    function timerJoin(params = "", addHours = 0) {
      let date = "";
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

      return (
        years +
        "-" +
        months +
        "-" +
        days +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        " " +
        ampm
      );
    }
    let checkTime = timerJoin(date.getTime());

    if (check >= 0) {
      const sql = `INSERT INTO trx_wingo_bets SET 
            id_product = ?,
            phone = ?,
            code = ?,
            invite = ?,
            stage = ?,
            level = ?,
            money = ?,
            amount = ?,
            fee = ?,
            get = ?,
            game = ?,
            bet = ?,
            status = ?,
            today = ?,
            time = ?`;
      await connection.query(sql, [
        id_product,
        userInfo.phone,
        userInfo.code,
        userInfo.invite,
        period,
        userInfo.level,
        total,
        x,
        fee,
        0,
        gameJoin,
        join,
        0,
        checkTime,
        timeNow,
      ]);
      await connection.query(
        "UPDATE `users` SET `money` = `money` - ? WHERE `phone` = ? ",
        [money * x, auth],
      );
      const [users] = await connection.query(
        "SELECT `money`, `level` FROM users WHERE phone = ? AND veri = 1  LIMIT 1 ",
        [auth],
      );
      await trx_rosesPlus(auth, money * x);
      // const [level] = await connection.query('SELECT * FROM level ');
      // let level0 = level[0];
      // const sql2 = `INSERT INTO roses SET
      // phone = ?,
      // code = ?,
      // invite = ?,
      // f1 = ?,
      // f2 = ?,
      // f3 = ?,
      // f4 = ?,
      // time = ?`;
      // let total_m = money * x;
      // let f1 = (total_m / 100) * level0.f1;
      // let f2 = (total_m / 100) * level0.f2;
      // let f3 = (total_m / 100) * level0.f3;
      // let f4 = (total_m / 100) * level0.f4;
      // await connection.query(sql2, [userInfo.phone, userInfo.code, userInfo.invite, f1, f2, f3, f4, timeNow]);
      // console.log(level);
      
      console.log("Successful bet");
    } else {
      console.log("The amount is not enough");
    }
  }
}
module.exports = {
    cronJobGame1p
};