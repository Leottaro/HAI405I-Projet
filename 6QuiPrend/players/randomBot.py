from random import randint
from players.G16Bot import G16Bot
from game.card import Card

"""
Ce Bot choisit une carte au hasard

il choisit aussi la ligne au hasard
"""

class RandomBot(G16Bot):
    def getLineToRemove(self, game):
        return randint(1, 4)

    def getCardToPlay(self, game):
        return self.hand[randint(0, len(self.hand) - 1)].value
