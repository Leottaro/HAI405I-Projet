import "./leaderboard.css";
import socket from "../../socket";
import { useEffect, useState } from "react";

function Leaderboard() {
    // {nom , nbWin}
    const [general, setGeneral] = useState([]);
    const [bataille, setBataille] = useState([]);
    const [six, setSix] = useState([]);

    useEffect(() => {
        socket.on("resLeaderboard", ([g, b, s]) => {
            setGeneral(g);
            setBataille(b);
            setSix(s);
        })
        socket.emit("reqLeaderboard");
        return () => socket.off("resLeaderboard");
    }, []);


    return (
        <div id="leaderboard">
            <div id="total">
                <label className="nomJeu">Général</label>
                <div className="classement">
                    {general.map((json, i) =>
                        <div className="divPlace">
                            <div className={i === 0 ? "first" : (i === 1 ? "second" : (i === 2 ? "third" : "place"))}>
                                <label className="labelPlace">{i + 1}</label>
                            </div>
                            <div className="joueur">
                                <label className="nomJoueur">{json.nom}</label>
                                <label className="statJoueur">{json.nbWin} Victoires</label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div id="eachGame">
                <div id="classementBataille">
                    <label className="nomJeu">Bataille</label>
                    {bataille.map((json, i) =>
                        <div className="divPlace">
                            <div className={i === 0 ? "first" : (i === 1 ? "second" : (i === 2 ? "third" : "place"))}>
                                <label className="labelPlace">{i + 1}</label>
                            </div>
                            <div className="joueur">
                                <label className="nomJoueur">{json.nom}</label>
                                <label className="statJoueur">{json.nbWin} Victoires</label>
                            </div>
                        </div>
                    )}
                </div>
                <div id="classementSix">
                    <label className="nomJeu">Six qui prend</label>
                    {six.map((json, i) =>
                        <div className="divPlace">
                            <div className={i === 0 ? "first" : (i === 1 ? "second" : (i === 2 ? "third" : "place"))}>
                                <label className="labelPlace">{i + 1}</label>
                            </div>
                            <div className="joueur">
                                <label className="nomJoueur">{json.nom}</label>
                                <label className="statJoueur">{json.nbWin} Victoires</label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;