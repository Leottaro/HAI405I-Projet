from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame

class SemiRandomBot(Bot):
    def getLineToRemove(self, game):
        min=NimmtGame.total_cows(game.table[0])
        index=0
        for i in range(1,4):
            cow=NimmtGame.total_cows(game.table[i])
            if cow<min:
                min=cow
                index=i
        return index

    def getCardToPlay(self): 
        return self.hand[randint(0, len(self.hand)-1)].value