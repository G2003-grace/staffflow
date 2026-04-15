import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Utilisateur } from "../types";

type UserContextType = {
  currentUser: Utilisateur | null;
  setCurrentUser: (utilisateur: Utilisateur | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useLocalStorage<Utilisateur | null>(
    "currentUser",
    null
  );

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};