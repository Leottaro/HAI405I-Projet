import socket from "../socket";

function Parties(props) {
    function rejoindre(){
        socket.emit('reqJoin',props.code);
    }

    return (
        <div className="divParties">
            <label className="labelParties">{props.nbrJoueurs} joueurs</label>
            <button onClick={rejoindre}>rejoindre</button>
        </div>
    );
}

export default Parties;
