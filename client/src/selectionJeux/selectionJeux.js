import socket from "../socket";
import { useEffect, useState } from "react";
import './selectionJeux.css';
import belote from './belote.png'
import bataille from './bataille.png'

function SelectionJeux(){
    const [jeux, setJeux] = useState("");
    const [i, setI] = useState(0);
    let listeJeux=[bataille,belote];

    function gauche(){
        
        if(i>0){
            setI(i-1);
        } else {
            setI(listeJeux.length-1);
        }
    }

    function droite(){
        setI((i+1)%listeJeux.length);
    }

    function choisir(){
        socket.emit("choixJeux", listeJeux[i]);
    }

    return (
        <div>
            <button onClick={gauche}>❮</button>
                <img src={listeJeux[i]} onClick={choisir}/>
            <button onClick={droite}>❯</button>
        </div>
    );
}
export default SelectionJeux;