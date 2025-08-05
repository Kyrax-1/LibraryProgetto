-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: gestionebiblioteca
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `libro`
--

DROP TABLE IF EXISTS `libro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `libro` (
  `LibroID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `author` varchar(45) NOT NULL,
  `isAvailable` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`LibroID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libro`
--

LOCK TABLES `libro` WRITE;
/*!40000 ALTER TABLE `libro` DISABLE KEYS */;
INSERT INTO `libro` VALUES (2,'Jane Eyre','Charlotte Brontë',0),(5,'Il Nome della Rosa','Umberto Eco',1),(6,'La Solitudine dei Numeri Primi','Paolo Giordano',0),(7,'Io prima di te','Jojo Moyes',1),(10,'Saga di Geralt di Rivia','Andrzej Sapkowski',1),(11,'1984','George Orwell',1),(12,'Le avventure di Pinocchio','Carlo Collodi',1),(13,'Le avventure di Pinocchio','Carlo Collodi',1),(14,'Le avventure di Pinocchio','Carlo Collodi',1),(16,'Le avventure di Pinocchio (Edizione illustrata)','Carlo Collodi',1),(17,'Io Robot','Isaac Asimov',1),(18,'Hunger Games','Suzanne Collins',1);
/*!40000 ALTER TABLE `libro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestito`
--

DROP TABLE IF EXISTS `prestito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestito` (
  `PrestitoID` int NOT NULL AUTO_INCREMENT,
  `UtenteID` int NOT NULL,
  `LibroID` int NOT NULL,
  `loanDate` date NOT NULL,
  `loanExpir` date NOT NULL,
  `borrowerName` varchar(45) NOT NULL,
  PRIMARY KEY (`PrestitoID`,`LibroID`,`UtenteID`),
  KEY `prestito_ibfk_2` (`LibroID`),
  KEY `fk_prestito_utente` (`UtenteID`),
  CONSTRAINT `fk_prestito_utente` FOREIGN KEY (`UtenteID`) REFERENCES `utente` (`UtenteID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prestito_ibfk_2` FOREIGN KEY (`LibroID`) REFERENCES `libro` (`LibroID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestito`
--

LOCK TABLES `prestito` WRITE;
/*!40000 ALTER TABLE `prestito` DISABLE KEYS */;
INSERT INTO `prestito` VALUES (12,7,2,'2025-08-04','2025-09-03','Mario Rossi'),(16,9,6,'2025-08-05','2025-10-04','Adolfo Artie');
/*!40000 ALTER TABLE `prestito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utente`
--

DROP TABLE IF EXISTS `utente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utente` (
  `UtenteID` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(45) NOT NULL,
  `Cognome` varchar(45) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Role` varchar(50) DEFAULT 'user',
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`UtenteID`),
  UNIQUE KEY `Email_UNIQUE` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utente`
--

LOCK TABLES `utente` WRITE;
/*!40000 ALTER TABLE `utente` DISABLE KEYS */;
INSERT INTO `utente` VALUES (6,'Tuonome','Tuocognome','tua.email@example.com','user','$2b$10$6jOPywluoFpaMh2PW.AjteSO6WxcAqr6OyDCIN0W9vYLgMQsZvhRG'),(7,'Mario','Rossi','mario.rossi@example.com','user','$2b$10$sITmrh4mBAyzCxF5CYuNbefuSbLjWAO7AdMXzIUIwwNwY9l8TD5bq'),(8,'Vito','Colucci','vitocolucci95@gmail.com','admin','$2b$10$NJmNeGvRZ7M1KJsGuhEpJe5u2CSa32hABN//e4ST9rUJ18ayGecNC'),(9,'Adolfo','Artie','dio.perdono@abbi.xn--piet-3na','user','$2b$10$3k3.0gZCmfSusAjtblZQtu0IEMDfFxPwKHfeVuoRaR8hT9wcfUZ3.'),(10,'Admin','Demo','admin@example.com','admin','$2b$10$ldqYCfoNrTefWD6tAHY3JeyZDSxOb.HHBI6QDe6migD0dgYhVjM2G'),(11,'Guest','User','guest@example.com','user','$2b$10$1DxmJc./SWaq33pLHqEJpu5ixRfww80vV5wONvJXRj4x7AsgSqoX.');
/*!40000 ALTER TABLE `utente` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-05 22:52:40
