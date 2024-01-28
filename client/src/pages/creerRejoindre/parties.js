import socket from "../../socket";

function Parties(props) {
    return (
        <div className="divPartie">
            <label className="labelPartie">{props.nbrJoueurs + " joueurs"}</label>
            <button className="buttonPartie" onClick={props.buttonCallback}>{props.buttonText}</button>
        </div>
    );
}

export default Parties;
