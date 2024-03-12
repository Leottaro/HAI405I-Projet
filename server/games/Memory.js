const Carte = require("./Carte");

class Memory {
    static roundDelays = { min: 5, default: 30, max: 60 };
    static choiceDelays = { min: 1, default: 5, max: 10 };
    static playersRange = [2, 10];

    constructor(creatorID, lien, maxPlayers, options) {
        this.nomJeux = "memory";
        this.url = "/plateauMemory" + "/" + lien;
        this.started = false;
        this.ended = false;
        this.winner;
        this.maxPlayers = maxPlayers;
        this.playersIDs = [];
        this.endCallback;

        this.plateau = [];
        this.scores = {};
        this.choosingPlayer = "";
        this.choosed = { valeur: "", type: "" };
        this.roundDelay = options ? options.roundDelay * 1000 : undefined;
        this.roundTimeout;
        this.roundCallback;
        this.choiceDelay = options ? options.choiceDelay * 1000 : undefined;
        this.choiceTimeout;
        this.choiceCallback;
        this.playCallback;

        this.addPlayer(creatorID);
    }

    setRoundCallback(callback) {
        this.roundCallback = callback;
    }
    playRoundTimeout() {
        clearTimeout(this.roundTimeout);
        if (this.roundDelay) {
            this.roundTimeout = setTimeout(this.roundCallback, this.roundDelay);
            this.playCallback(this.roundDelay);
        }
    }

    setChoiceCallback(callback) {
        this.choiceCallback = callback;
    }
    playChoiceTimeout() {
        clearTimeout(this.choiceTimeout);
        if (this.choiceDelay) {
            this.choiceTimeout = setTimeout(this.choiceCallback, this.choiceDelay);
            this.playCallback(this.choiceDelay);
        }
    }

    setPlayCallback(callback) {
        this.playCallback = callback;
    }

    hasStarted() {
        return this.started;
    }

    addPlayer(playerID) {
        if (this.started || this.playersIDs.length >= this.maxPlayers) {
            return false;
        }
        this.playersIDs.push(playerID);
        this.scores[playerID] = -1;
        return true;
    }

    removePlayer(playerID) {
        if (!this.scores[playerID]) {
            return false;
        }
        // delete sa carte choisie
        delete this.choosed[playerID];
        // on le vire
        this.playersIDs.splice(this.playersIDs.indexOf(playerID), 1);
        // on supprime son score
        delete this.scores[playerID];
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
            isChoosing: this.choosingPlayer === playerID,
            score: this.scores[playerID],
        };
    }

    start() {
        if (this.ended || this.started || this.playersIDs.length < Memory.playersRange[0]) {
            return false;
        }
        // mettre tout les scores à 0
        for (const playerID of this.playersIDs) {
            this.scores[playerID] = 0;
        }

        // créer le paquet de carte mélangé (on veut 40 cartes)
        this.plateau = Carte.creerPaquet().splice(0, 40);
        return true;
    }

    coup(playerID, carte) {
        if (this.ended || !this.scores[playerID] || playerID !== this.choosingPlayer) {
            return false;
        }
        let i = 0;
        while (!Carte.equals(carte, this.plateau[i])) {
            i++;
            if (i >= this.plateau.length) {
                return false;
            }
        }
        if (!this.choosed) {
            this.choosed = i;
        } else {
            // TODO:
        }
        return true;
    }

    everyonePlayed() {
        return this.playersIDs.some((id) => this.choosed[id]);
    }

    nextRound() {
        // return 0 si il y a un problème, 1 si tout va bien et 2 si un joueur doit choisir une carte
        if (this.ended || !this.everyonePlayed() || this.choosingPlayer) {
            return 0;
        }
        const players = this.playersIDs.sort(
            (id1, id2) => this.choosed[id1].valeur - this.choosed[id2].valeur
        );
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
                this.choosingPlayer = playerID;
                this.playChoiceTimeout();
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

        if (this.playersIDs.map((id) => this.AAA[id]).some((paquet) => paquet.length == 0)) {
            this.started = false;
            this.plateau = [[], [], [], []];
            this.start();
        }

        if (this.playersIDs.some((id) => this.scores[id] >= 66)) {
            this.ended = true;
            this.winner = this.playersIDs.sort(
                (id1, id2) => this.scores[id1] - this.scores[id2]
            )[0];
            Object.keys(this.AAA).forEach((playerID) => (this.AAA[playerID] = []));
            this.choosed = {};
            this.plateau = [[], [], [], []];
            this.endCallback();
        } else {
            this.playRoundTimeout();
        }
        return 1;
    }

    prends(playerID, ligne) {
        if (!this.choosingPlayer || this.choosingPlayer !== playerID || ligne < 0 || ligne > 3) {
            return false;
        }
        for (const carte of this.plateau[ligne]) {
            this.scores[playerID] += this.carteScore(carte);
        }
        this.plateau[ligne] = [];
        delete this.choosingPlayer;
        this.nextRound();
        return true;
    }
}
module.exports = Memory;
