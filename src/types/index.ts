export type Role = "Employe" | "Responsable";

// ── Responsable ───────────────────────────────────────────
export type Responsable = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  equipe: string;
  role: "Responsable";
};

// ── Employé ───────────────────────────────────────────────
export type Employe = {
  id: number;
  nom: string;
  prenom: string;
  equipe: string;
  role: "Employe";
};

export type Utilisateur = Responsable | Employe;

// ── Demande ───────────────────────────────────────────────
export type Categorie = "Congés payés" | "Récupération" | "Maladie";

export type Status = "en attente" | "approuvée" | "rejetée";

export type Demande = {
  id: number;
  employe_id: number;
  employe_nom: string;
  employe_prenom: string;
  equipe?: string;
  type: Categorie;
  start_date: string;
  end_date: string;
  reason: string;
  status: Status;
  comment?: string;
  created_at: string;
};
