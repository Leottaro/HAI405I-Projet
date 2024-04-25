from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame

"""ce bot notes chacune de ses cartes et choisis celle qui a la plus petite distance
positive avac la derniere carte de chaque ligne, il met la note max lorsque la ligne
posssede 5 cartes. il choisit la colone qui possede le moins de points lorsqu il doit faire un choix de colone"""
class DistanceMinBot(Bot):
    def getCardToPlay(self,game): 
        cardChoose=self.hand[0]
        score=[]
        for card in self.hand:  
            diff=[]
            for i in range(4):
                if game.table[i][-1].value<card.value :
                    diff.append(card.value-game.table[i][-1].value)
                else:
                    diff.append(105)
            score.append(min(diff))
        for i in range(4):
            if len(game.table[i]) == 5:
                index=0
                for card in self.hand:
                    if card.value>game.table[i][-1].value :
                        for j in range(3):
                            if card.value<game.table[i-j-1][-1].value:
                                score[index]=106
                        index+=1
        val=min(score)
        cardChoose=self.hand[score.index(val)]
        
        return cardChoose.value