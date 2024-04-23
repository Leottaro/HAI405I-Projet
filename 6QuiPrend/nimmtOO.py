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
    MinMaxBot,
    RandomBot,
    SampleBot,
    SemiRandomBot
]

def interactiveRun():
    print("Bienvenue sur le jeu 6 qui prend !")
    while True:
        try:
            players=[]

            num_players = int(input("Combien de joueurs ? "))
            for i in range(num_players):
                name=input("Nom du joueur : ")
                players.append(HumanPlayer(name))
            
            for botClass in BotsClasses:
                num_bot = int(input(f"Combien de {botClass.__name__} ? "))
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
    bots = [botClass(botClass.__name__) for botClass in BotsClasses]
    scoresTotaux = {bot.name: [] for bot in bots}
    # 1v1
    for bot1 in bots:
        for bot2 in bots:
            if bot1 == bot2:
                continue
            print(f"\n{bot1.name} vs {bot2.name}")
            for i in range(1):
                print(f"Partie {i+1}: ", end="")
                game = NimmtGame([bot1, bot2])
                scores, winners = game.play()
                scoresTotaux[bot1.name].append(scores[bot1.name])
                scoresTotaux[bot2.name].append(scores[bot2.name])
                print("Gagnant(s):", ", ".join([player.name for player in winners]), "\n")
    print("\nScores totaux:", scoresTotaux)

if __name__ == "__main__":
    while True:
        try:
            choix = int(input("\nque veux-tu faire ?\n  1: partie interactive\n  2: stats de bots\n"))
            if choix == 1:
                interactiveRun()
            elif choix == 2:
                statsBots()
            else: 
                Exception("Veuillez entrer 1 ou 2.")
            break
        except ValueError:
            print("Veuillez entrer un nombre entier.")
        except Exception as e:
            print(e)