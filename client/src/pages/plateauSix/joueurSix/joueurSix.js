import { useEffect, useState } from "react";
import './joueurSix.css';
import Carte from '../../../component/Carte/Carte';

function JoueurSix(props) { // nom de la carte
    const [carte, setCarte] = useState({});
    const [carteVisible, setCarteVisible] = useState(true);

    useEffect(() => {
        if (props.carte) setCarte(props.carte);
        else setCarte({});
        if (props.carteVisible) setCarteVisible(true);
        else setCarteVisible(false);
    }, [props]);

    return (
        <div className="joueurSix">
            <label className="labelJS">{props.pseudo}</label>
            <label className="labelJS">{props.nbrCartes} Cartes</label>
            {!props.carte ? <></> : <Carte visible={carteVisible} valeur={carte.valeur} type={carte.type} />}
        </div>
    );
}

export default JoueurSix;