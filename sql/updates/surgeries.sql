-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 07, 2012 at 07:10 PM
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
-- Table structure for table `surgeries`
--

DROP TABLE IF EXISTS `surgeries`;
CREATE TABLE IF NOT EXISTS `surgeries` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `type_num` bigint(255) DEFAULT NULL,
  `surgery` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=369 ;

--
-- Dumping data for table `surgeries`
--

INSERT INTO `surgeries` (`id`, `type`, `type_num`, `surgery`) VALUES
(220, 'Blood Vessel System', 1, 'Aortic Aneurysm'),
(221, 'Blood Vessel System', 1, 'Axillo - Femoral Bypass'),
(222, 'Blood Vessel System', 1, 'Femoral Embolectomy'),
(223, 'Blood Vessel System', 1, 'Femoro - Femoral Bypass'),
(224, 'Blood Vessel System', 1, 'Femoro - Popliteal Bypass'),
(225, 'Blood Vessel System', 1, 'Varicose Ulcer Treatment'),
(226, 'Blood Vessel System', 1, 'Varicose Vein Removal'),
(227, 'Blood Vessel System', 1, 'Vericose Vein Laser,Removal (new treatment)'),
(228, ' Bones, Joints & Tendons', 2, 'ACL Repair'),
(229, ' Bones, Joints & Tendons', 2, 'Ankle Fusion Operation - Arthodesis'),
(230, ' Bones, Joints & Tendons', 2, 'Broken Ankle - Open Reduction and Fixation'),
(231, ' Bones, Joints & Tendons', 2, 'Bunionectomy'),
(232, ' Bones, Joints & Tendons', 2, 'Carpal Tunnel Decompression'),
(233, ' Bones, Joints & Tendons', 2, 'Discectomy - Splipped Disc'),
(234, ' Bones, Joints & Tendons', 2, 'Dupuytrens Contacture - Partial Fasciectomy'),
(235, ' Bones, Joints & Tendons', 2, 'Epidural'),
(236, ' Bones, Joints & Tendons', 2, 'Femoral Shaft Fracture - Internal Fixation'),
(237, ' Bones, Joints & Tendons', 2, 'Ganglion Excision - Foot'),
(238, ' Bones, Joints & Tendons', 2, 'Ganglion Excision - Wrist'),
(239, ' Bones, Joints & Tendons', 2, 'Hip Replacement'),
(240, ' Bones, Joints & Tendons', 2, 'Knee Arthroscopy'),
(241, ' Bones, Joints & Tendons', 2, 'Knee Replacement'),
(242, ' Bones, Joints & Tendons', 2, 'Radius and Ulna Fracture - Internal Fixation'),
(243, ' Bones, Joints & Tendons', 2, 'Shoulder Arthroscopy'),
(244, ' Bones, Joints & Tendons', 2, 'Shoulder Tendon Repair - Rotator Cuff'),
(245, ' Bones, Joints & Tendons', 2, 'Spinal Fusion '),
(246, ' Bones, Joints & Tendons', 2, 'Spinal Stenosis Operation'),
(247, ' Bones, Joints & Tendons', 2, 'Spine - Total Disc Replacement (TDR)'),
(248, ' Bones, Joints & Tendons', 2, 'Tendon Repair - Achilles Tendon'),
(249, ' Bones, Joints & Tendons', 2, 'Tendon Repair - Extensor'),
(250, ' Bones, Joints & Tendons', 2, 'Tendon Repair - Flexor'),
(251, ' Bones, Joints & Tendons', 2, 'Toe Fusion - Arthodesis'),
(252, ' Bones, Joints & Tendons', 2, 'Toe Nail Removal'),
(253, 'Breast', 3, 'Breast - Wide Excision and Axillary Sample'),
(254, 'Breast', 3, 'Breast Biopsy'),
(255, 'Breast', 3, 'Mastecomy'),
(256, 'Breast', 3, 'Mastectomy - Male Subcutaneous'),
(257, 'Cardiology', 4, 'Abdominal or Thoratic Aortic Aneurysm Surgery'),
(258, 'Cardiology', 4, 'Angioplasty (Balloon & Stent)'),
(259, 'Cardiology', 4, 'ASD (Atrial Septal Defect) Closure'),
(260, 'Cardiology', 4, 'Coronary Artery Bypass Graft (CABG) Open Heart Surgery'),
(261, 'Cardiology', 4, 'PDA (Patient Ductus Arterious) Ligation'),
(262, 'Cardiology', 4, 'Radio Frequency Ablation'),
(263, 'Cardiology', 4, 'TOF (Total Correction Four Abnormality Correction)'),
(264, 'Cardiology', 4, 'Valve Replacement Surgery'),
(265, 'Cardiology', 4, 'VSD (Ventrical Septal Defect) Closure'),
(266, 'Diagnostics', 5, '24 hour holter (EKG) monitoring'),
(267, 'Diagnostics', 5, 'Carotid Angiography'),
(268, 'Diagnostics', 5, 'CT Scan'),
(269, 'Diagnostics', 5, 'Diagnostic Cardiac Catherization (Coronary Angiogram) '),
(270, 'Diagnostics', 5, 'Echocardiography'),
(271, 'Diagnostics', 5, 'Electrocardiogram (EKG) '),
(272, 'Diagnostics', 5, 'Electrophysiology Testing (Arrythmia)'),
(273, 'Diagnostics', 5, 'Exercise Echocardigraphy'),
(274, 'Diagnostics', 5, 'Exercise Stress Testing'),
(275, 'Diagnostics', 5, 'Myocardial Byopsy'),
(276, 'Diagnostics', 5, 'MRI '),
(277, 'Diagnostics', 5, 'Ultrasound'),
(278, 'Diagnostics', 5, 'X-Ray '),
(279, 'Ear, Nose and Throat', 6, 'Bronchoscopy - Elective '),
(280, 'Ear, Nose and Throat', 6, 'Bronchoscopy - Emergency'),
(281, 'Ear, Nose and Throat', 6, 'Grommet Insertion'),
(282, 'Ear, Nose and Throat', 6, 'Grommet Removal'),
(283, 'Ear, Nose and Throat', 6, 'Laryngscopy and Biopsy'),
(284, 'Ear, Nose and Throat', 6, 'Maxillary Antral - Sinus Washout'),
(285, 'Ear, Nose and Throat', 6, 'Myringotomy'),
(286, 'Ear, Nose and Throat', 6, 'Nasal Polyp Removal'),
(287, 'Ear, Nose and Throat', 6, 'Parotid Gland Removal - Parotidectomy'),
(288, 'Ear, Nose and Throat', 6, 'Septoplasty'),
(289, 'Ear, Nose and Throat', 6, 'Stapedectomy'),
(290, 'Ear, Nose and Throat', 6, 'Submucous Resection - SMR'),
(291, 'Ear, Nose and Throat', 6, 'Tonsillectomy (Adult)'),
(292, 'Ear, Nose and Throat', 6, 'Turbinates of Nose - Excision'),
(293, 'Ear, Nose and Throat', 6, 'Tympanoplasty - Myringplasty (Adult)'),
(294, 'Eye Surgery', 7, 'Lasik Laser Refraction'),
(295, 'Female Reproductive System and Pregnancy', 8, 'Abscess - Pelvic'),
(296, 'Female Reproductive System and Pregnancy', 8, 'Anterior Repair'),
(297, 'Female Reproductive System and Pregnancy', 8, 'Bartholins Gland Marsupialisation '),
(298, 'Female Reproductive System and Pregnancy', 8, 'Caesarean Section'),
(299, 'Female Reproductive System and Pregnancy', 8, 'Colposuspension'),
(300, 'Female Reproductive System and Pregnancy', 8, 'Cone Biopsy of Cervix'),
(301, 'Female Reproductive System and Pregnancy', 8, 'Dialation and Curretage - D and C'),
(302, 'Female Reproductive System and Pregnancy', 8, 'Hysterectomy - Abdominal'),
(303, 'Female Reproductive System and Pregnancy', 8, 'Hysterectomy - Vaginal'),
(304, 'Female Reproductive System and Pregnancy', 8, 'Laparoscopy'),
(305, 'Female Reproductive System and Pregnancy', 8, 'Laparoscopy and Dye'),
(306, 'Female Reproductive System and Pregnancy', 8, 'Microwave Endometrial Ablation'),
(307, 'Female Reproductive System and Pregnancy', 8, 'Posterior Repair - Prolapse Operation'),
(308, 'Female Reproductive System and Pregnancy', 8, 'Salpingo - Ectopic Pregnancy'),
(309, 'Female Reproductive System and Pregnancy', 8, 'Sterilization'),
(310, 'Female Reproductive System and Pregnancy', 8, 'Vaginal and Vulval Warts - Removal '),
(311, 'Female Reproductive System and Pregnancy', 8, 'Vulval Lesion Excision'),
(312, 'Fertility', 9, 'Assisted Hatching (AH) '),
(313, 'Fertility', 9, 'In Vitro Fertilization Treatment (IVF)'),
(314, 'Fertility', 9, 'Intracytoplasmatic Sperm Injection (ICSI)'),
(315, 'Fertility', 9, 'Intrauterine Insemination (IUI)'),
(316, ' General Surgery ', 10, 'Abdomino - Perineal Resection of Rectum '),
(317, ' General Surgery ', 10, 'Abscess - Intra Abdominal '),
(318, ' General Surgery ', 10, 'Adscess - Pelvic'),
(319, ' General Surgery ', 10, 'Adscess - Subphrenic'),
(320, ' General Surgery ', 10, 'Amputation - Above Knee'),
(321, ' General Surgery ', 10, 'Amputation - Below Knee'),
(322, ' General Surgery ', 10, 'Amputation - Toe'),
(323, ' General Surgery ', 10, 'Cholecystectomy - Gall Bladder Removal '),
(324, ' General Surgery ', 10, 'Epididymal Cyst Removal'),
(325, ' General Surgery ', 10, 'Hernia Repair - Epigastric'),
(326, ' General Surgery ', 10, 'Hernia Repair - Femoral'),
(327, ' General Surgery ', 10, 'Hernia Repair - Inguinal'),
(328, ' General Surgery ', 10, 'Hydrcele Operation - Adult'),
(329, ' General Surgery ', 10, 'Pilonidal Sinus'),
(330, ' General Surgery ', 10, 'Spleen Removal - Splenectomy '),
(331, ' General Surgery ', 10, 'Thyroidectomy'),
(332, 'Kidney and Urinary System', 11, 'Bladder Outlet Incision'),
(333, 'Kidney and Urinary System', 11, 'Cysto - Diathermy'),
(334, 'Kidney and Urinary System', 11, 'Cystoscopy'),
(335, 'Kidney and Urinary System', 11, 'Nephrectomy - Kidney Removal '),
(336, 'Kidney and Urinary System', 11, 'Nephrolithotomy - Removal of Kidney Stone'),
(337, 'Kidney and Urinary System', 11, 'Retrograde Pyelogram'),
(338, 'Kidney and Urinary System', 11, 'Ureterolithotomy'),
(339, 'Kidney and Urinary System', 11, 'Urethroscopy'),
(340, 'Male Reproductive System and Urinary Tract', 12, 'Circumcision'),
(341, 'Male Reproductive System and Urinary Tract', 12, 'Hydrocele Operation - Adult '),
(342, 'Male Reproductive System and Urinary Tract', 12, 'Penis Frenuloplasty'),
(343, 'Male Reproductive System and Urinary Tract', 12, 'Prostatectomy'),
(344, 'Male Reproductive System and Urinary Tract', 12, 'Vasectomy'),
(345, 'Male Reproductive System and Urinary Tract', 12, 'Vasectomy Reversal'),
(346, 'Physical Exams', 13, 'Basic Physical Exam'),
(347, 'Physical Exams', 13, 'Comprehensive Physical Exam'),
(348, 'Physical Exams', 13, 'Executive Physical Exam '),
(349, 'Stomach and Bowel ', 14, 'Abdominal - Perineal Resection of the Rectum '),
(350, 'Stomach and Bowel ', 14, 'Abscess - Perianal'),
(351, 'Stomach and Bowel ', 14, 'Anal Fissure'),
(352, 'Stomach and Bowel ', 14, 'Anal Fistula'),
(353, 'Stomach and Bowel ', 14, 'Anterior Resection of Rectum '),
(354, 'Stomach and Bowel ', 14, 'Appendicectomy'),
(355, 'Stomach and Bowel ', 14, 'Colectomy - Total - and Ileostomy '),
(356, 'Stomach and Bowel ', 14, 'Colon Polyp Removal'),
(357, 'Stomach and Bowel ', 14, 'Colonoscopy'),
(358, 'Stomach and Bowel ', 14, 'Colostomy - Defunctioning Loop '),
(359, 'Stomach and Bowel ', 14, 'Colostmy Closure - Colorectal Anastomosis'),
(360, 'Stomach and Bowel ', 14, 'Gastrectomy - Vertical'),
(361, 'Stomach and Bowel ', 14, 'Gastric Banding (Lapband) '),
(362, 'Stomach and Bowel ', 14, 'Gastric Bypass (RNY)'),
(363, 'Stomach and Bowel ', 14, 'Gastroscopy'),
(364, 'Stomach and Bowel ', 14, 'Haemorrhoid Injection'),
(365, 'Stomach and Bowel ', 14, 'Haemorrhoidectomy'),
(366, 'Stomach and Bowel ', 14, 'Hemi-Colectomy - Left'),
(367, 'Stomach and Bowel ', 14, 'Hemi - Colectomy - Right'),
(368, 'Stomach and Bowel ', 14, 'Sigmoid - Colectomy\r\n');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
