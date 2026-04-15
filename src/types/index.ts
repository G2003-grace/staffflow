export type Role = "Employe" | "Responsable";

export type Utilisateur = {
  id: number;
  name: string;
  role: Role;
  equipe: string;
};

export type Categorie = "Congés payés" | "Récupération" | "Maladie";

export type Status = "en attente" | "approuvée" | "rejetée";

export type Demande = {
  id: number;
  userId: number;
   userName: string;
  type: Categorie;
  startDate: string;
  endDate: string;
  reason: string;
  status: Status;
  comment?: string;
  createdAt: string;
};