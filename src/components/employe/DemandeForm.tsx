import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useUser } from "../../context/UserContext";
import { countWorkingDays } from "../../utils/dateUtils";
import type { Categorie } from "../../types";

type Props = {
  onSuccess?: () => void;
};

export default function DemandeForm({ onSuccess }: Props) {
  const { addDemande } = useData();
  const { currentUser } = useUser();

  const [categorie, setCategorie] = useState<Categorie>("Congés payés");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const days =
    startDate && endDate
      ? countWorkingDays(new Date(startDate), new Date(endDate))
      : 0;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Veuillez nous donner la raison de votre absence svp!");
      return;
    }
    if (!currentUser || currentUser.role !== "Employe") return;

    setLoading(true);
    try {
      await addDemande({
        employe_id: currentUser.id,
        type: categorie,
        start_date: startDate,
        end_date: endDate,
        reason,
      });
      setCategorie("Congés payés");
      setStartDate("");
      setEndDate("");
      setReason("");
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onSuccess?.(); }, 2000);
    } catch (err) {
      alert("Erreur lors de l'envoi. Vérifiez la connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 my-4">
      <h2 className="text-2xl font-bold">Nouvelle demande</h2>

      <select
        className="select select-bordered w-full"
        value={categorie}
        onChange={(e) => setCategorie(e.target.value as Categorie)}
      >
        <option>Congés payés</option>
        <option>Récupération</option>
        <option>Maladie</option>
      </select>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="label label-text">Date de début</label>
          <input
            className="input input-bordered w-full"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="label label-text">Date de fin</label>
          <input
            className="input input-bordered w-full"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      {days > 0 && (
        <p className="text-sm font-medium">
          Nombre de jours ouvrés : <span className="font-bold">{days}</span>
        </p>
      )}

      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Motif de la demande..."
        rows={3}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />

      {success && (
        <p className="text-success text-sm font-medium">
          Demande envoyée avec succès !
        </p>
      )}

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "Envoyer la demande"
        )}
      </button>
    </form>
  );
}
