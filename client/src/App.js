import { useEffect, useState } from "react";
import './App.css';
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

function App() {
  const [messageSent, setMessageSent] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");

  function sendMessage() {
    socket.emit("reqMessage", { message: messageSent });
  }

  useEffect(() => {
    socket.on("resMessage", function (data) {
      setMessageRecieved(data.message);
    })
  }, [socket]);

  return (
    <div className="App">
      <input placeholder="Message..." onChange={(event) => { setMessageSent(event.target.value) }} />
      <button onClick={sendMessage}>Send message</button>
      <p>Message:</p>
      {messageRecieved}
    </div>
  );
}

export default App;