import { lazy } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import socket from "./socket";
import './App.css';

const Connection = lazy(() => import("./pages/connection/Connection"));
const SelectionJeux = lazy(() => import("./pages/selectionJeux/selectionJeux"));

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
    </Routes>
  );
}
export default App;