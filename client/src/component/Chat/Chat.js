import { useEffect, useState } from "react";
import socket, {account} from "../../socket";
import './Chat.css';

function Chat(){
    const [listeMsg, setListeMsg] = useState([]);
    const [open, setOpen] = useState(true);

    socket.on("resMsg", msg => {
        let temp=listeMsg;
        temp=temp.concat(msg);
        
        setListeMsg(temp);
        console.log("msg : ",msg)
        console.log("temp : ",temp)
    })

    function envoyer(){
        socket.emit("reqMsg",[{pseudo: account, msg: document.getElementById("inputMsg").value}]);
    }


    function maskChat(){
        setOpen(!open);

    }

    return (
        <div className={open ? "" : "closed"}>
            <div className="chat">
                {listeMsg.map((msg, index) => (
                    <div className="auteurMsg" key={index}>
                        <label className="auteur">{msg.pseudo} :</label>
                        <label className="msg">{msg.msg}</label>
                    </div>
                ))}
            
            
            </div>
            <input id="inputMsg" type="text"></input>
            <button id="envoyerMsg" onClick={envoyer}>Envoyer</button>
            <button id="maskChat"  onClick={maskChat}>{open ? ">" : "<"}</button>
        </div>
    )
}
export default Chat;