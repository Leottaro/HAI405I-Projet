import Rank from "../../component/Rank/Rank";
import socket, { account } from "../../socket";
import "./profil.css";
import { useEffect, useState } from "react";

function Profil() {
    const [parties, setParties] = useState([]);
    const [nbBataille, setNbBataille] = useState(0);
    const [winBataille, setWinBataille] = useState(0);
    const [winrateBataille, setWinrateBataille] = useState(0);
    const [nbSix, setNbSix] = useState(0);
    const [winSix, setWinSix] = useState(0);
    const [winrateSix, setWinrateSix] = useState(0);
    const [tetes, setTetes] = useState(0);
    const [nbMemory, setNbMemory] = useState(0);
    const [winMemory, setWinMemory] = useState(0);
    const [winrateMemory, setWinrateMemory] = useState(0);

    useEffect(() => {
        socket.on("resProfilStat", (data) => {
            setParties(data);
            let tempNbBataille = 0;
            let tempWinBataille = 0;
            let tempPlaceBataille = 0;
            let tempNbSix = 0;
            let tempWinSix = 0;
            let tempPlaceSix = 0;
            let tempTetes = 0;
            let tempNbMemory = 0;
            let tempWinMemory = 0;
            let tempPlaceMemory = 0;
            parties.forEach((partie) => {
                switch (partie.nomJeux) {
                    case "sixQuiPrend":
                        tempNbSix += 1;
                        if (partie.place === 1) {
                            tempWinSix += 1;
                        }
                        tempPlaceSix += partie.place;
                        tempTetes += partie.points;
                        break;
                    case "bataille":
                        tempNbBataille += 1;
                        if (partie.place === 1) {
                            tempWinBataille += 1;
                        }
                        tempPlaceBataille += partie.place;
                        break;
                    case "memory":
                        tempNbMemory += 1;
                        if (partie.place === 1) {
                            tempWinMemory += 1;
                        }
                        tempPlaceMemory += partie.place;
                        break;
                    default:
                        break;
                }
            });
            setNbBataille(tempNbBataille);
            setWinBataille(tempWinBataille);
            setWinrateBataille(tempPlaceBataille / tempNbBataille);
            setNbSix(tempNbSix);
            setWinSix(tempWinSix);
            setWinrateSix(tempPlaceSix / tempNbSix);
            setTetes(tempTetes / tempNbSix);
            setNbBataille(tempNbMemory);
            setNbMemory(tempNbMemory);
            setWinMemory(tempWinMemory);
            setWinrateMemory(tempPlaceMemory / tempNbMemory);
        });
        socket.emit("reqProfilStat");
        return () => socket.off("resProfilStat");
    }, [parties]);

    return (
        <>
            <div id="profil">
                <label id="nom">{account}</label>
                <div id="pasLeNom">
                    <div id="profilJeux">
                        <div id="profilBataille">
                            <div className="stat">
                                <label className="nomJeux">Bataille</label>
                                <label className="labelProfil">Parties jouées : {nbBataille}</label>
                                <label className="labelProfil">Victoires : {winBataille}</label>
                                <label className="labelProfil">
                                    Placement Moyen : {winrateBataille}
                                </label>
                            </div>
                            <Rank
                                win={winBataille}
                                nb={nbBataille}
                            />
                        </div>
                        <div id="profilSix">
                            <div className="stat">
                                <label className="nomJeux">Six Qui Prend</label>
                                <label className="labelProfil">Parties jouées : {nbSix}</label>
                                <label className="labelProfil">Victoires : {winSix}</label>
                                <label className="labelProfil">
                                    Placement Moyen : {winrateSix}
                                </label>
                                <label className="labelProfil">
                                    Nombre de têtes de taureau Moyen : {tetes}
                                </label>
                            </div>
                            <Rank
                                win={winSix}
                                nb={nbSix}
                            />
                        </div>
                        <div id="profilMemory">
                            <div className="stat">
                                <label className="nomJeux">Memory</label>
                                <label className="labelProfil">Parties jouées : {nbMemory}</label>
                                <label className="labelProfil">Victoires : {winMemory}</label>
                                <label className="labelProfil">
                                    Placement Moyen : {winrateMemory}
                                </label>
                            </div>
                            <Rank
                                win={winMemory}
                                nb={nbMemory}
                            />
                        </div>
                    </div>
                    <div id="historique">
                        <label id="labelHistorique">Historique</label>
                        <div id="scrollHistorique">
                            {parties.map((json) => (
                                <div className={json.place === 1 ? "victoire" : "defaite"}>
                                    <label className="mode">{json.nomJeux}</label>
                                    <label className="resultat">{json.place}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profil;
