import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import socket, { account } from "./socket";
import './App.css';

import Profil from "./pages/profil/profil";
import Connection from "./pages/connection/connection";
import SelectionJeux from "./pages/selectionJeux/selectionJeux";
import CreerRejoindre from "./pages/creerRejoindre/creerRejoindre";
import PlateauBataille from "./pages/plateauBataille/plateauBataille";
import PlateauSix from "./pages/plateauSix/plateauSix";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    socket.off("goTo");
    socket.on("goTo", page => {
      navigate(page);
    });
  }, [])

  useEffect(() => {
    if (location.pathname !== "/Connection" && !account) {
      navigate("/Connection");
    }
    document.title = location.pathname.split('/')[1] || "Home";
  }, [location]);

  return (
    <Routes>
      <Route path="/profil" element={<Profil />} />
      <Route path="/Connection" element={<Connection />} />
      <Route path="/selectionJeux" element={<SelectionJeux />} />
      <Route path="/creerRejoindre/:jeux" element={<CreerRejoindre mode="creer" />} />
      <Route path="/plateauBataille/:code" element={<PlateauBataille />} />
      <Route path="/plateauSix/:code" element={<PlateauSix />} />
    </Routes>
  );
}

export default App;