-- ============================================================
-- StaffFlow - Schéma de base de données MySQL
-- ============================================================
-- Importer dans phpMyAdmin (WAMP) ou via :
--   mysql -u root < staffflow.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS staffflow;
USE staffflow;

-- ============================================================
-- TABLE : responsables
-- Champs : nom, prenom, email (unique), departement
-- ============================================================
CREATE TABLE IF NOT EXISTS responsables (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL,
  prenom      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  departement VARCHAR(100) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE : employes
-- Champs : nom, prenom, equipe
-- ============================================================
CREATE TABLE IF NOT EXISTS employes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nom        VARCHAR(100) NOT NULL,
  prenom     VARCHAR(100) NOT NULL,
  equipe     VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE : demandes
-- Liée à employes via employe_id
-- Statuts : en attente | approuvée | rejetée
-- ============================================================
CREATE TABLE IF NOT EXISTS demandes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  employe_id  INT NOT NULL,
  type        ENUM('Congés payés', 'Récupération', 'Maladie') NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  reason      TEXT,
  status      ENUM('en attente', 'approuvée', 'rejetée') NOT NULL DEFAULT 'en attente',
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employe_id) REFERENCES employes(id) ON DELETE CASCADE
);
