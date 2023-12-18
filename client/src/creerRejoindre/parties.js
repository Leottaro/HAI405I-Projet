import socket from "../socket";

function Parties(props) {
    function rejoindre() {
        socket.emit('reqJoin', props.code);
    }

    function recommencer() {
        socket.emit('reqRestart', props.code);
    }

    return (
        <div className="divPartie">
            <label className="labelPartie">{props.nbrJoueurs} joueurs</label>
            <button className="buttonPartie" onClick={props.mesParties ? recommencer : rejoindre}>{props.mesParties ? "recommencer" : "rejoindre"}</button>
        </div>
    );
}

export default Parties;
