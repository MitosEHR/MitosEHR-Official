-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 05, 2012 at 10:59 PM
-- Server version: 5.5.20
-- PHP Version: 5.3.9

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
-- Table structure for table `patient_allergies`
--

DROP TABLE IF EXISTS `patient_allergies`;
CREATE TABLE IF NOT EXISTS `patient_allergies` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) DEFAULT NULL COMMENT 'patient ID',
  `eid` bigint(20) DEFAULT NULL COMMENT 'encounter ID',
  `allergy_type` varchar(50) DEFAULT NULL,
  `allergy` varchar(50) DEFAULT NULL,
  `allergy_id` bigint(20) DEFAULT NULL,
  `begin_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `reaction` varchar(50) DEFAULT NULL,
  `severity` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_uid` bigint(20) DEFAULT NULL COMMENT 'created by User ID',
  `updated_uid` bigint(20) DEFAULT NULL COMMENT 'updated by User ID',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=23 ;

--
-- Dumping data for table `patient_allergies`
--

INSERT INTO `patient_allergies` (`id`, `pid`, `eid`, `allergy_type`, `allergy`, `allergy_id`, `begin_date`, `end_date`, `reaction`, `severity`, `location`, `create_date`, `update_date`, `created_uid`, `updated_uid`) VALUES
(18, 1, 7, 'Environmental', 'Pollen', 12, '2012-05-05 16:12:23', '0000-00-00 00:00:00', 'Facial swelling', 'Mild', 'Skin', '2012-05-05 16:12:23', '2012-05-05 20:33:01', 85, 85),
(19, 1, 7, 'Drug', 'Advicor', 1519, '2012-05-05 16:33:18', '0000-00-00 00:00:00', 'Diarrhea', 'Mild', 'Abdominal', '2012-05-05 16:33:18', '2012-05-05 20:33:36', 85, 85),
(20, 1, 7, 'Food', 'Sellfish', 6, '2012-05-05 16:33:43', '2012-05-22 00:00:00', 'Conjunctivitis', 'Severe', 'Local', '2012-05-05 16:33:43', '2012-05-05 20:45:18', 85, 85),
(21, 1, 7, 'Environmental', 'Pollen', 12, '2012-05-05 16:44:29', '2012-05-08 00:00:00', 'Vomiting', 'Moderate', 'Local', '2012-05-05 16:44:29', '2012-05-05 20:50:26', 85, 85),
(22, 1, 7, 'Environmental', 'Pollen', 12, '2012-05-05 16:49:53', '0000-00-00 00:00:00', 'Vomiting', 'Mild', 'Abdominal', '2012-05-05 16:49:53', '2012-05-05 20:50:14', 85, 85);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
