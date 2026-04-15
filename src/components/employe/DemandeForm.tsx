import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useUser } from "../../context/UserContext";
import { countWorkingDays } from "../../utils/dateUtils";

export default function DemandeForm() {
  const { addLeave } = useData();
  const { currentUser } = useUser();

  const [categorie, setCategorie] = useState("Congés payés");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

 const days =
  startDate && endDate
    ? countWorkingDays(new Date(startDate), new Date(endDate))
    : 0;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 if (reason.trim() === "") {
    alert("Veuillez nous donner la raison de votre absence svp!");
    return;
  }
    if (!currentUser) return;
 const newLeave = {
      id: Date.now(), 
      userId: currentUser.id,
      type: categorie,
      startDate,
      endDate,
      reason,
      status: "en attente",
      userName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    addLeave(newLeave);

    setCategorie("Congés payés");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  return (
    <form onSubmit={handleSubmit}> 
      <h2 className="text-3xl font-bold text-center">
        Nouvelle demande
      </h2>

      <select
        className="input w-full"
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
      >
        <option>Congés payés</option>
        <option>Récupération</option>
        <option>Maladie</option>
      </select>

      <br /><br />
    Date de début
 <input
  className="input w-1/2"
      
        type="date"
        
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)}
      />
      <br /> <br />
Date de fin
      

      <input
        className="input w-1/2"
          
        type="date"
      
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <br /><br />

      <p className="text-xl">Nombre de jours : {days}</p>

      <textarea
        className="input w-full"
        placeholder="Motif"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <br /><br />

      <button className="btn btn-primary" type="submit">
        Envoyer
      </button>
    </form>
  );
}