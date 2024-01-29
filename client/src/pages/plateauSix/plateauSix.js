import socket, { account } from "../../socket";
import { useEffect, useState } from "react";
import MonJeux from "../../component/MonJeux/MonJeux";
import JoueurSix from "./joueurSix/joueurSix";
import Chat from "../../component/Chat/Chat";
import Carte from "../../component/Carte/Carte";
import "./plateauSix.css";
import { useParams } from "react-router-dom";
import Start from "../../component/Start/Start";
import Audio from "../../component/Audio/Audio";

function PlateauSix(props) {
  const { code } = useParams();
  const [listeJoueurs, setListeJoueurs] = useState([]);
  const [moi, setMoi] = useState({ nom: "", paquet: [] });
  const [afficheStart, setAfficheStart] = useState(false);
  const [afficheSave, setAfficheSave] = useState(false);
  const [estFinDeTour, setEstFinDeTour] = useState(true);
  const [listePlateau, setListePlateau] = useState([[], [], [], []]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    socket.on("resPlayers", (json) => {
      // {nom: {isCreator, paquet, choosed, score}, ...}
      setListeJoueurs(
        Object.keys(json).reduce((filtered, player) => {
          if (player !== account) {
            filtered[player] = json[player];
          }
          return filtered;
        }, {}),
      );
      setMoi(json[account]);
      setAfficheStart(
        json[account].isCreator &&
          Object.keys(json).length >= 2 &&
          json[account].paquet.length === 0,
      );
      setAfficheSave(
        json[account].isCreator &&
          Object.keys(json).some((player) => json[player].paquet.length > 0),
      );
      setEstFinDeTour(
        Object.keys(json).every((player) => json[player].choosed),
      );
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

    return () => {
      socket.off("resPlayers");
      socket.off("resPlateau");
      socket.off("resTimeLeft");
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
    <div id="plateauSix">
      <Audio />
      <div id="listeJoueurs">
        {Object.keys(listeJoueurs)
          .sort()
          .map((player, index) => (
            <JoueurSix
              pseudo={player}
              carte={listeJoueurs[player].choosed}
              carteVisible={estFinDeTour}
              score={listeJoueurs[player].score}
              key={"joueur" + index}
            />
          ))}
      </div>
      <div id="tapis">
        {listePlateau.map((liste, index) => (
          <div
            className="ligne"
            onClick={() => socket.emit("reqSixPrends", index)}
          >
            {liste.map((json) => (
              <Carte
                visible
                valeur={json.valeur}
                type={json.type}
                chemin={"CartesSix/" + json.valeur + json.type + ".png"}
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
      <div
        id={
          timeLeft > 10
            ? "divTimer"
            : timeLeft > 5
              ? "divTimerOrange"
              : "divTimerRed"
        }
      >
        <label id="timer">{timeLeft.toFixed(1)}</label>
      </div>
      <MonJeux
        paquet={moi.paquet}
        dossier={"CartesSix/"}
        texte={moi.score + " têtes de boeuf"}
      />
      <div id="choisie">
        {moi.choosed ? (
          <Carte
            visible
            valeur={moi.choosed.valeur}
            type={moi.choosed.type}
            chemin={
              "CartesSix/" + moi.choosed.valeur + moi.choosed.type + ".png"
            }
          />
        ) : (
          <></>
        )}
      </div>
      <Chat />
    </div>
  );
}
export default PlateauSix;
