import { useEffect, useState } from "react";
import socket from "../socket";
import "./score.css";
import { useNavigate, useParams } from "react-router-dom";

function Score() {
    const [gagnant, setGagnant] = useState();
    const [listeJoueurs, setListeJoueurs] = useState([]);
    const [score, setScore] = useState({ nom: "", score : });
    socket.on("resGagnant", nom => {
        setGagnant(nom);
    });

    socket.on("listJoueur", liJoueurs => {
        setListeJoueurs(liJoueurs);
    });
    socket.on("scorePartie", dicoScore => {
        setScore(dicoScore);
    });

    return (
        <div id="scoreDiv">
            <label id="messageFin">{gagnant} a gagner la partie!</label>
            <div id="scoreBoard">
                <table>
                <thead>
                    <tr>
                        <th colspan="2">Tableau des scores</th>
                    </tr>
                </thead>
                <tbody>
                {listeJoueurs.map((nom) => {
                <tr>
                    <td>{nom}</td>
                    <td>{dicoScore[nom]}</td>
                </tr>})}
                </tbody>
                </table>
            </div>
        </div>
    );
}
export default Score;