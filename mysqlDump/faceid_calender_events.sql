-- MySQL dump 10.13  Distrib 8.0.19, for macos10.15 (x86_64)
--
-- Host: localhost    Database: faceid
-- ------------------------------------------------------
-- Server version	8.0.15

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
-- Table structure for table `calender_events`
--

DROP TABLE IF EXISTS `calender_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calender_events` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_name` varchar(100) NOT NULL,
  `event_date` varchar(45) NOT NULL,
  `event_startTime` time NOT NULL,
  `event_endTime` time NOT NULL,
  `user` varchar(45) NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `event_name_idx` (`event_name`),
  KEY `user_idx` (`user`),
  CONSTRAINT `user` FOREIGN KEY (`user`) REFERENCES `user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=431 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calender_events`
--

LOCK TABLES `calender_events` WRITE;
/*!40000 ALTER TABLE `calender_events` DISABLE KEYS */;
INSERT INTO `calender_events` VALUES (351,'CSD-Lecture','2020-05-20','08:00:00','11:00:00','shriyanarang03@gmail.com'),(352,'AI-LAB','2020-05-26','08:00:00','11:00:00','shriyanarang03@gmail.com'),(353,'AI LECTURE','2020-06-01','08:00:00','09:00:00','shriyanarang03@gmail.com'),(354,'Guest Lecture ','2020-06-10','10:00:00','13:00:00','shriyanarang03@gmail.com'),(355,'AI lecture','2020-06-08','08:00:00','09:00:00','shriyanarang03@gmail.com'),(356,'BIS lecture','2020-06-10','10:45:00','12:45:00','shriyanarang03@gmail.com'),(357,'ITX Lecture','2020-06-12','10:30:00','11:30:00','shriyanarang03@gmail.com'),(358,'ITX-LECTURE','2020-06-15','12:00:00','14:00:00','shriyanarang03@gmail.com'),(359,'ROBOTICS LECTURE','2020-06-18','08:00:00','09:00:00','shriyanarang03@gmail.com'),(360,'BIS- LAB','2020-06-23','10:00:00','13:00:00','shriyanarang03@gmail.com'),(361,'CSD-Lecture','2020-05-20','08:00:00','11:00:00','shriyanarang03@gmail.com'),(362,'AI LECTURE','2020-06-01','08:00:00','09:00:00','shriyanarang03@gmail.com'),(363,'AI-LAB','2020-05-26','08:00:00','11:00:00','shriyanarang03@gmail.com'),(364,'ITX-LECTURE','2020-06-15','12:00:00','14:00:00','shriyanarang03@gmail.com'),(365,'ROBOTICS LECTURE','2020-06-18','08:00:00','09:00:00','shriyanarang03@gmail.com'),(366,'Guest Lecture ','2020-06-10','10:00:00','13:00:00','shriyanarang03@gmail.com'),(367,'ITX Lecture','2020-06-12','10:30:00','11:30:00','shriyanarang03@gmail.com'),(368,'BIS lecture','2020-06-10','10:45:00','12:45:00','shriyanarang03@gmail.com'),(369,'AI lecture','2020-06-08','08:00:00','09:00:00','shriyanarang03@gmail.com'),(370,'BIS- LAB','2020-06-23','10:00:00','13:00:00','shriyanarang03@gmail.com'),(371,'ITX LAB','2020-05-04','22:30:00','23:30:00','shriyanarang03@gmail.com'),(372,'Guest Lecture ','2020-06-10','10:00:00','13:00:00','shriyanarang03@gmail.com'),(373,'BIS lecture','2020-06-10','10:45:00','12:45:00','shriyanarang03@gmail.com'),(374,'ITX Lecture','2020-06-12','10:30:00','11:30:00','shriyanarang03@gmail.com'),(375,'ITX-LECTURE','2020-06-15','12:00:00','14:00:00','shriyanarang03@gmail.com'),(376,'CSD-Lecture','2020-05-20','08:00:00','11:00:00','shriyanarang03@gmail.com'),(377,'AI-LAB','2020-05-26','08:00:00','11:00:00','shriyanarang03@gmail.com'),(378,'AI LECTURE','2020-06-01','08:00:00','09:00:00','shriyanarang03@gmail.com'),(379,'AI lecture','2020-06-08','08:00:00','09:00:00','shriyanarang03@gmail.com'),(380,'ROBOTICS LECTURE','2020-06-18','08:00:00','09:00:00','shriyanarang03@gmail.com'),(381,'ITX LAB','2020-05-04','22:30:00','23:30:00','shriyanarang03@gmail.com'),(382,'CSD-Lecture','2020-05-20','08:00:00','11:00:00','shriyanarang03@gmail.com'),(383,'AI-LAB','2020-05-26','08:00:00','11:00:00','shriyanarang03@gmail.com'),(384,'AI LECTURE','2020-06-01','08:00:00','09:00:00','shriyanarang03@gmail.com'),(385,'AI lecture','2020-06-08','08:00:00','09:00:00','shriyanarang03@gmail.com'),(386,'Guest Lecture ','2020-06-10','10:00:00','13:00:00','shriyanarang03@gmail.com'),(387,'BIS lecture','2020-06-10','10:45:00','12:45:00','shriyanarang03@gmail.com'),(388,'ITX Lecture','2020-06-12','10:30:00','11:30:00','shriyanarang03@gmail.com'),(389,'ITX-LECTURE','2020-06-15','12:00:00','14:00:00','shriyanarang03@gmail.com'),(390,'ROBOTICS LECTURE','2020-06-18','08:00:00','09:00:00','shriyanarang03@gmail.com');
/*!40000 ALTER TABLE `calender_events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-07  1:44:53
