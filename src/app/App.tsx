import { DataProvider } from "../context/DataContext";
import { UserProvider } from "../context/UserContext";
import Login from "../pages/Login";

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <Login />
      </DataProvider>
    </UserProvider>
  );
}

export default App;