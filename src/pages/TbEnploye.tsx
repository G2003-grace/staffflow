import { useState } from "react";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";
import { useUser } from "../context/UserContext";
import DemandeForm from "../components/employe/DemandeForm";
import type { Employe, Status } from "../types";

const STATUS_BADGE: Record<Status, string> = {
  "en attente": "badge-warning",
  "approuvée":  "badge-success",
  "rejetée":    "badge-error",
};

export default function TbEnploye() {
  const { demandes, loading } = useData();
  const { currentUser, setCurrentUser } = useUser();
  const [filter, setFilter] = useState<"tous" | Status>("tous");
  const [showForm, setShowForm] = useState(false);

  const employe = currentUser as Employe;
  const isFirstVisit = !loading && demandes.length === 0;

  const filtered =
    filter === "tous" ? demandes : demandes.filter((d) => d.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto p-6"
    >
      {/* ── En-tête ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {employe.prenom} {employe.nom}
          </h1>
          <p className="text-base-content/60 text-sm">Espace employé</p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCurrentUser(null)}
        >
          Déconnexion
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!loading && (
        <>
          {/* ══════════════════════════════════════════
              PREMIÈRE VISITE — formulaire mis en avant
          ══════════════════════════════════════════ */}
          {isFirstVisit && (
            <div className="card bg-base-100 shadow p-6">
              <p className="text-base-content/60 text-sm mb-4">
                Bienvenue ! Soumettez votre première demande ci-dessous.
              </p>
              <DemandeForm />
            </div>
          )}

          {/* ══════════════════════════════════════════
              RETOUR — demandes passées + bouton nouvelle demande
          ══════════════════════════════════════════ */}
          {!isFirstVisit && (
            <>
              {/* Bouton nouvelle demande */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Mes demandes</h2>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowForm((v) => !v)}
                >
                  {showForm ? "Fermer" : "+ Nouvelle demande"}
                </button>
              </div>

              {/* Formulaire (dépliable) */}
              {showForm && (
                <div className="card bg-base-100 shadow p-6 mb-6">
                  <DemandeForm onSuccess={() => setShowForm(false)} />
                </div>
              )}

              {/* Filtres */}
              <div className="flex flex-wrap gap-2 mb-4">
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

              {/* Liste des demandes passées */}
              {filtered.length === 0 ? (
                <p className="text-center text-base-content/40 py-8">
                  Aucune demande pour ce filtre
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map((d) => (
                    <div
                      key={d.id}
                      className="card bg-base-100 shadow border border-base-300 p-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{d.type}</span>
                        <span className={`badge ${STATUS_BADGE[d.status]}`}>
                          {d.status}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/60">
                        {d.start_date} → {d.end_date}
                      </p>
                      {d.reason && (
                        <p className="text-sm mt-1 italic text-base-content/70">
                          {d.reason}
                        </p>
                      )}
                      {d.comment && (
                        <p className="text-sm mt-2 text-info font-medium">
                          Commentaire : {d.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
