from random import randint
from players.G16Bot import G16Bot
from game.card import Card
from game.nimmtGame import NimmtGame


"""ce Bot choisit une carte random dans sa main.
il choisit la ligne qui possède le moins de points lorsqu'il
doit faire un choix de ligne"""

class SemiRandomBot(G16Bot):
    def getCardToPlay(self, game):
        return self.hand[randint(0, len(self.hand) - 1)].value
