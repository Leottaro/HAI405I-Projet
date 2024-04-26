from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame


"""ce bot choisit toujours la carte la plus petite.
il choisit la ligne qui possède le moins de points lorsqu'il
doit faire un choix de ligne"""

class CarteMinBot(Bot):
    def getCardToPlay(self, game):
        return self.hand[0].value
