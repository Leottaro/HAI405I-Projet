import { account } from "../../socket";
import Carte from "../Carte/Carte";
import "./MonJeux.css";

export default function MonJeux(props) {
    // {dossier: "" (voir Carte.js), paquet: [carte1, carte2], texte}
    return (
        <div className="monJeux">
            <p className="monLabel">{account}</p>
            <div className="mesCartes">
                {props.paquet ? (
                    props.paquet
                        .filter((carte) => carte)
                        .map((carte, index) => (
                            <Carte
                                visible
                                valeur={carte.valeur}
                                type={carte.type}
                                chemin={props.dossier + carte.valeur + carte.type + ".png"}
                                key={"carte" + index}
                            />
                        ))
                ) : (
                    <></>
                )}
            </div>
            <label className="monLabel">{props.texte}</label>
        </div>
    );
}
