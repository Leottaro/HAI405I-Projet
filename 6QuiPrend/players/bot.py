from game.card import Card
from players.player import Player

class Bot(Player):
    def __init__(self, name, displayInfo=False) -> None:
        super().__init__(name)
        self.displayInfo = displayInfo

    def info(self, message):
        if self.displayInfo:
            print("@"+self.name+" : ",message)
    
    def player_turn(self, game):
        return Card(self.getCardToPlay(game))