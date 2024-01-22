class SixQuiPrend {
    static playersRange = [2, 10];

    constructor(creatorID, lien, maxPlayers) {
        this.nomJeux = "sixQuiPrend";
        this.url = "/plateauSix" + "/" + lien;
        this.started = false;
        this.ended = false;

        this.maxPlayers = maxPlayers;
        this.playersIDs = [creatorID];
        this.enLice = [creatorID];
        this.tempCartes = [];

        this.paquets = {};
        this.paquets[creatorID] = [];

        this.round = 0;
        this.choosed = {};
        this.plateau = [[], [], [], []];
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
        // on supprime son paquet
        delete this.paquets[playerID];
        return true;
    }

    start() {
        if (this.ended || this.started || this.playersIDs.length < SixQuiPrend.playersRange[0]) {
            return false;
        }
        // créer le paquet de carte et le mélanger
        const Cartes = [...Array(104).keys()].map(n => { return { valeur: n + 1, type: "" } });
        for (let i = 0; i < Cartes.length; i++) {
            for (let j = i; j < Cartes.length; j++) {
                [Cartes[i], Cartes[j]] = [Cartes[j], Cartes[i]];
            }
        }
        // distribuer 10 cartes
        let n = 0;
        for (const playerID of this.playersIDs) {
            for (let i = 0; i < 10; i++) {
                this.paquets[playerID].push(Cartes[n]);
            }
            n++;
        }
        for (const paquet of this.plateau) {
            paquet.push(Cartes[n]);
            n++;
        }
        // supprimer les cartes choisies au cas où
        this.started = true;
        for (const playerID of this.playersIDs) {
            delete this.choosed[playerID];
        }
        return true;
    }

    coup(playerID, carte) {
        if (this.ended || this.choosed[playerID] || !this.paquets[playerID].some(carteJson => Carte.equals(carteJson, carte))) {
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
        if (this.ended || !this.everyonePlayed()) {
            return false;
        }
        let winner;
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
        this.paquets[winner] = this.paquets[winner].concat(Object.values(this.choosed).concat(this.tempCartes));
        this.tempCartes = [];
        this.choosed = {};
        this.round++;
        this.enLice = this.playersIDs.filter(playerID => this.paquets[playerID].length > 0);
        this.ended = this.enLice.length <= 1;
        return true;
    }
}
module.exports = SixQuiPrend;