import "./Connection.css";
import { useState } from "react";
import socket from "../../socket";

function Connection() {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    function signIn() {
        socket.emit("reqSignIn", { "pseudo": pseudo, "password": password });
    }

    function connect() {
        socket.emit("reqLogIn", { "pseudo": pseudo, "password": password });
    }

    socket.on("resSignIn", json => {
        setMessage(json.message);
    });
    socket.on("resLogIn", json => {
        setMessage(json.message);
    });

    return (
        <div id="connectionDiv">
            <label id="connectionLabel" aria-hidden="true">Bienvenue</label>
            <label id="message">{message}</label>
            <input className="connectionInput" placeholder="Entrez un nom" type="text" onChange={(event) => { setPseudo(event.target.value) }}></input>
            <input className="connectionInput" placeholder="Entrez le mot de passe" type="password" onChange={(event) => { setPassword(event.target.value) }}></input>
            <button className="connectionButton" onClick={connect}>Se connecter</button>
            <button className="connectionButton" onClick={signIn}>S'inscrire</button>
        </div>
    );
}
export default Connection;