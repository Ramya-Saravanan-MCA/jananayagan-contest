import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  const isAdmin = window.location.pathname === "/admin";

  return isAdmin ? <Admin /> : <Home />;
}

export default App;