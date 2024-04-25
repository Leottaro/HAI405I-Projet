import socket, { account } from "../../socket";
import { useEffect, useState } from "react";
import Chat from "../../component/Chat/Chat";
import Carte from "../../component/Carte/Carte";
import "./plateauMemory.css";
import { useParams } from "react-router-dom";
import Start from "../../component/Start/Start";
import Audio from "../../component/Audio/Audio";
import JoueurMemory from "./joueurMerory/joueurMemory";
import MonJeux from "../../component/MonJeux/MonJeux";

const nbCartesParLigne = 10;

function PlateauMemory() {
    const { code } = useParams();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [moi, setMoi] = useState({ nom: "" });
    const [carteChoisies, setCarteChoisies] = useState([]);
    const [afficheStart, setAfficheStart] = useState(false);
    const [afficheSave, setAfficheSave] = useState(false);
    const [listePlateau, setListePlateau] = useState([[], [], [], []]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [winner, setWinner] = useState("");

    useEffect(() => {
        socket.on("resPlayers", (json) => {
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
                    json[account].score === -1 // score de -1 -> jeux pas commencé
            );
            setAfficheSave(
                json[account].isCreator &&
                    Object.keys(json).some((player) => json[player].score >= 0)
            );
            setCarteChoisies(
                Object.values(json)
                    .map((data) => [data.choosed1, data.choosed2])
                    .reduce((choosen, data) => (choosen[0] !== undefined ? choosen : data))
            );
        });
        socket.emit("reqPlayers");

        socket.on("resPlateau", (listJson) => {
            // reçois [ {valeur:"n", type:""}, ...] et enregistre [ [{valeur:"n", type:""}, ... (nbCartesParLigne)], ... (4)]
            setListePlateau(
                [0, 1, 2, 3].map((_, i) =>
                    listJson.slice(i * nbCartesParLigne, (i + 1) * nbCartesParLigne)
                )
            );
        });
        socket.emit("reqPlateau");

        socket.on("resTimeLeft", (delay) => {
            setTimeLeft(() => delay);
        });
        const interval = setInterval(() => {
            setTimeLeft((timeLeft) => (timeLeft > 0 ? timeLeft - 0.1 : 0));
        }, 100);

        socket.on("Gagnant", (pseudo) => {
            clearInterval(interval);
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
                            score={listeJoueurs[player].score}
                        />
                    ))}
            </div>
            <div id="tapisMemory">
                {listePlateau.map((liste, i) => (
                    <div
                        className="ligne"
                        onClick={() => socket.emit("reqMemory", i)}
                        key={nbCartesParLigne * i}
                    >
                        {liste.map((json, j) =>
                            json ? (
                                <Carte
                                    visible={carteChoisies.includes(nbCartesParLigne * i + j)}
                                    valeur={json.valeur}
                                    type={json.type}
                                    index={nbCartesParLigne * i + j}
                                    chemin={"CartesBataille/" + json.valeur + json.type + ".png"}
                                    key={nbCartesParLigne * i + j}
                                />
                            ) : (
                                <div className="carte"></div>
                            )
                        )}
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
            {moi.isChoosing ? (
                <div
                    id={
                        timeLeft > nbCartesParLigne
                            ? "divTimer"
                            : timeLeft > 5
                              ? "divTimerOrange"
                              : "divTimerRed"
                    }
                >
                    <label id="timer">{timeLeft.toFixed(1)}</label>
                </div>
            ) : (
                <></>
            )}
            <MonJeux
                dossier={"CartesSix/"}
                texte={"score: " + moi.score}
            />
            <Chat />
        </div>
    );
}
export default PlateauMemory;
