from itertools import combinations
from matplotlib import pyplot as plt
from players.basicBot import BasicBot
from players.carteMaxBot import CarteMaxBot
from players.carteMinBot import CarteMinBot
from players.distanceMinBot import DistanceMinBot
from players.distanceMinV2Bot import DistanceMinV2Bot
from players.minMaxBot import MinMaxBot
from players.queLaLose import QueLaLose
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
    DistanceMinV2Bot,
    MinMaxBot,
    QueLaLose,
    RandomBot,
    SampleBot,
    SemiRandomBot,
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

def statsBots(factor):
    totalGames = 0
    iemeGame = 0

    NbPlayersGames = [[], []]
    for i in range(2, len(BotsClasses)+1):
        NbPlayersGames.append(list(combinations([_ for _ in range(len(BotsClasses))], i)))
        totalGames += len(NbPlayersGames[-1])
    totalGames *= factor
    
    bots = [botClass(botClass.__name__) for botClass in BotsClasses]
    scoresTotaux = {bot.name: [0 for _ in NbPlayersGames] for bot in bots}
    winTotals = {bot.name: [0 for _ in NbPlayersGames] for bot in bots}
    partiesTotals = {bot.name: [0 for _ in NbPlayersGames] for bot in bots}

    for NbrPlayers in range(len(NbPlayersGames)):
        for game in NbPlayersGames[NbrPlayers]:
            players = [bots[i] for i in game]
            for i in range(factor):
                iemeGame += 1
                partie = NimmtGame(players)
                scores, winners = partie.play()
                for bot in players:
                    scoresTotaux[bot.name][NbrPlayers] += scores[bot.name]
                    partiesTotals[bot.name][NbrPlayers] += 1
                for winner in winners:
                    winTotals[winner.name][NbrPlayers] += 1
                
                print(f"game {iemeGame} sur {totalGames} ({round(100*iemeGame/totalGames, 2)}%) : {" vs ".join([player.name for player in players])}          ", end="\r")
    print(f"game {iemeGame} / {totalGames} ({round(100*iemeGame/totalGames, 2)}%)\n")

    # print le winrate de chaque bot
    for NbrPlayers in range(2, len(NbPlayersGames)):
        print(f"\n{NbrPlayers} players games:")
        for bot in bots:
            print(f"{bot.name}:\t{round(100*winTotals[bot.name][NbrPlayers] / partiesTotals[bot.name][NbrPlayers], 2) if partiesTotals[bot.name][NbrPlayers] != 0 else 0}% winrate")

    # afficher le winrate de chaque bot
    plt.title('Win Percentage by Bot')
    plt.xlabel('Nombre de joueurs')
    plt.xticks(range(2, len(NbPlayersGames)), [str(i) for i in range(2, len(NbPlayersGames))], fontsize=10)
    plt.ylabel('Winrate (%)')
    plt.yticks(range(0, 101, 10), range(0, 101, 10), fontsize=10)

    for bot in bots:
        win_rates = [round(100 * winTotals[bot.name][NbrPlayers] / partiesTotals[bot.name][NbrPlayers], 2) for NbrPlayers in range(2, len(NbPlayersGames))]
        plt.plot(range(2, len(NbPlayersGames)), win_rates, label=bot.name)
    
    plt.legend()
    plt.grid()
    plt.ylim(0, 105)
    plt.show()

def stats1v1(factor):
    totalGames = 0
    iemeGame = 0
    bot1 = BotsClasses[0](BotsClasses[0].__name__)
    combatsPossibles = []
    winrates = [0 for i in range(1,len(BotsClasses))]

    for i in range(1,len(BotsClasses)):
        combatsPossibles.append(BotsClasses[i](BotsClasses[i].__name__))
        totalGames+=1

    totalGames*=factor

    for adversaire in range(len(combatsPossibles)):
        win=0
        for i in range(factor):
            iemeGame += 1
            partie = NimmtGame([bot1,combatsPossibles[adversaire]])
            scores, winners = partie.play()
            if winners[0].name == bot1.name:
                win+=1
            print(f"game {iemeGame} sur {totalGames} ({round(100*iemeGame/totalGames, 2)}%) :  vs {combatsPossibles[adversaire]} ", end="\r")
        winrates[adversaire] = 100*win/factor

    #affichage

    plt.title('Win Percentage against each bot')
    plt.xlabel('Bot')
    plt.xticks(range(len(BotsClasses[1:])), [bot.__name__ for bot in BotsClasses[1:]], fontsize=10)
    plt.ylabel('Winrate (%)')
    plt.yticks(range(0, 101, 10), range(0, 101, 10), fontsize=10)

    plt.bar(range(len(BotsClasses[1:])), winrates, label=bot1.name, color='blue')

    plt.legend()
    plt.grid(axis='y')
    plt.ylim(0, 105)
    plt.show()


if __name__ == "__main__":
    while True:
        try:
            choix = int(input("\nque veux-tu faire ?\n  1: partie interactive\n  2: stats de bots\n  3: Stats 1vs1\n"))
            if choix == 1:
                interactiveRun()
            elif choix == 2:
                while True:
                    try:
                        factor = int(input("Combien de fois voulez-vous jouer chaque combinaison de bots ? ") or "0")
                        if factor <= 0:
                            raise ValueError
                        statsBots(factor)
                        break
                    except ValueError:
                        print("Veuillez entrer un nombre entier positif.")
            elif choix==3:
                while True:
                    try:
                        factor = int(input("Combien de fois voulez-vous jouer chaque combinaison de bots ? ") or "0")
                        if factor <= 0:
                            raise ValueError
                        stats1v1(factor)
                        break
                    except ValueError:
                        print("Veuillez entrer un nombre entier positif.")
            else: 
                ValueError("Veuillez entrer un nombre entier entre 1 et 2")
            break
        except ValueError:
            print("Veuillez entrer un nombre entier indiqué au dessus")
