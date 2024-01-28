import io from "socket.io-client";
const host =
    process.env.NODE_ENV === "production"
        ? "http://jeuxapi.laboulangerie.net/"
        : "http://localhost:3001/";
const socket = io.connect(host);
export default socket;

export let account;
socket.on("resAccount", (pseudo) => {
    account = pseudo;
});
