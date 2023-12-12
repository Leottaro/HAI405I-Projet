class Carte {
    static types = ["Carreau", "Pique", "Coeur", "Trefle"];
    static valeurs = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Vallet", "Dame", "Roi", "As"]

    constructor(type, valeur) {
        if (!Carte.types.includes(type) || !Carte.valeurs.includes(valeur)) {
            throw new Error(`carte "${valeur} de ${type}" inconnue`);
        }
        this.type = type;
        this.valeur = valeur;
    }

    static creerPaquet() {
        const paquet = [];
        for (const type of Carte.types) {
            for (const valeur of Carte.valeurs) {
                paquet.push(new Carte(type, valeur));
            }
        }

        for (let i = 0; i < paquet.length; i++) {
            const j = Math.floor(i + Math.random() * (paquet.length - i));
            [paquet[i], paquet[j]] = [paquet[j], paquet[i]];
        }
        return paquet;
    }
}