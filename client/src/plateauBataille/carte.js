import socket from "../socket";

function Carte(props) {
    const lien = `../../asset/${props.valeur}De${props.type}.png`;
    console.log(lien);

    function carteClick() {
        socket.emit("reqCoup", props);
    }

    return (
        <div className="carte">
            <img height={"100"} src={lien}></img>
            {/* <label onClick={carteClick} className="carteLabel">{props.valeur} de {props.type}</label> */}
        </div>
    );
}
export default Carte;