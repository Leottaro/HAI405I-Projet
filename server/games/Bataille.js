const Carte = require("./Carte");

class Bataille {
    static playersRange = [2, 10]; 
    
    constructor(maxPlayers, creator) {
        this.maxPlayers = maxPlayers;
        this.players = [creator];

    }   
}
module.exports = Bataille;