import socket from "../../socket";
import { useEffect, useState } from "react";
import './joueurBataille.css';
import Carte from '../carte';

function JoueurBataille(props) { // nom de la carte
    return (
        <div className="joueurBataille">
            <p>{props.pseudo}</p>
            <p>{props.nbrCartes} Cartes</p>
            {!props.carte ? <div /> : <Carte visible={true} valeur={props.carte.valeur} type={props.carte.type} />}
        </div>
    );
}

export default JoueurBataille;