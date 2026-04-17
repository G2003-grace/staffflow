import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// connexion MySQL WAMP
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Wamp = vide par défaut
  database: "staffflow",
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL connecté");
});

// GET demandes
app.get("/demandes", (req, res) => {
  db.query("SELECT * FROM demandes", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// POST demande
app.post("/demandes", (req, res) => {
  const { user_name, categorie, status, date } = req.body;

  const sql =
    "INSERT INTO demandes (user_name, categorie, status, date) VALUES (?, ?, ?, ?)";

  db.query(sql, [user_name, categorie, status, date], (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

app.listen(5000, () => {
  console.log("Serveur backend lancé sur port 5000");
});