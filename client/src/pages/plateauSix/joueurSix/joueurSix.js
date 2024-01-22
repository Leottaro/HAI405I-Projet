import { useEffect, useState } from "react";
import './joueurSix.css';
import Carte from '../../../component/Carte/Carte';

function JoueurSix(props) { // {pseudo, carte, carteVisible, score}
    const [carte, setCarte] = useState({});
    const [carteVisible, setCarteVisible] = useState(false);

    useEffect(() => {
        if (props.carte) setCarte(props.carte);
        else setCarte({});
        if (props.carteVisible) setCarteVisible(true);
        else setCarteVisible(false);
    }, [props]);

    return (
        <div className="joueurSix">
            <label className="labelJS">{props.pseudo}</label>
            <label className="labelJS">{props.score + " têtes de boeuf"}</label>
            {!props.carte ? <></> : <Carte visible={carteVisible} valeur={carte.valeur} type={carte.type} chemin={"CartesSix/" + carte.valeur + carte.type + ".png"} />}
        </div>
    );
}

export default JoueurSix;