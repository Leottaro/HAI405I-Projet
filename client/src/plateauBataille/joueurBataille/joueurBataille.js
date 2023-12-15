import socket from "../../socket";
import { useEffect, useState } from "react";
import './joueurBataille.css';
import Carte from '../carte';

function JoueurBataille(props) { // nom de la carte
    return (
        <div className="joueurBataille">
            <label className="labelJB">{props.pseudo}</label>
            <label className="labelJB">{props.nbrCartes} Cartes</label>
            {!props.carte ? <></> : <Carte visible={true} valeur={props.carte.valeur} type={props.carte.type} />}
        </div>
    );
}

export default JoueurBataille;