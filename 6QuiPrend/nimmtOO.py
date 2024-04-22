from players.sampleBot import SampleBot
from players.randomBot import RandomBot
from players.carteMinBot import CarteMinBot
from players.carteMaxBot import CarteMaxBot
from players.Profondeur1Bot import Profondeur1Bot
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

            num_random_bots = int(input("Combien de RandomBots ? "))
            for i in range(num_random_bots):
                players.append(RandomBot(f"randomBot{i+1}"))
                
            num_min_bots = int(input("Combien d'MinBots ? "))
            for i in range(num_min_bots):
                players.append(CarteMinBot(f"MinBot{i+1}"))
                
            num_max_bots = int(input("Combien d'MaxBots ? "))
            for i in range(num_max_bots):
                players.append(CarteMaxBot(f"maxBot{i+1}"))
                
            num_sample_bots = int(input("Combien de SampleBots ? "))
            for i in range(num_sample_bots):
                players.append(SampleBot(f"sampleBot{i+1}"))
                
            num_Profondeur1_bots = int(input("Combien de Profondeur1Bots ? "))
            for i in range(num_Profondeur1_bots):
                players.append(Profondeur1Bot(f"profondeur1Bot{i+1}"))    
                
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