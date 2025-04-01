-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2025 at 05:31 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `only_schema_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `wingo1` text NOT NULL DEFAULT '-1',
  `wingo3` text NOT NULL DEFAULT '-1',
  `wingo5` text NOT NULL DEFAULT '-1',
  `wingo10` text NOT NULL DEFAULT '-1',
  `k5d` text NOT NULL DEFAULT '\'-1\'',
  `k5d3` text NOT NULL DEFAULT '\'-1\'',
  `k5d5` text DEFAULT '\'-1\'',
  `k5d10` text NOT NULL DEFAULT '\'-1\'',
  `k3d` text NOT NULL DEFAULT '\'-1\'',
  `k3d3` text NOT NULL DEFAULT '\'-1\'',
  `k3d5` text NOT NULL DEFAULT '\'-1\'',
  `k3d10` text NOT NULL DEFAULT '\'-1\'',
  `win_rate` int(11) NOT NULL DEFAULT 0,
  `telegram` varchar(100) NOT NULL DEFAULT '0',
  `cskh` varchar(100) NOT NULL DEFAULT '0',
  `app` text DEFAULT '0',
  `recharge_bonus` int(11) DEFAULT NULL,
  `recharge_bonus_2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



CREATE TABLE `balance_transfer` (
  `id` int(11) NOT NULL,
  `sender_phone` bigint(255) NOT NULL,
  `receiver_phone` bigint(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bank_recharge`
--

CREATE TABLE `bank_recharge` (
  `id` int(11) NOT NULL,
  `name_bank` varchar(50) NOT NULL DEFAULT '0',
  `name_user` varchar(100) NOT NULL DEFAULT '0',
  `stk` varchar(100) NOT NULL DEFAULT '0',
  `qr_code_image` varchar(255) NOT NULL,
  `upi_wallet` varchar(255) NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'bank',
  `time` varchar(30) NOT NULL DEFAULT '0',
  `transfer_mode` varchar(200) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `colloborator_action` varchar(20) DEFAULT NULL
)  ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `claimed_rewards` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `phone` varchar(15) NOT NULL,
  `reward_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `amount` float NOT NULL,
  `status` int(11) NOT NULL,
  `time` varchar(30) NOT NULL,
  `stake_amnt` varchar(200) DEFAULT NULL,
  `from_date` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `to_date` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `commissions` (
  `id` int(11) NOT NULL,
  `commission_id` varchar(50) DEFAULT NULL,
  `phone` varchar(15) NOT NULL,
  `from_user_phone` varchar(15) NOT NULL,
  `money` decimal(10,2) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;



CREATE TABLE `crashbetrecord` (
  `id` int(11) NOT NULL,
  `username` varchar(211) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` varchar(211) NOT NULL DEFAULT 'pending',
  `winpoint` float NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `d5`
--

CREATE TABLE `d5` (
  `id` int(11) NOT NULL,
  `period` bigint(20) DEFAULT 0,
  `result` varchar(5) NOT NULL DEFAULT '0',
  `game` int(11) NOT NULL DEFAULT 1,
  `status` int(11) DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `financial_details` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `phone_used` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `type` varchar(50) NOT NULL DEFAULT '0',
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `k3`
--

CREATE TABLE `k3` (
  `id` int(11) NOT NULL,
  `period` bigint(20) NOT NULL DEFAULT 0,
  `result` int(11) NOT NULL,
  `game` int(11) NOT NULL DEFAULT 1,
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(100) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `level` (
  `id` int(11) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  `f1` varchar(50) NOT NULL,
  `f2` varchar(50) NOT NULL,
  `f3` varchar(50) NOT NULL,
  `f4` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



CREATE TABLE `minutes_1` (
  `id` int(11) NOT NULL,
  `id_product` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(20) NOT NULL DEFAULT '0',
  `code` varchar(30) NOT NULL DEFAULT '0',
  `invite` varchar(30) NOT NULL DEFAULT '0',
  `stage` varchar(255) NOT NULL DEFAULT '0',
  `result` int(11) NOT NULL DEFAULT 0,
  `more` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 0,
  `money` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `fee` int(11) NOT NULL DEFAULT 0,
  `get` int(11) NOT NULL DEFAULT 0,
  `game` varchar(50) NOT NULL DEFAULT '0',
  `bet` varchar(10) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` varchar(50) NOT NULL DEFAULT '0',
  `time` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `recipient` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `transaction_id` varchar(200) DEFAULT NULL,
  `datetime` datetime DEFAULT current_timestamp(),
  `isread` int(1) DEFAULT NULL,
  `noti_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `point_list` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `telegram` varchar(100) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `money_us` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 0,
  `total1` int(11) NOT NULL DEFAULT 20,
  `total2` int(11) NOT NULL DEFAULT 50,
  `total3` int(11) NOT NULL DEFAULT 150,
  `total4` int(11) NOT NULL DEFAULT 350,
  `total5` int(11) NOT NULL DEFAULT 850,
  `total6` int(11) NOT NULL DEFAULT 5000,
  `total7` int(11) NOT NULL DEFAULT 18050,
  `total8` int(11) NOT NULL DEFAULT 20000
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



CREATE TABLE `recharge` (
  `id` int(11) NOT NULL,
  `id_order` varchar(100) NOT NULL DEFAULT '0',
  `transaction_id` varchar(100) DEFAULT '0',
  `utr` bigint(255) DEFAULT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `type` varchar(10) NOT NULL DEFAULT 'bank',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` varchar(50) NOT NULL DEFAULT '0',
  `url` varchar(255) DEFAULT NULL,
  `time` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



CREATE TABLE `redenvelopes` (
  `id` int(11) NOT NULL,
  `id_redenvelope` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `used` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



CREATE TABLE `redenvelopes_used` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `phone_used` varchar(50) NOT NULL DEFAULT '0',
  `id_redenvelops` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `result_5d` (
  `id` int(11) NOT NULL,
  `id_product` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(20) DEFAULT '0',
  `code` varchar(30) NOT NULL DEFAULT '0',
  `invite` varchar(30) NOT NULL DEFAULT '0',
  `stage` bigint(20) DEFAULT 0,
  `result` varchar(5) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT 0,
  `money` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `fee` int(11) NOT NULL DEFAULT 0,
  `get` int(11) NOT NULL DEFAULT 0,
  `game` int(11) NOT NULL,
  `join_bet` varchar(10) NOT NULL DEFAULT '0',
  `bet` varchar(20) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0',
  `today` varchar(50) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `result_k3` (
  `id` int(11) NOT NULL,
  `id_product` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `code` varchar(50) NOT NULL DEFAULT '0',
  `invite` varchar(50) NOT NULL DEFAULT '0',
  `stage` varchar(50) NOT NULL DEFAULT '0',
  `result` varchar(5) NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT 0,
  `money` int(11) NOT NULL DEFAULT 0,
  `price` int(11) NOT NULL DEFAULT 0,
  `amount` int(11) NOT NULL DEFAULT 0,
  `fee` int(11) NOT NULL DEFAULT 0,
  `get` int(11) NOT NULL DEFAULT 0,
  `game` varchar(5) NOT NULL DEFAULT '0',
  `join_bet` varchar(100) NOT NULL DEFAULT '0',
  `typeGame` varchar(100) NOT NULL DEFAULT '0',
  `bet` varchar(100) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) NOT NULL DEFAULT '0',
  `today` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `roses` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) DEFAULT '0',
  `code` varchar(50) NOT NULL DEFAULT '0',
  `invite` varchar(50) NOT NULL DEFAULT '0',
  `f1` int(11) NOT NULL DEFAULT 0,
  `f2` int(11) NOT NULL DEFAULT 0,
  `f3` int(11) NOT NULL DEFAULT 0,
  `f4` int(11) NOT NULL DEFAULT 0,
  `time` varchar(50) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



CREATE TABLE `salary` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `amount` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `time` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;



CREATE TABLE `trx_wingo_bets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_product` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(20) NOT NULL DEFAULT '0',
  `code` varchar(30) NOT NULL DEFAULT '0',
  `invite` varchar(30) NOT NULL DEFAULT '0',
  `stage` varchar(255) NOT NULL DEFAULT '0',
  `result` int(11) NOT NULL DEFAULT 0,
  `more` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 0,
  `money` float NOT NULL DEFAULT 0,
  `amount` float NOT NULL DEFAULT 0,
  `fee` float NOT NULL DEFAULT 0,
  `get` float NOT NULL DEFAULT 0,
  `game` varchar(50) NOT NULL DEFAULT '0',
  `bet` varchar(10) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` varchar(50) NOT NULL DEFAULT '0',
  `time` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `trx_wingo_game` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `period` varchar(255) NOT NULL,
  `result` int(11) NOT NULL,
  `game` varchar(20) NOT NULL,
  `status` int(11) NOT NULL,
  `release_status` int(11) NOT NULL DEFAULT 0,
  `block_id` int(11) NOT NULL,
  `block_time` varchar(30) NOT NULL,
  `hash` text NOT NULL,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `turn_over` (
  `id` int(11) NOT NULL,
  `phone` varchar(250) NOT NULL,
  `code` varchar(250) NOT NULL,
  `invite` varchar(250) NOT NULL,
  `daily_turn_over` decimal(20,2) NOT NULL DEFAULT 0.00,
  `total_turn_over` decimal(20,2) NOT NULL DEFAULT 0.00,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `id_user` varchar(50) NOT NULL DEFAULT '0',
  `phone` varchar(20) NOT NULL DEFAULT '0',
  `token` varchar(100) NOT NULL DEFAULT '0',
  `name_user` varchar(50) NOT NULL DEFAULT '0',
  `password` varchar(50) NOT NULL DEFAULT '0',
  `plain_password` varchar(250) DEFAULT NULL,
  `money` int(11) NOT NULL DEFAULT 0,
  `total_money` int(11) NOT NULL DEFAULT 0,
  `roses_f1` int(11) NOT NULL DEFAULT 0,
  `roses_f` int(11) NOT NULL DEFAULT 0,
  `roses_today` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 0,
  `rank` int(11) NOT NULL DEFAULT 0,
  `code` varchar(30) NOT NULL DEFAULT '0',
  `invite` varchar(30) NOT NULL DEFAULT '0',
  `ctv` varchar(50) NOT NULL DEFAULT '0',
  `veri` int(11) NOT NULL DEFAULT 0,
  `otp` varchar(10) NOT NULL DEFAULT '0',
  `ip_address` varchar(50) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` datetime NOT NULL DEFAULT current_timestamp(),
  `time` varchar(50) NOT NULL DEFAULT '0',
  `time_otp` varchar(50) NOT NULL DEFAULT '0',
  `user_level` int(11) DEFAULT 0,
  `transfer_mode` varchar(200) DEFAULT NULL,
  `dial_code` varchar(20) NOT NULL DEFAULT '+91',
  `avatar` varchar(50) DEFAULT '3-abfcc056.png',
  `lang_code` varchar(20) NOT NULL DEFAULT 'en',
  `vip_level` varchar(20) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `user_bank` (
  `id` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `name_bank` varchar(100) NOT NULL DEFAULT '0',
  `name_user` varchar(100) DEFAULT '0',
  `stk` varchar(100) NOT NULL DEFAULT '0',
  `tp` varchar(100) NOT NULL DEFAULT '0',
  `email` varchar(100) NOT NULL DEFAULT '0',
  `sdt` varchar(20) DEFAULT '0',
  `tinh` varchar(100) NOT NULL DEFAULT '0',
  `chi_nhanh` varchar(100) NOT NULL DEFAULT '0',
  `time` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `wingo` (
  `id` int(11) NOT NULL,
  `period` varchar(100) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `game` varchar(10) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE `withdraw` (
  `id` int(11) NOT NULL,
  `id_order` varchar(100) NOT NULL DEFAULT '0',
  `phone` varchar(50) NOT NULL DEFAULT '0',
  `money` int(11) NOT NULL DEFAULT 0,
  `stk` varchar(100) NOT NULL DEFAULT '0',
  `name_bank` varchar(100) NOT NULL DEFAULT '0',
  `name_user` varchar(100) NOT NULL DEFAULT '0',
  `ifsc` varchar(255) NOT NULL,
  `sdt` varchar(255) NOT NULL DEFAULT '0',
  `tp` varchar(211) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT 0,
  `today` varchar(50) NOT NULL DEFAULT '0',
  `time` varchar(30) NOT NULL DEFAULT '0',
  `type` varchar(100) DEFAULT NULL,
  `with_type` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `evtslog` (
  `id` int(11) NOT NULL,
  `evtName` varchar(20) NOT NULL,
  `step` int(11) NOT NULL,
  `debugMsg` varchar(1000) NOT NULL,
  `dtWhenLogged` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


ALTER TABLE `evtslog`
  ADD PRIMARY KEY (`id`);



ALTER TABLE `evtslog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=330;
COMMIT;

ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `balance_transfer`
--
ALTER TABLE `balance_transfer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_recharge`
--
ALTER TABLE `bank_recharge`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `claimed_rewards`
--
ALTER TABLE `claimed_rewards`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `commissions`
--
ALTER TABLE `commissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `commission_id` (`commission_id`);

--
-- Indexes for table `crashbetrecord`
--
ALTER TABLE `crashbetrecord`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `d5`
--
ALTER TABLE `d5`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `financial_details`
--
ALTER TABLE `financial_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `k3`
--
ALTER TABLE `k3`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `minutes_1`
--
ALTER TABLE `minutes_1`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foreign_key_user` (`recipient`);

--
-- Indexes for table `point_list`
--
ALTER TABLE `point_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recharge`
--
ALTER TABLE `recharge`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `redenvelopes`
--
ALTER TABLE `redenvelopes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `redenvelopes_used`
--
ALTER TABLE `redenvelopes_used`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `result_5d`
--
ALTER TABLE `result_5d`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `result_k3`
--
ALTER TABLE `result_k3`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roses`
--
ALTER TABLE `roses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary`
--
ALTER TABLE `salary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trx_wingo_bets`
--
ALTER TABLE `trx_wingo_bets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `INDEX_RGRA` (`bet`,`status`,`game`),
  ADD KEY `INDEX_C0R6` (`phone`);

--
-- Indexes for table `trx_wingo_game`
--
ALTER TABLE `trx_wingo_game`
  ADD PRIMARY KEY (`id`),
  ADD KEY `INDEX_1ZQ1` (`id`,`game`,`status`,`release_status`),
  ADD KEY `INDEX_XXBM` (`id`,`game`,`status`),
  ADD KEY `INDEX_N61B` (`period`,`game`);

--
-- Indexes for table `turn_over`
--
ALTER TABLE `turn_over`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_bank`
--
ALTER TABLE `user_bank`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wingo`
--
ALTER TABLE `wingo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `withdraw`
--
ALTER TABLE `withdraw`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `balance_transfer`
--
ALTER TABLE `balance_transfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `bank_recharge`
--
ALTER TABLE `bank_recharge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

--
-- AUTO_INCREMENT for table `claimed_rewards`
--
ALTER TABLE `claimed_rewards`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2433;

--
-- AUTO_INCREMENT for table `commissions`
--
ALTER TABLE `commissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78127;

--
-- AUTO_INCREMENT for table `crashbetrecord`
--
ALTER TABLE `crashbetrecord`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=216;

--
-- AUTO_INCREMENT for table `d5`
--
ALTER TABLE `d5`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=408258;

--
-- AUTO_INCREMENT for table `financial_details`
--
ALTER TABLE `financial_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `k3`
--
ALTER TABLE `k3`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=405191;

--
-- AUTO_INCREMENT for table `level`
--
ALTER TABLE `level`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `minutes_1`
--
ALTER TABLE `minutes_1`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2374;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=406;

--
-- AUTO_INCREMENT for table `point_list`
--
ALTER TABLE `point_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=407;

--
-- AUTO_INCREMENT for table `recharge`
--
ALTER TABLE `recharge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=515;

--
-- AUTO_INCREMENT for table `redenvelopes`
--
ALTER TABLE `redenvelopes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `redenvelopes_used`
--
ALTER TABLE `redenvelopes_used`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `result_5d`
--
ALTER TABLE `result_5d`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=692;

--
-- AUTO_INCREMENT for table `result_k3`
--
ALTER TABLE `result_k3`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=955;

--
-- AUTO_INCREMENT for table `roses`
--
ALTER TABLE `roses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2064;

--
-- AUTO_INCREMENT for table `salary`
--
ALTER TABLE `salary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `trx_wingo_bets`
--
ALTER TABLE `trx_wingo_bets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7149;

--
-- AUTO_INCREMENT for table `trx_wingo_game`
--
ALTER TABLE `trx_wingo_game`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63723;

--
-- AUTO_INCREMENT for table `turn_over`
--
ALTER TABLE `turn_over`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=807;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=520;

--
-- AUTO_INCREMENT for table `user_bank`
--
ALTER TABLE `user_bank`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `wingo`
--
ALTER TABLE `wingo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=410291;

--
-- AUTO_INCREMENT for table `withdraw`
--
ALTER TABLE `withdraw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `foreign_key_user` FOREIGN KEY (`recipient`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;


ALTER TABLE `bank_recharge` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT, add PRIMARY KEY (`id`);

ALTER TABLE `bank_recharge` ADD `status` INT(10) NOT NULL DEFAULT '0';

ALTER TABLE `recharge` ADD `redirect_to` VARCHAR(100) NULL DEFAULT NULL;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO `wingo` (`id`, `period`, `amount`, `game`, `status`, `time`) VALUES
(403507, '20250308021147', 5, 'wingo3', 1, '1741440961123'),
(403508, '20250308011147', 0, 'wingo', 1, '1741440961133'),
(403509, '20250308011148', 7, 'wingo', 1, '1741441021519'),
(403510, '20250308011149', 3, 'wingo', 1, '1741441081134'),
(403511, '20250308021150', 9, 'wingo3', 1, '1741441141465'),
(403512, '20250308011150', 9, 'wingo', 1, '1741441141534'),
(403513, '20250308011151', 4, 'wingo', 1, '1741441201008'),
(403514, '20250308041151', 9, 'wingo10', 1, '1741441201021'),
(403515, '20250308031151', 4, 'wingo5', 1, '1741441201058'),
(403516, '20250308011152', 4, 'wingo', 1, '1741441261421'),
(403517, '20250308011153', 2, 'wingo', 1, '1741441320839'),
(403518, '20250308021153', 3, 'wingo3', 1, '1741441320976'),
(403519, '20250308011154', 7, 'wingo', 1, '1741441381263'),
(403520, '20250308011155', 0, 'wingo', 1, '1741441441842'),
(403521, '20250308011156', 6, 'wingo', 1, '1741441501081'),
(403522, '20250308021156', 0, 'wingo3', 1, '1741441501704'),
(403523, '20250308031156', 1, 'wingo5', 1, '1741441501730'),
(403524, '20250308011157', 7, 'wingo', 1, '1741441561522'),
(403525, '20250308011158', 1, 'wingo', 1, '1741441621072'),
(403526, '20250308021159', 0, 'wingo3', 0, '1741441680729'),
(403527, '20250308011159', 6, 'wingo', 1, '1741441681356'),
(403528, '20250308011160', 1, 'wingo', 1, '1741441741218'),
(403529, '20250308041161', 0, 'wingo10', 0, '1741441800695'),
(403530, '20250308011161', 0, 'wingo', 0, '1741441800702'),
(403531, '20250308031161', 0, 'wingo5', 0, '1741441800842');

INSERT INTO `d5` (`id`, `period`, `result`, `game`, `status`, `time`) VALUES
(401634, 20250308071151, '48472', 5, 1, '1741441201080'),
(401635, 20250308051152, '50576', 1, 1, '1741441261450'),
(401636, 20250308051153, '57739', 1, 1, '1741441320875'),
(401637, 20250308061153, '84816', 3, 1, '1741441321007'),
(401638, 20250308051154, '92687', 1, 1, '1741441381290'),
(401639, 20250308051155, '98705', 1, 1, '1741441441859'),
(401640, 20250308051156, '80758', 1, 1, '1741441501115'),
(401641, 20250308061156, '51018', 3, 1, '1741441501725'),
(401642, 20250308071156, '38380', 5, 1, '1741441501750'),
(401643, 20250308051157, '91144', 1, 1, '1741441561551'),
(401644, 20250308051158, '65650', 1, 1, '1741441621102'),
(401645, 20250308061159, '69947', 3, 1, '1741441680757'),
(401646, 20250308051159, '67311', 1, 1, '1741441681387'),
(401647, 20250308051160, '95879', 1, 1, '1741441741235'),
(401648, 20250308081161, '0', 10, 0, '1741441800719'),
(401649, 20250308051161, '96730', 1, 1, '1741441800730'),
(401650, 20250308071161, '85939', 5, 1, '1741441800884'),
(401651, 20250308051162, '41096', 1, 1, '1741441861190'),
(401652, 20250308061162, '59574', 3, 1, '1741441861208'),
(401653, 20250308051163, '17348', 1, 1, '1741441922048'),
(401654, 20250308051164, '14396', 1, 1, '1741441981139'),
(401655, 20250308061165, '0', 3, 0, '1741442041728'),
(401656, 20250308051165, '62064', 1, 1, '1741442041744'),
(401657, 20250308051166, '0', 1, 0, '1741442101122'),
(401658, 20250308071166, '0', 5, 0, '1741442101221');

INSERT INTO `k3` (`id`, `period`, `result`, `game`, `status`, `time`) VALUES

(77536, 20250301050974, 665, 1, 1, '1740825781310'),
(77537, 20250301050975, 223, 1, 1, '1740825840795'),
(77538, 20250301050976, 342, 1, 1, '1740825901801'),
(77539, 20250301070976, 123, 5, 1, '1740825901805'),
(77540, 20250301060976, 316, 3, 1, '1740825901809'),
(77541, 20250301050977, 425, 1, 1, '1740825960962'),
(77542, 20250301050978, 336, 1, 1, '1740826021462'),
(77543, 20250301050979, 422, 1, 1, '1740826080891'),
(77544, 20250301060979, 655, 3, 1, '1740826080898'),
(77545, 20250301050980, 465, 1, 1, '1740826141649'),
(77546, 20250301070981, 426, 5, 1, '1740826201524'),
(77547, 20250301050981, 333, 1, 1, '1740826201535'),
(77548, 20250301080981, 0, 10, 0, '1740826201552'),
(77549, 20250301050982, 643, 1, 1, '1740826260730'),
(77550, 20250301060982, 311, 3, 1, '1740826260734'),
(77551, 20250301050983, 343, 1, 1, '1740826321263'),
(77552, 20250301050984, 461, 1, 1, '1740826380808'),
(77553, 20250301050985, 332, 1, 1, '1740826441359'),
(77554, 20250301060985, 224, 3, 1, '1740826441470'),
(77555, 20250301050986, 111, 1, 1, '1740826500690'),
(77556, 20250301070986, 0, 5, 0, '1740826501017'),
(77557, 20250301050987, 232, 1, 1, '1740826561158'),
(77558, 20250301050988, 644, 1, 1, '1740826620619'),
(77559, 20250301060988, 0, 3, 0, '1740826620680'),
(77560, 20250301050989, 0, 1, 0, '1740826681486');


INSERT INTO `users` ( `id_user`, `phone`, `token`, `name_user`, `password`, `plain_password`, `money`, `total_money`, `roses_f1`, `roses_f`, `roses_today`, `level`, `rank`, `code`, `invite`, `ctv`, `veri`, `otp`, `ip_address`, `status`, `today`, `time`, `time_otp`, `user_level`, `transfer_mode`, `dial_code`, `avatar`, `lang_code`, `vip_level`) VALUES
('26289', '8895203112', '4970b11f84c8526c8aa539fd0848e82d', 'binod', 'e10adc3949ba59abbe56e057f20f883e', 'golu8953', 0, 0, 0, 0, 0, 1, 1, 'uVxnY75353', 'SUTFD37284', '000000', 1, '240108', '78', 1, '2024-02-25 18:41:52', '1708886512413', '0', 1, 'manual', '+91', '3-abfcc056.png', 'en', '1');

INSERT INTO `point_list` ( `phone`, `telegram`, `money`, `money_us`, `level`, `total1`, `total2`, `total3`, `total4`, `total5`, `total6`, `total7`, `total8`) VALUES
('8895203112', '0', 0, 0, 0, 5, 10, 15, 25, 20, 30, 35, 6000);

INSERT INTO `admin` (`id`, `wingo1`, `wingo3`, `wingo5`, `wingo10`, `k5d`, `k5d3`, `k5d5`, `k5d10`, `k3d`, `k3d3`, `k3d5`, `k3d10`, `win_rate`, `telegram`, `cskh`, `app`, `recharge_bonus`, `recharge_bonus_2`) VALUES
(1, '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', 1, '6', '6294803606', 'https://t.me', NULL, NULL);


INSERT INTO `level` (`id`, `level`, `f1`, `f2`, `f3`, `f4`) VALUES
(0, 0, '2', '1', '1', '1'),
(1, 1, '0.25', '0.25', '0.25', '0.25'),
(2, 2, '0.25', '0.25', '0.25', '0.25'),
(3, 3, '0.25', '0.25', '0.25', '0.25'),
(4, 4, '0.25', '0.25', '0.25', '0.25'),
(5, 5, '0.25', '0.25', '0.25', '0.25'),
(6, 6, '0.25', '0.25', '0.25', '0.25'),
(7, 7, '0.25', '0.25', '0.25', '0.25'),
(8, 8, '0.25', '0.25', '0.25', '0.25'),
(9, 9, '0.25', '0.25', '0.25', '0.25'),
(10, 10, '0.5', '0.5', '0.5', '0.5'),
(11, 11, '0.5', '0.5', '0.5', '0.5'),
(12, 12, '0.5', '0.5', '0.5', '0.5'),
(13, 13, '0.5', '0.5', '0.5', '0.5'),
(14, 14, '0.5', '0.5', '0.5', '0.5');


INSERT INTO `bank_recharge`( `name_bank`, `name_user`, `stk`, `qr_code_image`, `type`, `time`, `transfer_mode`, `phone`, `colloborator_action`) VALUES ('','','','','','','manual','8895203112','off');


INSERT INTO `turn_over` ( `phone`, `code`, `invite`, `daily_turn_over`, `total_turn_over`, `date_time`) VALUES
('8895203112', 'uVxnY75353', 'SUTFD37284', 0.00, 0.00, '2025-01-21 11:32:59');


DROP EVENT IF EXISTS release_stack;

DELIMITER @@;

CREATE EVENT release_stack
ON SCHEDULE every 1 day
starts current_date + interval 1 day + interval 1 minute -- starts tomorrow at 00:01
DO
BEGIN

 
	INSERT INTO `evtslog` (`evtName`, `step`, `debugMsg`, `dtWhenLogged`) VALUES
	('testing', 1, 'Event Fired', now());
	
	SELECT @stake_amnt:=amount , @user_phone:=phone, @user_date:=to_date  FROM claimed_rewards WHERE DATE(to_date) = CURDATE() AND status=2;
	
	update users set money = money + ROUND(@stake_amnt) , total_money = total_money + ROUND(@stake_amnt)  where phone = @user_phone;
	
	update claimed_rewards SET status=1 WHERE to_date = @user_date AND status=2 AND phone = @user_phone AND reward_id = 136;
	
	INSERT INTO `evtslog` (`evtName`, `step`, `debugMsg`, `dtWhenLogged`) VALUES
	('testing', 2, 'Event Updated', now());
	
	INSERT INTO `evtslog` (`evtName`, `step`, `debugMsg`, `dtWhenLogged`) VALUES
	('testing', 3, 'Event Finished', now());

END;
@@;

DELIMITER ; 




DROP EVENT IF EXISTS one_minute_test;
DELIMITER $$
CREATE EVENT one_minute_test
  ON SCHEDULE EVERY 1 MINUTE STARTS '2015-09-01 00:00:00'
  ON COMPLETION PRESERVE
DO
BEGIN
 
	INSERT INTO `evtslog` (`evtName`, `step`, `debugMsg`, `dtWhenLogged`) VALUES
	('testing', 1, 'Event Fired', now());
	
	SELECT @stake_amnt:=amount , @user_phone:=phone, @user_date:=to_date  FROM claimed_rewards WHERE DATE(to_date) = CURDATE() AND status=2;
	
	update users set money = money + ROUND(@stake_amnt) , total_money = total_money + ROUND(@stake_amnt)  where phone = @user_phone;
	
	update claimed_rewards SET status=1 WHERE to_date = @user_date AND status=2 AND phone = @user_phone AND reward_id = 136;
	
	INSERT INTO `evtslog` (`evtName`, `step`, `debugMsg`, `dtWhenLogged`) VALUES
	('testing', 2, 'Event Updated', now());
	
	INSERT INTO `evtslog` (`evtName`, `step`, `debugMsg`, `dtWhenLogged`) VALUES
	('testing', 3, 'Event Finished', now());

END $$
DELIMITER ;
