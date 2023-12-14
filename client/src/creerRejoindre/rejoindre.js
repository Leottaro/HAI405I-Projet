import { useEffect, useState } from "react";
import socket from "../socket";
import "./rejoindre.css";
import { useNavigate } from "react-router-dom";

function Rejoindre() {
    const [lien, setLienPartie] = useState(1);
    const navigate=useNavigate();
    const [message, setMessage] = useState("");
    //const [listParties, setListParties] = useState([]);
    const [listPartiesString, setListPartiesString] = useState("");
    let listParties=[{code:1,nbrJoueurs:2},{code:2,nbrJoueurs:3},{code:2,nbrJoueurs:3},{code:2,nbrJoueurs:3},{code:2,nbrJoueurs:3},{code:2,nbrJoueurs:3},{code:2,nbrJoueurs:3},{code:2,nbrJoueurs:3}]
    

    function afficheListPartie(){
        console.log(listPartiesString);
        let temp="";
        for(let i=0;i<listParties.length;i++){
            temp+=jsonToHtml(listParties[i]);
            
        }
        setListPartiesString(temp);
    }
    
    function creer() {
        navigate("/creer");
    }
    function jsonToHtml(json){
        return "<div class='divParties'><label class='labelParties'>"+json.nbrJoueurs+" Joueurs</label><button onClick={rejoindre("+json.code+")}>Rejoindre</button></div>"
    }
    function valider(){
        socket.emit("reqJoin", lien);
    }
    socket.on('resJoin',json => {
        setMessage(json.message)
    });
    socket.on('resGames',json => {
        //setListParties(json)
        //afficheListPartie()
    });
    return (
        <div id="rejoindreDiv">
            <div id="creerRejoindre">
                <button id="creerButton"onClick={creer}>Creer</button>
                <button id="rejoindreButton">Rejoindre</button>
            </div>
            <label class="labelChris">entrez un lien de partie</label>
            <input className="lienInput" type="number" max={9999999} onChange={(event) => {setLienPartie(parseInt(event.target.value)) }}></input>
            <button className="submitButton" onClick={valider}>submit</button>
            <label id="message">{message}</label>
            <label id="partiesEnCours">Parties en cours:</label>
            <div id="listeParties" dangerouslySetInnerHTML={{ __html: listPartiesString}}/>
            <button onClick={afficheListPartie}>afficheListPartie</button>
        </div>
    );
}
export default Rejoindre;