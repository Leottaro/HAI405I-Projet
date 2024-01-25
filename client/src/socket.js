import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_HAI405I_HOST || "http://localhost:3001/");
export default socket;

export let account;
socket.on("resAccount", (pseudo) => {
    account = pseudo;
});
