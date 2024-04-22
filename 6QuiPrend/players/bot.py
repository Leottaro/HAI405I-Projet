from game.card import Card
from players.player import Player

class Bot(Player):
    def info(self, message):
        print("@"+self.name+" : ",message)
    
    def player_turn(self, game):
        return Card(self.getCardToPlay(game))