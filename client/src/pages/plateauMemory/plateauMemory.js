import socket, { account } from "../../socket";
import { useEffect, useState } from "react";
import MonJeux from "../../component/MonJeux/MonJeux";
import Chat from "../../component/Chat/Chat";
import Carte from "../../component/Carte/Carte";
import "./plateauMemory.css";
import { useParams } from "react-router-dom";
import Start from "../../component/Start/Start";
import Audio from "../../component/Audio/Audio";

function PlateauMemory() {
    const { code } = useParams();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [moi, setMoi] = useState({ nom: "" });
    const [afficheStart, setAfficheStart] = useState(false);
    const [afficheSave, setAfficheSave] = useState(false);
    const [estFinDeTour, setEstFinDeTour] = useState(true);
    const [listePlateau, setListePlateau] = useState([[], [], [], []]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [winner, setWinner] = useState("");

    useEffect(() => {
        socket.on("resPlayers", (json) => {
            // {nom: {isCreator, paquet, choosed, score}, ...}
            setListeJoueurs(
                Object.keys(json).reduce((filtered, player) => {
                    if (player !== account) {
                        filtered[player] = json[player];
                    }
                    return filtered;
                }, {})
            );
            setMoi(json[account]);
            setAfficheStart(
                json[account].isCreator &&
                    Object.keys(json).length >= 2 &&
                    json[account].paquet.length === 0
            );
            setAfficheSave(
                json[account].isCreator &&
                    Object.keys(json).some((player) => json[player].paquet.length > 0)
            );
            setEstFinDeTour(Object.keys(json).every((player) => json[player].choosed));
        });
        socket.emit("reqPlayers");

        
        socket.on("resPlateau", (listJson) => {
            // [ [{valeur:"n", type:""}, ...], 4 fois]
            setListePlateau(listJson);
        });
        socket.emit("reqPlateau");

        socket.on("resTimeLeft", (delay) => {
            setTimeLeft(() => delay);
        });
        const interval = setInterval(() => {
            setTimeLeft((timeLeft) => (timeLeft > 0 ? timeLeft - 0.1 : 0));
        }, 100);

        socket.on("Gagnant", (pseudo) => {
            if (pseudo === account) {
                setWinner("Vous avez Gagné !");
            } else {
                setWinner(pseudo + " a gagné...");
            }
        });

        return () => {
            socket.off("resPlayers");
            socket.off("resPlateau");
            socket.off("resTimeLeft");
            socket.off("Gagnant");
            clearInterval(interval);
        };
    }, []);

    function start() {
        socket.emit("reqStart");
    }

    function save() {
        socket.emit("reqSave");
    }

    return (
        <div id="plateauMemory">
            <Audio />
            <h2 id="winner">{winner}</h2>
            <div id="listeJoueurs">
                {Object.keys(listeJoueurs)
                    .sort()
                    .map((player, index) => (
                        <JoueurMemory
                            pseudo={player}
                            key={"joueur" + index}
                        />
                    ))}
            </div>
            <div id="tapis">
                {listePlateau.map((liste, index) => (
                    <div
                        className="ligne"
                        onClick={() => socket.emit("reqMemory", index)}
                    >
                        {liste.map((json) => (
                            <Carte
                                visible
                                valeur={json.valeur}
                                type={json.type}
                                chemin={"CartesBataille/" + json.valeur + json.type + ".png"}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <Start
                afficheStart={afficheStart}
                afficheSave={!afficheStart && afficheSave}
                code={code}
                start={start}
                save={save}
            />
            <MonJeux
                texte={moi}
            />
            <Chat />
        </div>
    );
}
export default PlateauMemory;
