import { useEffect, useState } from "react";
import socket from "../../socket";
import Parties from "./parties";
import { useParams } from "react-router-dom";

function Rejoindre() {
    const { jeux } = useParams();
    const [lien, setLienPartie] = useState(1);
    const [message, setMessage] = useState("");
    const [listParties, setListPartie] = useState([]);

    function valider() {
        socket.emit("reqJoin", lien.toString());
    }

    useEffect(() => {
        socket.on('resJoin', json => {
            if (!json.success)
                setMessage(json.message);
        });
        socket.on('resGames', liste => {
            if (liste) {
                setListPartie(liste);
            }
        });
        socket.emit("reqGames", jeux);
        const clock = setInterval(() => socket.emit("reqGames", jeux), 1000);
        return () => {
            clearInterval(clock);
            socket.off("resJoin");
            socket.off("resGames");
        }
    })

    return (
        <div id="CRContent">
            <label className="CRtitle">entrez un lien de partie</label>
            <input className="CRinput" type="number" max={9999999} onChange={(event) => { setLienPartie(parseInt(event.target.value)) }} />
            <button className="CRButton CRvalider" onClick={valider}>Rejoindre</button>
            <label id="message">{message}</label>
            <label className="CRtitle">Parties en cours:</label>
            <div id="listeParties">
                {listParties.map((partie, index) => (
                    <Parties key={index} nbrJoueurs={partie.nbrJoueurs} code={partie.code} />
                ))}
            </div>
        </div>
    );
}

export default Rejoindre;
