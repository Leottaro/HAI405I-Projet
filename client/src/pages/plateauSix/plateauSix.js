import socket, { account } from "../../socket";
import { useState } from "react";
import MonJeux from "../../component/MonJeux/MonJeux";
import JoueurSix from "./joueurSix/joueurSix";
import Chat from "../../component/Chat/Chat";
import Carte from "../../component/Carte/Carte";
import './plateauSix.css';
import { useParams } from "react-router-dom";

function PlateauSix() {
    const { code } = useParams();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [moi, setMoi] = useState({ nom: "", paquet: [] });
    const [afficheStart, setAfficheStart] = useState(false);
    const [afficheSave, setAfficheSave] = useState(false);
    const [estFinDeTour, setEstFinDeTour] = useState(true);
    const [winner, setWinner] = useState("");
    const [listePlateau, setListePlateau] = useState([[], [], [], []]);

    socket.on("resPlayers", listJson => { // [{nom, paquet, choisie}, ..., {nom, paquet, choisie}]
        setListeJoueurs(listJson.filter(joueur => joueur.nom !== account));
        setMoi(listJson.find(joueur => joueur.nom === account));
        setAfficheStart(listJson[0].paquet.length === 0 && listJson[0].nom === account && listJson.length >= 2);
        setAfficheSave(listJson[0].nom === account);
        setEstFinDeTour(listJson.every(joueur => joueur.choisie));
    });
    socket.on("resPlateau", listJson => { // [ [{valeur:"n", type:""}, ...], 4 fois]
        setListePlateau(listJson);
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
        <div id="plateauSix">
            <h2 id="winner">{winner}</h2>
            <div id="listeJoueurs">
                {listeJoueurs.map((json, index) => <JoueurSix pseudo={json.nom} nbrCartes={json.paquet.length} carte={json.choisie} carteVisible={estFinDeTour} key={"joueur" + index} />)}
            </div>
            <div id="tapis">
                {
                    listePlateau.map((liste, index) => <div className="ligne" onClick={() => socket.emit("reqSixPrends", index)}>{liste.map(json => <Carte visible valeur={json.valeur} type={json.type} chemin={"CartesSix/" + json.valeur + json.type + ".png"} />)}</div>)
                }
            </div>
            <div id="divStart">
                <h2 className="code">code de la partie:</h2>
                <h2 className="code">{code}</h2>
                <button hidden={!afficheStart} id="start" onClick={start}>commencer</button>
                <button hidden={!afficheSave} id="save" onClick={save}>save</button>
            </div>
            <MonJeux paquet={moi.paquet} dossier={"CartesSix/"} />
            <div id="choisie">
                {moi.choisie ? <Carte visible valeur={moi.choisie.valeur} type={moi.choisie.type} chemin={"CartesSix/" + moi.choisie.valeur + moi.choisie.type + ".png"} /> : <></>}
            </div>
            <Chat />
        </div>
    );
}
export default PlateauSix;