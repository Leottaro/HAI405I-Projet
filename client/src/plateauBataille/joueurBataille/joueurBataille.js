import socket from "../../socket";
import { useEffect, useState } from "react";
import './joueurBataille.css'

function joueurBataille(props){ //nom du joueur et nombre de cartes
    return (
        <div>
            <p>{props.pseudo}</p>
            <p>{props.nbCartes} Cartes</p>
        </div>
    );
}

export default joueurBataille;