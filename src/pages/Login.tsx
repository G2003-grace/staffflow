import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../context/UserContext";
import { apiPost } from "../utils/api";
import type { Utilisateur } from "../types";
import TbManager from "./TbManager";
import TbEnploye from "./TbEnploye";

type View = "choose" | "responsable" | "employe";


type EtapeEmploye = "identite" | "equipe";

export default function Login() {
  const { currentUser, setCurrentUser } = useUser();
  const [view, setView] = useState<View>("choose");

  
  const [rNom, setRNom] = useState("");
  const [rPrenom, setRPrenom] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rEquipe, setREquipe] = useState("");

  const [eNom, setENom] = useState("");
  const [ePrenom, setEPrenom] = useState("");
  const [eEquipe, setEEquipe] = useState("");
  const [etape, setEtape] = useState<EtapeEmploye>("identite");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  if (currentUser) {
    return currentUser.role === "Responsable" ? <TbManager /> : <TbEnploye />;
  }

  const handleResponsable = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost<Utilisateur>("/responsables", {
        nom: rNom, prenom: rPrenom, email: rEmail, equipe: rEquipe,
      });
      setCurrentUser(data);
    } catch (err: any) {
      setError(err.message ?? "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  
  const handleIdentite = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost<any>("/employes", { nom: eNom, prenom: ePrenom });

      if (data.needsEquipe) {
        
        setEtape("equipe");
        return;
      }
      
      setCurrentUser(data as Utilisateur);
    } catch (err: any) {
      setError(err.message ?? "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  
  const handleEquipe = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost<Utilisateur>("/employes", {
        nom: eNom, prenom: ePrenom, equipe: eEquipe,
      });
      setCurrentUser(data);
    } catch (err: any) {
      setError(err.message ?? "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const resetEmploye = () => {
    setEtape("identite");
    setENom("");
    setEPrenom("");
    setEEquipe("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <AnimatePresence mode="wait">

        {/* ── Choix du rôle ── */}
        {view === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card bg-base-100 shadow-xl w-full max-w-sm p-8"
          >
            <h1 className="text-3xl font-bold text-center mb-2">StaffFlow</h1>
            <p className="text-center text-base-content/60 mb-8">
              Choisissez votre rôle pour continuer
            </p>
            <div className="flex flex-col gap-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => { setView("responsable"); setError(""); }}
              >
                Responsable
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => { setView("employe"); resetEmploye(); }}
              >
                Employé
              </button>
            </div>
          </motion.div>
        )}

        
        {view === "responsable" && (
          <motion.div
            key="responsable"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="card bg-base-100 shadow-xl w-full max-w-sm p-8"
          >
            <button className="btn btn-ghost btn-sm mb-4 self-start"
              onClick={() => setView("choose")}>
              ← Retour
            </button>
            <h2 className="text-2xl font-bold mb-1">Espace Responsable</h2>
            <p className="text-sm text-base-content/50 mb-6">
              Si votre email est déjà enregistré, vous serez reconnecté automatiquement.
            </p>

            <form onSubmit={handleResponsable} className="flex flex-col gap-4">
              <div>
                <label className="label label-text">Nom</label>
                <input className="input input-bordered w-full" placeholder="Dupont"
                  value={rNom} onChange={(e) => setRNom(e.target.value)} required />
              </div>
              <div>
                <label className="label label-text">Prénom</label>
                <input className="input input-bordered w-full" placeholder="Marie"
                  value={rPrenom} onChange={(e) => setRPrenom(e.target.value)} required />
              </div>
              <div>
                <label className="label label-text">Email</label>
                <input className="input input-bordered w-full" type="email"
                  placeholder="marie@entreprise.com"
                  value={rEmail} onChange={(e) => setREmail(e.target.value)} required />
              </div>
              <div>
                <label className="label label-text">Équipe dont vous êtes responsable</label>
                <input className="input input-bordered w-full" placeholder="Équipe A"
                  value={rEquipe} onChange={(e) => setREquipe(e.target.value)} required />
              </div>

              {error && <p className="text-error text-sm">{error}</p>}

              <button className="btn btn-primary mt-2" type="submit" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Accéder"}
              </button>
            </form>
          </motion.div>
        )}

        
        {view === "employe" && etape === "identite" && (
          <motion.div
            key="employe-identite"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="card bg-base-100 shadow-xl w-full max-w-sm p-8"
          >
            <button className="btn btn-ghost btn-sm mb-4 self-start"
              onClick={() => setView("choose")}>
              ← Retour
            </button>
            <h2 className="text-2xl font-bold mb-1">Espace Employé</h2>
            <p className="text-sm text-base-content/50 mb-6">
              Entrez votre nom et prénom pour accéder à votre espace.
            </p>

            <form onSubmit={handleIdentite} className="flex flex-col gap-4">
              <div>
                <label className="label label-text">Nom</label>
                <input className="input input-bordered w-full" placeholder="Martin"
                  value={eNom} onChange={(e) => setENom(e.target.value)} required />
              </div>
              <div>
                <label className="label label-text">Prénom</label>
                <input className="input input-bordered w-full" placeholder="Jean"
                  value={ePrenom} onChange={(e) => setEPrenom(e.target.value)} required />
              </div>

              {error && <p className="text-error text-sm">{error}</p>}

              <button className="btn btn-secondary mt-2" type="submit" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Continuer"}
              </button>
            </form>
          </motion.div>
        )}

      
        {view === "employe" && etape === "equipe" && (
          <motion.div
            key="employe-equipe"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="card bg-base-100 shadow-xl w-full max-w-sm p-8"
          >
            <button className="btn btn-ghost btn-sm mb-4 self-start"
              onClick={() => { setEtape("identite"); setError(""); }}>
              ← Retour
            </button>

          
            <div className="bg-base-200 rounded-lg px-4 py-3 mb-6">
              <p className="text-sm text-base-content/60">Première connexion pour</p>
              <p className="font-bold text-lg">{ePrenom} {eNom}</p>
            </div>

            <h2 className="text-xl font-bold mb-1">Votre équipe</h2>
            <p className="text-sm text-base-content/50 mb-6">
              Renseignez votre équipe pour créer votre compte.
            </p>

            <form onSubmit={handleEquipe} className="flex flex-col gap-4">
              <div>
                <label className="label label-text">Équipe</label>
                <input className="input input-bordered w-full" placeholder="Équipe A"
                  value={eEquipe} onChange={(e) => setEEquipe(e.target.value)} required />
              </div>

              {error && <p className="text-error text-sm">{error}</p>}

              <button className="btn btn-secondary mt-2" type="submit" disabled={loading}>
                {loading
                  ? <span className="loading loading-spinner loading-sm" />
                  : "Créer mon compte et accéder"}
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
