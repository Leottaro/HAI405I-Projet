import socket from "../socket";

function Parties(props) {
    function rejoindre() {
        socket.emit('reqJoin', props.code);
    }

    return (
        <div className="divPartie">
            <label className="labelPartie">{props.nbrJoueurs} joueurs</label>
            <button className="buttonPartie" onClick={rejoindre}>rejoindre</button>
        </div>
    );
}

export default Parties;
