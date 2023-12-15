import socket from "../../socket";
import { useEffect, useState } from "react";
import './joueurBataille.css';
import Carte from '../carte';

function JoueurBataille(props) { // nom de la carte
    const [carteVisible, setCarteVisible] = useState(props.carteVisible);
    const [carte, setCarte] = useState(props.carte);

    useEffect(() => {
        console.log("hehe joueur " + JSON.stringify(props));
        setCarteVisible(props.carteVisible);
        setCarte(props.carte);
    }, [props]);

    return (
        <div className="joueurBataille">
            <label className="labelJB">{props.pseudo}</label>
            <label className="labelJB">{props.nbrCartes} Cartes</label>
            {!props.carte ? <></> : <Carte visible={carteVisible} valeur={carte.valeur} type={carte.type} />}
        </div>
    );
}

export default JoueurBataille;