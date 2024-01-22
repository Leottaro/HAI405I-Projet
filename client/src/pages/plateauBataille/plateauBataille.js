import socket, { account } from "../../socket";
import { useState } from "react";
import MonJeux from "../../component/MonJeux/MonJeux";
import JoueurBataille from "./joueurBataille/joueurBataille";
import Chat from "../../component/Chat/Chat";
import Carte from "../../component/Carte/Carte";
import './plateauBataille.css';
import { useParams } from "react-router-dom";

function PlateauBataille() {
    const { code } = useParams();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [moi, setMoi] = useState({ nom: "", paquet: [] });
    const [afficheStart, setAfficheStart] = useState(false);
    const [afficheSave, setAfficheSave] = useState(false);
    const [estFinDeTour, setEstFinDeTour] = useState(true);
    const [winner, setWinner] = useState("");

    socket.emit("reqPlayers");
    socket.on("resPlayers", listJson => { // [{nom, paquet, choisie}, ..., {nom, paquet, choisie}]
        setListeJoueurs(listJson.filter(joueur => joueur.nom !== account));
        setMoi(listJson.find(joueur => joueur.nom === account));
        setAfficheStart(listJson[0].paquet.length === 0 && listJson[0].nom === account && listJson.length >= 2);
        setAfficheSave(listJson[0].nom === account);
        setEstFinDeTour(listJson.every(joueur => joueur.choisie));
    });

    socket.on("Victoire", data => {
        if (data === account) {
            setWinner("Vous avez Gagné !");
        }
        else {
            setWinner(data + " a gagné...");
        }
    })

    function start() {
        socket.emit("reqStart");
    }

    function save() {
        socket.emit("reqSave");
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
            <MonJeux paquet={moi.paquet}/>
            <div id="divStart">
                <h2 className="code">code de la partie:</h2>
                <h2 className="code">{code}</h2>
                <button hidden={!afficheStart} id="start" onClick={start}>commencer</button>
                <button hidden={!afficheSave} id="save" onClick={save}>save</button>
            </div>
            <Chat />
        </div>
    );
}
export default PlateauBataille;