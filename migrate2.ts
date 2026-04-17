import mysql from "mysql2/promise";
async function migrate() {
  const pool = mysql.createPool({ host:"localhost", user:"root", password:"", database:"staffflow" });
  const [cols] = await pool.query("SHOW COLUMNS FROM responsables LIKE 'equipe'") as any;
  if (cols.length === 0) {
    await pool.query("ALTER TABLE responsables ADD COLUMN equipe VARCHAR(100) NOT NULL DEFAULT ''");
    console.log("✅ Colonne 'equipe' ajoutée à responsables");
  } else {
    console.log("✅ Colonne 'equipe' existe déjà");
  }
  await pool.end();
}
migrate();
