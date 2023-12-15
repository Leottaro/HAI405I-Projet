const Carte = require("./Carte");

class Bataille {
    static playersRange = [2, 10];

    constructor(creatorID, lien, maxPlayers) {
        this.nomJeux = "bataille";
        this.url = "/plateauBataille" + "/" + lien;
        this.started = false;

        this.maxPlayers = maxPlayers;
        this.playersIDs = [creatorID];

        this.paquets = {};
        this.paquets[creatorID] = [];

        this.round = 0;
        this.played = {};
    }

    hasStarted() {
        return this.started;
    }

    addPlayer(playerID) {
        if (this.started || this.playersIDs.length >= this.maxPlayers) {
            return false;
        }
        this.playersIDs.push(playerID);
        this.paquets[playerID] = [];
        return true;
    }

    removePlayer(playerID) {
        if (!this.paquets[playerID]) {
            return false;
        }
        this.playersIDs.splice(this.playersIDs.indexOf(playerID), 1);
        delete this.paquets[playerID];
        return true;
    }

    start() {
        if (this.started) {
            return false;
        }
        const paquet = Carte.creerPaquet();
        let i = -1;
        for (const carte of paquet) {
            i = (i + 1) % this.playersIDs.length;
            this.paquets[this.playersIDs[i]].push(carte);
        }
        this.started = true;
        for (const playerID of this.playersIDs) {
            this.played[playerID] = false;
        }
        return true;
    }

    jouer(playerID, carte) {
        if (!this.played[playerID] || !this.paquets[playerID].includes(carte)) {
            return false;
        }
        this.paquets[playerID].splice(this.paquets[playerID].indexOf(carte), 1);
        this.played[playerID] = true;

        if (this.playersIDs.every(playerID => this.played[playerID])) {
            for (const playerID of this.playersIDs) {
                this.played[playerID] = false;
            }
            this.round++;
        }

        return true;
    }
}
module.exports = Bataille;