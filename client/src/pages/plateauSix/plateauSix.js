import socket, { account } from "../../socket";
import { useEffect, useState } from "react";
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

    socket.on("resPlayers", json => { // {nom: {isCreator, paquet, choosed, score}, ...}
        setListeJoueurs(Object.keys(json).reduce((filtered, player) => {
            if (player !== account) {
                filtered[player] = json[player];
            }
            return filtered;
        }, {}));
        setMoi(json[account]);
        setAfficheStart(json[account].isCreator && Object.keys(json).length >= 2 && json[account].paquet.length === 0);
        setAfficheSave(json[account].isCreator);
        setEstFinDeTour(Object.keys(json).every(player => json[player].choosed));
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
                {Object.keys(listeJoueurs).map((player, index) => <JoueurSix pseudo={player} carte={listeJoueurs[player].choosed} carteVisible={estFinDeTour} score={listeJoueurs[player].score} key={"joueur" + index} />)}
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
            <MonJeux paquet={moi.paquet} dossier={"CartesSix/"} texte={moi.score + " têtes de boeuf"} />
            <div id="choisie">
                {moi.choosed ? <Carte visible valeur={moi.choosed.valeur} type={moi.choosed.type} chemin={"CartesSix/" + moi.choosed.valeur + moi.choosed.type + ".png"} /> : <></>}
            </div>
            <Chat />
        </div>
    );
}
export default PlateauSix;