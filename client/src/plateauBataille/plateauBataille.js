import socket from "../socket";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JoueurBataille from "./joueurBataille/joueurBataille";
import TapisBataille from "./TapisBataille/TapisBataille";
import './plateauBataille.css'

function PlateauBataille(){
    const { code } = useParams();
    let listeJoueurs=["moi","Joueur1","Joueur2","Joueur3","Joueur4","Joueur5","Joueur6","Joueur7","Joueur8","Joueur9"]
    let nbJoueurs=7;

    socket.on("debutGame", data => {
        listeJoueurs=data;
        nbJoueurs=listeJoueurs.length;
        
    })

    function start(){
        socket.emit("start");
    }

    return (
        <div id="plateauBataille">
            <div id="listeJoueurs">
                <div hidden={nbJoueurs<1}>
                    <JoueurBataille pseudo={listeJoueurs[1]} nbCartes="4"/>
                </div>
                <div hidden={nbJoueurs<2}>
                    <JoueurBataille pseudo={listeJoueurs[2]} nbCartes="4"/>
                </div>
                <div hidden={nbJoueurs<3}>
                    <JoueurBataille pseudo={listeJoueurs[3]} nbCartes="4"/>
                </div>
                <div hidden={nbJoueurs<4}>
                    <JoueurBataille pseudo={listeJoueurs[4]} nbCartes="4"/>
                </div>
                <div hidden={nbJoueurs<5}>
                    <JoueurBataille pseudo={listeJoueurs[5]} nbCartes="4"/>
                </div>
                <div hidden={nbJoueurs<6}>
                    <JoueurBataille pseudo={listeJoueurs[6]} nbCartes="4"/>
                </div>
                <div hidden={nbJoueurs<7}>
                    <JoueurBataille pseudo={listeJoueurs[7]} nbCartes="4"/>
                </div>
                <div hidden={nbJoueurs<8}>
                    <JoueurBataille pseudo={listeJoueurs[8]} nbCartes="4"/>
                </div>
                <div hidden={nbJoueurs<9}>
                    <JoueurBataille pseudo={listeJoueurs[9]} nbCartes="4"/>
                </div>
            </div>
            <div id="tapis">
                <TapisBataille nbJoueurs={nbJoueurs}/>
                <button id="start" onClick={start}>Start</button>
            </div>
            
            <div id="moi">
                <JoueurBataille pseudo={listeJoueurs[0]} nbCartes="10000"/>
                
            </div>
            
        </div>
    );
}
export default PlateauBataille;