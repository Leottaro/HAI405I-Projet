import { useEffect, useState } from "react";
import socket from "../../socket";
import "./score.css";
import { useNavigate, useParams } from "react-router-dom";

function Score() {
    const [gagnant, setGagnant] = useState();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [score, setScore] = useState({});
    socket.on("resGagnant", nom => {
        setGagnant(nom);
    });
    socket.on("listJoueur", liJoueurs => {
        setListeJoueurs(liJoueurs);
    });
    socket.on("scorePartie", liScore => {
        setScore(liScore);
    });

    const navigate = useNavigate();
    function rejouer(){
        navigate("/selectionJeux");
    }

    return (
        <div id="scoreDiv">
            <label id="messageFin">{gagnant} a gagné la partie !</label>
                <table id="customers">
                    <thead>
                        <tr>
                            <th colspan="2">Tableau des scores</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listeJoueurs.map(id =>
                        <tr>
                            <td>{id}</td>
                            <td>{score[id]}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
            <button id="buttonScore" onClick={rejouer}>Rejouer</button>
        </div>
    );
}
export default Score;