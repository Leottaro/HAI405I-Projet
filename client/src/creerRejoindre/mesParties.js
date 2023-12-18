import { useState } from "react";
import socket from "../socket";
import Parties from "./parties";

function MesParties() {
    const [message, setMessage] = useState("");
    const [listParties, setListPartie] = useState([]);

    socket.on('resJoin', json => {
        if (!json.success)
            setMessage(json.message);
    });

    socket.on('resMyGames', liste => {
        if (liste) {
            setListPartie(liste);
        }
    });

    return (
        <div id="CRContent">
            <label className="CRtitle">Mes Parties:</label>
            <label id="message">{message}</label>
            <div id="listeParties">
                {listParties.map((partie, index) => (
                    <Parties key={index} nbrJoueurs={partie.jeux.maxPlayers} code={partie.code} mesParties={true} />
                ))}
            </div>
        </div>
    );
}

export default MesParties;
