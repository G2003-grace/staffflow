
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demandes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employe_id` int NOT NULL,
  `categorie` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text,
  `status` varchar(20) NOT NULL DEFAULT 'en attente',
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employe_id` (`employe_id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `demandes` WRITE;
/*!40000 ALTER TABLE `demandes` DISABLE KEYS */;
INSERT INTO `demandes` VALUES (1,3,'Cong�s pay�s','2026-05-01','2026-05-10','Vacances �t�','en attente',NULL,'2026-04-16 17:56:31'),(2,4,'Récupération','2026-04-18','2026-05-10','malade','en attente',NULL,'2026-04-16 17:58:10'),(3,4,'Congés payés','2026-04-24','2026-06-07','Congés de maternité','approuvée','OK mais c\'est seulement pour une semaine','2026-04-16 17:58:57'),(4,5,'Récupération','2026-04-24','2026-07-12','Congés pour aller visiter ma mère','en attente',NULL,'2026-04-16 18:00:58'),(5,5,'Congés payés','2026-04-25','2026-05-10','BONNE NOUVELLE','en attente',NULL,'2026-04-16 18:01:32'),(6,4,'Maladie','2026-06-01','2026-06-05','Grippe','en attente',NULL,'2026-04-16 18:18:35'),(7,5,'Cong�s pay�s','2026-07-01','2026-07-15','�t�','en attente',NULL,'2026-04-16 18:18:35'),(8,8,'Congés payés','2026-04-18','2026-05-24','ATTENTION','en attente',NULL,'2026-04-16 18:24:30'),(9,8,'Congés payés','2026-03-31','2026-05-10','VACCANCES','en attente',NULL,'2026-04-16 18:25:32'),(10,9,'Récupération','2026-03-31','2026-04-18','Congé pour ma récupération','en attente',NULL,'2026-04-16 18:26:53'),(11,9,'Maladie','2026-04-18','2026-06-07','Pour ma santé','approuvée','ok bon congés','2026-04-16 18:27:41'),(12,10,'Récupération','2026-04-10','2026-06-07','demande de congés','rejetée','Non nous désolé','2026-04-17 08:53:36'),(13,11,'Récupération','2026-04-25','2026-09-06','Congés de détente','en attente',NULL,'2026-04-17 12:53:48');
/*!40000 ALTER TABLE `demandes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employes` (
  `idemployes` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL DEFAULT '',
  `poste` varchar(255) NOT NULL DEFAULT '',
  `equipe` varchar(255) NOT NULL,
  `idresponsables` int DEFAULT NULL,
  PRIMARY KEY (`idemployes`),
  KEY `fk_responsables` (`idresponsables`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `employes` WRITE;
/*!40000 ALTER TABLE `employes` DISABLE KEYS */;
INSERT INTO `employes` VALUES (2,'Dupont','Alice','','','Equipe B',NULL),(3,'Leroy','Sophie','','','Equipe C',NULL),(4,'Léolie','Sophie','','','equipe A',NULL),(5,'Grace','HOUEDANOU','','','equipe A',NULL),(6,'Duval','Luc','','','Equipe A',NULL),(7,'Blanc','Eva','','','Equipe B',NULL),(8,'Amos','HOUEDANOU','','','equipe A',NULL),(9,'Emmanuel','HOUEDANOU','','','equipe C',NULL),(10,'HOUEDANOU','Amos','','','Equipe A',NULL),(11,'HOUEDANOU','Merveille','','','Equipe A',NULL);
/*!40000 ALTER TABLE `employes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responsables` (
  `idresponsables` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `departement` varchar(100) NOT NULL DEFAULT '',
  `equipe` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`idresponsables`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `responsables` WRITE;
/*!40000 ALTER TABLE `responsables` DISABLE KEYS */;
INSERT INTO `responsables` VALUES (1,'BIENHEUREUSE','Grace','grace@gmail.com','RH',''),(2,'Merveille ','Gloire','gloire@gmail.com','','equipe C'),(3,'Rose','Gloire','rose@gmail.com','','equipe A'),(4,'Marie','Rose','marie@gmail.com','','Equipe A'),(5,'Marie','Rosa','rosa@gmail.com','','Equipe C');
/*!40000 ALTER TABLE `responsables` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

