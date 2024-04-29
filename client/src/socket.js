import io from "socket.io-client";
const host = "http://localhost:3001/";
const socket = io.connect(host);
export default socket;

export let account;
socket.on("resAccount", (pseudo) => {
    account = pseudo;
});
