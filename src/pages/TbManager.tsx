import { useState } from "react";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";
import { useUser } from "../context/UserContext";
import { hasOverlap } from "../utils/leaveUtils";
import type { Demande, Responsable, Status } from "../types";

const STATUS_BADGE: Record<Status, string> = {
  "en attente": "badge-warning",
  "approuvée":  "badge-success",
  "rejetée":    "badge-error",
};

export default function TbManager() {
  const { demandes, loading, updateDemande } = useData();
  const { currentUser, setCurrentUser } = useUser();

  const [comments, setComments] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<"tous" | Status>("en attente");

  const responsable = currentUser as Responsable;

  const approvedLeaves = demandes.filter((d) => d.status === "approuvée");

  const hasConflict = (d: Demande) =>
    approvedLeaves.some(
      (a) =>
        a.employe_id !== d.employe_id &&
        hasOverlap(
          new Date(d.start_date),
          new Date(d.end_date),
          new Date(a.start_date),
          new Date(a.end_date)
        )
    );

  const handleDecision = async (d: Demande, status: "approuvée" | "rejetée") => {
    await updateDemande(d.id, status, comments[d.id] ?? "");
    setComments((prev) => ({ ...prev, [d.id]: "" }));
  };

  const filtered =
    filter === "tous" ? demandes : demandes.filter((d) => d.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto p-6"
    >
      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {responsable.prenom} {responsable.nom}
          </h1>
          <p className="text-base-content/60 text-sm">
            Responsable de : {responsable.equipe}
          </p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCurrentUser(null)}
        >
          Déconnexion
        </button>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["tous", "en attente", "approuvée", "rejetée"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Chargement ── */}
      {loading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {/* ── Aucune demande ── */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-base-content/50 py-12">
          Aucune demande
        </p>
      )}

      {/* ── Liste des demandes ── */}
      <div className="flex flex-col gap-4">
        {filtered.map((d) => {
          const conflict = hasConflict(d);

          return (
            <div
              key={d.id}
              className="card bg-base-100 shadow border border-base-300 p-5"
            >
              {/* Identité employé + statut */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-lg">
                    {d.employe_nom} {d.employe_prenom}
                  </p>
                  {d.equipe && (
                    <p className="text-sm text-base-content/60">
                      Équipe : {d.equipe}
                    </p>
                  )}
                </div>
                <span className={`badge ${STATUS_BADGE[d.status]}`}>
                  {d.status}
                </span>
              </div>

              {/* Détails demande */}
              <div className="flex flex-wrap gap-4 text-sm mb-3">
                <span className="font-medium">{d.type}</span>
                <span className="text-base-content/70">
                  {d.start_date} → {d.end_date}
                </span>
              </div>

              {d.reason && (
                <p className="text-sm italic text-base-content/70 mb-3">
                  Motif : {d.reason}
                </p>
              )}

              {conflict && (
                <p className="text-error text-sm font-medium mb-3">
                  ⚠ Conflit de dates détecté avec une autre demande approuvée
                </p>
              )}

              {/* Commentaire déjà posé */}
              {d.comment && d.status !== "en attente" && (
                <p className="text-sm text-info mb-3">
                  Commentaire : {d.comment}
                </p>
              )}

              {/* Actions (seulement si en attente) */}
              {d.status === "en attente" && (
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Ajouter un commentaire (optionnel)"
                    className="input input-bordered input-sm w-full"
                    value={comments[d.id] ?? ""}
                    onChange={(e) =>
                      setComments((prev) => ({ ...prev, [d.id]: e.target.value }))
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleDecision(d, "approuvée")}
                    >
                      Approuver
                    </button>
                    <button
                      className="btn btn-error btn-sm btn-soft"
                      onClick={() => handleDecision(d, "rejetée")}
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
