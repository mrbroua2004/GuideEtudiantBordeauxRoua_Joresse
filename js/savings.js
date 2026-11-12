// savings.js : astuce du jour tirée au hasard

const tips = [
    "Le repas au restaurant universitaire est souvent le moins cher de la ville : pense à ta carte étudiante.",
    "Fais une liste avant d'aller au supermarché : tu éviteras les achats imprévus.",
    "Cuisine en grande quantité le dimanche et emporte tes repas en cours.",
    "Demande toujours s'il existe un tarif étudiant : cinémas, musées et salles de sport en proposent souvent.",
    "Compare les forfaits téléphone : certains coûtent moins de 10 € par mois.",
    "Revends les livres et objets dont tu ne te sers plus.",
    "Un vélo d'occasion peut remplacer l'abonnement de transport aux beaux jours.",
    "Vérifie chaque année ton droit à la bourse et aux APL : ta situation peut changer."
];

let lastIndex = -1;

function showRandomTip() {
    let index;
    // On tire un nouveau numéro tant qu'il est identique au précédent
    do {
        index = Math.floor(Math.random() * tips.length);
    } while (index === lastIndex);
    lastIndex = index;

    const box = document.getElementById("tip-box");
    box.textContent = "💡 " + tips[index];
    // On relance l'animation CSS "pop"
    box.classList.remove("pop");
    void box.offsetWidth;
    box.classList.add("pop");
}

document.getElementById("tip-button").addEventListener("click", showRandomTip);
