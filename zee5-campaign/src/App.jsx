import Home from "./pages/Home";
import Admin from "./pages/Admin";
import TermsAndConditions from "./pages/TermsAndConditions";

function App() {
  const pathname = window.location.pathname;

  if (pathname === "/admin") {
    return <Admin />;
  }

  if (pathname === "/terms-and-conditions") {
    return <TermsAndConditions />;
  }

  return <Home />;
}

export default App;