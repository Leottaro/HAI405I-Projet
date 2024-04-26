from random import randint
from players.G16Bot import G16Bot
from game.card import Card
from game.nimmtGame import NimmtGame


"""ce Bot choisit toujours la carte la plus petite.
il choisit la ligne qui possède le moins de points lorsqu'il
doit faire un choix de ligne"""

class CarteMinBot(G16Bot):
    def getCardToPlay(self, game):
        return self.hand[0].value
