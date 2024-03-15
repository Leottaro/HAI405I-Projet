const Carte = require("./Carte");

class SixQuiPrend {
    static roundDelays = { min: 5, default: 30, max: 60 };
    static choiceDelays = { min: 1, default: 5, max: 10 };
    static playersRange = [2, 10];

    constructor(creatorID, lien, maxPlayers, options) {
        this.nomJeux = "sixQuiPrend";
        this.url = "/plateauSix" + "/" + lien;
        this.started = false;
        this.ended = false;
        this.winner;
        this.maxPlayers = maxPlayers;
        this.playersIDs = [];
        this.paquets = {};
        this.choosed = {};
        this.endCallback;

        this.plateau = [[], [], [], []];
        this.scores = {};
        this.choosingPlayer;
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
            score: this.scores[playerID],
        };
    }

    start() {
        if (this.ended || this.started || this.playersIDs.length < SixQuiPrend.playersRange[0]) {
            return false;
        }
        // créer le paquet de carte et le mélanger
        const Cartes = [...Array(104).keys()].map((n) => {
            return { valeur: n + 1, type: "" };
        });
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
            this.paquets[playerID] = this.paquets[playerID].sort(
                (carteA, carteB) => carteA.valeur - carteB.valeur
            );
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
            (playerID) => this.paquets[playerID].length == 0 || this.choosed[playerID]
        );
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

        if (this.playersIDs.map((id) => this.paquets[id]).some((paquet) => paquet.length == 0)) {
            this.started = false;
            this.plateau = [[], [], [], []];
            this.start();
        }

        if (this.playersIDs.some((id) => this.scores[id] >= 66)) {
            this.ended = true;
            this.winner = this.playersIDs.sort(
                (id1, id2) => this.scores[id1] - this.scores[id2]
            )[0];
            Object.keys(this.paquets).forEach((playerID) => (this.paquets[playerID] = []));
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
module.exports = SixQuiPrend;
