import { useEffect, useState } from "react";
import socket from "../socket";

function Connection() {
    const [pseudo, setPseudo] = useState("");
    const [password, setPassword] = useState("");

    function valider() {
        socket.emit("reqRegister", [pseudo, password]);
    }

    return (
        <div id="connection">
            <input placeholder="Entrez un nom" type="text" onChange={(event) => { setPseudo(event.target.value) }}></input>
            <input placeholder="Entrez le mot de passe" type="password" onChange={(event) => { setPassword(event.target.value) }}></input>
            <button onClick={valider}>Valider</button>
        </div>
    );
}
export default Connection;