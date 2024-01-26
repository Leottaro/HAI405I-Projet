import socket, { account } from "../../socket";
import { useEffect, useState } from "react";
import MonJeux from "../../component/MonJeux/MonJeux";
import JoueurBataille from "./joueurBataille/joueurBataille";
import Chat from "../../component/Chat/Chat";
import Carte from "../../component/Carte/Carte";
import './plateauBataille.css';
import { useParams } from "react-router-dom";
import NavProfil from "../../component/NavProfil/NavProfil";
import Start from "../../component/Start/Start";
import Audio from "../../component/Audio/Audio";

function PlateauBataille() {
    const { code } = useParams();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [moi, setMoi] = useState({ nom: "", paquet: [] });
    const [afficheStart, setAfficheStart] = useState(false);
    const [afficheSave, setAfficheSave] = useState(false);
    const [estFinDeTour, setEstFinDeTour] = useState(true);
    const [winner, setWinner] = useState("");

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

    socket.on("Gagnant", pseudo => {
        if (pseudo === account) {
            setWinner("Vous avez Gagné !");
        }
        else {
            setWinner(pseudo + " a gagné...");
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
            <NavProfil />
            <Audio />
            <h2 id="winner">{winner}</h2>
            <div id="listeJoueurs">
                {Object.keys(listeJoueurs).sort().map((player, index) => <JoueurBataille pseudo={player} nbrCartes={listeJoueurs[player].paquet.length} carte={listeJoueurs[player].choosed} carteVisible={estFinDeTour} key={"joueur" + index} />)}
            </div>
            <Start afficheStart={afficheStart} afficheSave={afficheSave} code={code} start={start} save={save} />
            <MonJeux paquet={moi.paquet} dossier={"CartesBataille/"} texte={moi.paquet.length + " Cartes"} />
            <div id="choisie">
                {moi.choosed ? <Carte visible valeur={moi.choosed.valeur} type={moi.choosed.type} chemin={"CartesBataille/" + moi.choosed.valeur + moi.choosed.type + ".png"} /> : <></>}
            </div>
            <Chat />
        </div>
    );
}
export default PlateauBataille;