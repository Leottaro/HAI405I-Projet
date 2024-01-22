import socket, { account } from "../../socket";
import "./Profil.css";
import { useEffect, useState } from "react";

function Profil(){
    const [historique, setHistorique] = useState([]);

    return (
        <div id="profil">
            <label id="nom">{account}</label>
            <div id="pasLeNom">
                <div id="profilJeux">
                    <div className="profilJeux">
                        <div className="stat">
                            <label id="nomBataille">Bataille</label>
                            <label className="labelProfil">Parties jouées : </label>
                            <label className="labelProfil">Victoires : </label>
                            <label className="labelProfil">Winrate : </label>
                        </div>
                    </div>
                    <div className="profilJeux">
                        <div className="stat">
                            <label id="nomSix">Six Qui Prend</label>
                            <label className="labelProfil">Parties jouées : </label>
                            <label className="labelProfil">Victoires : </label>
                            <label className="labelProfil">Placement moyen : </label>
                        </div>
                    </div>
                </div>
                <div id="historique">
                    <label id="labelHistorique">Historique</label>
                    <div id="scrollHistorique">
                        {historique.map(json => 
                            <div className="partie">
                                <label className="mode">{json.mode}</label>
                                <label className="resultat">{json.resultat}</label>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profil;