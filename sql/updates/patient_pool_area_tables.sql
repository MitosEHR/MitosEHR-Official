-- phpMyAdmin SQL Dump
-- version 3.4.10.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 09, 2012 at 04:29 AM
-- Server version: 5.5.20
-- PHP Version: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mitosdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `patient_pools`
--

DROP TABLE IF EXISTS `patient_pools`;
CREATE TABLE IF NOT EXISTS `patient_pools` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) DEFAULT NULL,
  `uid` bigint(20) DEFAULT NULL COMMENT 'user id that is treating the patient',
  `eid` bigint(20) DEFAULT NULL,
  `time_in` datetime DEFAULT NULL COMMENT 'checkin time',
  `time_out` datetime DEFAULT NULL COMMENT 'checkout time',
  `area_id` int(11) DEFAULT NULL COMMENT 'pool area id',
  `priority` int(11) DEFAULT NULL COMMENT 'priority 1 is the highest',
  `in_queue` tinyint(1) DEFAULT '1' COMMENT 'true = patient is in queue, false = the patient it been treated by someone',
  `checkout_timer` time DEFAULT NULL COMMENT 'timer user to automatically checkout from the pool area, and return to the previous pool area ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `pool_areas`
--

DROP TABLE IF EXISTS `pool_areas`;
CREATE TABLE IF NOT EXISTS `pool_areas` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `area` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
