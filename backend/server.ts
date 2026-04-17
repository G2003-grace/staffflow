import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "staffflow",
  waitForConnections: true,
  connectionLimit: 10,
});

pool.query("SELECT 1")
  .then(() => console.log("✅ MySQL connecté"))
  .catch((err: Error) => console.error("❌ Erreur MySQL :", err.message));

// ============================================================
// RESPONSABLES  (PK = idresponsables)
// ============================================================

app.get("/responsables", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT idresponsables AS id, nom, prenom, email, equipe FROM responsables"
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST — inscription / reconnexion par email
app.post("/responsables", async (req, res) => {
  const { nom, prenom, email, equipe } = req.body;
  if (!nom || !prenom || !email || !equipe) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT idresponsables AS id, nom, prenom, email, equipe FROM responsables WHERE email = ?",
      [email]
    ) as any;

    if (existing.length > 0) {
      return res.json({ ...existing[0], role: "Responsable", exists: true });
    }

    const [result] = await pool.query(
      "INSERT INTO responsables (nom, prenom, email, equipe) VALUES (?, ?, ?, ?)",
      [nom, prenom, email, equipe]
    ) as any;

    res.status(201).json({
      id: result.insertId, nom, prenom, email, equipe,
      role: "Responsable", exists: false,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// EMPLOYÉS  (PK = idemployes)
// ============================================================

app.get("/employes", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT idemployes AS id, nom, prenom, equipe FROM employes"
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST — trouver par nom+prénom OU créer avec équipe
app.post("/employes", async (req, res) => {
  const { nom, prenom, equipe } = req.body;
  if (!nom || !prenom) {
    return res.status(400).json({ error: "Nom et prénom obligatoires" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT idemployes AS id, nom, prenom, equipe FROM employes WHERE LOWER(nom) = LOWER(?) AND LOWER(prenom) = LOWER(?)",
      [nom, prenom]
    ) as any;

    if (existing.length > 0) {
      return res.json({ ...existing[0], role: "Employe", exists: true });
    }

    if (!equipe) {
      return res.json({ exists: false, needsEquipe: true });
    }

    const [result] = await pool.query(
      "INSERT INTO employes (nom, prenom, equipe, email, poste) VALUES (?, ?, ?, '', '')",
      [nom, prenom, equipe]
    ) as any;

    res.status(201).json({
      id: result.insertId, nom, prenom, equipe,
      role: "Employe", exists: false,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
// DEMANDES  (FK employe_id → employes.idemployes)
// ============================================================

// GET — demandes filtrées par équipe (pour le responsable)
// ?equipe=EquipeA  → demandes des employés de cette équipe uniquement
app.get("/demandes", async (req, res) => {
  try {
    const equipe = req.query.equipe as string | undefined;

    let sql = `
      SELECT
        d.id, d.employe_id, d.categorie AS type,
        d.start_date, d.end_date, d.reason,
        d.status, d.comment, d.created_at,
        e.nom AS employe_nom, e.prenom AS employe_prenom, e.equipe
      FROM demandes d
      INNER JOIN employes e ON d.employe_id = e.idemployes
    `;
    const params: string[] = [];

    if (equipe) {
      sql += " WHERE LOWER(e.equipe) = LOWER(?)";
      params.push(equipe);
    }

    sql += " ORDER BY d.created_at DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET — demandes d'un seul employé
app.get("/demandes/employe/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        d.id, d.employe_id, d.categorie AS type,
        d.start_date, d.end_date, d.reason,
        d.status, d.comment, d.created_at,
        e.nom AS employe_nom, e.prenom AS employe_prenom
      FROM demandes d
      INNER JOIN employes e ON d.employe_id = e.idemployes
      WHERE d.employe_id = ?
      ORDER BY d.created_at DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST — soumettre une nouvelle demande
app.post("/demandes", async (req, res) => {
  const { employe_id, type, start_date, end_date, reason } = req.body;
  if (!employe_id || !type || !start_date || !end_date) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO demandes (employe_id, categorie, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)",
      [employe_id, type, start_date, end_date, reason ?? ""]
    ) as any;
    res.status(201).json({ id: result.insertId, message: "Demande créée" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH — approuver / rejeter / commenter
app.patch("/demandes/:id", async (req, res) => {
  const { status, comment } = req.body;
  if (!status) return res.status(400).json({ error: "Statut obligatoire" });

  try {
    await pool.query(
      "UPDATE demandes SET status = ?, comment = ? WHERE id = ?",
      [status, comment ?? "", req.params.id]
    );
    res.json({ message: "Demande mise à jour" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
