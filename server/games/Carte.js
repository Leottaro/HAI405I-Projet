class Carte {
    static types = ["Carreau", "Pique", "Coeur", "Trefle"];
    static valeurs = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Vallet", "Dame", "Roi", "As"]

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
}
module.exports = Carte;