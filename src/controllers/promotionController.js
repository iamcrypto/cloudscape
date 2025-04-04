import moment from "moment";
import connection from "../config/connectDB.js";
import {
  REWARD_STATUS_TYPES_MAP,
  REWARD_TYPES_MAP,
} from "../constants/reward_types.js";
import { PaymentStatusMap } from "./paymentController.js";
import {
  getStartOfWeekTimestamp,
  getTimeBasedOnDate,
  getTodayStartTime,
  monthTime,
  yesterdayTime,
} from "../helpers/games.js";
import md5 from "md5";
function getOrdinal(n) {
  let s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

let timeNow = Date.now();

const getSubordinateDataByPhone = async (phone) => {
  const [[row_1]] = await connection.execute(
    "SELECT COUNT(*) AS `count` FROM `recharge` WHERE `phone` = ? AND `status` = ?",
    [phone, 1],
  );
  const rechargeQuantity = row_1.count;
  const [[row_2]] = await connection.execute(
    "SELECT SUM(money) AS `sum` FROM `recharge` WHERE `phone` = ? AND `status` = ?",
    [phone, 1],
  );
  const rechargeAmount = row_2.sum;

  const [[row_3]] = await connection.execute(
    "SELECT SUM(money) AS `sum` FROM `recharge` WHERE `phone` = ? AND `status` = ? ORDER BY id LIMIT 1 ",
    [phone, 1],
  );
  const firstRechargeAmount = row_3.sum;

  const [gameWingo] = await connection.query(
    "SELECT SUM(money) as totalBettingAmount FROM minutes_1 WHERE phone = ?",
    [phone],
  );
  const gameWingoBettingAmount = gameWingo[0].totalBettingAmount || 0;

  const [gameK3] = await connection.query(
    "SELECT SUM(money) as totalBettingAmount FROM result_k3 WHERE phone = ?",
    [phone],
  );
  const gameK3BettingAmount = gameK3[0].totalBettingAmount || 0;

  const [game5D] = await connection.query(
    "SELECT SUM(money) as totalBettingAmount FROM result_5d WHERE phone = ?",
    [phone],
  );
  const game5DBettingAmount = game5D[0].totalBettingAmount || 0;

  return {
    rechargeQuantity,
    rechargeAmount,
    firstRechargeAmount,
    bettingAmount:
      parseInt(gameWingoBettingAmount) +
      parseInt(gameK3BettingAmount) +
      parseInt(game5DBettingAmount),
  };
};

const getSubordinatesListDataByCode = async (code, startDate) => {
  let [subordinatesList] = startDate
    ? await connection.execute(
        "SELECT `code`, `phone`, `id_user`, `level`, `time` FROM `users` WHERE `invite` = ? AND time <= ?",
        [code, startDate],
      )
    : await connection.execute(
        "SELECT `code`, `phone`, `id_user`, `time` FROM `users` WHERE `invite` = ?",
        [code],
      );

  let subordinatesCount = subordinatesList.length;
  let subordinatesRechargeQuantity = 0;
  let subordinatesRechargeAmount = 0;
  let subordinatesWithDepositCount = 0;
  let subordinatesFirstDepositAmount = 0;
  let subordinatesWithBettingCount = 0;
  let subordinatesBettingAmount = 0;

  for (let index = 0; index < subordinatesList.length; index++) {
    const subordinate = subordinatesList[index];
    const {
      rechargeQuantity,
      rechargeAmount,
      bettingAmount,
      firstRechargeAmount,
    } = await getSubordinateDataByPhone(subordinate.phone);

    subordinatesRechargeQuantity += parseInt(rechargeQuantity) || 0;
    subordinatesRechargeAmount += parseInt(rechargeAmount) || 0;
    subordinatesList[index]["rechargeQuantity"] =
      parseInt(rechargeQuantity) || 0;
    subordinatesList[index]["rechargeAmount"] = parseInt(rechargeAmount) || 0;
    subordinatesList[index]["bettingAmount"] = parseInt(bettingAmount) || 0;
    subordinatesList[index]["firstRechargeAmount"] =
      parseInt(firstRechargeAmount) || 0;
    subordinatesList[index]["level"] = subordinatesList[index]["level"] || 0;
    subordinatesList[index]["commission"] =
      subordinatesList[index]["commission"] || 0;
    subordinatesWithBettingCount += parseInt(bettingAmount) > 0 ? 1 : 0;
    subordinatesBettingAmount += parseInt(bettingAmount);
    subordinatesFirstDepositAmount += parseInt(firstRechargeAmount) || 0;

    if (rechargeAmount > 0) {
      subordinatesWithDepositCount++;
    }
  }

  return {
    subordinatesList,
    subordinatesCount,
    subordinatesRechargeQuantity,
    subordinatesRechargeAmount,
    subordinatesWithDepositCount,
    subordinatesWithBettingCount,
    subordinatesBettingAmount,
    subordinatesFirstDepositAmount,
  };
};

const getOneLevelTeamSubordinatesData = async (directSubordinatesList) => {
  let oneLevelTeamSubordinatesCount = 0;
  let oneLevelTeamSubordinatesRechargeQuantity = 0;
  let oneLevelTeamSubordinatesRechargeAmount = 0;
  let oneLevelTeamSubordinatesWithDepositCount = 0;
  let oneLevelTeamSubordinatesList = [];

  for (const directSubordinate of directSubordinatesList) {
    const indirectSubordinatesData = await getSubordinatesListDataByCode(
      directSubordinate.code,
    );
    oneLevelTeamSubordinatesList = [
      ...oneLevelTeamSubordinatesList,
      ...indirectSubordinatesData.subordinatesList,
    ];
    oneLevelTeamSubordinatesCount += indirectSubordinatesData.subordinatesCount;
    oneLevelTeamSubordinatesRechargeQuantity +=
      indirectSubordinatesData.subordinatesRechargeQuantity;
    oneLevelTeamSubordinatesRechargeAmount +=
      indirectSubordinatesData.subordinatesRechargeAmount;
    oneLevelTeamSubordinatesWithDepositCount +=
      indirectSubordinatesData.subordinatesWithDepositCount;
  }

  return {
    oneLevelTeamSubordinatesCount,
    oneLevelTeamSubordinatesRechargeQuantity,
    oneLevelTeamSubordinatesRechargeAmount,
    oneLevelTeamSubordinatesWithDepositCount,
    oneLevelTeamSubordinatesList,
  };
};

// const subordinatesDataAPI = async (req, res) => {
//   try {
//       const authToken = req.cookies.auth;
//       const [userRow] = await connection.execute("SELECT `code`, `invite` FROM `users` WHERE `token` = ? AND `veri` = 1", [authToken]);
//       const user = userRow?.[0];

//       if (!user) {
//          return res.status(401).json({ message: "Unauthorized" });
//       }

//       const directSubordinatesData = await getSubordinatesListDataByCode(user.code);

//       let directSubordinatesCount = directSubordinatesData.subordinatesCount;
//       let directSubordinatesRechargeQuantity = directSubordinatesData.subordinatesRechargeQuantity;
//       let directSubordinatesRechargeAmount = directSubordinatesData.subordinatesRechargeAmount;
//       let directSubordinatesWithDepositCount = directSubordinatesData.subordinatesWithDepositCount;

//       const directSubordinatesList = directSubordinatesData.subordinatesList;

//       let teamSubordinatesCount = directSubordinatesCount;
//       let teamSubordinatesRechargeQuantity = directSubordinatesRechargeQuantity;
//       let teamSubordinatesRechargeAmount = directSubordinatesRechargeAmount;
//       let teamSubordinatesWithDepositCount = directSubordinatesWithDepositCount;

//       let tempSubordinatesList = directSubordinatesList;

//       for (let index = 0; index < 10; index++) {
//          const element = await getOneLevelTeamSubordinatesData(tempSubordinatesList);

//          tempSubordinatesList = element.oneLevelTeamSubordinatesList;
//          teamSubordinatesCount += element.oneLevelTeamSubordinatesCount;
//          teamSubordinatesRechargeQuantity += element.oneLevelTeamSubordinatesRechargeQuantity;
//          teamSubordinatesRechargeAmount += element.oneLevelTeamSubordinatesRechargeAmount;
//          teamSubordinatesWithDepositCount += element.oneLevelTeamSubordinatesWithDepositCount;
//       }

//       return res.status(200).json({
//          data: {
//             directSubordinatesCount,
//             directSubordinatesRechargeQuantity,
//             directSubordinatesRechargeAmount,
//             directSubordinatesWithDepositCount,
//             teamSubordinatesCount,
//             teamSubordinatesRechargeQuantity,
//             teamSubordinatesRechargeAmount,
//             teamSubordinatesWithDepositCount,
//          },
//       });
//   } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: error.message });
//   }
// };
const createInviteMap = (rows) => {
  const inviteMap = {};
  rows.forEach((user) => {
    if (!inviteMap[user.invite]) {
      inviteMap[user.invite] = [];
    }
    inviteMap[user.invite].push(user);
  });
  return inviteMap;
};

const getLevelUsers = (inviteMap, userCode, currentLevel, maxLevel) => {
  if (currentLevel > maxLevel) return [];

  const levelUsers = inviteMap[userCode] || [];
  if (levelUsers.length === 0) return [];
  return levelUsers.flatMap((user) => [
    { ...user, user_level: currentLevel },
    ...getLevelUsers(inviteMap, user.code, currentLevel + 1, maxLevel),
  ]);
};

const getUserLevels = (rows, userCode, maxLevel = 10) => {
  const inviteMap = createInviteMap(rows);
  const usersByLevels = getLevelUsers(inviteMap, userCode, 1, maxLevel);

  return { usersByLevels, level1Referrals: inviteMap[userCode] };
};

const userStats = async (startTime, endTime, phone = "") => {
  const time = moment().startOf("day").valueOf();
  const [rows] = await connection.query(
    `
      SELECT
          u.phone,
          u.invite,
          u.code,
          u.time,
          u.id_user,
          COALESCE(r.total_deposit_amount, 0) AS total_deposit_amount,
          COALESCE(r.total_deposit_number, 0) AS total_deposit_number
      FROM
          users u
      LEFT JOIN
          (
              SELECT
                  phone,
                  SUM(CASE WHEN status = 1 THEN COALESCE(money, 0) ELSE 0 END) AS total_deposit_amount,
                  COUNT(CASE WHEN status = 1 THEN phone ELSE NULL END) AS total_deposit_number
              FROM
                  recharge
              GROUP BY
                  phone
          ) r ON u.phone = r.phone    
      ORDER BY
          u.time DESC;
      `,
    [
      // time,
      // time,
      // time,
      // time,
      // phone,
    ],
  );

  return rows;
};

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

const subordinatesDataAPI = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const now = new Date();
    const startOfWeek = getStartOfWeekTimestamp();
    const startOfYesterdayTimestamp = getTodayStartTime();
    const endOfYesterdayTimestamp = now.getTime();
    const time = moment().startOf("day").valueOf();
    const [userRow] = await connection.execute(
      "SELECT * FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const commissions = await getCommissionStatsByTime(startOfWeek, user.phone);

    const userStatsData = await userStats(
      startOfYesterdayTimestamp,
      endOfYesterdayTimestamp,
    );

    const { usersByLevels = [], level1Referrals = [] } = getUserLevels(
      userStatsData,
      user.code,
    );
    const directSubordinatesCount = level1Referrals.length;
    const noOfRegisteredSubordinates = level1Referrals.filter(
      (user) => user.time >= time,
    ).length;;
    const directSubordinatesRechargeQuantity = level1Referrals.reduce(
      (acc, curr) => acc + curr.total_deposit_number,
      0,
    );
    const directSubordinatesRechargeAmount = level1Referrals.reduce(
      (acc, curr) => acc + +curr.total_deposit_amount,
      0,
    );
    const directSubordinatesWithDepositCount = level1Referrals.filter(
      (user) => user.total_deposit_number === 1,
    ).length;

    const teamSubordinatesCount = usersByLevels.length;
    const noOfRegisterAll = usersByLevels.filter(
      (user) => user.time >= time,
    );
    const noOfRegisterAllSubordinates = noOfRegisterAll.length;
    const teamSubordinatesRechargeQuantity = usersByLevels.reduce(
      (acc, curr) => acc + curr.total_deposit_number,
      0,
    );
    const teamSubordinatesRechargeAmount = usersByLevels.reduce(
      (acc, curr) => acc + +curr.total_deposit_amount,
      0,
    );
    const teamSubordinatesWithDepositCount = usersByLevels.filter(
      (user) => user.total_deposit_number === 1,
    ).length;

    const totalCommissions = commissions?.total_commission || 0;
    const totalCommissionsThisWeek = commissions?.last_week_commission || 0;
    const totalCommissionsYesterday = commissions?.yesterday_commission || 0;

    return res.status(200).json({
      data: {
        directSubordinatesCount,
        noOfRegisteredSubordinates,
        directSubordinatesRechargeQuantity,
        directSubordinatesRechargeAmount,
        directSubordinatesWithDepositCount,
        teamSubordinatesCount,
        noOfRegisterAllSubordinates,
        teamSubordinatesRechargeQuantity,
        teamSubordinatesRechargeAmount,
        teamSubordinatesWithDepositCount,
        totalCommissions,
        totalCommissionsThisWeek,
        totalCommissionsYesterday,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// const subordinatesDataByTimeAPI = async (req, res) => {
//    try {
//       const authToken = req.cookies.auth;
//       const [userRow] = await connection.execute("SELECT `code`, `invite` FROM `users` WHERE `token` = ? AND `veri` = 1", [authToken]);
//       const user = userRow?.[0];
//       const startDate = req.query.startDate;
//       console.log('===================',req.query.startDate)

//       if (!user) {
//          return res.status(401).json({ message: "Unauthorized" });
//       }

//       const directSubordinatesData = await getSubordinatesListDataByCode(user.code, startDate);

//       let directSubordinatesCount = directSubordinatesData.subordinatesCount;
//       let directSubordinatesRechargeQuantity = directSubordinatesData.subordinatesRechargeQuantity;
//       let directSubordinatesRechargeAmount = directSubordinatesData.subordinatesRechargeAmount;
//       let directSubordinatesWithDepositCount = directSubordinatesData.subordinatesWithDepositCount;
//       let directSubordinatesWithBettingCount = directSubordinatesData.subordinatesWithBettingCount;
//       let directSubordinatesBettingAmount = directSubordinatesData.subordinatesBettingAmount;
//       let directSubordinatesFirstDepositAmount = directSubordinatesData.subordinatesFirstDepositAmount;

//       const directSubordinatesList = directSubordinatesData.subordinatesList;

//       res.status(200).json({
//          status: true,
//          data: {
//             directSubordinatesCount,
//             directSubordinatesRechargeQuantity,
//             directSubordinatesRechargeAmount,
//             directSubordinatesWithDepositCount,
//             directSubordinatesWithBettingCount,
//             directSubordinatesBettingAmount,
//             directSubordinatesFirstDepositAmount,
//             directSubordinatesList,
//          },
//          message: "Successfully fetched subordinates data",
//       });
//    } catch (error) {
//       console.log(error);
//       res.status(500).json({
//          message: "Something went wrong!",
//          error,
//       });
//    }
// };

const subordinatesDataByTimeAPI = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `code`,phone, `invite` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];
    const startDate = +req.query.startDate;
    const endDate = getTimeBasedOnDate(startDate);

    const searchFromUid = req.query.id || "";
    const levelFilter = req.query.level;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userStatsData = await userStats(startDate, endDate, user.phone);

    const { usersByLevels = [] } = getUserLevels(userStatsData, user.code);

    const filteredUsers = usersByLevels.filter(
      (user) =>
        user.id_user.includes(searchFromUid) &&
        (levelFilter !== "All" ? user.user_level === +levelFilter : true),
    );
    // const usersFilterByPositiveData = filteredUsers.filter(
    //   (user) =>
    //     user.total_deposit_number > 0 ||
    //     user.total_deposit_amount > 0 ||
    //     user.total_bets > 0,
    // );

    const sortedUsersByBet = filteredUsers.sort((a, b) => b.total_bet_amount - a.total_bet_amount);

    const subordinatesRechargeQuantity = filteredUsers.reduce(
      (acc, curr) => acc + curr.total_deposit_number,
      0,
    );
    const subordinatesRechargeAmount = filteredUsers.reduce(
      (acc, curr) => acc + +curr.total_deposit_amount,
      0,
    );
    /**********************for bets ********************************** */
    const subordinatesWithBetting = filteredUsers.filter(
      (user) => user.total_bets > 0,
    );
    const subordinatesWithBettingCount = subordinatesWithBetting.length;
    const subordinatesBettingAmount = subordinatesWithBetting
      .reduce((acc, curr) => acc + +curr.total_bet_amount, 0)
      .toFixed();

    /**********************for first deposit ********************************** */
    const subordinatesWithFirstDeposit = filteredUsers.filter(
      (user) => user.total_deposit_number === 1,
    );
    const subordinatesWithFirstDepositCount =
      subordinatesWithFirstDeposit.length;
    const subordinatesWithFirstDepositAmount =
      subordinatesWithFirstDeposit.reduce(
        (acc, curr) => acc + +curr.total_deposit_amount,
        0,
      );

    //for pagination
    const paginatedUsers = sortedUsersByBet.slice(
      offset,
      offset + limit,
    );
    const totalUsers = sortedUsersByBet.length;
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      status: true,
      meta: {
        totalPages,
        currentPage: page,
      },
      data: {
        usersByLevels: paginatedUsers,

        subordinatesRechargeQuantity,
        subordinatesRechargeAmount,
        subordinatesWithBettingCount,
        subordinatesBettingAmount,
        subordinatesWithFirstDepositCount,
        subordinatesWithFirstDepositAmount,
      },
      message: "Successfully fetched subordinates data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const subordinatesAPI = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `code`,phone, `invite` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const type = req.query.type || "today";
    const now1 = new Date();
    const startOfYesterdayTimestamp = getTodayStartTime();
    const endOfYesterdayTimestamp = now1.getTime();
    const { startOfMonthTimestamp, endOfMonthTimestamp } = monthTime();

    const startDate =
      type === "today"
        ? getTodayStartTime()
        : type === "yesterday"
          ? startOfYesterdayTimestamp
          : type === "this month"
            ? startOfMonthTimestamp
            : "";
    const endDate =
      type === "today"
        ? new Date().getTime()
        : type === "yesterday"
          ? endOfYesterdayTimestamp
          : type === "this month"
            ? endOfMonthTimestamp
            : "";

    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userStatsData = await userStats(startDate, endDate, user.phone);
    const { level1Referrals } = getUserLevels(userStatsData, user.code);
    const users = level1Referrals
      .map((user) => {
        const { phone, id_user: uid, time } = user;
        const phoneFormat = phone.slice(0, 3) + "****" + phone.slice(7);
        const timeUtc = new Date(parseInt(time))
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
          })
          .replace(",", "");
        if (user.time >= startDate)
          return { phone: phoneFormat, uid, time: timeUtc };
        else return null;
      })
      .filter(Boolean);

    res.status(200).json({
      status: true,
      type,
      users,
      message: "Successfully fetched subordinates data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const InvitationBonusList = [
  {
    id: 1,
    numberOfInvitedMembers: 3,
    numberOfDeposits: 3,
    amountOfRechargePerPerson: 555,
    bonusAmount: 199,
  },

  {
    id: 2,
    numberOfInvitedMembers: 5,
    numberOfDeposits: 5,
    amountOfRechargePerPerson: 555,
    bonusAmount: 299,
  },
  {
    id: 3,
    numberOfInvitedMembers: 10,
    numberOfDeposits: 10,
    amountOfRechargePerPerson: 1111,
    bonusAmount: 599,
  },
  {
    id: 4,
    numberOfInvitedMembers: 30,
    numberOfDeposits: 30,
    amountOfRechargePerPerson: 1111,
    bonusAmount: 1799,
  },
  {
    id: 5,
    numberOfInvitedMembers: 50,
    numberOfDeposits: 50,
    amountOfRechargePerPerson: 1111,
    bonusAmount: 2799,
  },
  {
    id: 6,
    numberOfInvitedMembers: 75,
    numberOfDeposits: 75,
    amountOfRechargePerPerson: 1555,
    bonusAmount: 4799,
  },
  {
    id: 7,
    numberOfInvitedMembers: 100,
    numberOfDeposits: 100,
    amountOfRechargePerPerson: 1555,
    bonusAmount: 6799,
  },
  {
    id: 8,
    numberOfInvitedMembers: 200,
    numberOfDeposits: 200,
    amountOfRechargePerPerson: 1555,
    bonusAmount: 12229,
  },
  {
    id: 9,
    numberOfInvitedMembers: 500,
    numberOfDeposits: 500,
    amountOfRechargePerPerson: 1777,
    bonusAmount: 33339,
  },
  {
    id: 10,
    numberOfInvitedMembers: 1000,
    numberOfDeposits: 1000,
    amountOfRechargePerPerson: 1777,
    bonusAmount: 64449,
  },
  {
    id: 11,
    numberOfInvitedMembers: 2000,
    numberOfDeposits: 2000,
    amountOfRechargePerPerson: 1777,
    bonusAmount: 122229,
  },
  {
    id: 12,
    numberOfInvitedMembers: 5000,
    numberOfDeposits: 5000,
    amountOfRechargePerPerson: 2111,
    bonusAmount: 299999,
  },
  {
    id: 13,
    numberOfInvitedMembers: 10000,
    numberOfDeposits: 10000,
    amountOfRechargePerPerson: 2555,
    bonusAmount: 999999,
  },
];

const getInvitationBonus = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `code`, `invite`, `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];
    if (!user) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    const directSubordinatesData = await getSubordinatesListDataByCode(
      user.code,
    );

    let directSubordinatesCount = directSubordinatesData.subordinatesCount;
    let directSubordinatesRechargeAmount =
      directSubordinatesData.subordinatesRechargeAmount;

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.INVITATION_BONUS, user.phone],
    );

    const invitationBonusData = InvitationBonusList.map((item) => {
      const currentNumberOfDeposits =
        directSubordinatesData.subordinatesList.filter(
          (subordinate) =>
            subordinate.rechargeAmount >= item.amountOfRechargePerPerson,
        ).length;
      return {
        id: item.id,
        isFinished:
          directSubordinatesCount >= item.numberOfInvitedMembers &&
          currentNumberOfDeposits >= item.numberOfDeposits,
        isClaimed: claimedRewardsRow.some(
          (claimedReward) => claimedReward.reward_id === item.id,
        ),
        required: {
          numberOfInvitedMembers: item.numberOfInvitedMembers,
          numberOfDeposits: item.numberOfDeposits,
          amountOfRechargePerPerson: item.amountOfRechargePerPerson,
        },
        current: {
          numberOfInvitedMembers: Math.min(
            directSubordinatesCount,
            item.numberOfInvitedMembers,
          ),
          numberOfDeposits: Math.min(
            currentNumberOfDeposits,
            item.numberOfDeposits,
          ),
          amountOfRechargePerPerson: Math.min(
            directSubordinatesRechargeAmount,
            item.amountOfRechargePerPerson,
          ),
        },
        bonusAmount: item.bonusAmount,
      };
    });

    return res.status(200).json({
      data: invitationBonusData,
      status: true,
      message: "Successfully fetched invitation bonus data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const claimInvitationBonus = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const invitationBonusId = req.body.claim_id;

    const [userRow] = await connection.execute(
      "SELECT `code`, `invite`, `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const directSubordinatesData = await getSubordinatesListDataByCode(
      user.code,
    );

    let directSubordinatesCount = directSubordinatesData.subordinatesCount;
    let directSubordinatesRechargeAmount =
      directSubordinatesData.subordinatesRechargeAmount;

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.INVITATION_BONUS, user.phone],
    );

    const invitationBonusData = InvitationBonusList.map((item) => {
      const currentNumberOfDeposits =
        directSubordinatesData.subordinatesList.filter(
          (subordinate) =>
            subordinate.rechargeAmount >= item.amountOfRechargePerPerson,
        ).length;
      return {
        id: item.id,
        isFinished:
          directSubordinatesCount >= item.numberOfInvitedMembers &&
          currentNumberOfDeposits >= item.numberOfDeposits,
        isClaimed: claimedRewardsRow.some(
          (claimedReward) => claimedReward.reward_id === item.id,
        ),
        required: {
          numberOfInvitedMembers: item.numberOfInvitedMembers,
          numberOfDeposits: item.numberOfDeposits,
          amountOfRechargePerPerson: item.amountOfRechargePerPerson,
        },
        current: {
          numberOfInvitedMembers: Math.min(
            directSubordinatesCount,
            item.numberOfInvitedMembers,
          ),
          numberOfDeposits: Math.min(
            currentNumberOfDeposits,
            item.numberOfDeposits,
          ),
          amountOfRechargePerPerson: Math.min(
            directSubordinatesRechargeAmount,
            item.amountOfRechargePerPerson,
          ),
        },
        bonusAmount: item.bonusAmount,
      };
    });
    const claimableBonusData = invitationBonusData.filter(
      (item) => item.isFinished && item.id === parseInt(invitationBonusId),
    );
    if (claimableBonusData.length === 0) {
      return res.status(200).json({
        status: false,
        message: "You does not meet the requirements to claim this reword!",
      });
    }

    const claimedRewardsData = invitationBonusData.find(
      (item) => item.isClaimed && item.id === parseInt(invitationBonusId),
    );

    if (claimedRewardsData?.id === parseInt(invitationBonusId)) {
      return res.status(200).json({
        status: false,
        message: "Bonus already claimed",
      });
    }

    const claimedBonusData = claimableBonusData?.find(
      (item) => item.id === parseInt(invitationBonusId),
    );

    const time = moment().valueOf();

    await connection.execute(
      "UPDATE `users` SET `money` = `money` + ?, `total_money` = `total_money` + ? WHERE `phone` = ?",
      [claimedBonusData.bonusAmount, claimedBonusData.bonusAmount, user.phone],
    );

    await connection.execute(
      "INSERT INTO `claimed_rewards` (`reward_id`, `type`, `phone`, `amount`, `status`, `time`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        parseInt(invitationBonusId),
        REWARD_TYPES_MAP.INVITATION_BONUS,
        user.phone,
        claimedBonusData.bonusAmount,
        REWARD_STATUS_TYPES_MAP.SUCCESS,
        time,
      ],
    );

    return res.status(200).json({
      status: true,
      message: "Successfully claimed invitation bonus",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getInvitedMembers = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `code`, `invite`, `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let [invitedMembers] = await connection.execute(
      "SELECT `phone`, `time`, `id_user`, `id_user`, `name_user` FROM `users` WHERE `invite` = ?",
      [user.code],
    );

    for (let index = 0; index < invitedMembers.length; index++) {
      const invitedMember = invitedMembers[index];

      const [[row_2]] = await connection.execute(
        "SELECT SUM(money) AS `sum` FROM `recharge` WHERE `phone` = ? AND `status` = ?",
        [invitedMember.phone, 1],
      );
      const rechargeAmount = row_2.sum;

      invitedMembers[index]["rechargeAmount"] = rechargeAmount;
    }

    return res.status(200).json({
      data: invitedMembers.map((invitedMember) => ({
        uid: invitedMember.id_user,
        phone: invitedMember.phone,
        create_time: moment(invitedMember.time, "x").format(
          "YYYY-MM-DD HH:mm:ss",
        ),
        amount: invitedMember.rechargeAmount,
        username: invitedMember.name_user,
      })),
      status: true,
      message: "Successfully fetched invited members",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const WeekBettingBonusList = [
  {
    id: 1,
    bettingAmount: 50000,
    bonusAmount: 100,
  },
]


const DailyRebateBonusList = [
  {
    id: 1,
    rebetAmount: 50,
    bonusAmount: 0,
  },
]
const DailyBettingBonusList = [
  {
    id: 1,
    bettingAmount: 1000,
    bonusAmount: 38,
  },
  {
    id: 2,
    bettingAmount: 5000,
    bonusAmount: 128,
  },
  {
    id: 3,
    bettingAmount: 10000,
    bonusAmount: 208,
  },
  {
    id: 4,
    bettingAmount: 50000,
    bonusAmount: 508,
  },
  {
    id: 5,
    bettingAmount: 100000,
    bonusAmount: 888,
  },
];


const DailyRechargeBonusList = [
  {
    id: 1,
    rechargeAmount: 1000,
    bonusAmount: 38,
  },
  {
    id: 2,
    rechargeAmount: 5000,
    bonusAmount: 128,
  },
  {
    id: 3,
    rechargeAmount: 10000,
    bonusAmount: 208,
  },
  {
    id: 4,
    rechargeAmount: 50000,
    bonusAmount: 508,
  },
  {
    id: 5,
    rechargeAmount: 100000,
    bonusAmount: 888,
  },
];

const getDailyRechargeReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = moment().startOf("day").valueOf();
    const [todayRechargeRow] = await connection.execute(
      "SELECT SUM(money) AS `sum` FROM `recharge` WHERE `phone` = ? AND `status` = ? AND `time` >= ?",
      [user.phone, 1, today],
    );
    const todayRechargeAmount = todayRechargeRow[0].sum || 0;

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ?",
      [REWARD_TYPES_MAP.DAILY_RECHARGE_BONUS, user.phone, today],
    );


    const dailyRechargeRewordList = DailyRechargeBonusList.map((item) => {
      return {
        id: item.id,
        rechargeAmount: Math.min(todayRechargeAmount, item.rechargeAmount),
        requiredRechargeAmount: item.rechargeAmount,
        bonusAmount: item.bonusAmount,
        isFinished: todayRechargeAmount >= item.rechargeAmount,
        isClaimed: claimedRewardsRow.some(
          (claimedReward) => claimedReward.reward_id === item.id,
        ),
      };
    });

    return res.status(200).json({
      data: dailyRechargeRewordList,
      status: true,
      message: "Successfully fetched daily recharge bonus data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const claimDailyRechargeReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const dailyRechargeRewordId = req.body.claim_id;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = moment().startOf("day").valueOf();
    const [todayRechargeRow] = await connection.execute(
      "SELECT SUM(money) AS `sum` FROM `recharge` WHERE `phone` = ? AND `status` = ? AND `time` >= ?",
      [user.phone, 1, today],
    );
    const todayRechargeAmount = todayRechargeRow[0].sum || 0;

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ?",
      [REWARD_TYPES_MAP.DAILY_RECHARGE_BONUS, user.phone, today],
    );

    const dailyRechargeRewordList = DailyRechargeBonusList.map((item) => {
      return {
        id: item.id,
        rechargeAmount: todayRechargeAmount,
        requiredRechargeAmount: item.rechargeAmount,
        bonusAmount: item.bonusAmount,
        isFinished: todayRechargeAmount >= item.rechargeAmount,
        isClaimed: claimedRewardsRow.some(
          (claimedReward) => claimedReward.reward_id === item.rechargeAmount,
        ),
      };
    });

    const claimableBonusData = dailyRechargeRewordList.filter(
      (item) =>
        item.isFinished && item.rechargeAmount >= item.requiredRechargeAmount,
    );
    if (claimableBonusData.length === 0) {
      return res.status(200).json({
        status: false,
        message: "You does not meet the requirements to claim this reword!",
      });
    }
    const claimedBonusData = claimableBonusData?.find(
      (item) => item.id === parseInt(dailyRechargeRewordId),
    );
    const [bonusList] = await connection.query(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ? AND `reward_id` = ?",
      [
        REWARD_TYPES_MAP.DAILY_RECHARGE_BONUS,
        user.phone,
        today,
        claimedBonusData.id,
      ],
    );
    if (bonusList.length > 0) {
      return res.status(200).json({
        status: false,
        message: "Bonus already claimed",
      });
    }
    const time = moment().valueOf();

    await connection.execute(
      "UPDATE `users` SET `money` = `money` + ?, `total_money` = `total_money` + ? WHERE `phone` = ?",
      [claimedBonusData.bonusAmount, claimedBonusData.bonusAmount, user.phone],
    );

    await connection.execute(
      "INSERT INTO `claimed_rewards` (`reward_id`, `type`, `phone`, `amount`, `status`, `time`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        claimedBonusData.id,
        REWARD_TYPES_MAP.DAILY_RECHARGE_BONUS,
        user.phone,
        claimedBonusData.bonusAmount,
        REWARD_STATUS_TYPES_MAP.SUCCESS,
        time,
      ],
    );

    return res.status(200).json({
      status: true,
      message: "Successfully claimed daily recharge bonus",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const dailyRechargeRewordRecord = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.DAILY_RECHARGE_BONUS, user.phone],
    );

    const claimedRewardsData = claimedRewardsRow.map((claimedReward) => {
      const currentDailyRechargeReword = DailyRechargeBonusList.find(
        (item) => item?.id === claimedReward?.reward_id,
      );
      return {
        id: claimedReward.reward_id,
        requireRechargeAmount: currentDailyRechargeReword?.rechargeAmount || 0,
        amount: claimedReward.amount,
        status: claimedReward.status,
        time: moment.unix(claimedReward.time).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
    return res.status(200).json({
      data: claimedRewardsData,
      status: true,
      message: "Successfully fetched daily recharge bonus record",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const firstRechargeBonusList = [
  {
    id: 1,
    rechargeAmount: 100000,
    bonusAmount: 5888,
    agentBonus: 9999,
  },
  {
    id: 2,
    rechargeAmount: 50000,
    bonusAmount: 2888,
    agentBonus: 6888,
  },
  {
    id: 3,
    rechargeAmount: 10000,
    bonusAmount: 488,
    agentBonus: 1288,
  },
  {
    id: 4,
    rechargeAmount: 5000,
    bonusAmount: 288,
    agentBonus: 768,
  },
  {
    id: 5,
    rechargeAmount: 1000,
    bonusAmount: 188,
    agentBonus: 208,
  },
  {
    id: 6,
    rechargeAmount: 500,
    bonusAmount: 108,
    agentBonus: 128,
  },
  {
    id: 7,
    rechargeAmount: 200,
    bonusAmount: 48,
    agentBonus: 58,
  },
  {
    id: 8,
    rechargeAmount: 100,
    bonusAmount: 28,
    agentBonus: 28,
  },
];

const getFirstRechargeRewords = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.FIRST_RECHARGE_BONUS, user.phone],
    );
    const [rechargeRow] = await connection.execute(
      "SELECT * FROM `recharge` WHERE `phone` = ? AND `status` = ? ORDER BY id DESC LIMIT 1 ",
      [user.phone, 1],
    );
    const firstRecharge = rechargeRow?.[0];

    const firstRechargeRewordList = firstRechargeBonusList.map(
      (item, index) => {
        const currentRechargeAmount = firstRecharge?.money || 0;
        return {
          id: item.id,
          currentRechargeAmount: Math.min(
            item.rechargeAmount,
            currentRechargeAmount,
          ),
          requiredRechargeAmount: item.rechargeAmount,
          bonusAmount: item.bonusAmount,
          agentBonus: item.agentBonus,
          isFinished:
            index === 0
              ? currentRechargeAmount >= item.rechargeAmount
              : currentRechargeAmount >= item.rechargeAmount &&
                firstRechargeBonusList[index - 1]?.rechargeAmount >
                  currentRechargeAmount,
          isClaimed: claimedRewardsRow.some(
            (claimedReward) => claimedReward.reward_id === item.id,
          ),
        };
      },
    );

    return res.status(200).json({
      data: firstRechargeRewordList,
      isExpired: firstRechargeRewordList.some(
        (item) => item.isFinished && item.isClaimed,
      ),
      status: true,
      message: "Successfully fetched first recharge bonus data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const claimFirstRechargeReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const firstRechargeRewordId = req.body.id;
    const [userRow] = await connection.execute(
      "SELECT * FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.FIRST_RECHARGE_BONUS, user.phone],
    );
    const [rechargeRow] = await connection.execute(
      "SELECT * FROM `recharge` WHERE `phone` = ? AND `status` = ? ORDER BY id DESC LIMIT 1 ",
      [user.phone, 1],
    );
    const firstRecharge = rechargeRow?.[0];

    const firstRechargeRewordList = firstRechargeBonusList.map(
      (item, index) => {
        const currentRechargeAmount = firstRecharge?.money || 0;
        return {
          id: item.id,
          currentRechargeAmount: Math.min(
            item.rechargeAmount,
            currentRechargeAmount,
          ),
          requiredRechargeAmount: item.rechargeAmount,
          bonusAmount: item.bonusAmount,
          agentBonus: item.agentBonus,
          isFinished:
            index === 0
              ? currentRechargeAmount >= item.rechargeAmount
              : currentRechargeAmount >= item.rechargeAmount &&
                firstRechargeBonusList[index - 1]?.rechargeAmount >
                  currentRechargeAmount,
          isClaimed: claimedRewardsRow.some(
            (claimedReward) => claimedReward.reward_id === item.id,
          ),
        };
      },
    );

    const claimableBonusData = firstRechargeRewordList.filter(
      (item) => item.isFinished,
    );

    if (claimableBonusData.length === 0) {
      return res.status(200).json({
        status: false,
        message: "You does not meet the requirements to claim this reword!",
      });
    }

    const isExpired = firstRechargeRewordList.some(
      (item) => item.isFinished && item.isClaimed,
    );

    if (isExpired) {
      return res.status(200).json({
        status: false,
        message: "Bonus already claimed",
      });
    }

    const claimedBonusData = claimableBonusData?.find(
      (item) => item.id === firstRechargeRewordId,
    );

    const time = moment().valueOf();

    await connection.execute(
      "UPDATE `users` SET `money` = `money` + ?, `total_money` = `total_money` + ? WHERE `phone` = ?",
      [claimedBonusData.bonusAmount, claimedBonusData.bonusAmount, user.phone],
    );

    await connection.execute(
      "INSERT INTO `claimed_rewards` (`reward_id`, `type`, `phone`, `amount`, `status`, `time`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        claimedBonusData.id,
        REWARD_TYPES_MAP.FIRST_RECHARGE_BONUS,
        user.phone,
        claimedBonusData.bonusAmount,
        REWARD_STATUS_TYPES_MAP.SUCCESS,
        time,
      ],
    );
    return res.status(200).json({
      status: true,
      message: "Successfully claimed first recharge bonus",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const AttendanceBonusList = [
  {
    id: 1,
    days: 1,
    bonusAmount: 5,
    requiredAmount: 200,
  },
  {
    id: 2,
    days: 2,
    bonusAmount: 18,
    requiredAmount: 1000,
  },
  {
    id: 3,
    days: 3,
    bonusAmount: 100,
    requiredAmount: 3000,
  },
  {
    id: 4,
    days: 4,
    bonusAmount: 200,
    requiredAmount: 10000,
  },
  {
    id: 5,
    days: 5,
    bonusAmount: 400,
    requiredAmount: 20000,
  },
  {
    id: 6,
    days: 6,
    bonusAmount: 3000,
    requiredAmount: 100000,
  },
  {
    id: 7,
    days: 7,
    bonusAmount: 7000,
    requiredAmount: 200000,
  },
];

const getAttendanceBonus = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.ATTENDANCE_BONUS, user.phone],
    );

    let attendanceBonusId = 0;

    if (claimedRewardsRow.length === 0) {
      attendanceBonusId = 0;
    } else {
      const lastClaimedReword =
        claimedRewardsRow?.[claimedRewardsRow.length - 1];
      const lastClaimedRewordTime = lastClaimedReword?.time || 0;
      let clamed_date = new Date(timerJoin(lastClaimedRewordTime));
      let todays_date = new Date(timerJoin(moment().valueOf()));
      let Difference_In_Time =  todays_date.getTime() - clamed_date.getTime();
      let Difference_In_Days =  Math.round(Difference_In_Time / (1000 * 3600 * 24));

      if (parseInt(Difference_In_Days)  < 1) {
        attendanceBonusId = lastClaimedReword.reward_id;
      } else if (parseInt(Difference_In_Days) >= 2) {
        attendanceBonusId = 0;
      } else {
        attendanceBonusId = lastClaimedReword.reward_id;
      }
    }

    const claimedBonusData = AttendanceBonusList.find(
      (item) => item.id === attendanceBonusId,
    );

    return res.status(200).json({
      status: true,
      data: {
        id: claimedBonusData?.id || 0,
        days: claimedBonusData?.days || 0,
        bonusAmount: claimedBonusData?.bonusAmount || 0,
      },
      message: "Successfully fetched attendance bonus data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: true,
      message: error.message,
    });
  }
};

const claimAttendanceBonus = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.ATTENDANCE_BONUS, user.phone],
    );

    if (claimedRewardsRow.map((item) => item.reward_id).includes(7)) {
      return res.status(200).json({
        status: false,
        message: "You have already claimed the attendance bonus for 7 days",
      });
    }

    let attendanceBonusId = 0;

    if (claimedRewardsRow.length === 0) {
      attendanceBonusId = 1;
    } else {
      const lastClaimedReword =
        claimedRewardsRow?.[claimedRewardsRow.length - 1];
      const lastClaimedRewordTime = lastClaimedReword?.time || 0;

      let clamed_date = new Date(timerJoin(lastClaimedRewordTime));
      let todays_date = new Date(timerJoin(moment().valueOf()));
      let Difference_In_Time =  todays_date.getTime() - clamed_date.getTime();
      let Difference_In_Days =  Math.round(Difference_In_Time / (1000 * 3600 * 24));

      if (parseInt(Difference_In_Days) < 1) {
        return res.status(200).json({
          status: false,
          message: "You have already claimed the attendance bonus today",
        });
      } else if (parseInt(Difference_In_Days) >= 2) {
        attendanceBonusId = 1;
      } else {
        attendanceBonusId = lastClaimedReword.reward_id + 1;
      }
    }

    const claimedBonusData = AttendanceBonusList.find(
      (item) => item.id === attendanceBonusId,
    );

    const [rechargeTotal] = await connection.query(
      "SELECT SUM(money) AS total_recharge FROM recharge WHERE status = 1 AND phone = ?",
      [user.phone],
    );
    const totalRecharge = +rechargeTotal[0].total_recharge || 0;

    const check = totalRecharge >= claimedBonusData.requiredAmount;

    if (!check)
      return res.status(200).json({
        status: false,
        message: "Total Recharge amount doesn't met the Required Amount !",
      });

    const time = moment().valueOf();

    await connection.execute(
      "UPDATE `users` SET `money` = `money` + ?, `total_money` = `total_money` + ? WHERE `phone` = ?",
      [claimedBonusData.bonusAmount, claimedBonusData.bonusAmount, user.phone],
    );

    await connection.execute(
      "INSERT INTO `claimed_rewards` (`reward_id`, `type`, `phone`, `amount`, `status`, `time`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        claimedBonusData.id,
        REWARD_TYPES_MAP.ATTENDANCE_BONUS,
        user.phone,
        claimedBonusData.bonusAmount,
        REWARD_STATUS_TYPES_MAP.SUCCESS,
        time,
      ],
    );

    return res.status(200).json({
      status: true,
      message: `Successfully claimed attendance bonus for ${getOrdinal(claimedBonusData.days)} day`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: true,
      message: error.message,
    });
  }
};

const getAttendanceBonusRecord = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.ATTENDANCE_BONUS, user.phone],
    );

    const claimedRewardsData = claimedRewardsRow.map((claimedReward) => {
      const currentAttendanceBonus = AttendanceBonusList.find(
        (item) => item?.id === claimedReward?.reward_id,
      );
      return {
        id: claimedReward.reward_id,
        days: currentAttendanceBonus?.days || 0,
        amount: claimedReward.amount,
        status: claimedReward.status,
        time: moment.unix(claimedReward.time).format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    return res.status(200).json({
      data: claimedRewardsData,
      status: true,
      message: "Successfully fetched attendance bonus record",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: true,
      message: error.message,
    });
  }
};


const getDailyBettingeReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = moment().startOf("day").valueOf();
    const [minutes_1] = await connection.query('SELECT * FROM minutes_1 WHERE phone = ? AND `time` >= ?', [user.phone, today]);
    const [k3_bet_money] = await connection.query('SELECT * FROM result_k3 WHERE phone = ? AND `time` >= ?', [user.phone, today]);
    const [d5_bet_money] = await connection.query('SELECT * FROM result_5d WHERE phone = ? AND `time` >= ?', [user.phone, today]);
    const [trx_bet_money] = await connection.query('SELECT * FROM trx_wingo_bets WHERE phone = ? AND `time` >= ?', [user.phone, today]);
	
	    let total2 = 0;
	    let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
	
	minutes_1.forEach((data) => {
        total_w += parseFloat(data.money);
    });
    k3_bet_money.forEach((data) => {
        total_k3 += parseFloat(data.money);
    });
    d5_bet_money.forEach((data) => {
        total_5d += parseFloat(data.money);
    });
    trx_bet_money.forEach((data) => {
        total_trx += parseFloat(data.money);
    });
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d) + parseInt(total_trx);

    const todayBettingAmount = total2;

    const [claimedBettingRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ?",
      [REWARD_TYPES_MAP.DAILY_BETTING_BONUS, user.phone, today],
    );

    const dailyBetingRewordList = DailyBettingBonusList.map((item) => {
      return {
        id: item.id,
        bettingAmount: Math.min(todayBettingAmount, item.bettingAmount),
        requiredBettingAmount: item.bettingAmount,
        bonusAmount: item.bonusAmount,
        isFinished: todayBettingAmount >= item.bettingAmount,
        isClaimed: claimedBettingRow.some(
          (claimedReward) => claimedReward.reward_id === item.id,
        ),
      };
    });

    return res.status(200).json({
      data: dailyBetingRewordList,
      status: true,
      message: "Successfully fetched daily recharge bonus data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getDailyRebateReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = moment().startOf("day").valueOf();
    const [commissions] = await connection.query('SELECT SUM(`money`) as `sum` FROM commissions WHERE phone = ? AND `time` >= ? AND `level` <= 6; ', [user.phone, today]);
	  let comm_amt = 0;
    comm_amt = commissions[0].sum || 0;
	
    const todayRebateAmount = comm_amt;

    const [week_commissions] = await connection.query('SELECT SUM(`money`) as `sum` FROM commissions WHERE phone = ? AND `level` <= 6;', [user.phone]);
	  let w_comm_amt = 0;
    w_comm_amt = week_commissions[0].sum || 0;
	
    const week_RebateAmount = w_comm_amt;

    const [claimedBettingRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ?",
      [REWARD_TYPES_MAP.REBATE_BONUS, user.phone, today],
    );


    const dailyRebateRewordList = DailyRebateBonusList.map((item) => {
      return {
        id: item.id,
        bettingAmount: Math.min(todayRebateAmount, item.rebetAmount),
        requiredBettingAmount: item.rebetAmount,
        bonusAmount: todayRebateAmount,
        weeklyBetAmount:week_RebateAmount,
        isFinished: todayRebateAmount >= item.rebetAmount,
        isClaimed: claimedBettingRow.some(
          (claimedReward) => claimedReward.reward_id === item.id,
        ),
      };
    });

    return res.status(200).json({
      data: dailyRebateRewordList,
      status: true,
      message: "Successfully fetched daily recharge bonus data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


const claimDailyBettingReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;;
    const dailyBettingRewordId = req.body.claim_id;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = moment().startOf("day").valueOf();
    const [minutes_1] = await connection.query('SELECT * FROM minutes_1 WHERE phone = ? AND `time` >= ?', [user.phone, today]);
    const [k3_bet_money] = await connection.query('SELECT * FROM result_k3 WHERE phone = ? AND `time` >= ?', [user.phone, today]);
    const [d5_bet_money] = await connection.query('SELECT * FROM result_5d WHERE phone = ? AND `time` >= ?', [user.phone, today]);
    const [trx_bet_money] = await connection.query('SELECT * FROM trx_wingo_bets WHERE phone = ? AND `time` >= ?', [user.phone, today]);
	
	  let total2 = 0;
	  let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
	
	  minutes_1.forEach((data) => {
        total_w += parseFloat(data.money);
    });
    k3_bet_money.forEach((data) => {
        total_k3 += parseFloat(data.money);
    });
    d5_bet_money.forEach((data) => {
        total_5d += parseFloat(data.money);
    });
    trx_bet_money.forEach((data) => {
        total_trx += parseFloat(data.money);
    });
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d) + parseInt(total_trx);
	
    const todayBettingAmount = total2;

    const [claimedBettingRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ?",
      [REWARD_TYPES_MAP.DAILY_BETTING_BONUS, user.phone, today],
    );

    const dailyBetingRewordList = DailyBettingBonusList.map((item) => {
      return {
        id: item.id,
        bettingAmount: todayBettingAmount,
        requiredBettingAmount: item.bettingAmount,
        bonusAmount: item.bonusAmount,
        isFinished: todayBettingAmount >= item.bettingAmount,
        isClaimed: claimedBettingRow.some(
          (claimedReward) => claimedReward.reward_id === item.rechargeAmount,
        ),
      };
    });

    const claimableBonusData = dailyBetingRewordList.filter(
      (item) =>
        item.isFinished && item.bettingAmount >= item.requiredBettingAmount,
    );
    if (claimableBonusData.length === 0) {
      return res.status(200).json({
        status: false,
        message: "You does not meet the requirements to claim this reward!",
      });
    }
    const claimedBonusData = claimableBonusData?.find(
      (item) => item.id === parseInt(dailyBettingRewordId),
    );
    const [bonusList] = await connection.query(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ? AND `reward_id` = ?",
      [
        REWARD_TYPES_MAP.DAILY_BETTING_BONUS,
        user.phone,
        today,
        claimedBonusData.id,
      ],
    );
    if (bonusList.length > 0) {
      return res.status(200).json({
        status: false,
        message: "Bonus already claimed",
      });
    }
    const time = moment().valueOf();

    await connection.execute(
      "UPDATE `users` SET `money` = `money` + ?, `total_money` = `total_money` + ? WHERE `phone` = ?",
      [claimedBonusData.bonusAmount, claimedBonusData.bonusAmount, user.phone],
    );

    await connection.execute(
      "INSERT INTO `claimed_rewards` (`reward_id`, `type`, `phone`, `amount`, `status`, `time`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        claimedBonusData.id,
        REWARD_TYPES_MAP.DAILY_BETTING_BONUS,
        user.phone,
        claimedBonusData.bonusAmount,
        REWARD_STATUS_TYPES_MAP.SUCCESS,
        time,
      ],
    );

    return res.status(200).json({
      status: true,
      message: "Successfully claimed daily betting bonus",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const claimDailyRebateReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;;
    const dailyRebateRewordId = req.body.claim_id;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = moment().startOf("day").valueOf();
    const [commissions] = await connection.query('SELECT SUM(`money`) as `sum` FROM commissions WHERE phone = ? AND `time` >= ? AND `level` <= 6;', [user.phone, today]);
	  let comm_amt = 0;
    comm_amt = commissions[0].sum || 0;
	
    const todayRebateAmount = comm_amt;


    const [claimedBettingRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ?",
      [REWARD_TYPES_MAP.REBATE_BONUS, user.phone, today],
    );

    const dailyRebateRewordList = DailyRebateBonusList.map((item) => {
      return {
        id: item.id,
        bettingAmount: todayRebateAmount,
        requiredBettingAmount: item.rebetAmount,
        bonusAmount: todayRebateAmount,
        isFinished: todayRebateAmount >= item.rebetAmount,
        isClaimed: claimedBettingRow.some(
          (claimedReward) => claimedReward.reward_id === item.id,
        ),
      };
    });

    const claimableBonusData = dailyRebateRewordList.filter(
      (item) =>
        item.isFinished && item.bettingAmount >= item.requiredBettingAmount,
    );
    if (claimableBonusData.length === 0) {
      return res.status(200).json({
        status: false,
        message: "You does not meet the requirements to claim this reward!",
      });
    }
    const claimedBonusData = claimableBonusData?.find(
      (item) => item.id === parseInt(dailyRebateRewordId),
    );
    const [bonusList] = await connection.query(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ? AND `reward_id` = ?",
      [
        REWARD_TYPES_MAP.REBATE_BONUS,
        user.phone,
        today,
        claimedBonusData.id,
      ],
    );
    if (bonusList.length > 0) {
      return res.status(200).json({
        status: false,
        message: "Bonus already claimed",
      });
    }
    const time = moment().valueOf();

    await connection.execute(
      "UPDATE `users` SET `money` = `money` + ?, `total_money` = `total_money` + ? WHERE `phone` = ?",
      [claimedBonusData.bonusAmount, claimedBonusData.bonusAmount, user.phone],
    );

    await connection.execute(
      "INSERT INTO `claimed_rewards` (`reward_id`, `type`, `phone`, `amount`, `status`, `time`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        claimedBonusData.id,
        REWARD_TYPES_MAP.REBATE_BONUS,
        user.phone,
        claimedBonusData.bonusAmount,
        REWARD_STATUS_TYPES_MAP.SUCCESS,
        time,
      ],
    );

    return res.status(200).json({
      status: true,
      message: "Successfully claimed daily betting bonus",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


const dailyBetttingRewordRecord = async (req, res) => {
  try {
    const authToken = req.cookies.auth;;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.DAILY_BETTING_BONUS, user.phone],
    );

    const claimedRewardsData = claimedRewardsRow.map((claimedReward) => {
      const currentDailyBetttingReword = DailyBettingBonusList.find(
        (item) => item?.id === claimedReward?.reward_id,
      );
      return {
        id: claimedReward.reward_id,
        requireBettingAmount: currentDailyBetttingReword?.bettingAmount || 0,
        amount: claimedReward.amount,
        status: claimedReward.status,
        time: moment.unix(claimedReward.time).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
    return res.status(200).json({
      data: claimedRewardsData,
      status: true,
      message: "Successfully fetched daily recharge bonus record",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const dailyRebateRewordRecord = async (req, res) => {
  try {
    const authToken = req.cookies.auth;;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.REBATE_BONUS, user.phone],
    );
    const claimedRewardsData = claimedRewardsRow.map((claimedReward) => {
      const currentDailyBetttingReword = DailyRebateBonusList.find(
        (item) => item?.id === claimedReward?.reward_id,
      );
      return {
        id: claimedReward.reward_id,
        requireBettingAmount: currentDailyBetttingReword?.rebetAmount || 0,
        amount: claimedReward.amount,
        status: claimedReward.status,
        time: moment.unix(claimedReward.time).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
    return res.status(200).json({
      data: claimedRewardsData,
      status: true,
      message: "Successfully fetched daily recharge bonus record",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};



const getweeklyBettingeReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = moment().startOf("day").valueOf();

    const [claimedBettingRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? ",
      [REWARD_TYPES_MAP.WEEKLY_BETTING_BONUS, user.phone],
    );
    const lastClaimedReword = claimedBettingRow?.[claimedBettingRow.length - 1];
    const lastClaimedRewordTime = lastClaimedReword?.time || 0;
    let clamed_date = new Date(timerJoin(lastClaimedRewordTime));
    let todays_date = new Date(timerJoin(moment().valueOf()));
    let Difference_In_Time =  todays_date.getTime() - clamed_date.getTime();
    let Difference_In_Days =  Math.round(Difference_In_Time / (1000 * 3600 * 24));
    let total2 = 0;
	  let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    if (parseInt(Difference_In_Days) > 0) {
        const [curr_minutes_1] = await connection.query("SELECT SUM(money) AS `sum` FROM minutes_1 WHERE phone = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1);", [user.phone]);
        const [curr_k3_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_k3 WHERE phone = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1);", [user.phone]);
        const [curr_d5_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_5d WHERE phone = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1);", [user.phone]);
        const [curr_trx_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE phone = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1);", [user.phone]);
        total_w = curr_minutes_1[0].sum || 0;
        total_k3 = curr_k3_bet_money[0].sum || 0;
        total_5d = curr_d5_bet_money[0].sum || 0;
        total_trx = curr_trx_bet_money[0].sum || 0;
    }
    else{
        const [last_minutes_1] = await connection.query("SELECT SUM(money) AS `sum` FROM minutes_1 WHERE phone = ? AND `today` > current_date - interval '7' day;", [user.phone]);
        const [last_k3_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_k3 WHERE phone = ? AND `today` > current_date - interval '7' day;", [user.phone]);
        const [last_d5_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_5d WHERE phone = ? AND `today` > current_date - interval '7' day;", [user.phone]);
        const [last_trx_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE phone = ? AND `today` > current_date - interval '7' day;", [user.phone]);
        total_w = last_minutes_1[0].sum || 0;
        total_k3 = last_k3_bet_money[0].sum || 0;
        total_5d = last_d5_bet_money[0].sum || 0;
        total_trx = last_trx_bet_money[0].sum || 0;
    }
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d) + parseInt(total_trx);
    const weekBettingAmount = total2;

    const weekBetingRewordList = WeekBettingBonusList.map((item) => {

      return {
        id: item.id,
        bettingAmount: Math.min(weekBettingAmount, item.bettingAmount),
        requiredBettingAmount: item.bettingAmount,
        bonusAmount: item.bonusAmount,
        isFinished: weekBettingAmount >= item.bettingAmount,
        isClaimed: claimedBettingRow.some(
          (claimedReward) => claimedReward.reward_id === item.id,
        ),
      };
    });
    return res.status(200).json({
      data: weekBetingRewordList,
      status: true,
      message: "Successfully fetched daily betting bonus data",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

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


const claimWeeklyBettingReword = async (req, res) => {
  try {
    const authToken = req.cookies.auth;;
    //const authToken = "5O3Bzs-TIZvFz5wfy7CG47mf7iZ-rXW6oS7XJxMpcE4";
    const weeklyBettingRewordId = req.body.claim_id;
    //const weeklyBettingRewordId = 1;

    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const today = moment().startOf("day").valueOf();
    
    const [claimedBettingRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ?",
      [REWARD_TYPES_MAP.WEEKLY_BETTING_BONUS, user.phone, today],
    );

    let total2 = 0;
	  let total_w = 0;
    let total_k3 = 0;
    let total_5d = 0;
    let total_trx = 0;
    if (claimedBettingRow.length > 0) {
        const [curr_minutes_1] = await connection.query("SELECT SUM(money) AS `sum` FROM minutes_1 WHERE phone = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1);", [user.phone]);
        const [curr_k3_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_k3 WHERE phone = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1);", [user.phone]);
        const [curr_d5_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_5d WHERE phone = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1);", [user.phone]);
        const [curr_trx_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE phone = ? AND YEARWEEK(`today`, 1) = YEARWEEK(CURDATE(), 1);", [user.phone]);
        total_w = curr_minutes_1[0].sum || 0;
        total_k3 = curr_k3_bet_money[0].sum || 0;
        total_5d = curr_d5_bet_money[0].sum || 0;
        total_trx = curr_trx_bet_money[0].sum || 0;
    }
    else{
        const [last_minutes_1] = await connection.query("SELECT SUM(money) AS `sum` FROM minutes_1 WHERE phone = ? AND `today` > current_date - interval '7' day;", [user.phone]);
        const [last_k3_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_k3 WHERE phone = ? AND `today` > current_date - interval '7' day;", [user.phone]);
        const [last_d5_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM result_5d WHERE phone = ? AND `today` > current_date - interval '7' day;", [user.phone]);
        const [last_trx_bet_money] = await connection.query("SELECT SUM(money) AS `sum` FROM trx_wingo_bets WHERE phone = ? AND `today` > current_date - interval '7' day;", [user.phone]);
        total_w = last_minutes_1[0].sum || 0;
        total_k3 = last_k3_bet_money[0].sum || 0;
        total_5d = last_d5_bet_money[0].sum || 0;
        total_trx = last_trx_bet_money[0].sum || 0;
    }
    
    total2 += parseInt(total_w) + parseInt(total_k3) + parseInt(total_5d) + parseInt(total_trx);
	
    const weekBettingAmount = total2;

    const weekBetingRewordList = WeekBettingBonusList.map((item) => {
      return {
        id: item.id,
        bettingAmount: Math.min(weekBettingAmount, item.bettingAmount),
        requiredBettingAmount: item.bettingAmount,
        bonusAmount: item.bonusAmount,
        isFinished: weekBettingAmount >= item.bettingAmount,
        isClaimed: claimedBettingRow.some(
          (claimedReward) => claimedReward.reward_id === item.id,
        ),
      };
    });

    const claimableBonusData = weekBetingRewordList.filter(
      (item) =>
        item.isFinished && item.bettingAmount >= item.requiredBettingAmount,
    );
    if (claimableBonusData.length === 0) {
      return res.status(200).json({
        status: false,
        message: "You does not meet the requirements to claim this reward!",
      });
    }
    const claimedBonusData = claimableBonusData?.find(
      (item) => item.id === parseInt(weeklyBettingRewordId),
    );
    const [bonusList] = await connection.query(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ? AND `time` >= ? AND `reward_id` = ?",
      [
        REWARD_TYPES_MAP.WEEKLY_BETTING_BONUS,
        user.phone,
        today,
        claimedBonusData.id,
      ],
    );
    if (bonusList.length > 0) {
      return res.status(200).json({
        status: false,
        message: "Bonus already claimed",
      });
    }
    const time = moment().valueOf();

    await connection.execute(
      "UPDATE `users` SET `money` = `money` + ?, `total_money` = `total_money` + ? WHERE `phone` = ?",
      [claimedBonusData.bonusAmount, claimedBonusData.bonusAmount, user.phone],
    );

    await connection.execute(
      "INSERT INTO `claimed_rewards` (`reward_id`, `type`, `phone`, `amount`, `status`, `time`) VALUES (?, ?, ?, ?, ?, ?)",
      [
        claimedBonusData.id,
        REWARD_TYPES_MAP.WEEKLY_BETTING_BONUS,
        user.phone,
        claimedBonusData.bonusAmount,
        REWARD_STATUS_TYPES_MAP.SUCCESS,
        time,
      ],
    );

    return res.status(200).json({
      status: true,
      message: "Successfully claimed weekly betting bonus",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const weeklyBetttingRewordRecord = async (req, res) => {
  try {
    const authToken = req.cookies.auth;
    const [userRow] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ? AND `veri` = 1",
      [authToken],
    );
    const user = userRow?.[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [claimedRewardsRow] = await connection.execute(
      "SELECT * FROM `claimed_rewards` WHERE `type` = ? AND `phone` = ?",
      [REWARD_TYPES_MAP.WEEKLY_BETTING_BONUS, user.phone],
    );

    const claimedRewardsData = claimedRewardsRow.map((claimedReward) => {
      const currentDailyBetttingReword = WeekBettingBonusList.find(
        (item) => item?.id === claimedReward?.reward_id,
      );
      return {
        id: claimedReward.reward_id,
        requireBettingAmount: currentDailyBetttingReword?.bettingAmount || 0,
        amount: claimedReward.amount,
        status: claimedReward.status,
        time: moment.unix(claimedReward.time).format("YYYY-MM-DD HH:mm:ss"),
      };
    });
    return res.status(200).json({
      data: claimedRewardsData,
      status: true,
      message: "Successfully fetched weekly betting bonus record",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


const addonstake = async (req, res) => {
  const authToken = req.cookies.auth;
  let stack_amt = req.body.stack_amt;
  let stack_period = req.body.stack_period;
  let stack_monthly_roi = req.body.stack_monthly_roi;
  let stack_yealy_roi = req.body.stack_yealy_roi;
  if (!stack_amt && !stack_period ) {
      return res.status(200).json({
          message: 'Failed',
          status: false,
          timeStamp: timeNow,
      })
  }
  const [userRow] = await connection.execute(
    "SELECT `phone`,`money` FROM `users` WHERE `token` = ? AND `veri` = 1",
    [authToken],
  );
  const user = userRow?.[0];

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  var rewardid_bonus = '';
  if(parseInt(stack_period) < 3)
  {
    rewardid_bonus = REWARD_TYPES_MAP.ROI_STAKE_1;
  }
  else if(parseInt(stack_period) < 6)
  {
    rewardid_bonus = REWARD_TYPES_MAP.ROI_STAKE_3;
  }
  else if(parseInt(stack_period) < 9)
  {
    rewardid_bonus = REWARD_TYPES_MAP.ROI_STAKE_6; 
  }
  else
  {
    rewardid_bonus = REWARD_TYPES_MAP.ROI_STAKE_12;
  }

  if (user.money - stack_amt >= 0) {
    let date = new Date();
    let checkTime = timerJoin(date.getTime());
    var toDate = new Date(new Date(date).setMonth(date.getMonth() + parseInt(stack_period)));
    let checkTime2 = timerJoin(toDate.getTime());
    await connection.execute(
      "INSERT INTO `claimed_rewards` (`reward_id`, `type`, `phone`, `amount`, `status`, `time`, `stake_amnt`, `from_date`, `to_date`) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?)",
      [
        parseInt("136"),
        rewardid_bonus,
        user.phone,
        stack_yealy_roi,
        2,
        timeNow,
        stack_amt,
        checkTime,
        checkTime2
      ],
      await connection.query('UPDATE users SET money = money - ? WHERE phone = ? ', [parseFloat(stack_amt).toFixed(4).toString(), user.phone])
    );
    return res.status(200).json({
      status: true,
      message: "Successfully raised stake",
    });
  }
  else
  {
    return res.status(200).json({
      message: 'The balance is not enough to fulfill the request',
      status: false,
      timeStamp: timeNow,
  });
  }
}

const getstakedetails = async (req, res) => {
  const authToken = req.cookies.auth;

  const [userRow] = await connection.execute(
    "SELECT `phone`,`money` FROM `users` WHERE `token` = ? AND `veri` = 1",
    [authToken],
  );
  const user = userRow?.[0];

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const [row_1] = await connection.execute(
    "SELECT phone AS phone FROM `claimed_rewards` where `reward_id` = 136 GROUP BY phone;"
  );
  const stakeusers = row_1.length || 0;

  const [[row_2]] = await connection.execute(
    "SELECT SUM(stake_amnt) AS `sum` FROM `claimed_rewards` WHERE `reward_id` = 136;"
  );
  const stakeamount = row_2.sum || 0;

  const [[row_3]] = await connection.execute(
    "SELECT SUM(amount) AS `sum` FROM `claimed_rewards` WHERE `reward_id` = 136 AND status = 1;"
  );
  const stakerewards =  row_3.sum || 0;

  const [userstackes] = await connection.query('SELECT * FROM claimed_rewards WHERE `phone` = ? AND `reward_id` = 136 ', [user.phone]);
  const [useractivestakes] = await connection.query('SELECT * FROM claimed_rewards WHERE status = 2 AND `phone` = ? AND `reward_id` = 136 ', [user.phone]);
  return res.status(200).json({
    message: 'Success',
    status: true,
    totalstakes : stakeamount,
    totalstakeusers : stakeusers,
    totalclaimedrewards : stakerewards,
    userstakedetails : userstackes,
    useractivestakes: useractivestakes,
  });
}


const promotionController = {
  subordinatesDataAPI,
  subordinatesAPI,
  getInvitationBonus,
  claimInvitationBonus,
  getInvitedMembers,
  getDailyRechargeReword,
  claimDailyRechargeReword,
  dailyRechargeRewordRecord,
  getFirstRechargeRewords,
  claimFirstRechargeReword,
  claimAttendanceBonus,
  getAttendanceBonusRecord,
  getAttendanceBonus,
  subordinatesDataByTimeAPI,
  getDailyBettingeReword,
  claimDailyBettingReword,
  dailyBetttingRewordRecord,
  getweeklyBettingeReword,
  claimWeeklyBettingReword,
  weeklyBetttingRewordRecord,
  addonstake,
  getstakedetails,
  claimDailyRebateReword,
  dailyRebateRewordRecord,
  getDailyRebateReword,
};

export default promotionController;


