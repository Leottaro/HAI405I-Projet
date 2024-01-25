import io from "socket.io-client";
require("dotenv").config();
const socket = io.connect(process.env.HAI405I_HOST || "http://localhost:3001/");
export default socket;

export let account;
socket.on("resAccount", (pseudo) => {
    account = pseudo;
});
