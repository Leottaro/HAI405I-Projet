import io from "socket.io-client";
const socket = io.connect(
    process.env.REACT_APP_ENV === "dev"
        ? "http://localhost:3001"
        : "http://bottle.laboulangerie.net:9999"
);
export default socket;

export let account;
socket.on("resAccount", (pseudo) => {
    account = pseudo;
});
