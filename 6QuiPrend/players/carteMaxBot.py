from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame

class CarteMaxBot(Bot):
    def getCardToPlay(self, game): 
        return self.hand[-1].value