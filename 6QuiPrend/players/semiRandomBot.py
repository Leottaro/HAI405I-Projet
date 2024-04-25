from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame


class SemiRandomBot(Bot):
    def getCardToPlay(self, game):
        return self.hand[randint(0, len(self.hand) - 1)].value
