import { useEffect, useState } from "react";
import socket from "../socket";
import "./creer.css";
function Creer() {
    let lien="";
    for(let i=0;i<8;i++){
        lien=10*lien+Math.floor(Math.random()*9);
    }
    console.log(lien);
    const [nbrJoueurs, setNbrJoueurs] = useState(1);

    function valider() {
        socket.emit("reqLienPartie", [nbrJoueurs, lien]);
    }

    return (
        <div id="creer"style={{ display: 'flex', flexDirection: 'column' }}>
            <h2>entrez le nombre de joueurs dans la partie:</h2>
            <input defaultValue={1} type="number" min={1} max={6} onChange={(event) => 
                {setNbrJoueurs(parseInt(event.target.value)) }}></input>
            <button onClick={valider}>Valider</button>
            <h2>copiez le lien de la partie:</h2>
            <h2 id='lien'>{lien}</h2>
        </div>
    );
}
export default Creer;