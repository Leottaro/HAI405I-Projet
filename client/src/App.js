import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import socket, { account } from "./socket";
import "./App.css";

import Profil from "./pages/profil/profil";
import Connection from "./pages/connection/connection";
import SelectionJeux from "./pages/selectionJeux/selectionJeux";
import CreerRejoindre from "./pages/creerRejoindre/creerRejoindre";
import PlateauBataille from "./pages/plateauBataille/plateauBataille";
import PlateauSix from "./pages/plateauSix/plateauSix";
import Score from "./pages/score/score";
import Leaderboard from "./pages/leaderboard/leaderboard";
import Navbar from "./component/NavBar/NavBar";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    socket.on("goTo", (page) => {
      navigate(page);
    });
    return () => socket.off("goTo");
  }, [navigate]);

  useEffect(() => {
    const locationTitle = location.pathname.split("/")[1];
    document.title = locationTitle || "Home";
    if (!locationTitle.startsWith("plateau")) {
      socket.emit("reqLeave");
    }
  }, [location]);

  return (
    <>
      {location.pathname !== "/Connection" ? <Navbar /> : <></>}
      <Routes>
        <Route
          path="/Connection"
          element={account ? <Navigate to="/profil" /> : <Connection />}
        />
        <Route path="/profil" element={<Profil />} />
        <Route path="/selectionJeux" element={<SelectionJeux />} />
        <Route
          path="/creerRejoindre/:jeux"
          element={<CreerRejoindre mode="creer" />}
        />
        <Route path="/plateauBataille/:code" element={<PlateauBataille />} />
        <Route path="/plateauSix/:code" element={<PlateauSix />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/Score" element={<Score />} />
        <Route
          path="*"
          element={<Navigate to={account ? "/selectionJeux" : "/Connection"} />}
        />
      </Routes>
    </>
  );
}

export default App;
