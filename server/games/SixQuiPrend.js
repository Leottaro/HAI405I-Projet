const Carte = require("./Carte");

class SixQuiPrend {
    static choiceDelay = 3000;
    static roundDelay = 30000;
    static playersRange = [2, 10];

    constructor(creatorID, lien, maxPlayers) {
        this.nomJeux = "sixQuiPrend";
        this.url = "/plateauSix" + "/" + lien;
        this.started = false;
        this.ended = false;

        this.maxPlayers = maxPlayers;
        this.playersIDs = [];

        this.paquets = {};

        this.choosed = {};
        this.plateau = [[], [], [], []];
        this.scores = {};
        this.leJoueurQuiAMisUneCarteTropPetiteAvantLà;
        this.roundInterval;
        this.roundCallback;
        this.choiceTimeout;
        this.choiceCallback;

        this.addPlayer(creatorID);
    }

    setRoundCallback(callback) {
        this.roundCallback = callback;
    }
    playRoundInterval(delay) {
        clearInterval(this.roundInterval);
        this.roundInterval = setInterval(this.roundCallback, delay);
    }

    setChoiceCallback(callback) {
        this.choiceCallback = callback;
    }
    playChoiceTimeout(delay) {
        clearTimeout(this.choiceTimeout);
        this.choiceTimeout = setTimeout(this.choiceCallback, delay);
    }

    // setChoiceTimeout(callback, delay) {
    //     clearTimeout(this.choiceTimeout);
    //     this.choiceTimeout = setTimeout(callback, delay);
    // }

    hasStarted() {
        return this.started;
    }

    addPlayer(playerID) {
        if (this.started || this.playersIDs.length >= this.maxPlayers) {
            return false;
        }
        this.playersIDs.push(playerID);
        this.paquets[playerID] = [];
        this.scores[playerID] = 0;
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
        delete this.scores[playerID];
        return true;
    }

    playerData(playerID) {
        if (this.playersIDs[playerID]) {
            return false;
        }
        return { isCreator: this.playersIDs[0] === playerID, paquet: this.paquets[playerID], choosed: this.choosed[playerID], score: this.scores[playerID] };
    }

    start() {
        if (this.ended || this.started || this.playersIDs.length < SixQuiPrend.playersRange[0]) {
            return false;
        }
        // créer le paquet de carte et le mélanger
        const Cartes = [...Array(104).keys()].map(n => { return { valeur: n + 1, type: "" } });
        for (let i = 0; i < Cartes.length; i++) {
            const j = Math.floor(i + Math.random() * (Cartes.length - i));
            [Cartes[i], Cartes[j]] = [Cartes[j], Cartes[i]];
        }
        // distribuer 10 cartes
        let n = 0;
        for (const playerID of this.playersIDs) {
            for (let i = 0; i < 10; i++) {
                this.paquets[playerID].push(Cartes[n]);
                n++;
            }
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
        return this.playersIDs.every(playerID => this.paquets[playerID].length == 0 || this.choosed[playerID]);
    }

    carteScore(carte) {
        let score = 1;
        if (carte.valeur % 5 == 0) {
            score += 1;
        }
        if (carte.valeur % 10 == 0) {
            score += 1;
        }
        if (carte.valeur % 11 == 0) {
            score += 4;
        }
        return score;
    }

    nextRound() { // return 0 si il y a un problème, 1 si tout va bien et 2 si un joueur doit choisir une carte
        if (this.ended || !this.everyonePlayed() || this.leJoueurQuiAMisUneCarteTropPetiteAvantLà) {
            return 0;
        }
        const players = this.playersIDs.sort((id1, id2) => this.choosed[id1].valeur - this.choosed[id2].valeur);
        for (const playerID of players) {
            const choosed = this.choosed[playerID];
            let biggest = { ligne: 0, carte: { valeur: -1, type: "" } };
            for (const ligne in this.plateau) {
                if (this.plateau[ligne].length == 0) {
                    biggest = { ligne, carte: { valeur: -1, type: "" } };
                    break;
                }
                const carte = this.plateau[ligne].at(-1);
                if (carte.valeur < choosed.valeur && carte.valeur > biggest.carte.valeur) {
                    biggest = { ligne, carte };
                }
            }
            if (!biggest.ligne) {
                this.leJoueurQuiAMisUneCarteTropPetiteAvantLà = playerID;
                return 2;
            }
            if (this.plateau[biggest.ligne].length == 5) {
                for (const carte of this.plateau[biggest.ligne]) {
                    this.scores[playerID] += this.carteScore(carte);
                }
                this.plateau[biggest.ligne] = [];
            }
            this.plateau[biggest.ligne].push(choosed);
            delete this.choosed[playerID];
        }

        if (this.playersIDs.map(id => this.paquets[id]).some(paquet => paquet.length == 0)) {
            this.started = false;
            this.plateau = [[], [], [], []];
            this.start();
        }

        if (this.playersIDs.map(id => this.scores[id]).some(score => score >= 66)) {
            this.ended = true;
        }
        return 1;
    }

    prends(playerID, ligne) {
        if (!this.leJoueurQuiAMisUneCarteTropPetiteAvantLà || this.leJoueurQuiAMisUneCarteTropPetiteAvantLà !== playerID || ligne < 0 || ligne > 3) {
            return false;
        }
        for (const carte of this.plateau[ligne]) {
            this.scores[playerID] += this.carteScore(carte);
        }
        this.plateau[ligne] = [];
        delete this.leJoueurQuiAMisUneCarteTropPetiteAvantLà;
        this.nextRound();
        return true;
    }
}
module.exports = SixQuiPrend;