import { useEffect, useState } from "react";
import socket from "../socket";
import "./creer.css";
import { useNavigate, useParams } from "react-router-dom";

function Creer() {
    const { jeux } = useParams();
    const [nbrJoueursMax, setNbrJoueursMax] = useState(1);
    
    const navigate = useNavigate();
    function rejoindre() {
        setTimeout(() => navigate("/rejoindre/" + jeux), 10);
    }

    function valider() {
        socket.emit("reqCreate", { nbrJoueursMax: nbrJoueursMax, jeux: jeux });
    }

    socket.on("resCreate", json => {
        
    });

    return (
        <div id="creerDiv">
            <div id="creerRejoindre">
                <button id="creerButton">Creer</button>
                <button id="rejoindreButton" onClick={rejoindre}>Rejoindre</button>
            </div>
            <label className="label1">Nombre de joueurs max dans la partie:</label>
            <input className="nbrJoueursInput" defaultValue={2} type="number" min={2} max={10} onChange={(event) => { setNbrJoueursMax(parseInt(event.target.value)) }}></input>
            <button className='validerButton' onClick={valider}>Valider</button>
        </div>
    );
}
export default Creer;