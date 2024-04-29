import os, csv
from itertools import combinations
from matplotlib import pyplot as plt
from players.basicBot import BasicBot
from players.carteMaxBot import CarteMaxBot
from players.carteMinBot import CarteMinBot
from players.distanceMinBot import DistanceMinBot
from players.G16distanceMinV2Bot import G16DistanceMinV2Bot
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
    G16DistanceMinV2Bot,
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
    if os.path.exists("stats.csv"):
        f = open("stats.csv", "a")
    elif os.path.exists("./6QuiPrend/stats.csv"):
        f = open("./6QuiPrend/stats.csv", "a")
    else:
        f = open("stats.csv", "w")
        f.write("participants;têtes de boeuf;winners\n")
    writer = csv.writer(f, delimiter=";")

    totalGames = 0
    NbPlayersGames = []
    for i in range(2, len(BotsClasses)+1):
        NbPlayersGames.append(list(combinations([_ for _ in range(len(BotsClasses))], i)))
        totalGames += len(NbPlayersGames[-1])
    totalGames *= factor

    iemeGame = 1
    bots = [botClass(botClass.__name__) for botClass in BotsClasses]
    try:
        for i in range(factor):
            for NbrPlayers in range(len(NbPlayersGames)):
                for game in NbPlayersGames[NbrPlayers]:
                    players = [bots[i] for i in game]
                    print(f"game {iemeGame} / {totalGames} ({round(100*iemeGame/totalGames, 2)}%)", end="\r")
                    iemeGame += 1
                    partie = NimmtGame(players)
                    scores, winners = partie.play()
                    writer.writerow([
                        ",".join([bot.name for bot in players]),
                        ",".join([f"{bot}:{scores[bot]}" for bot in scores]), 
                        ",".join([bot.name for bot in winners])
                    ])
    finally:
        f.close()

def readStats():
    if os.path.exists("stats.csv"):
        f = open("stats.csv", "r")
    elif os.path.exists("./6QuiPrend/stats.csv"):
        f = open("./6QuiPrend/stats.csv", "r")
    else:
        print("Pas de fichier de stats")
        exit(2)
    reader = csv.reader(f, delimiter=";")
    next(reader)  # Skip la 1ere ligne

    NbrPlayersGames = []
    bots = []
    partiesTotals = {}
    scoresTotaux = {}
    winTotals = {}

    for row in reader:
        players, scores, winners = [col.split(",") for col in row]
        scores = [score.split(":") for score in scores]
        scores = {score[0]:int(score[1]) for score in scores}

        nbPlayers = len(players)
        for bot in players:
            if bot not in bots:
                bots.append(bot)
                partiesTotals[bot] = {nb:0 for nb in NbrPlayersGames}
                scoresTotaux[bot] = {nb:0 for nb in NbrPlayersGames}
                winTotals[bot] = {nb:0 for nb in NbrPlayersGames}
            if nbPlayers not in NbrPlayersGames:
                NbrPlayersGames.append(nbPlayers)
                for registeredBots in bots:
                    partiesTotals[registeredBots][nbPlayers] = 0
                    scoresTotaux[registeredBots][nbPlayers] = 0
                    winTotals[registeredBots][nbPlayers] = 0
            
            partiesTotals[bot][nbPlayers] += 1
            scoresTotaux[bot][nbPlayers] += scores[bot]
            if bot in winners:
                winTotals[bot][nbPlayers] += 1
    NbrPlayersGames.sort()

    print("bots: ", bots)
    print("NbrPlayersGames: ", NbrPlayersGames)
    print("\npartiesTotals: ", partiesTotals)
    print("scoresTotaux: ", scoresTotaux)
    print("winTotals: ", winTotals)

    # print le winrate de chaque bot
    for NbrPlayers in NbrPlayersGames:
        print(f"\n{NbrPlayers} players games:")
        for bot in bots:
            print(f"{bot}:\t{round(100*winTotals[bot][NbrPlayers] / partiesTotals[bot][NbrPlayers], 2) if partiesTotals[bot][NbrPlayers] != 0 else 0}% winrate")

    # afficher le winrate de chaque bot
    plt.title('Win Percentage by Bot')
    plt.xlabel('Nombre de joueurs')
    plt.xticks(NbrPlayersGames, [str(i) for i in NbrPlayersGames], fontsize=10)
    plt.ylabel('Winrate (%)')
    plt.yticks(range(0, 101, 10), range(0, 101, 10), fontsize=10)

    for bot in bots:
        win_rates = [round(NbrPlayers / 3 *100 * winTotals[bot][NbrPlayers] / partiesTotals[bot][NbrPlayers], 2) for NbrPlayers in NbrPlayersGames]
        plt.plot(NbrPlayersGames, win_rates, label=bot)
    
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
            choix = int(input("\nque veux-tu faire ?\n  1: partie interactive\n  2: écrire stats de bots\n  3: Stats 1vs1\n  4: Lire stats de bots\n  "))
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
                
                if input("afficher les résultats ? (ne rien répondre pour oui)") == "":
                    readStats()
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
            elif choix == 4:
                readStats()
            else: 
                ValueError("Veuillez entrer un nombre entier entre 1 et 2")
            break
        except ValueError:
            print("Veuillez entrer un nombre entier indiqué au dessus")
