class Carte {
    static types = ["Carreau", "Pique", "Coeur", "Trefle"];
    static valeurs = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Vallet", "Dame", "Roi", "As"];

    static json(valeur, type) {
        if (!Carte.types.includes(type) || !Carte.valeurs.includes(valeur)) {
            throw new Error(`carte "${valeur} de ${type}" inconnue`);
        }
        return { valeur, type };
    }

    static creerPaquet() {
        const paquet = [];
        for (const type of Carte.types) {
            for (const valeur of Carte.valeurs) {
                paquet.push(Carte.json(valeur, type));
            }
        }

        for (let i = 0; i < paquet.length; i++) {
            const j = Math.floor(i + Math.random() * (paquet.length - i));
            [paquet[i], paquet[j]] = [paquet[j], paquet[i]];
        }
        return paquet;
    }

    static equals(carte1, carte2) {
        return carte1.valeur === carte2.valeur && carte1.type === carte2.type;
    }

    static sort(carte1, carte2, AsFort) {
        // adFort est un boolean qui placera le roi à la fin ou au début
        const valeur1 =
            Carte.valeurs.indexOf(carte1.valeur) + Carte.types.indexOf(carte1.type) / 10;
        const valeur2 =
            Carte.valeurs.indexOf(carte2.valeur) + Carte.types.indexOf(carte2.type) / 10;
        return AsFort
            ? valeur2 - valeur1
            : ((valeur2 + 1) % Carte.valeurs.length) - ((valeur1 + 1) % Carte.valeurs.length);
    }
}
module.exports = Carte;
