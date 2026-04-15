import { useState } from "react";
import { useData } from "../context/DataContext";
import { useUser } from "../context/UserContext";
import DemandeForm from "../components/employe/DemandeForm";
import { motion } from "motion/react"


export default function TbEnploye() {
  const { leaves } = useData();
  const { currentUser, setCurrentUser } = useUser();

  const [filter, setFilter] = useState<
    "tous" | "en attente" | "approuvée" | "rejetée"
  >("tous");

  const myLeaves = leaves.filter(
    (leave) => leave.userId === currentUser?.id
  );

  const filteredLeaves = myLeaves.filter((leave) => {
    if (filter === "tous") return true;
    return leave.status === filter;
  });

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
      <h1 className="text-3xl font-bold">Employé : {currentUser?.name}</h1>

     

      <DemandeForm />

      <h2 className="text-3xl font-bold">Mes demandes</h2>

      <div className="flex  gap-3 mt-5">
        <button onClick={() => setFilter("tous")} className="btn btn-primary">Tous</button>
        <button onClick={() => setFilter("en attente")} className="btn btn-secondary">
          En attente
        </button>
        <button onClick={() => setFilter("approuvée")} className="btn btn-success">
          Approuvée
        </button>
        <button onClick={() => setFilter("rejetée")} className="btn btn-error">
          Rejetée
        </button>
      </div>

      {filteredLeaves.map((leave) => (
  <div key={leave.id} className="border p-2 mt-2">

    <p>{leave.type}</p>
<p>{leave.startDate} → {leave.endDate} </p>
<p>{leave.status}</p>
<p>{leave.reason}</p>
 {leave.status !== "en attente" && (
      <p  style={{ color: "yellow" }}>Décision prise</p>
    )}
 {leave.comment && (
      <p className="text-blue-600 mt-2">
         Commentaire : {leave.comment}
      </p>
    )}

 
  </div>
))}
<br />
 <button className="btn btn-primary" onClick={() => setCurrentUser(null)}>
        Déconnexion
      </button>
    </div>
    </motion.li>
  );
}