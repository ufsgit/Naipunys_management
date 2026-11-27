-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: naipunya
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_branch_configs`
--

DROP TABLE IF EXISTS `account_branch_configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_branch_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `opening_balance` decimal(12,2) DEFAULT '0.00',
  `is_selected` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_account_branch` (`account_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `account_branch_configs_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `account_branch_configs_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_branch_configs`
--

LOCK TABLES `account_branch_configs` WRITE;
/*!40000 ALTER TABLE `account_branch_configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_branch_configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_code` varchar(30) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(30) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `opening_balance` decimal(12,2) DEFAULT '0.00',
  `current_balance` decimal(12,2) DEFAULT '0.00',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_code` (`account_code`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'ACC-1795676206174','CASH','Bank',NULL,0.00,0.00,'Active','2026-11-26 06:56:46','2026-11-26 06:56:46'),(2,'ACC-UPI','UPI','Bank',NULL,0.00,0.00,'Active','2026-11-26 07:02:56','2026-11-26 07:02:56'),(3,'ACC-BANK','BANK','Bank',NULL,0.00,0.00,'Active','2026-11-26 07:02:56','2026-11-26 07:02:56');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address` text,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'BR-ERN','Ernakulam','Ernakulam','0484 235 8890','MG Road, Ravipuram','Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(2,'BR-KAL','Kaloor','Kaloor','0484 235 8891','Kaloor Junction','Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(3,'BR-ANG','Angamaly','Angamaly','0484 235 8892','Angamaly Town','Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(4,'BR-THR','Thrikkakara','Thrikkakara','0484 235 8893','Thrikkakara','Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(5,'BR-PAL','Pala','Pala','0484 235 8894','Pala Town','Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(6,'BR-OVS','Naipunya Overseas','Kochi','0484 235 8895','Kochi','Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(12,'BR-1795771551547','test','test','','','Active','2026-11-27 09:25:51','2026-11-27 09:25:51');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_info`
--

DROP TABLE IF EXISTS `company_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(200) DEFAULT NULL,
  `phone_no` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text,
  `land_phone` varchar(30) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_info`
--

LOCK TABLES `company_info` WRITE;
/*!40000 ALTER TABLE `company_info` DISABLE KEYS */;
INSERT INTO `company_info` VALUES (1,'Naipunya Academy of Languages & Skills','98470 22001','info@naipunya.edu.in','MG Road, Ravipuram, Ernakulam, Kochi, Kerala 682016','0484 235 8890','https://naipunya.edu.in','2026-11-25 08:01:35');
/*!40000 ALTER TABLE `company_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_branch_fees`
--

DROP TABLE IF EXISTS `course_branch_fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_branch_fees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `fee` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_course_branch` (`course_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `course_branch_fees_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_branch_fees_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_branch_fees`
--

LOCK TABLES `course_branch_fees` WRITE;
/*!40000 ALTER TABLE `course_branch_fees` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_branch_fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `department_id` int DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `fee` decimal(10,2) DEFAULT '0.00',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'A01','IELTS REGULAR',NULL,'1 Month',0.00,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(2,'A02','IELTS 2 MONTHS',NULL,'2 Months',0.00,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(3,'A03','IELTS CRASH',NULL,'Crash',0.00,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(4,'A04','IELTS Extn (ONE MONTH)',NULL,'1 Month',0.00,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(5,'A05','IELTS Extn (2 WEEKS)',NULL,'2 Weeks',0.00,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(6,'A06','OET',NULL,'1 Month',0.00,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(7,'A07','COMMUNICATIVE ENGLISH 1 MONTH',NULL,'1 Month',0.00,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(8,'A08','OET (2 Weeks)',NULL,'2 Weeks',0.00,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(22,'C-1795771503260','test',NULL,'',0.00,'Active','2026-11-27 09:25:03','2026-11-27 09:25:03');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department_permissions`
--

DROP TABLE IF EXISTS `department_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(100) DEFAULT '',
  `department_name` varchar(100) NOT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department_permissions`
--

LOCK TABLES `department_permissions` WRITE;
/*!40000 ALTER TABLE `department_permissions` DISABLE KEYS */;
INSERT INTO `department_permissions` VALUES (1,'Angamaly','Admission',1),(2,'','Accounts',2),(3,'','CLOSED',3),(4,'','Marketing',4),(5,'','Follow Up',5),(6,'','JOINED',6),(7,'','Visa',7),(8,'Ernakulam','Accounts',8),(9,'','Admission',9),(10,'','CLOSED',10),(11,'','Follow Up',11),(12,'','JOINED',12),(13,'','Marketing',13),(14,'','Visa',14),(15,'Kaloor','CLOSED',15),(16,'','JOINED',16),(17,'','Admission',17),(18,'','Follow Up',18),(19,'','Accounts',19),(20,'','Visa',20),(21,'','Marketing',21),(22,'Naipunya Overseas','Admission',22),(23,'','Accounts',23),(24,'','CLOSED',24),(25,'','Follow Up',25),(26,'','JOINED',26),(27,'','Visa',27),(28,'','Marketing',28),(29,'Pala','Accounts',29),(30,'','Admission',30),(31,'','Follow Up',31),(32,'','Marketing',32),(33,'','Visa',33),(34,'Thrikkakara','CLOSED',34),(35,'','Admission',35),(36,'','Accounts',36),(37,'','Follow Up',37),(38,'','JOINED',38),(39,'','Marketing',39),(40,'','Visa',40);
/*!40000 ALTER TABLE `department_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `head_of_department_id` int DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `head_of_department_id` (`head_of_department_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`head_of_department_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'DEP-ACC','Accounts',NULL,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(2,'DEP-ADM','Admission',NULL,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(3,'DEP-CLO','CLOSED',NULL,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(4,'DEP-FOL','Follow Up',NULL,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(5,'DEP-JOI','JOINED',NULL,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(6,'DEP-MAR','Marketing',NULL,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(7,'DEP-VIS','Visa',NULL,'Active','2026-11-25 08:01:35','2026-11-25 08:01:35'),(14,'DEP-1795771524780','Test',NULL,'Active','2026-11-27 09:25:24','2026-11-27 09:25:24');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow_ups`
--

DROP TABLE IF EXISTS `follow_ups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow_ups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `assigned_to_id` int DEFAULT NULL,
  `followup_type_id` int DEFAULT NULL,
  `followup_date` date DEFAULT NULL,
  `remarks` text,
  `next_followup_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `assigned_to_id` (`assigned_to_id`),
  KEY `followup_type_id` (`followup_type_id`),
  CONSTRAINT `follow_ups_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `follow_ups_ibfk_2` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`),
  CONSTRAINT `follow_ups_ibfk_3` FOREIGN KEY (`followup_type_id`) REFERENCES `settings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow_ups`
--

LOCK TABLES `follow_ups` WRITE;
/*!40000 ALTER TABLE `follow_ups` DISABLE KEYS */;
INSERT INTO `follow_ups` VALUES (2,7,NULL,NULL,'2026-11-27','intrest','2026-11-30','Interested','2026-11-27 10:14:02','2026-11-27 10:14:02'),(3,8,NULL,NULL,'2026-11-27','','2026-12-03','test','2026-11-27 10:29:55','2026-11-27 10:29:55'),(4,8,1,NULL,'2026-11-27','done','2026-12-03','Interested','2026-11-27 10:30:31','2026-11-27 10:30:31');
/*!40000 ALTER TABLE `follow_ups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_permissions`
--

DROP TABLE IF EXISTS `menu_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `has_edit` tinyint(1) DEFAULT '0',
  `has_delete` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_permissions`
--

LOCK TABLES `menu_permissions` WRITE;
/*!40000 ALTER TABLE `menu_permissions` DISABLE KEYS */;
INSERT INTO `menu_permissions` VALUES (1,'Create New',0,1,1),(2,'Tab-Qualification',0,0,2),(3,'Tab-Course',0,0,3),(4,'Tab-Application',0,0,4),(5,'Tab-Fund Details',0,0,5),(6,'Tab-Invoice Details',0,0,6),(7,'Tab-Checklist',0,0,7),(8,'Tab-Document',0,0,8),(9,'Student List',0,0,9),(10,'Task',1,1,10),(11,'Report',0,0,11),(12,'User Activity Report',0,0,12),(13,'Work Report',0,0,13),(14,'FollowUp Summary',0,0,14),(15,'Enquiry Source Report',0,0,15),(16,'Task Report',0,0,16),(17,'Fee Payment Report',0,0,17),(18,'Application Status Report',0,0,18),(19,'Application Details Status Report',0,0,19),(20,'Student Report',0,0,20),(21,'Login Report',0,0,21),(22,'PCC Report',0,0,22),(23,'Medical Report',0,0,23),(24,'Checklist Report',0,0,24),(25,'Invoice Claim Report',0,0,25),(26,'Fees Pending Report',0,0,26),(27,'Ielts Students Report',0,0,27),(28,'Student Registration Report',0,0,28),(29,'Data',0,0,29),(30,'Import',0,0,30),(31,'Import Pool',0,0,31),(32,'FileTransfer',0,0,32),(33,'Settings',0,0,33),(34,'Course',1,1,34),(35,'Overseas Course',1,1,35),(36,'User Details',1,1,36),(37,'Enquiry Source',1,1,37),(38,'Status',1,1,38),(39,'Stream',1,1,39),(40,'FollowUp Type',1,1,40),(41,'Country',1,1,41),(42,'Level',1,1,42),(43,'College',1,1,43),(44,'Department',1,1,44),(45,'Branch',1,1,45),(46,'Checklist Item',1,1,46),(47,'Document',1,1,47),(48,'User Role',1,1,48),(49,'Intake',1,1,49),(50,'Place',1,1,50),(51,'Company Info',0,0,51),(52,'Export',0,0,52),(53,'Register',0,0,53),(54,'Remove Registration',0,0,54),(55,'Course Discount',0,0,55),(56,'Generate Button',0,0,56),(57,'Receipt Delete',0,0,57),(58,'Account',0,0,58),(59,'Receipt',1,1,59),(60,'Accounts',0,0,60),(61,'Payment',1,1,61),(62,'Branch Account Report',0,0,62),(63,'Search All',0,0,63);
/*!40000 ALTER TABLE `menu_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `voucher_no` varchar(30) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `paid_to` varchar(150) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT '0.00',
  `payment_mode` varchar(30) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `voucher_no` (`voucher_no`),
  KEY `account_id` (`account_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'802','2026-11-27','hi','clean',1,1,2400.00,'Cash','clean','2026-11-27 08:24:48','2026-11-27 08:24:48');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipts`
--

DROP TABLE IF EXISTS `receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receipt_no` varchar(30) DEFAULT NULL,
  `receipt_date` date DEFAULT NULL,
  `received_from` varchar(150) DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `course` varchar(150) DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT '0.00',
  `voucher_no` varchar(30) DEFAULT NULL,
  `details` text,
  `to_account_id` int DEFAULT NULL,
  `payment_mode` varchar(30) DEFAULT NULL,
  `reference_no` varchar(50) DEFAULT NULL,
  `remark` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_no` (`receipt_no`),
  KEY `student_id` (`student_id`),
  KEY `to_account_id` (`to_account_id`),
  KEY `idx_receipts_date` (`receipt_date`),
  KEY `idx_receipts_branch` (`branch_id`),
  CONSTRAINT `receipts_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `receipts_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `receipts_ibfk_3` FOREIGN KEY (`to_account_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipts`
--

LOCK TABLES `receipts` WRITE;
/*!40000 ALTER TABLE `receipts` DISABLE KEYS */;
INSERT INTO `receipts` VALUES (10,'1795683340571','2026-11-26','mns',NULL,'OET',1,1000.00,'','',1,'Book Amount','','','2026-11-26 08:55:40','2026-11-27 10:27:24'),(13,'1795685127258','2026-11-26','mns',NULL,'OET',1,1000.00,'','fees',3,'','','','2026-11-26 09:25:27','2026-11-27 10:27:24'),(15,'1795751677728','2026-11-27','Test1',NULL,'IELTS Extn (2 WEEKS)',2,2000.00,'','',1,'Fees','','','2026-11-27 03:54:37','2026-11-27 09:06:15'),(16,'1795770773388','2026-11-27','Test',NULL,'COMMUNICATIVE ENGLISH 1 MONTH',3,1000.00,'','',2,'Book Amount','','','2026-11-27 09:12:53','2026-11-27 09:14:25'),(17,'1795771084967','2026-11-27','Manasa',7,'IELTS Extn (2 WEEKS)',5,1000.00,'','',2,'Fees','','','2026-11-27 09:18:04','2026-11-27 09:18:04'),(18,'1795771635887','2026-11-27','manasa',7,'IELTS Extn (2 WEEKS)',5,2000.00,'','Fess',1,'','','','2026-11-27 09:27:15','2026-11-27 09:27:15'),(19,'1795775496969','2026-11-27','New',8,'IELTS CRASH',3,10000.00,'','',1,'Fees','','','2026-11-27 10:31:36','2026-11-27 10:31:36');
/*!40000 ALTER TABLE `receipts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `role_under` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMINISTRATIOR','DIRECTOR','Active','2026-11-25 08:01:35','2026-11-26 04:53:40'),(2,'ACCOUNT OFFICER','DIRECTOR','Active','2026-11-25 08:01:35','2026-11-26 04:53:40'),(3,'ADMIN MANAGER','HEAD OPERATION','Active','2026-11-26 04:53:40','2026-11-26 04:53:40'),(4,'ASST MANAGER OVERSEAS','HEAD OPERATION','Active','2026-11-26 04:53:40','2026-11-26 04:53:40'),(5,'CHIEF MARKETING MANAGER','DIRECTOR','Active','2026-11-26 04:53:40','2026-11-26 04:53:40'),(6,'DIRECTOR','DIRECTOR','Active','2026-11-26 04:53:40','2026-11-26 04:53:40'),(7,'HEAD OPERATION','ACCOUNT OFFICER','Active','2026-11-26 04:53:40','2026-11-26 04:53:40'),(8,'MANAGER OVERSEAS','HEAD OPERATION','Active','2026-11-26 04:53:40','2026-11-26 04:53:40'),(16,'TEST','CHIEF MARKETING MANAGER','Active','2026-11-26 09:14:03','2026-11-26 09:14:03');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'followup_type','FT-01','e-mail','Active',1,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(2,'followup_type','FT-02','Incoming Call','Active',2,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(3,'followup_type','FT-03','Outgoing Call','Active',3,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(4,'followup_type','FT-04','Walkin','Active',4,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(5,'enquiry_source','SRC-01','Advertisement','Active',1,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(6,'enquiry_source','SRC-02','Walkin','Active',2,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(7,'enquiry_source','SRC-03','Referral','Active',3,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(8,'enquiry_source','SRC-04','Social Media','Active',4,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(9,'enquiry_source','SRC-05','Website','Active',5,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(10,'status','ST-01','Interested','Active',1,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(11,'status','ST-02','Not Interested','Active',2,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(12,'status','ST-03','Payment Pending','Active',3,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(13,'status','ST-04','Payment Received','Active',4,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(14,'status','ST-05','Unknown','Active',5,'2026-11-25 08:01:35','2026-11-25 08:01:35'),(39,'followup_type','FOL-72500763','Test','Active',0,'2026-11-27 09:41:40','2026-11-27 09:41:40'),(40,'enquiry_source','ENQ-72512614','Test','Active',0,'2026-11-27 09:41:52','2026-11-27 09:41:52'),(41,'status','STA-72524747','test','Active',0,'2026-11-27 09:42:04','2026-11-27 09:42:04');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_code` varchar(30) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `parents_mobile` varchar(30) DEFAULT NULL,
  `whatsapp` varchar(30) DEFAULT NULL,
  `address` text,
  `facebook` varchar(100) DEFAULT NULL,
  `alt_email` varchar(100) DEFAULT NULL,
  `enquiry_source` varchar(100) DEFAULT NULL,
  `enquiry_type` varchar(100) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `fees_total` decimal(10,2) DEFAULT '0.00',
  `fees_paid` decimal(10,2) DEFAULT '0.00',
  `status` varchar(30) DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_code` (`student_code`),
  KEY `course_id` (`course_id`),
  KEY `department_id` (`department_id`),
  KEY `idx_students_branch` (`branch_id`),
  KEY `idx_students_status` (`status`),
  KEY `idx_students_name` (`name`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `students_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (7,'STU-1795770913982','Manasa','7485963614','','7898654512','','','','','','COURSE',5,5,2,'','2026-11-27',10000.00,3000.00,'Active','2026-11-27 09:15:14','2026-11-27 09:58:19'),(8,'STU-1795775395956','New','7898564525','','9674852536','','','','','Referral','RECRUITMENT',3,3,1,'','2026-11-27',30000.00,10000.00,'Active','2026-11-27 10:29:55','2026-11-27 10:32:08');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','Administrator','admin@naipunya.edu.in',NULL,1,1,'240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Active','2026-11-25 08:01:35','2026-11-26 06:25:07'),(5,'new','new','','',2,1,'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3','Active','2026-11-26 06:46:44','2026-11-27 06:16:16'),(10,'Test','Test','','',6,3,'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad','Active','2026-11-27 09:42:51','2026-11-27 09:42:51');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-27 16:36:52
