from game.card import Card
from players.player import Player
from game.nimmtGame import NimmtGame

class Bot(Player):
    def __init__(self, name, displayInfo=False) -> None:
        super().__init__(name)
        self.displayInfo = displayInfo

    def getLineToRemove(self, game):
        min=NimmtGame.total_cows(game.table[0])
        index=0
        for i in range(1,4):
            cow=NimmtGame.total_cows(game.table[i])
            if cow<min:
                min=cow
                index=i
        return index+1

    def info(self, message):
        if self.displayInfo:
            print("@"+self.name+" : ",message)
    
    def player_turn(self, game):
        return Card(self.getCardToPlay(game))