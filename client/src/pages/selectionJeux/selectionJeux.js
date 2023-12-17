import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './selectionJeux.css';
import belote from './belote.png'
import bataille from './bataille.png'

function SelectionJeux() {
    const [i, setI] = useState(0);
    const listeJeux = [bataille, belote];
    const listeNomJeux = ["bataille", "belote"];

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
        setTimeout(() => navigate("/creerRejoindre/" + listeNomJeux[i]), 10);
    }

    return (
        <div id="selectionJeuxDiv">
            <button className="selectionJeuxButton" onClick={gauche}>❮</button>
            <img className="img" src={listeJeux[i]} onClick={choisir} alt=""/>
            <button className="selectionJeuxButton" onClick={droite}>❯</button>
        </div>
    );
}
export default SelectionJeux;