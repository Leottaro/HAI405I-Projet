import os
from itertools import combinations
from players.basicBot import BasicBot
from players.carteMaxBot import CarteMaxBot
from players.carteMinBot import CarteMinBot
from players.distanceMinBot import DistanceMinBot
from players.minMaxBot import MinMaxBot
from players.randomBot import RandomBot
from players.sampleBot import SampleBot
from players.semiRandomBot import SemiRandomBot
from players.humanPlayer import HumanPlayer
from game.nimmtGame import NimmtGame

BotsClasses = [
    BasicBot,
    CarteMaxBot,
    CarteMinBot,
    DistanceMinBot,
    # MinMaxBot,
    RandomBot,
    # SampleBot,
    SemiRandomBot
]

def interactiveRun():
    print("Bienvenue sur le jeu 6 qui prend !")
    while True:
        try:
            players=[]

            num_players = int(input("Combien de joueurs ? ") or "0")
            for i in range(num_players):
                name=input("Nom du joueur : ")
                players.append(HumanPlayer(name))
            
            for botClass in BotsClasses:
                num_bot = int(input(f"Combien de {botClass.__name__} ? ") or "0")
                for i in range(num_bot):
                    players.append(botClass(f"{botClass.__name__}{i+1}", displayInfo=True))

            game=NimmtGame(players)
            scores, winners=game.play()

            print("La partie est terminée!")
            print("Scores finaux :")
            for playername, score in scores.items(): 
                print(f"Joueur {playername} : {score} points")
            s=" ".join([player.name for player in winners])
            print("Vainqueurs(s) : ",s," !")
            break
        except ValueError:
            print("Veuillez entrer un nombre entier.")

def statsBots():
    NbPlayersGames = [[], []]
    for i in range(2, len(BotsClasses)+1):
        NbPlayersGames.append(list(combinations([_ for _ in range(len(BotsClasses))], i)))
    
    bots = [botClass(botClass.__name__) for botClass in BotsClasses]
    
    scoresTotaux = {bot.name: [0 for _ in NbPlayersGames] for bot in bots}
    winTotals = {bot.name: [0 for _ in NbPlayersGames] for bot in bots}
    partiesTotals = {bot.name: [0 for _ in NbPlayersGames] for bot in bots}

    for NbrPlayers in range(len(NbPlayersGames)):
        for game in NbPlayersGames[NbrPlayers]:
            players = [BotsClasses[i](BotsClasses[i].__name__) for i in game]
            for i in range(1000):
                partie = NimmtGame(players)
                scores, winners = partie.play()
                for bot in players:
                    scoresTotaux[bot.name][NbrPlayers] += scores[bot.name]
                    partiesTotals[bot.name][NbrPlayers] += 1
                for winner in winners:
                    winTotals[winner.name][NbrPlayers] += 1
                
                os.system('cls' if os.name == 'nt' else 'clear')
                print(f"{NbrPlayers} players games:")
                for bot in bots:
                    print(f"{bot.name}:\t{round(100*winTotals[bot.name][NbrPlayers] / partiesTotals[bot.name][NbrPlayers], 2) if partiesTotals[bot.name][NbrPlayers] != 0 else 0}% winrate")
                print(f"currently players {" vs ".join([player.name for player in players])} (game {i+1})")
    
    os.system('cls' if os.name == 'nt' else 'clear')
    for NbrPlayers in range(2, len(NbPlayersGames)):
        print(f"\n{NbrPlayers} players games:")
        for bot in bots:
            print(f"{bot.name}:\t{round(100*winTotals[bot.name][NbrPlayers] / partiesTotals[bot.name][NbrPlayers], 2) if partiesTotals[bot.name][NbrPlayers] != 0 else 0}% winrate")
    


if __name__ == "__main__":
    while True:
        try:
            choix = int(input("\nque veux-tu faire ?\n  1: partie interactive\n  2: stats de bots\n"))
            if choix == 1:
                interactiveRun()
            elif choix == 2:
                statsBots()
            else: 
                ValueError("Veuillez entrer un nombre entier entre 1 et 2")
            break
        except ValueError:
            print("Veuillez entrer un nombre entier indiqué au dessus")