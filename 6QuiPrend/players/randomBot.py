from random import randint
from players.bot import Bot
from game.card import Card

class RandomBot(Bot):
    def getLineToRemove(self, game):
        return randint(1, 4)

    def getCardToPlay(self): 
        return self.hand[randint(0, len(self.hand)-1)].value