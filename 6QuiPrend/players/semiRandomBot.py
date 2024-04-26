from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame


"""ce bot choisit une carte random dans sa main.
il choisit la ligne qui possède le moins de points lorsqu'il
doit faire un choix de ligne"""

class SemiRandomBot(Bot):
    def getCardToPlay(self, game):
        return self.hand[randint(0, len(self.hand) - 1)].value
