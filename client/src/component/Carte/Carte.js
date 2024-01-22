import { useEffect, useState } from "react";
import socket from "../../socket";

function Carte(props) { // {nom, valeur, type} (nom est composé de dossier+nom.png ex: CartesSix/1.png)
    const [chemin, setChemin] = useState("");
    const [visible, setVisible] = useState(false);
    const [valeur, setValeur] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        if (props.chemin) setChemin(props.chemin);
        else setChemin("FaceCachee.png");
        setVisible(props.visible ? true : false);
        if (props.valeur) setValeur(props.valeur);
        else setValeur("");
        if (props.type) setType(props.type);
        else setType("");
    }, [props]);

    function carteClick() {
        socket.emit("reqCoup", { "valeur": valeur, "type": type });
    }

    return (
        <img className="carte" height={"100"} width={"70"} onClick={carteClick} src={"../../Assets/" + (visible ? chemin : "FaceCachee.png")} alt=""></img>
    );
}
export default Carte;