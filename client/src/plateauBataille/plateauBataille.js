import socket, { account } from "../socket";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoueurBataille from "./joueurBataille/joueurBataille";
import Chat from "../component/Chat/Chat";
import Carte from "./carte";
import './plateauBataille.css'

function PlateauBataille() {
    const { code } = useParams();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [moi, setMoi] = useState({ nom: "", paquet: [] });
    const [estCreateur, setEstCreateur] = useState(false);
    const [estFinDeTour, setEstFinDeTour] = useState(true);

    socket.emit("reqPlayers");
    socket.on("resPlayers", listJson => { // [{nom, paquet, choisie}, ..., {nom, paquet, choisie}]
        setListeJoueurs(listJson.filter(joueur => joueur.nom !== account));
        setMoi(listJson.find(joueur => joueur.nom === account));
        setEstCreateur(listJson[0].nom === account);
        setEstFinDeTour(listJson.every(joueur => joueur.choisie));
    });

    function start() {
        socket.emit("reqStart");
    }

    function test() {
        setEstFinDeTour(!estFinDeTour);
    }

    return (
        <div id="plateauBataille">
            <Chat />
            <div id="listeJoueurs">
                {listeJoueurs.map((json, index) => <JoueurBataille pseudo={json.nom} nbrCartes={json.paquet.length} carte={json.choisie} catreVisible={estFinDeTour} key={"joueur" + index} />)}
            </div>
            <div id="tapis">
                {moi.choisie ? <Carte visible={true} valeur={moi.choisie.valeur} type={moi.choisie.type} /> : <></>}
            </div>
            <div id="moi" className="joueurMoi">
                <p>{account}</p>
                <div id="mesCartes">
                    {moi.paquet.filter(carte => carte).map((carte, index) => <Carte visible={true} valeur={carte.valeur} type={carte.type} key={"carte" + index} />)}
                </div>
                <button hidden={!estCreateur} id="start" onClick={start}>commencer</button>
            </div>
            <button id="test" onClick={test}>TEST</button>
        </div>
    );
}
export default PlateauBataille;