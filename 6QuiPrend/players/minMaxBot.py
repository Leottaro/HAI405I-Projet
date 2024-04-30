from random import randint
from players.G16Bot import G16Bot
from game.card import Card

"""
Ce Bot regarde l'arbre des possibilités de coups pour lui et son adversaire (sur une certaine profondeur)
puis choisit la carte qui mène au sous arbre dont la pire issue est la meilleure de tous les sous arbres


il choisit ligne qui possède le moins le points lorsqu'il doit faire un choix de ligne
"""

class MinMaxBot(G16Bot):
    def __init__(self, name, displayInfo=False) -> None:
        while True:
            try:
                self.profondeur = int(
                    input(f"Profondeur de recherche de {name} (1 par défaut) : ") or "1"
                )
                if self.profondeur < 1:
                    raise ValueError()
                break
            except ValueError:
                print("Veuillez entrer un nombre entier >0.")
        super().__init__(name+f"_p{self.profondeur}", displayInfo)

    def update_table(self, table, cards, myCard):
        """
        Met à jour le plateau après un tour de jeu.

        :param plays: Les coups joués pendant le tour, un coup est un couple (joueur, carte jouée).
        """
        monScore = 0
        for card in cards:
            placed = False
            for i in range(len(table) - 1, -1, -1):
                if table[i][-1] < card:
                    if len(table[i]) < 5:
                        table[i].append(card)
                    else:
                        cows = sum(card.cowsNb for card in table[i])
                        if card == myCard:
                            monScore += cows
                        table[i] = [card]
                        table.sort(key=lambda x: x[-1])
                    placed = True
                    break
            if not placed:

                min = sum(card.cowsNb for card in table[0])
                index = 0
                for i in range(1, 4):
                    cow = sum(card.cowsNb for card in table[i])
                    if cow < min:
                        min = cow
                        index = i

                if card == myCard:
                    monScore += cow
                table[i] = [card]
                table.sort(key=lambda x: x[-1])
        return monScore

    def parcours(self, baseHand, basePlayedCards, baseTable, iterationsLeft):
        min = 1000
        minCard = baseHand[0]
        for myCard in baseHand:
            max = 0
            for enemyCard in [
                Card(c)
                for c in range(1, 105, 4)
                if (Card(c) not in basePlayedCards) and (Card(c) not in baseHand)
            ]:

                tempTable = [[carte for carte in ligne] for ligne in baseTable]
                monScore = self.update_table(tempTable, [myCard, enemyCard], myCard)
                if len(baseHand) != 1 and iterationsLeft != 1:
                    monScore += self.parcours(
                        [c for c in baseHand if c != myCard],
                        [c for c in basePlayedCards if c != myCard and c != enemyCard],
                        tempTable,
                        iterationsLeft - 1,
                    )[0]
                if monScore > max:
                    max = monScore
                    if max >= min:
                        break
            if max < min:
                min = max
                minCard = myCard
            if min == 0:
                return [min, minCard]
        return [min, minCard]

    def getCardToPlay(self, game):
        retour = self.parcours(
            self.hand, game.alreadyPlayedCards, game.table, self.profondeur
        )
        return retour[1].value