import { useEffect, useState } from "react";
import socket from "../socket";
import "./rejoindre.css";
function Rejoindre() {

    const [lien, setLienPartie] = useState(1);

    function valider(){
        socket.emit("reqDemandeEntrePartieLien", [lien]);
    }
    return (
        <div id="rejoindre"style={{ display: 'flex', flexDirection: 'column' }}>
            <h2>entrez un lien de partie</h2>
            <input type="number" max={9999999} onChange={(event) => {setLienPartie(parseInt(event.target.value)) }}></input>
            <button onClick={valider}>submit</button>
            <h2>Parties en cours:</h2>
        </div>
    );
}
export default Rejoindre;