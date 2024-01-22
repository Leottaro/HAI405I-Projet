import { useState } from "react";
import socket, { account } from "../../socket";
import Carte from "../Carte/Carte";
import "./MonJeux.css";

export default function MonJeux(props) { // {dossier: "" (voir Carte.js), paquet: [carte1, carte2]}
    const [dossier, setDossier] = useState(props.dossier ? props.dossier : "");
    return (
        <div className="monJeux">
            <p className="monNom">{account}</p>
            <div className="mesCartes">
                {props.paquet.filter(carte => carte).map((carte, index) => <Carte visible valeur={carte.valeur} type={carte.type} chemin={dossier + carte.valeur + carte.type + ".png"} key={"carte" + index} />)}
            </div>
            <label className="monLabel">{props.paquet.length} Cartes</label>
        </div>
    );
}