import { createContext, useContext } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Demande } from "../types";

type DataContextType = {
  leaves: Demande[];
  addLeave: (leave: Demande) => void;
  updateLeave: (leave: Demande) => void;
};

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [leaves, setLeaves] = useLocalStorage<Demande[]>("leaves", []);

  const addLeave = (leave: Demande) => {
    setLeaves([...leaves, leave]);
  };

  const updateLeave = (updatedLeave: Demande) => {
    setLeaves(
      leaves.map((l) => (l.id === updatedLeave.id ? updatedLeave : l))
    );
  };

  return (
    <DataContext.Provider value={{ leaves, addLeave, updateLeave }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside DataProvider");
  return context;
};