import { useEffect, useState } from "react";
import socket from "../../socket";
import Parties from "./parties";
import { useParams } from "react-router-dom";

function MesParties() {
  const { jeux } = useParams();
  const [message, setMessage] = useState("");
  const [listParties, setListPartie] = useState([]);

  useEffect(() => {
    socket.on("resJoin", (json) => {
      if (!json.success) setMessage(json.message);
    });
    socket.on("resMyGames", (liste) => {
      if (liste) {
        setListPartie(liste);
      }
    });
    socket.emit("reqMyGames", jeux);
    const clock = setInterval(() => socket.emit("reqMyGames", jeux), 1000);
    return () => {
      clearInterval(clock);
      socket.off("resJoin");
      socket.off("resMyGames");
    };
  }, [jeux]);

  return (
    <div id="CRContent">
      <label className="CRtitle">Mes Parties:</label>
      <label id="message">{message}</label>
      <div id="listeParties">
        {listParties.map((partie, index) => (
          <Parties
            key={index}
            buttonText="recommencer"
            nbrJoueurs={partie.jeux.maxPlayers}
            buttonCallback={() => socket.emit("reqRestart", partie.code)}
          />
        ))}
      </div>
    </div>
  );
}

export default MesParties;
