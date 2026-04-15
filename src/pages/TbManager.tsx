import { useState } from "react";
import { useData } from "../context/DataContext";
import { useUser } from "../context/UserContext";
import { hasOverlap } from "../utils/leaveUtils";
import { motion } from "motion/react"


export default function TbManager() {
  const { leaves, updateLeave } = useData();
  const { currentUser, setCurrentUser } = useUser();
const [comm, setComm] = useState<{ [key: string]: string }>({});
const approvedLeaves = leaves.filter(
    (l) => l.status === "approuvée"
  );
const hasConflict = (currentLeave: any) => {
  return approvedLeaves.some(
    (l) =>
      l.userId !== currentLeave.userId &&
      hasOverlap(
        new Date(currentLeave.startDate),
        new Date(currentLeave.endDate),
        new Date(l.startDate),
        new Date(l.endDate)
      )
  );
};
const pendingLeaves = leaves.filter(
    (leave) => leave.status === "en attente"
  );

  const handleDecision = (
    leave: any,
    status: "approuvée" | "rejetée"
  ) => {
    updateLeave({
      ...leave,
      status,
      comment: comm[leave.id] || ""
    });

    
    setComm((prev) => ({ ...prev, [leave.id]: "" }));
  };

  return (
<motion.li
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between gap-2 p-3 rounded-lg bg-base-200"
    >
<div className="p-5">
      <h1 className="text-3xl font-bold text-center">
        Responsable : {currentUser?.name}
      </h1>

      

      <h2 className="text-3xl font-bold">
        Demandes en attente
      </h2>

      {pendingLeaves.length === 0 && (
        <p>Aucune demande</p>
      )}

      {pendingLeaves.map((leave) => {
        const conflict = hasConflict(leave);

        return (
          <div key={leave.id} className="border p-3 mt-2">
            <p>ID Employé : {leave.userId}</p>
            <p>{leave.type}</p>
            <p>{leave.reason}</p>
            <p>
              {leave.startDate} → {leave.endDate}
            </p>

            {conflict && (
              <p style={{ color: "red" }}>
                Conflit détecté
              </p>
            )}

            
            <input
              type="text"
              placeholder="Ajouter un commentaire"
              className="input input-bordered w-full mt-2"
              value={comm[leave.id] || ""}
              onChange={(e) =>
                setComm({
                  ...comm,
                  [leave.id]: e.target.value
                })
              }
            />

            <button
              className="btn btn-success mt-2"
              onClick={() =>
                handleDecision(leave, "approuvée")
              }
            >
              Approuver
            </button>

            <button
              className="btn btn-sm btn-error btn-soft ml-4 mt-2"
              onClick={() =>
                handleDecision(leave, "rejetée")
              }
            >
              Rejeter
            </button>
          </div>
        );
      })}
       <br />
 <button
        className="btn btn-primary"
        onClick={() => setCurrentUser(null)}
      >
        Déconnexion
      </button>
    </div>
    </motion.li>
  );
}