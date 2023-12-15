import socket from "../../socket";
import { useEffect, useState } from "react";
import './joueurBataille.css'

function joueurBataille(props) { //nom du joueur et nombre de cartes
    return (
        <div className="joueurBataille">
            <p>{props.pseudo}</p>
            <p>{props.nbrCartes} Cartes</p>
            <label className="carteJouée">Vallet de Carreau</label>
        </div>
    );
}

export default joueurBataille;