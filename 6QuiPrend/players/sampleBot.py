from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame

class SampleBot(Bot):
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
        deck=list(map(lambda c:Card(c),list(range(1, 105))))
        cartePossibles=[]
        for elem in deck:
                if elem not in self.hand and elem not in game.alreadyPlayedCards:
                    cartePossibles.append(elem)
        somme=[0 for i in range(len(self.hand))]
        moyenne=[0 for i in range(len(self.hand))]
        for i in range(10000):
            ensembleCarte=[]
            for j in range(len(game.players)):
                ensembleCarte.append(cartePossibles[randint(0,len(cartePossibles)-1)])
            ensembleCarte.sort
            plateau=[]
            for k in range(4):
                ligne=[]
                for l in range(len(game.table[k])):
                    ligne.append(game.table[k][l])
                plateau.append(ligne)
            
            for carteSelf in self.hand:
                indexCarte=0
                cpt=0
                for carteOther in ensembleCarte:
                    if carteSelf<carteOther:
                        min=carteSelf
                    else:
                        min=carteOther
                    placed = False
                    coutMin=1000
                    for m in range(3, -1, -1):
                        if plateau[m][-1]<min:
                            if len(plateau[m]) < 5:
                                coutMin=0
                                plateau[m].append(min)
                            else:
                                cows = game.total_cows(plateau[m])
                                if cows<coutMin:
                                    coutMin=cows
                                    plateau[m]=[min]
                            placed = True
                    if not placed:
                        for n in range(3, -1, -1):
                            cows = game.total_cows(plateau[n])
                            if cows < coutMin:
                                coutMin = cows
                                plateau[n]=[min]
                    if min==carteSelf and cpt==0:
                        somme[indexCarte]+=coutMin
                        indexCarte +=1
                        cpt +=1
            for o in range(len(somme)):
                moyenne[o]+=(somme[o]/len(game.players))
            mini=1000
            indice=0
            for p in range(len(moyenne)):
                if moyenne[p]<mini:
                    min=moyenne[p]
                    indice=p
        return self.hand[indice].value
                    
                    
                    
                    
                    
                    
                    
                    
            