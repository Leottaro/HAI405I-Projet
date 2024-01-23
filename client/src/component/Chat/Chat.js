import { useEffect, useRef, useState } from "react";
import socket, { account } from "../../socket";
import './Chat.css';

function Chat() {
    const [listeMsg, setListeMsg] = useState([]);
    const [isChatShown, setChatShown] = useState(false);
    const [isNotifShown, setNotifShown] = useState(false);
    const [input, setInput] = useState("");
    const MessagesRef = useRef(null);

    socket.on("resMsg", msg => {
        setListeMsg(listeMsg.concat(msg));
        setNotifShown(!isChatShown)
    });

    useEffect(() => {
        if (MessagesRef.current) {
            MessagesRef.current.scrollTop = MessagesRef.current.scrollHeight;
        }
    }, [listeMsg]);

    function envoyer() {
        setInput("");
        if (input.replaceAll(" ", "") === "") {
            return;
        }
        socket.emit("reqMsg", [{ pseudo: account, msg: input }]);

    }

    function handleKey(event) {
        if (event.key === "Enter") envoyer();
    }

    function onChatButtonClick() {
        setChatShown(!isChatShown);
        if (!isChatShown) setNotifShown(false);
    }

    return (
        <>
            <svg viewBox="-12 -12 24 24" id="ChatButton" onClick={onChatButtonClick} className={isChatShown ? "shown" : ""}>
                <path d="M 7 0 L -7 0 M 7 0 L 1 -6 M 7 0 L 1 6" strokeLinecap="round" />
            </svg>
            <span id="ChatNotif" className={isNotifShown ? "shown" : ""} />
            <div id="ChatDiv" className={isChatShown ? "shown" : ""}>
                <div id="inputDiv">
                    <input id="MessageInput" type="text" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKey} />
                    <button id="MessageButton" onClick={envoyer}>Envoyer</button>
                </div>
                <div id="Messages" ref={MessagesRef}>
                    {listeMsg.map((msg, index) => (
                        <div className="Msg" key={index}>
                            <label className="auteur">{msg.pseudo + " :"}</label>
                            <label className="contenu">{msg.msg}</label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Chat;