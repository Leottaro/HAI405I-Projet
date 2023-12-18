import socket, { account } from "../socket";
import { useState } from "react";
import JoueurBataille from "./joueurBataille/joueurBataille";
import Chat from "../component/Chat/Chat";
import Carte from "./carte";
import './plateauBataille.css';
import { useParams } from "react-router-dom";

function PlateauBataille() {
    const { code } = useParams();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [moi, setMoi] = useState({ nom: "", paquet: [] });
    const [afficheStart, setAfficheStart] = useState(false);
    const [estFinDeTour, setEstFinDeTour] = useState(true);
    const [winner, setWinner] = useState("");

    socket.emit("reqPlayers");
    socket.on("resPlayers", listJson => { // [{nom, paquet, choisie}, ..., {nom, paquet, choisie}]
        setListeJoueurs(listJson.filter(joueur => joueur.nom !== account));
        setMoi(listJson.find(joueur => joueur.nom === account));
        setAfficheStart(listJson[0].paquet.length === 0 && listJson[0].nom === account && listJson.length >= 2);
        setEstFinDeTour(listJson.every(joueur => joueur.choisie));
    });

    socket.on("Victoire", data => {
        if(data == account){
            setWinner("Vous avez Gagné !");
        }
        else{
            setWinner(data+" a gagné...");
        }
    })

    function start() {
        socket.emit("reqStart");
    }

    return (
        <div id="plateauBataille">
            <h2 id="winner">{winner}</h2>
            <div id="listeJoueurs">
                {listeJoueurs.map((json, index) => <JoueurBataille pseudo={json.nom} nbrCartes={json.paquet.length} carte={json.choisie} carteVisible={estFinDeTour} key={"joueur" + index} />)}
            </div>
            <div id="tapis">
                {moi.choisie ? <Carte visible={true} valeur={moi.choisie.valeur} type={moi.choisie.type} /> : <></>}
            </div>
            <div id="moi" className="joueurMoi">
                <p id="monNom">{account}</p>
                <div id="mesCartes">
                    {moi.paquet.filter(carte => carte).map((carte, index) => <Carte visible={true} valeur={carte.valeur} type={carte.type} key={"carte" + index} />)}
                </div>
                <label className="labelJB">{moi.paquet.length} Cartes</label>
            </div>
            <h2 id="code">code de la partie: {code}</h2>
            <button hidden={!afficheStart} id="start" onClick={start}>commencer</button>
            <Chat />
        </div>
    );
}
export default PlateauBataille;