import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost, apiPatch } from "../utils/api";
import { useUser } from "./UserContext";
import type { Demande, Status } from "../types";

type DataContextType = {
  demandes: Demande[];
  loading: boolean;
  fetchDemandes: () => Promise<void>;
  addDemande: (data: {
    employe_id: number;
    type: string;
    start_date: string;
    end_date: string;
    reason: string;
  }) => Promise<void>;
  updateDemande: (id: number, status: Status, comment: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUser();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDemandes = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (currentUser.role === "Responsable") {
        const equipe = encodeURIComponent(currentUser.equipe);
        const data = await apiGet<Demande[]>(`/demandes?equipe=${equipe}`);
        setDemandes(data);
      } else {
        const data = await apiGet<Demande[]>(
          `/demandes/employe/${currentUser.id}`
        );
        setDemandes(data);
      }
    } catch (err) {
      console.error("Erreur chargement demandes :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, [currentUser?.id]);

  const addDemande = async (data: {
    employe_id: number;
    type: string;
    start_date: string;
    end_date: string;
    reason: string;
  }) => {
    await apiPost("/demandes", data);
    await fetchDemandes();
  };

  const updateDemande = async (
    id: number,
    status: Status,
    comment: string
  ) => {
    await apiPatch(`/demandes/${id}`, { status, comment });
    await fetchDemandes();
  };

  return (
    <DataContext.Provider
      value={{ demandes, loading, fetchDemandes, addDemande, updateDemande }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside DataProvider");
  return context;
};
