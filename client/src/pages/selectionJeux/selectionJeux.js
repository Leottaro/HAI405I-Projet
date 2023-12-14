import socket from "../../socket";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './selectionJeux.css';
import belote from './belote.png'
import bataille from './bataille.png'

function SelectionJeux() {
    const [jeux, setJeux] = useState("");
    const [i, setI] = useState(0);
    let listeJeux = [bataille, belote];
    let listeStringJeux = ["bataille", "belote"];

    function gauche() {
        if (i > 0) {
            setI(i - 1);
        } else {
            setI(listeJeux.length - 1);
        }
    }

    function droite() {
        setI((i + 1) % listeJeux.length);
    }

    const navigate = useNavigate();
    function choisir() {
        navigate("/creer");
    }

    return (
        <div id="selectionJeuxDiv">
            <button className="selectionJeuxButton" onClick={gauche}>❮</button>
            <img src={listeJeux[i]} onClick={choisir} />
            <button className="selectionJeuxButton" onClick={droite}>❯</button>
        </div>
    );
}
export default SelectionJeux;