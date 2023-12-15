import socket, { account } from "../socket";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoueurBataille from "./joueurBataille/joueurBataille";
import './plateauBataille.css'

function PlateauBataille() {
    const { code } = useParams();
    const [autresJoueurs, setAutresJoueurs] = useState([]);
    const [moi, setMoi] = useState({});

    socket.emit("reqPlayers");
    socket.on("resPlayers", listJson => { // [{nom, paquet}, ..., {nom, paquet}]
        console.log(listJson);
        setAutresJoueurs(listJson); // .filter(joueur => joueur.nom !== account)
        setMoi(listJson.filter(joueur => joueur.nom === account)[0]);
    });

    return (
        <div id="plateauBataille">
            <div id="listeJoueurs">
                {autresJoueurs.map(json => <JoueurBataille pseudo={json.nom} nbrCartes={json.paquet.length} />)}
            </div>
            <div id="moi" className="joueurBataille">
                <p>{account}</p>
                <div className="mesCartes">
                    { }
                </div>
            </div>
        </div>
    );
}
export default PlateauBataille;