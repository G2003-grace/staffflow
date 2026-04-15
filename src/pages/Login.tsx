import { useUser } from "../context/UserContext";
import TbEnploye from "./TbEnploye";
import TbManager from "./TbManager";
import { motion } from "motion/react"
export default function Login() {
  const { currentUser, setCurrentUser } = useUser();

  if (currentUser) {
    if (currentUser.role === "Responsable") {
      return <TbManager />;
    }

    return <TbEnploye/>;
  }

  const fakeUsers = [
    { id: "1", name: "Jean", role: "Employé", equipe: "A" },
    
    { id: "2", name: "Marie", role: "Responsable", equipe: "A" }
  ];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between gap-2 p-3 rounded-lg bg-base-200"
    >
   <div>
  <h1 className="text-3xl font-bold text-center">
    Choisir un profil
  </h1>

  
  <div className="flex justify-center gap-6 mt-5">
    {fakeUsers.map((user) => (
      <button
        className="btn btn-primary text-lg px-6"
        key={user.id}
        onClick={() => setCurrentUser(user as any)}
      >
        {user.role}
      </button>
    ))}
  </div>
</div>
    </motion.li>
  );
}