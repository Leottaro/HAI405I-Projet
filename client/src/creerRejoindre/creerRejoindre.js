import { useEffect, useState } from "react";
import socket from "../socket";
import Creer from "./creer";
import Rejoindre from "./rejoindre";
import "./creerRejoindre.css";

function CreerRejoindre(){

    return (
    <div class = 'creerRejoindre'>
        <Creer/>
    </div>
);}
export default CreerRejoindre;

