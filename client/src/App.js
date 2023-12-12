import { useNavigate, Routes, Route } from "react-router-dom";
import socket from "./socket";
import './App.css';

import Connection from "./pages/connection/Connection";
import SelectionJeux from "./pages/selectionJeux/selectionJeux";

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