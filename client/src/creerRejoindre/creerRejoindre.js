import { useEffect, useState } from "react";
import socket from "../socket";
import "./creerRejoindre.css";
import { useParams } from "react-router-dom";
import Creer from "./creer";
import Rejoindre from "./rejoindre";
import MesParties from "./mesParties";

function CreerRejoindre(params) {
    const { jeux } = useParams();
    const [mode, setMode] = useState(params.mode);
    const [rejoindreClock, setRejoindreClock] = useState(0);
    const [mesPartiesClock, setMesPartiesClock] = useState(0);

    useEffect(() => {
        if (mode === "rejoindre") {
            clearInterval(mesPartiesClock);
            socket.emit("reqGames", jeux);
            setRejoindreClock(setInterval(() => socket.emit("reqGames", jeux), 1000));
        } else if (mode === "mesParties") {
            clearInterval(rejoindreClock);
            socket.emit("reqMyGames", jeux);
            setMesPartiesClock(setInterval(() => socket.emit("reqMyGames", jeux), 1000));
        } else {
            clearInterval(rejoindreClock);
            clearInterval(mesPartiesClock);
        }
        // eslint-disable-next-line
    }, [mode]);

    function creer() {
        if (mode === "creer") return;
        setMode("creer");
    }

    function rejoindre() {
        if (mode === "rejoindre") return;
        setMode("rejoindre");
    }

    function mesParties() {
        if (mode === "mesParties") return;
        setMode("mesParties");
    }

    return (
        <div id="CRDiv">
            <div id="CRbuttonDiv">
                <button className="CRButton" onClick={creer} disabled={mode === "creer"}>Creer</button>
                <button className="CRButton" onClick={rejoindre} disabled={mode === "rejoindre"}>Rejoindre</button>
                <button className="CRButton" onClick={mesParties} disabled={mode === "mesParties"}>Mes parties</button>
            </div>
            {mode === "creer" ? <Creer jeux={jeux} /> : (mode === "rejoindre" ? <Rejoindre jeux={jeux} /> : <MesParties jeux={jeux} />)}
        </div>
    );
}
export default CreerRejoindre;