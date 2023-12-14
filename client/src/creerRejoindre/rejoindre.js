import { useEffect, useState } from "react";
import socket from "../socket";
import "./rejoindre.css";
import { useNavigate } from "react-router-dom";

function Rejoindre() {

    const [lien, setLienPartie] = useState(1);
    const navigate=useNavigate();
    const [message, setMessage] = useState("");

    function creer() {
        navigate("/creer");
    }

    function valider(){
        socket.emit("reqJoin", lien);
    }
    socket.on('resJoin',json => {
        setMessage(json.message)
    });
    return (
        <div id="rejoindreDiv">
            <div id="creerRejoindre">
                <button id="creerButton"onClick={creer}>Creer</button>
                <button id="rejoindreButton">Rejoindre</button>
            </div>
            <label>entrez un lien de partie</label>
            <input className="lienInput" type="number" max={9999999} onChange={(event) => {setLienPartie(parseInt(event.target.value)) }}></input>
            <button className="submitButton" onClick={valider}>submit</button>
            <label id="message">{message}</label>
            <label>Parties en cours:</label>
        </div>
    );
}
export default Rejoindre;