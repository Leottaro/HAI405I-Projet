import { useEffect, useState } from "react";
import socket from "../socket";
import "./creer.css";
import { useNavigate } from "react-router-dom";

function Creer() {
    function creerLien() {
        let newLien=0;
        for(let i=0;i<8;i++){
            newLien=10*newLien+Math.floor(Math.random()*9);
        }
        setLien(newLien);
        console.log(lien);
        valider()
    }
    const [nbrJoueurs, setNbrJoueurs] = useState(1);
    const [lien, setLien] = useState(0);

    function valider() {
        socket.emit("reqCreate", {nbrJoueurs: nbrJoueurs, lien: lien, jeux: "bataille"});
        socket.emit("reqCreate", {nbrJoueurs: nbrJoueurs, lien: lien, jeux: "bataille"});
    }

    const navigate=useNavigate();
    
    function rejoindre() {
        navigate("/rejoindre");
    }

    return (
        <div id="creerDiv">
            <div id="creerRejoindre">
                <button id="creerButton">Creer</button>
                <button id="rejoindreButton" onClick={rejoindre}>Rejoindre</button>
            </div>
            
            <label>Nombre de joueurs dans la partie:</label>
            <input className="nbrJoueursInput" defaultValue={2} type="number" min={2} max={10} onChange={(event) => 
                {setNbrJoueurs(parseInt(event.target.value)) }}></input>
            <button className='validerButton' onClick={creerLien}>Valider</button>
            <label>copiez le lien de la partie:</label>
            <label id='lien'>{lien}</label>
        </div>
    );
}
export default Creer;