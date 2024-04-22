from players.randomBot import RandomBot
from players.humanPlayer import HumanPlayer
from game.nimmtGame import NimmtGame     

def interactiveRun():
    print("Bienvenue sur le jeu 6 qui prend !")
    while True:
        try:
            players=[]

            num_players = int(input("Combien de joueurs ? "))
            for i in range(num_players):
                name=input("Nom du joueur : ")
                players.append(HumanPlayer(name))

            num_bots = int(input("Combien de bots ? "))
            for i in range(num_bots):
                players.append(RandomBot(f"Bot{i+1}"))

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

if __name__ == "__main__":
    interactiveRun()