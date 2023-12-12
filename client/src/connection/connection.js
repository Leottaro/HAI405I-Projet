import "./Connection.css";
import { useEffect, useState } from "react";
import socket from "../socket";

function Connection() {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");

    function register() {
        socket.emit("reqRegister", { "pseudo": pseudo, "password": password });
    }

    function connect() {
        socket.emit("reqConnect", { "pseudo": pseudo, "password": password });
    }

    return (
        <div id="connectionDiv">
            <label id="connectionLabel" aria-hidden="true">Bienvenue</label>
            <input className="connectionInput" placeholder="Entrez un nom" type="text" onChange={(event) => { setPseudo(event.target.value) }}></input>
            <input className="connectionInput" placeholder="Entrez le mot de passe" type="password" onChange={(event) => { setPassword(event.target.value) }}></input>
            <button className="connectionButton" onClick={register}>S'inscrire</button>
            <button className="connectionButton" onClick={connect}>Se connecter</button>
        </div>
    );
}
export default Connection;