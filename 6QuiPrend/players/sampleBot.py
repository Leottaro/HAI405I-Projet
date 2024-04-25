from math import sqrt
from random import randint
from players.bot import Bot
from game.card import Card
from game.nimmtGame import NimmtGame

class SampleBot(Bot):
    def __init__(self, name, displayInfo=False):
        super().__init__(name, displayInfo)
        # essai
        while True:
            try:
                self.nEchantillons = int(input(f"nombre d'échantillons de {name} (500 par défaut) : ") or "500")
                if (self.nEchantillons < 0):
                    raise ValueError
                break
            except ValueError:
                print("Veuillez entrer un nombre entier >0.")

    def getCardToPlay(self,game):
        deck=[Card(c) for c in range(1, 105)]
        cartePossibles=[carte for carte in deck if carte not in self.hand and carte not in game.alreadyPlayedCards]
        scoreCartes=[0 for _ in self.hand]
        for echantillon in range(self.nEchantillons):
            # si on a déjà une carte qui est clairement meilleure que les autres, on arrête
            if (echantillon > 104 and 2*min(scoreCartes) < sum(scoreCartes)/len(scoreCartes)): 
                break

            coupsAdverse=[]
            plateau=[[carte for carte in ligne] for ligne in game.table]

            # remplir les coups adverse
            randomCard = cartePossibles[randint(0, len(cartePossibles)-1)]
            for _ in range(len(game.players) - 1):
                while randomCard in coupsAdverse:
                    randomCard = cartePossibles[randint(0, len(cartePossibles)-1)]
                coupsAdverse.append(randomCard)

            for maCarteI in range(len(self.hand)):
                for carteOther in coupsAdverse:
                    # joue ma carte et celle de l'adversaire dans l'ordre croissant
                    cards = sorted([self.hand[maCarteI], carteOther], key=lambda x: x.value)
                    for card in cards:

                        # parcours les lignes du plateau par ordre croissant de leur dernières cartes (les lignes sont triées par nimmtGame)
                        for i in range(len(plateau) - 1, -1, -1):
                            if plateau[i][-1]<card:
                                if len(plateau[i]) < 5:
                                    plateau[i].append(card)
                                else:
                                    plateau[i] = [card]
                                    plateau.sort(key=lambda x: x[-1])
                                break
                        # le else est exécuté quand on a break (c'est beau python)
                        else: # on suppose que la ligne prise est la ligne la plus petite
                            minBoeuf=NimmtGame.total_cows(plateau[0])
                            line = 0
                            for i in range(4):
                                cow = NimmtGame.total_cows(plateau[i])
                                if cow < minBoeuf:
                                    minBoeuf = cow
                                    line = i
                            plateau[line] = [card]
                            if card == self.hand[maCarteI]:
                                scoreCartes[maCarteI] += minBoeuf
        
        minCarteI = 0
        for carteI in range(1, len(self.hand)):
            if scoreCartes[carteI] < scoreCartes[minCarteI]:
                minCarteI = carteI

        return self.hand[minCarteI].value