import { useEffect, useState } from "react";
import './App.css';
import socket from "./socket";

import Connection from "./connection/Connection";

function App() {
  return (
    <Connection/>
  );
}

export default App;