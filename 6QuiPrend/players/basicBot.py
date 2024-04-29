from random import randint
from players.G16Bot import G16Bot
from game.card import Card


class BasicBot(G16Bot):
    def getCardToPlay(self, game):

        min = 1000
        cardMin = self.hand[0]
        for card in self.hand:
            placed = False
            for i in range(len(game.table) - 1, -1, -1):
                if game.table[i][-1] < card:
                    if len(game.table[i]) < 5:
                        min = 0
                        cardMin = card
                    else:
                        cows = game.total_cows(game.table[i])
                        if cows < min:
                            min = cows
                            cardMin = card
                    placed = True
            if not placed:
                for i in range(len(game.table) - 1, -1, -1):
                    cows = game.total_cows(game.table[i])
                    if cows < min:
                        min = cows
                        cardMin = card
        return cardMin.value
