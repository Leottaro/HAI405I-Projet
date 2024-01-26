import Rank from "../../component/Rank/Rank";
import Retour from "../../component/Retour/Retour";
import socket, { account } from "../../socket";
import "./profil.css";
import { useEffect, useState } from "react";

function Profil() {
    const [parties, setParties] = useState([]);
    const [nbSix, setNbSix] = useState(0);
    const [nbBataille, setNbBataille] = useState(0);
    const [winSix, setWinSix] = useState(0);
    const [winBataille, setWinBataille] = useState(0);
    const [winrateSix, setWinrateSix] = useState(0);
    const [winrateBataille, setWinrateBataille] = useState(0);
    const [tetes, setTetes] = useState(0);
    useEffect(() => {
        socket.on("resProfilStat", data => {
            setParties(data);
            let tempNbSix = 0;
            let tempNbBataille = 0;
            let tempWinSix = 0;
            let tempWinBataille = 0;
            let tempPlaceSix = 0;
            let tempPlaceBataille = 0;
            let tempTetes = 0;
            parties.forEach(partie => {
                switch (partie.nomJeux) {
                    case "sixQuiPrend":
                        tempNbSix += 1;
                        if (partie.place == 1) {
                            tempWinSix += 1;
                        }
                        tempPlaceSix += partie.place;
                        tempTetes += partie.points;
                        break;
                    case "bataille":
                        tempNbBataille += 1;
                        if (partie.place == 1) {
                            tempWinBataille += 1;
                        }
                        tempPlaceBataille += partie.place;
                        break;
                    default:
                        break;
                }
            })
            setNbSix(tempNbSix);
            setNbBataille(tempNbBataille);
            setWinSix(tempWinSix);
            setWinBataille(tempWinBataille);
            setWinrateSix(tempPlaceSix / tempNbSix);
            setWinrateBataille(tempPlaceBataille / tempNbBataille);
            setTetes(tempTetes / tempNbSix);
        });
        socket.emit("reqProfilStat");
        return () => socket.off("resProfilStat");
    });


    return (
        <>
            <div id="profil">
            <Rank winBataille={winBataille} nbBataille={nbBataille} winSix={winSix} nbSixS={nbSix}/>
                <label id="nom">{account}</label>
                <div id="pasLeNom">
                    <div id="profilJeux">
                        <div id="profilBataille">
                            <div className="stat">
                                <label className="nomJeux">Bataille</label>
                                <label className="labelProfil">Parties jouées : {nbBataille}</label>
                                <label className="labelProfil">Victoires : {winBataille}</label>
                                <label className="labelProfil">Placement Moyen : {winrateBataille}</label>
                            </div>
                        </div>
                        <div id="profilSix">
                            <div className="stat">
                                <label className="nomJeux">Six Qui Prend</label>
                                <label className="labelProfil">Parties jouées : {nbSix}</label>
                                <label className="labelProfil">Victoires : {winSix}</label>
                                <label className="labelProfil">Placement Moyen : {winrateSix}</label>
                                <label className="labelProfil">Nombre de têtes de taureau Moyen : {tetes}</label>
                            </div>
                        </div>
                    </div>
                    <div id="historique">
                        <label id="labelHistorique">Historique</label>
                        <div id="scrollHistorique">
                            {parties.map(json =>
                                <div className={json.place == 1 ? "victoire" : "defaite"}>
                                    <label className="mode">{json.nomJeux}</label>
                                    <label className="resultat">{json.place}</label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Retour left="2vw" top="2vh" />
        </>
    )
}

export default Profil;