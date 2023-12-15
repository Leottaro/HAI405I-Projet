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
        this.choosed = {};
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
            delete this.choosed[playerID];
        }
        return true;
    }

    coup(playerID, carte) {
        if (this.choosed[playerID] || !this.paquets[playerID].some(carteJson => Carte.equals(carteJson, carte))) {
            return false;
        }
        let i = 0;
        while (!Carte.equals(carte, this.paquets[playerID][i])) i++;
        this.paquets[playerID].splice(i, 1);
        this.choosed[playerID] = carte;
        return true;
    }

    nextRound() {
        if (!this.playersIDs.every(playerID => this.choosed[playerID])) {
            return false;
        }
        this.choosed = {};
        this.round++;
        return true;
    }
}
module.exports = Bataille;