import { useEffect, useRef, useState } from "react";
import socket, { account } from "../../socket";
import './Chat.css';

function Chat() {
    const [listeMsg, setListeMsg] = useState([]);
    const [isChatShown, setChatShown] = useState(false);
    const [isNotifShown, setNotifShown] = useState(false);
    const [input, setInput] = useState("");
    const MessagesRef = useRef(null);

    useEffect(() => {
        socket.on("resMsg", msg => {
            setListeMsg(listeMsg.concat(msg));
            setNotifShown(!isChatShown)
        });
        return () => socket.off("resMsg");
    }, [listeMsg, isChatShown]);

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 48" id="ChatButton" onClick={onChatButtonClick} className={isChatShown ? "shown" : ""} >
                <path className="arrow" d="M20 24H4M20 24l-8-6M20 24l-8 6" stroke="#fff" strokeLinecap="round" strokeWidth={3} />
                <path className="background" fill="#ffffff40" d="M0 24c0-6 6-12 12-12S24 6 24 0v48c0-6-6-12-12-12S0 30 0 24Z" />
            </svg>
            <span id="ChatNotif" className={isNotifShown ? "shown" : ""} />
            <div id="ChatDiv" className={isChatShown ? "shown" : ""}>
                <div id="inputDiv">
                    <input id="MessageInput" type="text" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKey} />
                    <button id="MessageButton" onClick={envoyer}>Envoyer</button>
                </div>
                <div id="Messages" ref={MessagesRef}>
                    {listeMsg.map((msg, index) => (
                        <div className={"Msg" + (msg.pseudo === account ? " mien" : "")} key={index}>
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