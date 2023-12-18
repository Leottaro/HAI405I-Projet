import { lazy, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import socket, { account } from "./socket";
import './App.css';

const Connection = lazy(() => import("./pages/connection/Connection"));
const SelectionJeux = lazy(() => import("./pages/selectionJeux/selectionJeux"));
const CreerRejoindre = lazy(() => import("./pages/creerRejoindre/creerRejoindre"));
const PlateauBataille = lazy(() => import("./pages/plateauBataille/plateauBataille"));

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
    // eslint-disable-next-line
  }, [location]);

  return (
    <Routes>
      <Route path="/Connection" element={<Connection />} />
      <Route path="/selectionJeux" element={<SelectionJeux />} />
      <Route path="/creerRejoindre/:jeux" element={<CreerRejoindre mode="creer" />} />
      <Route path="/plateauBataille/:code" element={<PlateauBataille />} />
    </Routes>
  );
}

window.addEventListener("beforeunload", function () {
  socket.emit("reqLogOut");
});

export default App;