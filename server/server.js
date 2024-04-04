require("dotenv").config();
const CryptoJS = require("crypto-js");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Utility functions
async function sqlRequest(query, params) {
    return new Promise((resolve, reject) => {
        database.all(query, params, (err, rows) => {
            resolve([err, rows]);
        });
    });
}
function randomString(length, minCharCode, maxCharCode) {
    const range = maxCharCode - minCharCode + 1;
    return [...Array(length)]
        .map((_) => String.fromCharCode(Math.floor(minCharCode + Math.random() * range)))
        .join("");
}

// create database directory
const fs = require("fs");
if (!fs.existsSync("./databases")) {
    fs.mkdirSync("./databases");
}

// Create crypted key
if (!fs.existsSync("./databases/.key")) {
    fs.writeFileSync("./databases/.key", randomString(128, 33, 127));
}

// Create database
const sqlite3 = require("sqlite3").verbose();
const database = new sqlite3.Database("./databases/HAI405I.db", async (err) => {
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
    database.run(`
        CREATE TABLE IF NOT EXISTS partieFinie (
            code TEXT NOT NULL, 
            nomJeux TEXT NOT NULL,
            PRIMARY KEY (code)
        );
    `);
    database.run(`
        CREATE TABLE IF NOT EXISTS aJoue (
            codeR TEXT NOT NULL, 
            nom TEXT NOT NULL,
            place INT NOT NULL,
            points INT,
            PRIMARY KEY (codeR,nom),
            FOREIGN KEY(nom) REFERENCES account(pseudo),
            FOREIGN KEY(codeR) REFERENCES partieFinie(code)
        );
    `);
    console.log("Database started on ./databases/HAI405I.db");
});

const Bataille = require("./games/Bataille");
const SixQuiPrend = require("./games/SixQuiPrend");
const Memory = require("./games/Memory");
const listeJeux = { bataille: Bataille, sixQuiPrend: SixQuiPrend, memory: Memory };

app.get("/", (req, res) => {
    res.send("<h1>voici le serveur</h1>");
});

const port = process.env.HAI405I_PORT || 3001;
httpServer.listen(port, () => {
    console.log(`server running on port http://localhost:${port}/`);
});

const sockets = {}; // clef: socket.id              valeur: {compte, partie}
const parties = {}; // clef: code de la partie      valeur: instance de jeu

io.on("connection", function (socket) {
    socket.emit("resAccount");
    socket.emit("goTo", "/");

    // CONNECTION

    socket.on("reqSignIn", async (json) => {
        const [err, rows] = await sqlRequest(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`);
        if (err) throw err;
        if (!rows) throw new Error("Problem with the database");

        if (rows.length != 0) {
            return socket.emit("resSignIn", {
                success: false,
                message: `${json.pseudo} is already taken !`,
            });
        }
        const cryptedPassword = CryptoJS.AES.encrypt(
            json.password,
            fs.readFileSync("./databases/.key").toString()
        );

        database.run(
            `INSERT INTO account(pseudo, password) VALUES ("${json.pseudo}", "${cryptedPassword}")`
        );
        sockets[socket.id] = { compte: json.pseudo };

        socket.emit("resSignIn", {
            success: true,
            message: `Successfully signIned user "${json.pseudo}" with socket ${socket.id}`,
        });
        socket.emit("goTo", "/selectionJeux");
        socket.emit("resAccount", json.pseudo);
    });

    socket.on("reqLogIn", async (json) => {
        if (Object.values(sockets).some((socketInfo) => socketInfo.compte === json.pseudo)) {
            return socket.emit("resSignIn", {
                success: false,
                message: `${json.pseudo} is already connected !`,
            });
        }
        const [err, rows] = await sqlRequest(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`);
        if (err) throw err;
        if (!rows) throw new Error("Problem with the database");

        if (rows.length == 0) {
            return socket.emit("resLogIn", {
                success: false,
                message: `wrong username or password !`,
            });
        }
        const decryptedPassword = CryptoJS.AES.decrypt(
            rows[0].password,
            fs.readFileSync("./databases/.key").toString()
        ).toString(CryptoJS.enc.Utf8);
        if (json.password != decryptedPassword) {
            return socket.emit("resLogIn", {
                success: false,
                message: `wrong username or password !`,
            });
        }
        sockets[socket.id] = { compte: json.pseudo };

        socket.emit("resLogIn", {
            success: true,
            message: `Successfully connected user "${json.pseudo}" with socket ${socket.id}`,
        });
        socket.emit("goTo", "/selectionJeux");
        socket.emit("resAccount", json.pseudo);
    });

    // AUTO DÉCONNECTION

    socket.on("disconnect", () => {
        if (!sockets[socket.id]) {
            return;
        }
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (code && jeux) {
            jeux.removePlayer(socket.id);
            socket.leave(code);
            if (!jeux.ended) {
                resPlayers(code);
            }
        }
        delete sockets[socket.id];
    });

    // CREER

    socket.on("reqCreate", async (json) => {
        if (!sockets[socket.id]) {
            return;
        }
        const nbrJoueursMax = json.nbrJoueursMax;
        const jeux = listeJeux[json.jeux];
        if (!jeux) {
            return;
        }
        if (nbrJoueursMax < jeux.playersRange[0] || nbrJoueursMax > jeux.playersRange[1] || !jeux) {
            return socket.emit("resCreate", {
                success: false,
                message: `nbrJoueursMax hors limite ou jeux inconnu`,
            });
        }
        let code, err, rows;
        do {
            code = randomString(6, 48, 57);
            [err, rows] = await sqlRequest(`SELECT * FROM partie where code="${code}"`);
        } while (parties[json.code] || err || rows.length > 0);

        parties[code] = new jeux(socket.id, code, nbrJoueursMax, json.options);
        parties[code].endCallback = () => finJeux(code);

        sockets[socket.id].partie = code;
        socket.join(code);
        socket.emit("resCreate", { success: true, message: "ça a marché oui" });
        socket.emit("goTo", parties[code].url);
    });

    // REJOINDRE

    socket.on("reqGames", (jeux) => {
        const sendParties = Object.keys(parties)
            .filter((code) => parties[code] && parties[code].nomJeux === jeux)
            .map((code) => {
                return { code: code, nbrJoueurs: parties[code].playersIDs.length };
            });
        socket.emit("resGames", sendParties);
    });

    socket.on("reqJoin", (code) => {
        if (!sockets[socket.id]) {
            return;
        }
        const jeux = parties[code];
        if (!jeux) {
            return socket.emit("resJoin", {
                success: false,
                message: "code inexistant",
            });
        }
        if (!jeux.addPlayer(socket.id)) {
            return socket.emit("resJoin", {
                success: false,
                message: jeux.started ? "cette partie à commencée" : "cette partie est pleine",
            });
        }
        sockets[socket.id]["partie"] = code;

        socket.join(code);
        socket.emit("resJoin", { success: true, message: "ça a marché oui" });
        socket.emit("goTo", jeux.url);
    });

    socket.on("reqRestart", (code) => {
        // TODO:
    });

    // LEAVE

    socket.on("reqLeave", () => {
        if (!sockets[socket.id]) {
            return;
        }
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (jeux) {
            jeux.removePlayer(socket.id);
            resPlayers(code);
            resPlateau(code);
        }
        socket.leave(code);
    });

    // MY GAMES

    socket.on("reqMyGames", async (jeux) => {
        // TODO:
        if (!sockets[socket.id]) {
            return;
        }
        const [err, rows] = await sqlRequest(
            `SELECT * FROM partie WHERE createur="${
                sockets[socket.id].compte
            }" AND nomJeux="${jeux}"`
        );
        socket.emit(
            "resMyGames",
            rows.map((partie) => {
                return {
                    code: partie.code,
                    createur: partie.createur,
                    jeux: JSON.parse(partie.jeux.replaceAll("'", '"')),
                };
            })
        );
    });

    // CHAT

    socket.on("reqMsg", (msg) => {
        if (!sockets[socket.id] || !sockets[socket.id].partie) {
            return;
        }
        io.in(sockets[socket.id].partie).emit("resMsg", msg);
    });

    // JEUX

    socket.on("reqGamesInfos", (jeux) => {
        if (jeux === "sixQuiPrend") {
            socket.emit("resGamesInfos", {
                roundDelays: SixQuiPrend.roundDelays,
                choiceDelays: SixQuiPrend.choiceDelays,
            });
        } else if (jeux === "memory") {
            socket.emit("resGamesInfos", {
                roundDelays: Memory.roundDelays,
            });
        }
    });

    function resPlayers(code) {
        if (!parties[code]) return;
        const jeux = parties[code];
        const socketsIDs = parties[code].playersIDs;
        const final = {};
        for (const playerID of socketsIDs.filter((socketID) => sockets[socketID])) {
            final[sockets[playerID].compte] = jeux.playerData(playerID);
        }
        io.in(code).emit("resPlayers", final);
    }
    socket.on("reqPlayers", () => {
        if (!sockets[socket.id]) {
            return;
        }
        resPlayers(sockets[socket.id].partie);
    });

    function resPlateau(code) {
        if (!parties[code]) return;
        const jeux = parties[code];
        const final = jeux.plateau;
        io.in(code).emit("resPlateau", final);
    }
    socket.on("reqPlateau", () => {
        if (!sockets[socket.id]) {
            return;
        }
        resPlateau(sockets[socket.id].partie);
    });

    socket.on("reqStart", () => {
        if (!sockets[socket.id]) {
            return;
        }
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (!jeux.start()) {
            return;
        }
        resPlayers(code);
        resPlateau(code);
        switch (jeux.nomJeux) {
            case "sixQuiPrend":
                // définit la fonction exécutée quand le round prends trop de temps
                jeux.setRoundCallback(() => {
                    for (const playerID of jeux.playersIDs) {
                        if (!jeux.choosed[playerID]) {
                            const i = Math.floor(Math.random() * jeux.paquets[playerID].length);
                            jeux.coup(playerID, jeux.paquets[playerID][i]);
                        }
                    }
                    jeux.nextRound();
                    resPlayers(code);
                    resPlateau(code);
                });

                // définit la fonction exécutée quand le choix de carte prends trop de temps
                jeux.setChoiceCallback(() => {
                    jeux.prends(jeux.choosingPlayer, Math.floor(Math.random() * 5));
                    resPlayers(code);
                    resPlateau(code);
                });

                // définit la fonction exécutée quand on play un timeout
                jeux.setPlayCallback((timeLeft) => {
                    io.in(code).emit("resTimeLeft", timeLeft / 1000);
                });

                jeux.playRoundTimeout();
                break;
            case "memory":
                // définit la fonction exécutée quand le round prends trop de temps
                jeux.setRoundCallback(async () => {
                    while (!jeux.everyonePlayed()) {
                        const i = Math.floor(Math.random() * jeux.plateau.length);
                        jeux.coup(jeux.choosingPlayer, jeux.plateau[i], i);
                    }
                    resPlayers(code);
                    resPlateau(code);
                    await new Promise((r) => setTimeout(r, 1000));
                    jeux.nextRound();
                    resPlayers(code);
                    resPlateau(code);
                });

                // définit la fonction exécutée quand on play un timeout
                jeux.setPlayCallback((timeLeft) => {
                    io.in(code).emit("resTimeLeft", timeLeft / 1000);
                });

                jeux.playRoundTimeout();
                break;
            default:
                break;
        }
    });

    socket.on("reqCoup", async (json) => {
        if (!sockets[socket.id]) {
            return;
        }
        const carte = json.carte;
        const index = json.index;
        const code = sockets[socket.id].partie;
        const jeux = parties[code];
        if (!jeux || !jeux.coup(socket.id, carte, index)) {
            return;
        }
        resPlayers(code);
        resPlateau(code);
        if (jeux.everyonePlayed()) {
            if (jeux.nextRound()) {
                await new Promise((r) => setTimeout(r, 1000));
                resPlayers(code);
                resPlateau(code);
            }
        }
    });

    socket.on("reqSave", () => {
        // TODO:
        if (!sockets[socket.id] || !sockets[socket.id].partie) {
            return;
        }
        const code = sockets[socket.id].partie;
        const createur = sockets[socket.id].compte;
        const jeux = parties[code];
        if (!jeux) {
            return;
        }

        database.run(
            `INSERT INTO partie(code, createur, nomJeux, jeux) VALUES ("${code}", "${createur}", "${
                jeux.nomJeux
            }", "${JSON.stringify(jeux).replaceAll('"', "'")}")`
        );

        io.in(code).emit("goTo", "/creerRejoindre/" + jeux.nomJeux);
        for (const playerID of jeux.playersIDs) {
            io.sockets.sockets.get(playerID).leave(code);
            jeux.removePlayer(playerID);
        }
    });

    // Six qui prend

    socket.on("reqSixPrends", (index) => {
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

    // Fin

    async function finJeux(code) {
        const jeux = parties[code];
        if (jeux === undefined) {
            return;
        }

        if (!jeux.ended) {
            io.in(code).emit("goTo", "/profil");
            io.socketsLeave(code);
            delete parties[code];
            return;
        }

        jeux.nextRound();
        resPlayers(code);
        resPlateau(code);

        database.run(
            `INSERT INTO partieFinie(code, nomJeux) VALUES ("${code}", "${jeux.nomJeux}")`
        );

        let json;
        switch (jeux.nomJeux) {
            case "bataille":
                jeux.playersIDs.forEach((id) => {
                    if (id == jeux.winner) {
                        database.run(
                            `INSERT INTO aJoue(codeR, nom, place) VALUES ("${code}", "${sockets[id].compte}", "1")`
                        );
                    } else {
                        database.run(
                            `INSERT INTO aJoue(codeR, nom, place) VALUES ("${code}", "${sockets[id].compte}", "2")`
                        );
                    }
                });
                io.in(code).emit("Gagnant", sockets[jeux.winner].compte);
                io.socketsLeave(code);
                delete parties[code];
                break;
            case "sixQuiPrend":
                jeux.playersIDs.forEach((id) => {
                    if (id == jeux.winner) {
                        database.run(
                            `INSERT INTO aJoue(codeR, nom, place, points) VALUES ("${code}", "${sockets[id].compte}", "1",${jeux.scores[id]})`
                        );
                    } else {
                        database.run(
                            `INSERT INTO aJoue(codeR, nom, place, points) VALUES ("${code}", "${sockets[id].compte}", "2",${jeux.scores[id]})`
                        );
                    }
                });

                io.in(code).emit("goTo", "/Score");
                json = {
                    gagnant: sockets[jeux.winner].compte,
                    joueurs: jeux.playersIDs.map((id) => sockets[id].compte),
                    scores: Object.keys(jeux.scores).reduce((newScores, id) => {
                        newScores[sockets[id].compte] = jeux.scores[id];
                        return newScores;
                    }, {}),
                };
                delete parties[code];
                setTimeout(() => {
                    io.in(code).emit("winSix", json);
                    io.in(code)
                        .fetchSockets()
                        .then((sockets) => sockets.map((socket) => socket.id));
                    io.socketsLeave(code);
                }, 100);
                break;
            case "memory":
                jeux.playersIDs.forEach((id) => {
                    if (id == jeux.winner) {
                        database.run(
                            `INSERT INTO aJoue(codeR, nom, place, points) VALUES ("${code}", "${sockets[id].compte}", "1",${jeux.scores[id]})`
                        );
                    } else {
                        database.run(
                            `INSERT INTO aJoue(codeR, nom, place, points) VALUES ("${code}", "${sockets[id].compte}", "2",${jeux.scores[id]})`
                        );
                    }
                });
                io.in(code).emit("goTo", "/Score");
                json = {
                    gagnant: sockets[jeux.winner].compte,
                    joueurs: jeux.playersIDs.map((id) => sockets[id].compte),
                    scores: Object.keys(jeux.scores).reduce((newScores, id) => {
                        newScores[sockets[id].compte] = jeux.scores[id];
                        return newScores;
                    }, {}),
                };
                delete parties[code];
                setTimeout(() => {
                    io.in(code).emit("winMemory", json);
                    io.in(code)
                        .fetchSockets()
                        .then((sockets) => sockets.map((socket) => socket.id));
                    io.socketsLeave(code);
                }, 100);
                break;
            default:
                throw new Error("Nomjeux non adapté à la fin de partie");
        }
    }

    // Profil

    socket.on("reqProfilStat", async () => {
        if (!sockets[socket.id]) {
            return;
        }
        const [err, rows] = await sqlRequest(`SELECT nomJeux, place, points FROM aJoue, partieFinie 
        WHERE codeR=code
        AND nom="${sockets[socket.id].compte}"`);
        socket.emit("resProfilStat", rows || []);
    });

    // leaderboard

    socket.on("reqLeaderboard", async () => {
        if (!sockets[socket.id]) {
            return;
        }
        const [err, general] = await sqlRequest(
            `SELECT nom, COUNT(*) as nbWin FROM aJoue, partieFinie 
            WHERE codeR=code
            AND place=1
            GROUP BY nom
            ORDER BY nbWin DESC`
        );
        const [errBataille, bataille] = await sqlRequest(
            `SELECT nom, COUNT(*) as nbWin FROM aJoue, partieFinie 
            WHERE codeR=code
            AND place=1
            AND nomJeux="bataille"
            GROUP BY nom
            ORDER BY nbWin DESC`
        );
        const [errSix, six] = await sqlRequest(
            `SELECT nom, COUNT(*) as nbWin FROM aJoue, partieFinie 
            WHERE codeR=code
            AND place=1
            AND nomJeux="sixQuiPrend"
            GROUP BY nom
            ORDER BY nbWin DESC`
        );
        const [errMemory, memory] = await sqlRequest(
            `SELECT nom, COUNT(*) as nbWin FROM aJoue, partieFinie 
            WHERE codeR=code
            AND place=1
            AND nomJeux="memory"
            GROUP BY nom
            ORDER BY nbWin DESC`
        );
        socket.emit("resLeaderboard", [general, bataille, six, memory]);
    });
});
