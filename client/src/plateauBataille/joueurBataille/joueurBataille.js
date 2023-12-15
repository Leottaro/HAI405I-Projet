import socket from "../../socket";
import { useEffect, useState } from "react";
import './joueurBataille.css';
import Carte from '../carte';

function JoueurBataille(props) { // nom de la carte
    const [carte, setCarte] = useState({});
    const [carteVisible, setCarteVisible] = useState(true);

    useEffect(() => {
        if (props.carte) setCarte(props.carte);
        else setCarte({});
        if (props.carteVisible) setCarteVisible(true);
        else setCarteVisible(false);
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