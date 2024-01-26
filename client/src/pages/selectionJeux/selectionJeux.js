import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './selectionJeux.css';
import sixQuiPrend from './sixQuiPrend.jpg'
import bataille from './bataille.png'
import NavProfil from "../../component/NavProfil/NavProfil";
import Navbar from "../../component/NavBar/NavBar";

function SelectionJeux() {
    const [i, setI] = useState(0);
    const [placement, setPlacement] = useState("center");
    const listeJeux = [bataille, sixQuiPrend];
    const listeNomJeux = ["bataille", "sixQuiPrend"];

    function gauche() {

        setPlacement("gauche");
        setTimeout(() => {
            setPlacement("droite");
        }, 250);
        setTimeout(() => {
            if (i > 0) {
                setI(i - 1);
            } else {
                setI(listeJeux.length - 1);
            }
            setPlacement("center");
        }, 500);

    }

    function droite() {

        setPlacement("droite");
        setTimeout(() => {
            setPlacement("gauche");
        }, 250);
        setTimeout(() => {
            setI((i + 1) % listeJeux.length);
            setPlacement("center");
        }, 500);
    }

    const navigate = useNavigate();
    function choisir() {
        navigate("/creerRejoindre/" + listeNomJeux[i]);
    }

    return (
        <div id="selectionJeuxDiv">
            <Navbar/>
            <button id="gauche" className="selectionJeuxButton" onClick={gauche}>❮</button>
            <img id="img" className={placement} src={listeJeux[i]} onClick={choisir} alt="" />
            <button id="droite" className="selectionJeuxButton" onClick={droite}>❯</button>
        </div>
    );
}
export default SelectionJeux;