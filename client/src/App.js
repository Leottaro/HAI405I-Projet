import { lazy, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import socket, { account } from "./socket";
import './App.css';

const Connection = lazy(() => import("./pages/connection/Connection"));
const SelectionJeux = lazy(() => import("./pages/selectionJeux/selectionJeux"));
const Creer = lazy(() => import("./creerRejoindre/creer"));
const Rejoindre = lazy(() => import("./creerRejoindre/rejoindre"));
const PlateauBataille = lazy(() => import("./plateauBataille/plateauBataille"));

function App() {
  const navigate = useNavigate();
  socket.on("goTo", page => {
    setTimeout(() => navigate(page), 10);
  });

  const location = useLocation();
  useEffect(() => {
    console.log(location);
    if (location.pathname !== "/Connection" && !account) {
      setTimeout(() => navigate("/Connection"), 10);
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/Connection" element={<Connection />} />
      <Route path="/selectionJeux" element={<SelectionJeux />} />
      <Route path="/creer/:jeux" element={<Creer />} />
      <Route path="/rejoindre/:jeux" element={<Rejoindre />} />
      <Route path="/plateauBataille/:code" element={<PlateauBataille />} />
    </Routes>
  );
}

window.addEventListener("beforeunload", function () {
  socket.emit("reqLogOut");
});

export default App;