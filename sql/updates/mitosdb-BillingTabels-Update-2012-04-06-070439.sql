-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 06, 2012 at 07:13 AM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

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
-- Table structure for table `encounter_codes_cpt`
--

DROP TABLE IF EXISTS `encounter_codes_cpt`;
CREATE TABLE IF NOT EXISTS `encounter_codes_cpt` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `eid` bigint(20) DEFAULT NULL COMMENT 'encounter ID',
  `code` varchar(255) DEFAULT NULL COMMENT 'code number',
  `charge` varchar(255) DEFAULT NULL,
  `days_of_units` text,
  `emergency` tinyint(1) NOT NULL DEFAULT '0',
  `essdt_plan` text,
  `modifiers` text,
  `place_of_service` text,
  `status` int(1) NOT NULL DEFAULT '0' COMMENT 'billing status of this cpt',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=81 ;

--
-- Dumping data for table `encounter_codes_cpt`
--

INSERT INTO `encounter_codes_cpt` (`id`, `eid`, `code`, `charge`, `days_of_units`, `emergency`, `essdt_plan`, `modifiers`, `place_of_service`, `status`) VALUES
(70, 7, '93981', NULL, NULL, 0, NULL, NULL, NULL, 1),
(71, 7, '93970', NULL, NULL, 0, NULL, NULL, NULL, 1),
(72, 7, '93925', NULL, NULL, 0, NULL, NULL, NULL, 1),
(73, 7, '95861', NULL, NULL, 0, NULL, NULL, NULL, 2),
(74, 7, '96523', NULL, NULL, 0, NULL, NULL, NULL, 0),
(75, 7, '96000', NULL, NULL, 0, NULL, NULL, NULL, 0),
(76, 8, '93981', NULL, NULL, 0, NULL, NULL, NULL, 0),
(77, 8, '95861', NULL, NULL, 0, NULL, NULL, NULL, 0),
(78, 8, '93970', NULL, NULL, 0, NULL, NULL, NULL, 0),
(79, 2, '93925', NULL, NULL, 0, NULL, NULL, NULL, 0),
(80, 2, '96523', NULL, NULL, 0, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `form_data_encounter`
--

DROP TABLE IF EXISTS `form_data_encounter`;
CREATE TABLE IF NOT EXISTS `form_data_encounter` (
  `eid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Encounter ID',
  `pid` bigint(20) NOT NULL COMMENT 'Patient ID',
  `open_uid` bigint(20) NOT NULL COMMENT 'User ID who opened the encounter',
  `close_uid` bigint(20) DEFAULT NULL COMMENT 'User ID who Closed/Sign the encounter',
  `prov_uid` bigint(20) DEFAULT NULL COMMENT 'Provider User ID',
  `sup_uid` bigint(20) DEFAULT NULL COMMENT 'Supervisor User ID',
  `brief_description` varchar(255) DEFAULT NULL,
  `visit_category` varchar(255) DEFAULT NULL,
  `facility` varchar(255) DEFAULT NULL,
  `billing_facility` varchar(255) DEFAULT NULL,
  `sensitivity` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `close_date` datetime DEFAULT NULL,
  `onset_date` datetime DEFAULT NULL,
  `billing_stage` int(1) DEFAULT NULL COMMENT 'billing stage of this encounter',
  PRIMARY KEY (`eid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `form_data_encounter`
--

INSERT INTO `form_data_encounter` (`eid`, `pid`, `open_uid`, `close_uid`, `prov_uid`, `sup_uid`, `brief_description`, `visit_category`, `facility`, `billing_facility`, `sensitivity`, `start_date`, `close_date`, `onset_date`, `billing_stage`) VALUES
(1, 1, 85, 85, 85, NULL, 'Test 1', 'low', 'low', NULL, 'low', '2012-03-02 16:28:00', '2012-03-05 19:49:21', NULL, 2),
(2, 10, 85, NULL, NULL, NULL, 'Patien has flu', 'low', 'low', NULL, 'low', '2012-03-02 16:56:00', NULL, NULL, 2),
(6, 1, 85, NULL, NULL, NULL, 'ahora si q si', 'low', 'low', NULL, 'low', '2012-03-04 13:01:00', NULL, NULL, 3),
(7, 1, 85, NULL, NULL, NULL, 'La segunda prueba', 'low', 'low', NULL, 'low', '2012-03-04 13:10:00', NULL, NULL, 4),
(8, 2, 85, NULL, NULL, NULL, 'Juano Test', 'low', 'low', NULL, 'low', '2012-03-09 12:55:00', NULL, NULL, 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
