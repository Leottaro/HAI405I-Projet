import { useEffect, useState } from "react";
import socket from "../socket";
import "./rejoindre.css";
import { useNavigate, useParams } from "react-router-dom";
import Parties from "./parties";

function Rejoindre() {
    const { jeux } = useParams();
    const [lien, setLienPartie] = useState(1);
    const [message, setMessage] = useState("");
    const [listParties, setListPartie] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let interval=setInterval(buttonAfficheListPartie,1000);
        buttonAfficheListPartie();
    }, []);

    function creer() {
        setTimeout(() => navigate("/creer/" + jeux), 10);
    }

    function valider() {
        socket.emit("reqJoin", lien);
    }

    socket.on('resJoin', json => {
        setMessage(json.message);
    });

    socket.on('resGames', json => {
        if (json) {
            setListPartie(json);
        }
    });

    function buttonAfficheListPartie() {
        socket.emit("reqGames", jeux);
    }

    return (
        <div id="rejoindreDiv">
            <div id="creerRejoindre">
                <button id="creerBut" onClick={creer}>Creer</button>
                <button id="rejoindreBut">Rejoindre</button>
            </div>
            <label className="labelChris">entrez un lien de partie</label>
            <input className="lienInput" type="number" max={9999999} onChange={(event) => { setLienPartie(parseInt(event.target.value)) }} />
            <button className="submitButton" onClick={valider}>submit</button>
            <label id="message">{message}</label>
            <label id="partiesEnCours">Parties en cours:</label>
            <div id="listeParties">
                {listParties.map((partie, index) => (
                    <Parties key={index} nbrJoueurs={partie.nbrJoueurs} code={partie.code} />
                ))}
            </div>
        </div>
    );
}

export default Rejoindre;
