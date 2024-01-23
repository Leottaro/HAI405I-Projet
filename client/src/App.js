import { lazy, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import socket, { account } from "./socket";
import './App.css';

const Profil = lazy(() => import("./pages/profil/profil"));
const Connection = lazy(() => import("./pages/connection/Connection"));
const SelectionJeux = lazy(() => import("./pages/selectionJeux/selectionJeux"));
const CreerRejoindre = lazy(() => import("./pages/creerRejoindre/creerRejoindre"));
const PlateauBataille = lazy(() => import("./pages/plateauBataille/plateauBataille"));
const PlateauSix = lazy(() => import("./pages/plateauSix/plateauSix"));

function App() {
  const navigate = useNavigate();
  socket.on("goTo", page => {
    setTimeout(() => navigate(page), 10);
  });

  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== "/Connection" && !account) {
      setTimeout(() => navigate("/Connection"), 10);
    }
    document.title = location.pathname.split('/')[1];
  }, [location]);

  return (
    <Routes>
      <Route path="/profil" element={<Profil/>} />
      <Route path="/Connection" element={<Connection />} />
      <Route path="/selectionJeux" element={<SelectionJeux />} />
      <Route path="/creerRejoindre/:jeux" element={<CreerRejoindre mode="creer" />} />
      <Route path="/plateauBataille/:code" element={<PlateauBataille />} />
      <Route path="/plateauSix/:code" element={<PlateauSix />} />
    </Routes>
  );
}

window.addEventListener("beforeunload", function () {
  socket.emit("reqLogOut");
});

export default App;