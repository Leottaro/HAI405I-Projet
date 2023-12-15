import { useEffect, useState } from "react";
import socket, { account } from "../socket";

function Carte(props) {
    const [nom, setNom] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (props.valeur && props.type) setNom(props.valeur + "De" + props.type);
        else setNom("RectoCarte");
        if (props.visible) setVisible(true);
        else setVisible(false);
    }, props);

    function carteClick() {
        if (!visible || nom === "RectoCarte") return;
        const temp = nom.split("De");
        socket.emit("reqCoup", { "valeur": temp[0], "type": temp[1] });
    }

    return (
        <img className="carte" height={"100"} width={"auto"} onClick={carteClick} src={"../../asset/" + (visible ? nom : "RectoCarte") + ".png"}></img>
    );
}
export default Carte;