import { lazy } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import socket from "./socket";
import './App.css';

const Connection = lazy(() => import("./pages/connection/Connection"));
const SelectionJeux = lazy(() => import("./pages/selectionJeux/selectionJeux"));
const Creer = lazy(() => import("./creerRejoindre/creer"));
const Rejoindre = lazy(() => import("./creerRejoindre/rejoindre"));
function App() {
  const navigate = useNavigate();

  socket.on("goTo", page => {
    navigate(page);
  });

  return (
    <Routes>
      <Route exact path="/" element={<Connection />} />
      <Route path="/Connection" element={<Connection />} />
      <Route path="/selectionJeux" element={<SelectionJeux />} />
      <Route path="/creer" element={<Creer />} />
      <Route path="/rejoindre" element={<Rejoindre />} />
    </Routes>
  );
}
export default App;