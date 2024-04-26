from random import randint
from players.G16Bot import G16Bot
from game.card import Card
from game.nimmtGame import NimmtGame


"""ce Bot pue la défaite, il arrive même pas a être toujours dernier."""


class QueLaLose(G16Bot):
    def getLineToRemove(self, game):
        max = NimmtGame.total_cows(game.table[0])
        index = 0
        for i in range(1, 4):
            cow = NimmtGame.total_cows(game.table[i])
            if cow > max:
                max = cow
                index = i
        return index + 1

    def getCardToPlay(self, game):
        cardChoose = self.hand[0]
        score = []
        for card in self.hand:
            diff = []
            for i in range(4):
                if game.table[i][-1].value < card.value:
                    if len(game.table[i]) == 5:
                        diff.append(106 + card.value - game.table[i][-1].value)
                    else:
                        diff.append(card.value - game.table[i][-1].value)
                else:
                    diff.append(105)
            score.append(max(diff))
        val = max(score)
        cardChoose = self.hand[score.index(val)]

        return cardChoose.value
