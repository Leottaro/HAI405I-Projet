import socket from "../socket";
import { useEffect, useState } from "react";
import JoueurBataille from "./joueurBataille/joueurBataille";

function plateauBataille(){
    return (
        <div>
            <JoueurBataille pseudo="Joueur1" nbCartes="4"/>
            {/* <JoueurBataille pseudo="Joueur2" nbCartes="6"/> */}
        </div>
    );
}

export default plateauBataille;