import { useEffect, useState } from "react";
import socket from "../socket";
import "./score.css";
import { useNavigate, useParams } from "react-router-dom";

function Score() {
    const [gagnant, setGagnant] = useState();

    socket.on("resGagnant", nom => {
        setGagnant(nom);
    });
    return (
        <div id="scoreDiv">
            <label id="messageFin">{gagnant} a gagner la partie!</label>
        </div>
    );
}
export default Score;