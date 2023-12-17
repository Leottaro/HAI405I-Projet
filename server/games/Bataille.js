const Carte = require("./Carte");

class Bataille {
    static playersRange = [2, 10];

    constructor(creatorID, lien, maxPlayers) {
        this.nomJeux = "bataille";
        this.url = "/plateauBataille" + "/" + lien;
        this.started = false;

        this.maxPlayers = maxPlayers;
        this.playersIDs = [creatorID];
        this.enLice = this.playersIDs;
        this.tempCartes = [];

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
        for (let i = 0; i < this.paquets[playerID].length; i++) {
            const receveur = this.playersIDs[i % this.playersIDs.length];
            this.paquets[receveur].push(this.paquets[playerID][i]);
        }
        delete this.paquets[playerID];
        return true;
    }

    start() {
        if (this.started || this.playersIDs.length < 2) {
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
        this.choosed[playerID] = this.paquets[playerID].splice(i, 1)[0];
        return true;
    }

    everyonePlayed() {
        return this.playersIDs.every(playerID => this.paquets[playerID].length == 0 || this.choosed[playerID] || !this.enLice.includes(playerID));
    }

    nextRound() {
        let winner;
        if (!this.everyonePlayed()) {
            return false;
        }
        let sortedChoosed = this.enLice.sort((id1, id2) => Carte.sort(this.choosed[id1], this.choosed[id2], true));
        let nbEgalite = 1;
        for (let i = 1; i < sortedChoosed.length; i++) {
            if (this.choosed[sortedChoosed[i]].valeur == this.choosed[sortedChoosed[0]].valeur) {
                this.tempCartes.push(this.choosed[sortedChoosed[i]]);
                delete this.choosed[sortedChoosed[i]];
                nbEgalite = i + 1;
            }
        }
        if (nbEgalite == 1) {
            winner = sortedChoosed[0];
        }
        else {
            this.tempCartes.push(this.choosed[sortedChoosed[0]]);
            delete this.choosed[sortedChoosed[0]];
            this.enLice = sortedChoosed.slice(0, nbEgalite);
            return this.nextRound();
        }
        console.log("winner : ", winner);
        this.paquets[winner] = this.paquets[winner].concat(Object.values(this.choosed).concat(this.tempCartes));
        this.tempCartes = [];
        this.choosed = {};
        this.round++;
        this.enLice = this.playersIDs;
        return true;
    }
}
module.exports = Bataille;