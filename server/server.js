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

// create database directory
const fs = require("fs");
if (!fs.existsSync("./databases")) {
    fs.mkdirSync("./databases");
}

// Create database
const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database("./databases/HAI405I.db", async err => {
    if (err) throw err;
    database.run(`
        CREATE TABLE IF NOT EXISTS account (
            pseudo TEXT NOT NULL, 
            password TEXT NOT NULL,
            PRIMARY KEY (pseudo)
        );
    `);
    database.run(`
        CREATE TABLE IF NOT EXISTS partie (
            code TEXT NOT NULL, 
            createur TEXT NOT NULL,
            nomJeux TEXT NOT NULL,
            jeux TEXT NOT NULL,
            PRIMARY KEY (code),
            FOREIGN KEY(createur) REFERENCES account(pseudo)
        );
    `);
    console.log("Database started on ./databases/HAI405I.db");
});

async function sqlRequest(query, params) {
    return new Promise((resolve, reject) => {
        database.all(query, params, (err, rows) => {
            resolve([err, rows]);
        });
    });
}

const Bataille = require("./games/Bataille");
const SixQuiPrend = require("./games/SixQuiPrend");
const listeJeux = { "bataille": Bataille, "sixQuiPrend": SixQuiPrend };

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

    socket.on("reqSignIn", async json => {
        const [err, rows] = await sqlRequest(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`);
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

    socket.on("reqLogIn", async json => {
        if (Object.values(sockets).some(socketInfo => socketInfo.compte === json.pseudo)) {
            return socket.emit("resSignIn", { success: false, message: `${json.pseudo} is already connected !` });
        }
        const [err, rows] = await sqlRequest(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`);
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

    // AUTO DÉCONNECTION

    socket.on("reqLogOut", () => {
        if (!sockets[socket.id]) {
            return;
        }
        console.log(`account ${sockets[socket.id]["compte"]} disconnected: ${socket.id}`);
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (code && jeux) {
            jeux.removePlayer(socket.id);
            socket.leave(code);
            if (jeux.playersIDs.length == 0) {
                delete parties[code];
            } else {
                resPlayers(code);
            }
        }
        delete sockets[socket.id];
    });

    // CREER

    socket.on("reqCreate", async json => {
        const nbrJoueursMax = json.nbrJoueursMax;
        const jeux = listeJeux[json.jeux];
        if (!jeux) {
            return;
        }
        if (nbrJoueursMax < jeux.playersRange[0] || nbrJoueursMax > jeux.playersRange[1] || !jeux) {
            return socket.emit("resCreate", { success: false, message: `nbrJoueursMax hors limite ou jeux inconnu` });
        }
        let code, err, rows;
        do {
            code = Math.floor(100000 + Math.random() * 899999).toString();
            [err, rows] = await sqlRequest(`SELECT * FROM partie where code="${code}"`);
        } while (parties[json.code] || err || rows.length > 0);

        parties[code] = new jeux(socket.id, code, nbrJoueursMax);
        sockets[socket.id]["partie"] = code;

        socket.join(code);
        socket.emit("resCreate", { success: true, message: "ça a marché oui" });
        socket.emit("goTo", parties[code].url);
        setTimeout(() => resPlayers(code), 100);
    });

    // REJOINDRE

    socket.on("reqGames", jeux => {
        const sendParties = Object.keys(parties).filter(code => parties[code] && parties[code].nomJeux === jeux).map(code => { return { code: code, nbrJoueurs: parties[code].playersIDs.length }; });
        socket.emit("resGames", sendParties);
    });

    socket.on("reqJoin", code => {
        if (!sockets[socket.id]) {
            return;
        }
        const jeux = parties[code];
        if (!jeux) {
            return socket.emit("resJoin", { success: false, message: "code inexistant" });
        }
        if (!jeux.addPlayer(socket.id)) {
            return socket.emit("resJoin", { success: false, message: (jeux.started ? "cette pax@rtie à commencée" : "cette partie est pleine") });
        }
        sockets[socket.id]["partie"] = code;

        socket.join(code);
        socket.emit("resJoin", { success: true, message: "ça a marché oui" });
        socket.emit("goTo", jeux.url);
        setTimeout(() => resPlayers(code), 250);
    });

    // MY GAMES

    socket.on("reqMyGames", async jeux => {
        if (!sockets[socket.id]) {
            return;
        }
        const [err, rows] = await sqlRequest(`SELECT * FROM partie WHERE createur="${sockets[socket.id].compte}" AND nomJeux="${jeux}"`);
        socket.emit("resMyGames", rows.map(partie => { return { code: partie.code, createur: partie.createur, jeux: JSON.parse(partie.jeux.replaceAll("\'", "\"")) }; }));
    });

    // CHAT

    socket.on("reqMsg", msg => {
        if (!sockets[socket.id] || !sockets[socket.id].partie) {
            return;
        }
        io.in(sockets[socket.id].partie).emit("resMsg", msg);
    })

    // JEUX

    function resPlayers(code) {
        if (!parties[code]) return;
        const jeux = parties[code];
        const socketsIDs = parties[code].playersIDs;
        const final = socketsIDs.filter(socketID => sockets[socketID]).map(socketID => { return { "nom": sockets[socketID].compte, "paquet": jeux.paquets[socketID], "choisie": jeux.choosed[socketID] }; })
        io.in(code).emit("resPlayers", final);
    }

    function resPlateau(code) {
        if (!parties[code]) return;
        const jeux = parties[code];
        const final = jeux.plateau;
        io.in(code).emit("resPlateau", final);
    }

    socket.on("reqStart", () => {
        if (!sockets[socket.id]) {
            return;
        }
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (jeux.start()) {
            resPlayers(code);
            resPlateau(code);
        }
    });

    socket.on("reqCoup", carte => {
        if (!sockets[socket.id]) {
            return;
        }
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (!jeux || !jeux.coup(socket.id, carte)) {
            return;
        }
        socket.emit("select", carte);
        resPlayers(code);
        resPlateau(code);
        if (jeux.everyonePlayed()) {
            setTimeout(() => {
                if (jeux.nextRound()) {
                    resPlayers(code);
                    resPlateau(code);
                    if (jeux.ended) {
                        io.in(code).emit("Victoire", sockets[jeux.enLice[0]].compte);
                    }
                }
            }, 1000);
        }
    });

    socket.on("reqSave", () => {
        if (!sockets[socket.id] || !sockets[socket.id].partie) {
            return;
        }
        const code = sockets[socket.id].partie;
        const createur = sockets[socket.id].compte;
        const jeux = parties[code];
        if (!jeux) {
            return;
        }

        database.run(`INSERT INTO partie(code, createur, nomJeux, jeux) VALUES ("${code}", "${createur}", "${jeux.nomJeux}", "${JSON.stringify(jeux).replaceAll("\"", "\'")}")`);

        io.in(code).emit("goTo", "/creerRejoindre/" + jeux.nomJeux);
        for (const playerID of jeux.playersIDs) {
            io.sockets.sockets.get(playerID).leave(code);
            jeux.removePlayer(playerID);
        }
    });

    // Six qui prend

    socket.on("reqSixPrends", index => {
        if (!sockets[socket.id]) {
            return;
        }
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (!jeux || !jeux.prends(socket.id, index)) {
            return;
        }
        resPlayers(code);
        resPlateau(code);
    });
});