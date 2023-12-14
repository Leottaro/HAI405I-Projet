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

const sockets = {}; // clef: socket.id              valeur: nom du compte
const parties = {}; // clef: code de la partie      valeur: instance de jeu

io.on("connection", function (socket) {
    socket.on("reqSignIn", json => {
        database.all(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`, (err, rows) => {
            if (err) throw err;
            if (!rows) throw new Error("Problem with the database");
            if (rows.length != 0) {
                return socket.emit("resSignIn", { success: false, message: `${json.pseudo} is already taken !` });
            }
            database.run(`INSERT INTO account(pseudo, password) VALUES ("${json.pseudo}", "${json.password}")`);
            sockets[socket.id] = json.pseudo;
            console.log(`signed account ${JSON.stringify(json)}`);
            socket.emit("resSignIn", { success: true, message: `Successfully signIned user "${json.pseudo}" with socket ${socket.id}` });
            socket.emit("goTo", "/selectionJeux");
        });
    });

    socket.on("reqLogIn", json => {
        database.all(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`, (err, rows) => {
            if (err) throw err;
            if (!rows) throw new Error("Problem with the database");
            if (rows.length == 0 || json.password != rows[0].password) {
                return socket.emit("resLogIn", { success: false, message: `wrong username or password !` });
            }
            sockets[socket.id] = json.pseudo;
            console.log(`account connected ${JSON.stringify(json)}`);
            socket.emit("resLogIn", { success: true, message: `Successfully connected user "${json.pseudo}" with socket ${socket.id}` });
            socket.emit("goTo", "/selectionJeux");
        });
    });

    socket.on("reqLogOut", () => {
        if (sockets[socket.id]) {
            console.log(`account ${sockets[socket.id]} disconnected: ${socket.id}`);
            delete sockets[socket.id];
        }
    });

    socket.on("reqCreate", json => {
        const nbrJoueur = json.nbrJoueur;
        const jeux = listeJeux[json.jeux];
        if (nbrJoueur < jeux.playersRange[0] || nbrJoueur > jeux.playersRange[1] || !jeux) {
            return socket.emit("resCreate", { success: false, message: `nbrJoueurs hors limite ou jeux inconnu` });
        }
        const lien = Math.floor(100000 + Math.random() * 899999).toString();
        parties[lien] = new jeux(socket.id, lien, nbrJoueur);
        socket.emit("resCreate", { success: true, message: "ça a marché oui" });
        socket.emit("goTo", parties[lien].lien);
    });

    socket.on("reqJoin", code => {
        if (!parties[code]) {
            return socket.emit("resJoin", { success: false, message: "lien inexistant" });
        }
        parties[code].addPlayer(socket.id);
        socket.emit("resJoin", { success: false, message: "ça a marché oui" });
        socket.emit("goTo", parties[code].lien);
    });

    socket.on("reqGames", jeux => {
        let temp1 = Object.keys(parties);
        console.log(temp1);
        let temp2 = temp1.filter(lien => parties[lien].nomJeux === jeux);
        console.log(temp2);
        let temp3 = temp2.map(lien => { return { code: lien, nbrJoueurs: parties[lien].playersIDs.length }; });
        console.log(temp3);
        socket.emit("resGames", temp3);
    });
});