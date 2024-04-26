from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame

"""ce bot choisit toujours la carte la plus grande.
il choisit la ligne qui possède le moins de points lorsqu'il
doit faire un choix de ligne"""

class CarteMaxBot(Bot):
    def getCardToPlay(self, game):
        return self.hand[-1].value
