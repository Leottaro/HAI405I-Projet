import { useEffect, useState } from "react";
import socket from "../../socket";
import './Chat.css';

function Chat(){
    const [listeMsg, setListeMsg] = useState([]);
    
    useEffect(()=>{
        
        let interval = setInterval(afficherChat,1000);
    }, []);

    socket.on("nouveauMsg", msg => {
        let temp=listeMsg;
        temp.concat(msg);
        setListeMsg(temp);
    })

    function afficherChat(){
        setListeMsg([{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"}, {pseudo: "pasmoi", msg: "salut"},{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"},{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"},{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"},{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"},{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"},{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"},{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"},{pseudo: "moi", msg: "bonjour je suis moi meme et je mange des artichauds et des bananes"}]);
    }

    function envoyer(){
        afficherChat();
        console.log(listeMsg);
        socket.emit("msg",document.getElementById("inputMsg").value);
    }

    return (
        <div>
            <div className="chat">
                {listeMsg.map((msg, index) => (
                    <div className="auteurMsg">
                        <label className="auteur">{msg.pseudo} :</label>
                        <label className="msg">{msg.msg}</label>
                    </div>
                ))}
                
            
            </div>
            <input id="inputMsg" type="text"></input>
            <button id="envoyerMsg" onClick={envoyer}>Envoyer</button>
        </div>
    )
}
export default Chat;