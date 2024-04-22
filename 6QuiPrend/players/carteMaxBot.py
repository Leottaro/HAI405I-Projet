from random import randint
from players.bot import Bot
from game.card import Card

class CarteMaxBot(Bot):
    def getLineToRemove(self, game):
        return randint(1, 4)

    def getCardToPlay(self, game): 
        return self.hand[-1].value