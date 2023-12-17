import { useEffect, useState } from "react";
import socket from "../socket";
import "./creerRejoindre.css";
import { useParams } from "react-router-dom";
import Creer from "./creer";
import Rejoindre from "./rejoindre";

function CreerRejoindre(params) {
    const { jeux } = useParams();
    const [mode, setMode] = useState(params.mode);
    const [clock, setClock] = useState(0);

    useEffect(() => {
        if (mode === "rejoindre") {
            socket.emit("reqGames", jeux);
            setClock(setInterval(() => socket.emit("reqGames", jeux), 1000));
        } else {
            clearInterval(clock);
        }
    }, [mode, jeux, clock]);

    function creer() {
        if (mode === "creer") return;
        setMode("creer");
    }

    function rejoindre() {
        if (mode === "rejoindre") return;
        setMode("rejoindre");
    }

    return (
        <div id="CRDiv">
            <div id="CRbuttonDiv">
                <button className="CRButton" onClick={creer} disabled={mode === "creer"}>Creer</button>
                <button className="CRButton" onClick={rejoindre} disabled={mode === "rejoindre"}>Rejoindre</button>
            </div>
            {mode === "creer" ? <Creer jeux={jeux} /> : <Rejoindre jeux={jeux} />}
        </div>
    );
}
export default CreerRejoindre;