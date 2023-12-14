import { useEffect, useState } from "react";
import socket from "../socket";
import "./rejoindre.css";
import { useNavigate } from "react-router-dom";

function Rejoindre() {

    const [lien, setLienPartie] = useState(1);
    const navigate=useNavigate();
    
    function creer() {
        navigate("/creer");
    }

    function valider(){
        socket.emit("reqDemandeEntrePartieLien", [lien]);
    }
    return (
        <div id="rejoindreDiv">
            <button className="creerButton"onClick={creer}>Creer</button>
            <button className="rejoindreButton">Creer</button>
            <label>entrez un lien de partie</label>
            <input type="number" max={9999999} onChange={(event) => {setLienPartie(parseInt(event.target.value)) }}></input>
            <button className="submitButton" onClick={valider}>submit</button>
            <label>Parties en cours:</label>
        </div>
    );
}
export default Rejoindre;