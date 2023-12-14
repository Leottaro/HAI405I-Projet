import "./TapisBataille.css";
import { useEffect, useState } from "react";

function TapisBataille(props){
    return (
        <div id="tapisBataille">
            <div id="listeCartes">
                <div hidden={props.nbJoueurs<1} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
                <div hidden={props.nbJoueurs<2} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
                <div hidden={props.nbJoueurs<3} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
                <div hidden={props.nbJoueurs<4} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
                <div hidden={props.nbJoueurs<5} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
                <div hidden={props.nbJoueurs<6} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
                <div hidden={props.nbJoueurs<7} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
                <div hidden={props.nbJoueurs<8} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
                <div hidden={props.nbJoueurs<9} class="divTapis">
                    <label id="carte1">10 coeur</label>
                </div>
            </div>
            <div id="maCarte">
                <label id="carteMoi">AS coeur</label>
            </div>
        </div>
    )
}

export default TapisBataille;