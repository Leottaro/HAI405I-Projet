import { useEffect, useState } from "react";
import socket from "../socket";
import "./creer.css";
import { useNavigate } from "react-router-dom";

function Creer() {
    let lien="";
    function creerLien() {
        for(let i=0;i<8;i++){
            lien=10*lien+Math.floor(Math.random()*9);
        }
        console.log(lien);
        valider()
    }
    const [nbrJoueurs, setNbrJoueurs] = useState(1);

    function valider() {
        socket.emit("reqLienPartie", [nbrJoueurs, lien]);
    }

    const navigate=useNavigate();
    
    function rejoindre() {
        navigate("/rejoindre");
    }

    return (
        <div id="creerDiv">
            <button className='rejoindre' onClick={rejoindre}>Rejoindre</button>
            <button className="rejoindreButton">Creer</button>
            <label>entrez le nombre de joueurs dans la partie:</label>
            <input defaultValue={1} type="number" min={1} max={6} onChange={(event) => 
                {setNbrJoueurs(parseInt(event.target.value)) }}></input>
            <button className='validerButton' onClick={creerLien}>Valider</button>
            <label>copiez le lien de la partie:</label>
            <label id='lien'>{lien}</label>
        </div>
    );
}
export default Creer;