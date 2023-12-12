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

app.get("/", (req, res) => {
    res.send("<h1>voici le serveur</h1>");
});

io.listen(3001, () => {
    console.log("server running on port http://localhost:3001/");
});

const sockets = {};

io.on("connection", function (socket) {
    console.log(`New user connected: ${socket.id}`);

    socket.on("reqRegister", json => {
        database.all(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`, (err, rows) => {
            if (err) throw err;
            if (!rows) throw new Error("Problem with the database");
            if (rows.length != 0) {
                return socket.emit("resRegister", { success: false, message: `${json.pseudo} is already taken !` });
            }
            database.run(`INSERT INTO account(pseudo, password) VALUES ("${json.pseudo}", "${json.password}")`);
            sockets[socket.id] = json;
            console.log(`registered account ${JSON.stringify(json)}`);
            return socket.emit("resRegister", { success: true, message: `Successfully registered user "${json.pseudo}"` });
        });
    });

    socket.on("reqConnect", json => {
        database.all(`SELECT * FROM account WHERE pseudo="${json.pseudo}"`, (err, rows) => {
            if (err) throw err;
            if (!rows) throw new Error("Problem with the database");
            if (rows.length == 0 || json.password != rows[0].password) {
                return socket.emit("resConnect", { success: false, message: `wrong username or password !` });
            }
            sockets[socket.id] = json;
            console.log(`account connected ${JSON.stringify(json)}`);
            return socket.emit("resConnect", { success: true, message: `Successfully registered user "${json.pseudo}"` });
        });
    });
});