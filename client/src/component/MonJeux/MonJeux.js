import socket, { account } from "../../socket";
import Carte from "../Carte/Carte";
import "./MonJeux.css";

export default function MonJeux(props) { // props : {paquet: [carte1, carte2]}
    console.log(props);
    return (
        <div className="monJeux">
            <p className="monNom">{account}</p>
            <div className="mesCartes">
                {props.paquet.filter(carte => carte).map((carte, index) => <Carte visible={true} valeur={carte.valeur} type={carte.type} key={"carte" + index} />)}
            </div>
            <label className="monLabel">{props.paquet.length} Cartes</label>
        </div>
    );
}