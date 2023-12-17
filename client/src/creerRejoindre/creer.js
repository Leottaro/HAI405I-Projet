import { useState } from "react";
import socket from "../socket";
import { useParams } from "react-router-dom";

function Creer() {
    const { jeux } = useParams();
    const [nbrJoueursMax, setNbrJoueursMax] = useState(1);

    function valider() {
        socket.emit("reqCreate", { nbrJoueursMax: nbrJoueursMax, jeux: jeux });
    }

    return (
        <div id="CRContent">
            <label className="CRtitle">Nombre de joueurs max dans la partie:</label>
            <input className="CRinput" defaultValue={2} type="number" min={2} max={10} onChange={(event) => { setNbrJoueursMax(parseInt(event.target.value)) }} />
            <button className="CRButton CRvalider" onClick={valider}>Valider</button>
        </div>
    );
}
export default Creer;