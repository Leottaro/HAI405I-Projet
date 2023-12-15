import socket, { account } from "../socket";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoueurBataille from "./joueurBataille/joueurBataille";
import Chat from "../component/Chat/Chat";
import Carte from "./carte";
import './plateauBataille.css'
import Chat from "../component/Chat/Chat"

function PlateauBataille() {
    const { code } = useParams();
    const [autresJoueurs, setAutresJoueurs] = useState([]);
    const [monPaquet, setMonPaquet] = useState([]);
    const [estCreateur, setEstCreateur] = useState(false);

    socket.emit("reqPlayers");
    socket.on("resPlayers", listJson => { // [{nom, paquet}, ..., {nom, paquet}]
        console.log(listJson);
        setAutresJoueurs(listJson.filter(joueur => joueur.nom !== account));
        setMonPaquet(listJson.find(joueur => joueur.nom === account).paquet);
        setEstCreateur(listJson[0].nom === account);
    });

    function start() {
        socket.emit("reqStart");
    }

    return (
        <div id="plateauBataille">
            <Chat/>
            <div id="listeJoueurs">
                {autresJoueurs.map((json, index) => <JoueurBataille pseudo={json.nom} nbrCartes={json.paquet.length} key={"joueur" + index} />)}
            </div>
            <div id="moi" className="joueurBataille">
                <p>{account}</p>
                <div id="mesCartes">
                    {monPaquet.map((carte, index) => <Carte valeur={carte.valeur} type={carte.type} key={"carte" + index} />)}
                </div>
                <button hidden={!estCreateur} id="start" onClick={start}>commencer</button>
            </div>
        </div>
    );
}
export default PlateauBataille;