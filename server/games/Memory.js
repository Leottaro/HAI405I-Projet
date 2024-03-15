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
        this.choosingPlayer = creatorID;
        this.choosed;
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
        const isCreator = this.playersIDs[0] === playerID;
        const isChoosing = this.choosingPlayer === playerID;
        const choosed = isChoosing ? this.choosed : undefined;
        const score = this.scores[playerID];
        return { isCreator, isChoosing, choosed, score };
    }

    start() {
        if (this.ended || this.started || this.playersIDs.length < Memory.playersRange[0]) {
            return false;
        }
        // mettre tout les scores à 0
        for (const playerID of this.playersIDs) {
            this.scores[playerID] = 0;
        }

        // créer le paquet de carte mélangé
        let Cartes = Carte.creerPaquet().splice(0, 20);
        Cartes = Cartes.concat(Cartes);
        for (let i = 0; i < Cartes.length; i++) {
            const j = Math.floor(i + Math.random() * (Cartes.length - i));
            [Cartes[i], Cartes[j]] = [Cartes[j], Cartes[i]];
        }
        this.plateau = Cartes;
        return true;
    }

    coup(playerID, carte) {
        if (this.ended || this.scores[playerID] === undefined || playerID !== this.choosingPlayer) {
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
            if(this.choosed==i){
                return false;
            }
            else if(this.plateau[i]==this.plateau[this.choosed]){
                this.scores[playerID]++;
                this.plateau[i]=undefined;
                this.plateau[this.choosed]=undefined;
            }
            this.choosed = undefined;
            this.choosingPlayer=this.playersIDs[(this.playersIDs.indexOf(this.choosingPlayer)+1)%this.playersIDs.length];
            console.log(this.choosingPlayer);
        }
        return true;
    }
}
module.exports = Memory;
