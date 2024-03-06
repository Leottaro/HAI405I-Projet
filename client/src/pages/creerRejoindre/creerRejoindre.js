import { useState } from "react";
import "./creerRejoindre.css";
import { useParams } from "react-router-dom";
import Creer from "./creer";
import Rejoindre from "./rejoindre";
import MesParties from "./mesParties";

function CreerRejoindre(params) {
    const { jeux } = useParams();
    const [mode, setMode] = useState(params.mode);

    function creer() {
        if (mode !== "creer") {
            setMode("creer");
        }
    }

    function rejoindre() {
        if (mode !== "rejoindre") {
            setMode("rejoindre");
        }
    }

    function mesParties() {
        if (mode !== "mesParties") {
            setMode("mesParties");
        }
    }

    return (
        <>
            <div id="CRDiv">
                <div id="CRbuttonDiv">
                    <button
                        className="CRButton"
                        onClick={creer}
                        disabled={mode === "creer"}
                    >
                        Creer
                    </button>
                    <button
                        className="CRButton"
                        onClick={rejoindre}
                        disabled={mode === "rejoindre"}
                    >
                        Rejoindre
                    </button>
                    <button
                        className="CRButton"
                        onClick={mesParties}
                        disabled={mode === "mesParties"}
                    >
                        Mes parties
                    </button>
                </div>
                {mode === "creer" ? (
                    <Creer jeux={jeux} />
                ) : mode === "rejoindre" ? (
                    <Rejoindre jeux={jeux} />
                ) : (
                    <MesParties jeux={jeux} />
                )}
            </div>
        </>
    );
}
export default CreerRejoindre;
