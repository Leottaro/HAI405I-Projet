from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame

"""ce bot notes chacune de ses cartes et choisis celle qui a la plus petite distance
positive avac la derniere carte de chaque ligne, il met la note max lorsque la ligne
posssede 5 cartes. il choisit la colone qui possede le moins de points lorsqu il doit faire un choix de colone"""
class DistanceMinBot(Bot):
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
                if game.table[i][-1].value<card.value :
                    if len(game.table[i]) == 5:
                        diff.append(-1)
                    else:
                        diff.append(card.value-game.table[i][-1].value)
                else:
                    diff.append(105)
            for i in range(len(diff)):
                if diff[i]==-1:
                    diff[i]=106
            score.append(min(diff))    
        val=min(score)
        cardChoose=self.hand[score.index(val)]
        
        return cardChoose.value