import { useEffect, useState } from "react";
import './joueurBataille.css';
import Carte from '../../../component/Carte/Carte';

function JoueurBataille(props) { // {pseudo, nbrCartes, carte, carteVisible}
    const [carte, setCarte] = useState({});
    const [carteVisible, setCarteVisible] = useState(false);

    useEffect(() => {
        if (props.carte) setCarte(props.carte);
        else setCarte({});
        if (props.carteVisible) setCarteVisible(true);
        else setCarteVisible(false);
    }, [props]);

    return (
        <div className="joueurBataille">
            <label className="labelJB">{props.pseudo}</label>
            <label className="labelJB">{props.nbrCartes + " Cartes"}</label>
            {!props.carte ? <></> : <Carte visible={carteVisible} valeur={carte.valeur} type={carte.type} chemin={"CartesBataille/" + carte.valeur + carte.type + ".png"} />}
        </div>
    );
}

export default JoueurBataille;