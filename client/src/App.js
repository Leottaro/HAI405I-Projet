import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import socket, { account } from "./socket";
import './App.css';

import Profil from "./pages/profil/profil";
import Connection from "./pages/connection/connection";
import SelectionJeux from "./pages/selectionJeux/selectionJeux";
import CreerRejoindre from "./pages/creerRejoindre/creerRejoindre";
import PlateauBataille from "./pages/plateauBataille/plateauBataille";
import PlateauSix from "./pages/plateauSix/plateauSix";
import Score from "./pages/score/score";

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
      <Route path="/Score" element={<Score />} />
      <Route path="*" element={<Navigate to={account ? "/selectionJeux" : "/Connection"} />} />
    </Routes>
  );
}

export default App;