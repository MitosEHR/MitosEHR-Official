-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 07, 2012 at 06:47 AM
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
(70, 7, '93981', '', '', 1, '', '', 'Clinic', 1),
(71, 7, '93970', '', '', 0, '', '', 'Clinic', 1),
(72, 7, '93925', '', '', 0, '', '', 'Hospital', 1),
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
-- Table structure for table `form_encounter`
--

DROP TABLE IF EXISTS `form_encounter`;
CREATE TABLE IF NOT EXISTS `form_encounter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `reason` longtext,
  `facility` longtext,
  `facility_id` int(11) NOT NULL DEFAULT '0',
  `pid` bigint(20) DEFAULT NULL,
  `encounter` bigint(20) DEFAULT NULL,
  `onset_date` datetime DEFAULT NULL,
  `sensitivity` varchar(30) DEFAULT NULL,
  `billing_note` text,
  `pc_catid` int(11) NOT NULL DEFAULT '5' COMMENT 'event category from openemr_postcalendar_categories',
  `last_level_billed` int(11) NOT NULL DEFAULT '0' COMMENT '0=none, 1=ins1, 2=ins2, etc',
  `last_level_closed` int(11) NOT NULL DEFAULT '0' COMMENT '0=none, 1=ins1, 2=ins2, etc',
  `last_stmt_date` date DEFAULT NULL,
  `stmt_count` int(11) NOT NULL DEFAULT '0',
  `provider_id` int(11) DEFAULT '0' COMMENT 'default and main provider for this visit',
  `supervisor_id` int(11) DEFAULT '0' COMMENT 'supervising provider, if any, for this visit',
  `invoice_refno` varchar(31) NOT NULL DEFAULT '',
  `referral_source` varchar(31) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
