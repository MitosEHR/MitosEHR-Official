-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 04, 2012 at 06:08 AM
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
-- Table structure for table `allergies`
--

DROP TABLE IF EXISTS `allergies`;
CREATE TABLE IF NOT EXISTS `allergies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `summary` varchar(255) DEFAULT NULL,
  `allergy_name` varchar(255) DEFAULT NULL,
  `allergy_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `allergies`
--

INSERT INTO `allergies` (`id`, `summary`, `allergy_name`, `allergy_type`) VALUES
(1, 'Milk, cream, butter, cheese, yogurt, ice cream, gelato.', 'Dairy', 'Food'),
(2, 'Egg', 'Egg', 'Food'),
(3, 'Peanut, nut', 'Peanut ', 'Food'),
(4, 'Almond, cashew, chestnuts, coconut, hazelnut, macadamia, pistachio, walnut', 'Other Nuts  ', 'Food'),
(5, 'Fish, roe, fish eggs', 'Seafood', 'Food'),
(6, 'Crab, lobster, shrimp, crawfish, clam, mussel, octopus, oyster, snail, squid, scallop', 'Sellfish ', 'Food'),
(7, 'Soy', 'Soy', 'Food'),
(8, 'Gluten, couscous, durum, semolina', 'Wheat  ', 'Food'),
(9, 'Melons, bananas, cucumbers, ragweed poll', 'Melons, bananas, cucumbers (ragweed pollen) ', 'Food'),
(10, 'Yeast, baker yeast', 'Baker’s Yeast  ', 'Food'),
(11, 'Dust (inhaled)', 'Dust ', 'Environmental'),
(12, 'Pollen (inhaled)', 'Pollen ', 'Environmental'),
(13, 'Dust mites (contact)', 'Dust Mites ', 'Environmental'),
(14, 'Dander (contact) ', 'Animal Dander ', 'Environmental'),
(15, 'Insect wings (contact) ', 'Insect Stings ', 'Environmental'),
(16, 'Latex, vinyl (contact) ', 'Latex ', 'Environmental'),
(17, 'Nickel (contact) ', 'Nickel', 'Environmental'),
(18, 'Mold (inhaled)', 'Mold', 'Environmental');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
