const Carte = require("./Carte");

class Bataille {
    static playersRange = [2, 10];

    constructor(creatorID, lien, maxPlayers) {
        this.nomJeux = "bataille";
        this.url = "/plateauBataille" + "/" + lien;
        this.started = false;
        this.ended = false;
        this.winner;
        this.maxPlayers = maxPlayers;
        this.playersIDs = [];
        this.paquets = {};
        this.choosed = {};
        this.endCallback;

        this.enLice = [];
        this.tempCartes = [];

        this.addPlayer(creatorID);
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
        this.enLice.push(playerID);
        return true;
    }

    removePlayer(playerID) {
        if (!this.paquets[playerID]) {
            return false;
        }
        // réintegre sa carthe choisir dans son paquet
        if (this.choosed[playerID]) {
            this.paquets[playerID].push(this.choosed[playerID]);
            delete this.choosed[playerID];
        }
        // on le vire
        this.playersIDs.splice(this.playersIDs.indexOf(playerID), 1);
        // on répartit son paquet aux autres joueurs
        for (let i = 0; i < this.paquets[playerID].length; i++) {
            const receveur = this.playersIDs[i % this.playersIDs.length];
            this.paquets[receveur].push(this.paquets[playerID][i]);
        }
        // réstituer les tempCartes aux joueurs enLice
        if (this.tempCartes.length > 0) {
            if (this.enLice.includes(playerID)) {
                this.enLice.splice(this.enLice.indexOf(playerID), 1);
            }
            for (let i = 0; i < this.tempCartes.length; i++) {
                const receveur = this.enLice[i % this.enLice.length];
                this.paquets[receveur].push(this.paquets[playerID][i]);
            }
            this.tempCartes = [];
        }
        delete this.paquets[playerID];
        // si la game n'a plus assez de joueurs, on la supprime
        if (
            (this.started && this.playersIDs.length < 2) ||
            (!this.started && this.playersIDs.length == 0)
        ) {
            this.endCallback();
        }
        return true;
    }

    playerData(playerID) {
        if (this.playersIDs[playerID]) {
            return false;
        }
        return {
            isCreator: this.playersIDs[0] === playerID,
            paquet: this.paquets[playerID],
            choosed: this.choosed[playerID],
        };
    }

    start() {
        if (this.ended || this.started || this.playersIDs.length < Bataille.playersRange[0]) {
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
            this.paquets[playerID] = this.paquets[playerID].sort((carteA, carteB) =>
                Carte.sort(carteA, carteB, true)
            );
        }
        return true;
    }

    coup(playerID, carte, index) {
        if (
            this.ended ||
            this.choosed[playerID] ||
            !this.paquets[playerID].some((carteJson) => Carte.equals(carteJson, carte))
        ) {
            return false;
        }
        let i = 0;
        while (!Carte.equals(carte, this.paquets[playerID][i])) i++;
        this.choosed[playerID] = this.paquets[playerID].splice(i, 1)[0];
        return true;
    }

    everyonePlayed() {
        return this.playersIDs.every(
            (playerID) =>
                this.paquets[playerID].length == 0 ||
                this.choosed[playerID] ||
                !this.enLice.includes(playerID)
        );
    }

    nextRound() {
        // return 0 si il y a un problème, 1 si tout va bien
        if (this.ended || !this.everyonePlayed()) {
            return 0;
        }
        let winner;
        let sortedChoosed = this.enLice.sort((id1, id2) =>
            Carte.sort(this.choosed[id1], this.choosed[id2], true)
        );
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
        } else {
            this.tempCartes.push(this.choosed[sortedChoosed[0]]);
            delete this.choosed[sortedChoosed[0]];
            this.enLice = sortedChoosed.slice(0, nbEgalite);
            return this.nextRound();
        }
        this.paquets[winner] = this.paquets[winner]
            .concat(Object.values(this.choosed).concat(this.tempCartes))
            .sort((carteA, carteB) => Carte.sort(carteA, carteB, true));
        this.choosed = {};
        this.tempCartes = [];
        this.enLice = this.playersIDs.filter((playerID) => this.paquets[playerID].length > 0);
        this.ended = this.enLice.length <= 1;
        if (this.ended) {
            this.winner = winner;
            this.endCallback();
        }
        return 1;
    }
}
module.exports = Bataille;
