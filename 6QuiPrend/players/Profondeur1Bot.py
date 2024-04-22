from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame

class Profondeur1Bot(Bot):
    def getLineToRemove(self, game):
        min=NimmtGame.total_cows(game.table[0])
        index=0
        for i in range(1,4):
            cow=NimmtGame.total_cows(game.table[i])
            if cow<min:
                min=cow
                index=i
        return index

    def getCardToPlay(self,game): 
        cardChoose=self.hand[0]
        score=[]
        for card in self.hand:
            diff=[]
            for i in range(4):
                if game.table[i][-1].value<card.value and len(game.table[i]) != 5:
                    diff.append(card.value-game.table[i][-1].value)
                else:
                    diff.append(105)
            score.append(min(diff))
        print(score)
        val=min(score)
        cardChoose=self.hand[score.index(val)]
        
        return cardChoose.value