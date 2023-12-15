const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database("./databases/HAI405I.db", err => {
    if (err) throw err;
    console.log("Database started on ./databases/HAI405I.db");
    // database.run("DROP TABLE IF EXISTS account");
    database.run("CREATE TABLE IF NOT EXISTS account (pseudo VARCHAR(255) PRIMARY KEY, password VARCHAR(255) NOT NULL);");
});

const Bataille = require("./games/Bataille");
const listeJeux = { "bataille": Bataille };

app.get("/", (req, res) => {
    res.send("<h1>voici le serveur</h1>");
});

io.listen(3001, () => {
    console.log("server running on port http://localhost:3001/");
});

const sockets = {}; // clef: socket.id              valeur: {compte, partie}
const parties = {}; // clef: code de la partie      valeur: instance de jeu

io.on("connection", function (socket) {

    // CONNECTION

    socket.on("reqSignIn", json => {
        database.all(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`, (err, rows) => {
            if (err) throw err;
            if (!rows) throw new Error("Problem with the database");
            if (rows.length != 0) {
                return socket.emit("resSignIn", { success: false, message: `${json.pseudo} is already taken !` });
            }
            database.run(`INSERT INTO account(pseudo, password) VALUES ("${json.pseudo}", "${json.password}")`);
            sockets[socket.id] = { compte: json.pseudo };

            socket.emit("resSignIn", { success: true, message: `Successfully signIned user "${json.pseudo}" with socket ${socket.id}` });
            socket.emit("goTo", "/selectionJeux");
            socket.emit("resAccount", json.pseudo);
            console.log(json);
        });
    });

    socket.on("reqLogIn", json => {
        if (Object.values(sockets).some(socketInfo => socketInfo.compte === json.pseudo)) {
            return socket.emit("resSignIn", { success: false, message: `${json.pseudo} is already connected !` });
        }
        database.all(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`, (err, rows) => {
            if (err) throw err;
            if (!rows) throw new Error("Problem with the database");
            if (rows.length == 0 || json.password != rows[0].password) {
                return socket.emit("resLogIn", { success: false, message: `wrong username or password !` });
            }
            sockets[socket.id] = { compte: json.pseudo };

            socket.emit("resLogIn", { success: true, message: `Successfully connected user "${json.pseudo}" with socket ${socket.id}` });
            socket.emit("goTo", "/selectionJeux");
            socket.emit("resAccount", json.pseudo);
            console.log(json);
        });
    });

    // AUTO DÉCONNECTION

    socket.on("reqLogOut", () => {
        if (sockets[socket.id]) {
            console.log(`account ${sockets[socket.id]["compte"]} disconnected: ${socket.id}`);
            socket.leave(sockets[socket.id].partie);
            resPlayers(sockets[socket.id].partie);
            delete sockets[socket.id];
        }
    });

    // CREER

    socket.on("reqCreate", json => {
        const nbrJoueur = json.nbrJoueur;
        const jeux = listeJeux[json.jeux];
        if (nbrJoueur < jeux.playersRange[0] || nbrJoueur > jeux.playersRange[1] || !jeux) {
            return socket.emit("resCreate", { success: false, message: `nbrJoueurs hors limite ou jeux inconnu` });
        }
        const code = Math.floor(100000 + Math.random() * 899999).toString();
        parties[code] = new jeux(socket.id, code, nbrJoueur);
        sockets[socket.id]["partie"] = code;

        socket.join(code);
        socket.emit("resCreate", { success: true, message: "ça a marché oui" });
        socket.emit("goTo", parties[code].url);
        setTimeout(() => resPlayers(code), 100);
    });

    // REJOINDRE

    socket.on("reqGames", jeux => {
        const sendParties = Object.keys(parties).filter(lien => parties[lien].nomJeux === jeux).map(lien => { return { code: lien, nbrJoueurs: parties[lien].playersIDs.length }; });
        socket.emit("resGames", sendParties);
    });

    socket.on("reqJoin", code => {
        if (!parties[code]) {
            return socket.emit("resJoin", { success: false, message: "lien inexistant" });
        }
        if (parties[code].started) {
            return socket.emit("resJoin", { success: false, message: "" });
        }
        parties[code].addPlayer(socket.id);
        sockets[socket.id]["partie"] = code;

        socket.join(code);
        socket.emit("resJoin", { success: false, message: "ça a marché oui" });
        socket.emit("goTo", parties[code].url);
        setTimeout(() => resPlayers(code), 100);
    });

    // CHAT

    socket.on("reqMsg", msg => {
        io.in(sockets[socket.id].partie).emit("resMsg", msg);
    })

    // JEUX

    function resPlayers(code) {
        if (!parties[code]) return;
        const jeux = parties[code];
        const socketsIDs = parties[code].playersIDs;
        const final = socketsIDs.filter(socketID => sockets[socketID]).map(socketID => { return { "nom": sockets[socketID].compte, "paquet": jeux.paquets[socketID], "choisie": jeux.choosed[socket.id] }; })
        io.in(code).emit("resPlayers", final);
    }

    socket.on("reqStart", () => {
        if (!sockets[socket.id]) return;
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        jeux.start();
        resPlayers(code);
    });

    socket.on("reqCoup", carte => {
        if (!sockets[socket.id]) return;
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (jeux.coup(socket.id, carte)) resPlayers(code);
    });
});