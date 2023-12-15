import socket from "../../socket";
import { useEffect, useState } from "react";
import './joueurBataille.css';
import Carte from '../carte';

function joueurBataille(props) { // nom de la carte
    return (
        <div className="joueurBataille">
            <p>{props.pseudo}</p>
            <p>{props.nbrCartes} Cartes</p>
            {!props.carte ? <div/> : props.carte == null ? <Carte nom="RectoCarte"/> : <Carte nom={props.carte.valeur + "De" + props.carte.type}/>}
        </div>
    );
}

export default joueurBataille;