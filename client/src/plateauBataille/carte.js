import { useState } from "react";
import socket, { account } from "../socket";
const rectoCarte = `../../asset/RectoCarte.png`;

function Carte(props) {
    function carteClick() {
        const temp = props.nom.split("De");
        socket.emit("reqCoup", { "valeur": temp[0], "type": temp[1] });
    }

    return (
        <img className="carte" height={"100"} width={"auto"} onClick={carteClick} src={"../../asset/" + props.nom + ".png"}></img>
    );
}
export default Carte;