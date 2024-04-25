from random import randint
from players.bot import Bot

"""
ce bot choisis en fonction de la distance avec la derniere carte de la ligne ou elle sera posée.
il préviligiera n'importe quelle note à une carte qui nous fera prendre une ligne (si elle est plus petite que tout),
en particulier si cette carte ne nous permets pas de choisir cette ligne (si elle se place sur une ligne à 5 cartes).
"""
class DistanceMinV2Bot(Bot):
    def getCardToPlay(self, game):
        valeursJouées = [carte.value for carte in game.alreadyPlayedCards]
        valsEntre=[]
        for card in self.hand:

            # Anticipe ou sera posée la carte et lui attribue un score
            score = -1
            index = 4
            for i in range(3, -1, -1):
                if card > game.table[i][-1]:
                    if len(game.table[i]) == 5:
                        score = 104
                    else:
                        score = card.value - game.table[i][-1].value
                    index = i
                    break
            
            # Map les valeurs entre la carte et la dernière carte de la ligne où elle sera posée
            # mets des -1 pour que les valeurs déjà jouées ne soient pas prises en compte dans le score de cette carte
            match score:
                case -1: # n'est pas jouable -> provoque une prise de ligne
                    valsEntre.append([-1] * 105)
                case 104: # se mets sur une ligne pleine
                    valsEntre.append([-1] * 106)
                case _:
                    valsEntre.append([v for v in range(game.table[index][-1].value + 1, card.value)])
        
        # filtrer valsEntre pour ne garder que les valeurs non jouées
        valsEntre = [[n for n in vals if n not in valeursJouées] for vals in valsEntre]
        finalScores = [len(vals) for vals in valsEntre]
        cardChoose = self.hand[finalScores.index(min(finalScores))]
        return cardChoose.value