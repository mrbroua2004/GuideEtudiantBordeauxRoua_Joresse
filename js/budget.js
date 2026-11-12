// budget.js : simulateur de budget (inspiré de submitQuiz() du TP3)

const MAX_TRIES = 5;
let tryNumber = 0;

const incomeFields = ["aid", "job", "family"];
const expenseFields = {
    rent: "Loyer",
    transport: "Transports",
    food: "Courses",
    phone: "Téléphone",
    leisure: "Loisirs"
};

function formatEuro(amount) {
    return amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function getValue(id) {
    return Number(document.getElementById(id).value);
}

function showFormMessage(text, type) {
    const message = document.getElementById("budget-message");
    message.textContent = text;
    message.className = "form-message " + type;
    message.hidden = false;
}

// Vérifie que tous les champs sont remplis (autonomie du TP3)
function checkFields() {
    const inputs = document.querySelectorAll("#budget-form input[type='number']");
    let allFilled = true;
    inputs.forEach(function (input) {
        if (input.value === "" || Number(input.value) < 0) {
            input.classList.add("invalid");
            allFilled = false;
        } else {
            input.classList.remove("invalid");
        }
    });
    return allFilled;
}

function calculateBudget() {
    if (!checkFields()) {
        showFormMessage("Veuillez remplir tous les champs ! Mets 0 si tu n'as rien dans une case.", "error");
        return;
    }

    // 1. Total des revenus
    let incomes = 0;
    incomeFields.forEach(function (id) {
        incomes += getValue(id);
    });

    // 2. Total des dépenses (on garde aussi le détail pour le graphique)
    let expenses = 0;
    const details = {};
    for (const id in expenseFields) {
        details[id] = getValue(id);
        expenses += details[id];
    }

    // 3. Reste à vivre
    const rest = incomes - expenses;

    displaySummary(incomes, expenses, rest);
    drawChart(details, expenses);
    addResultRow(incomes, expenses, rest);
    showFormMessage("Simulation enregistrée dans l'historique.", "success");
}

function displaySummary(incomes, expenses, rest) {
    const summary = document.getElementById("budget-summary");
    let advice;
    if (rest < 0) {
        advice = "Attention, tu dépenses plus que tu ne gagnes. Regarde la page Économies pour des astuces.";
    } else if (rest < 100) {
        advice = "Ton budget est serré : garde un peu de marge pour les imprévus.";
    } else {
        advice = "Bravo, ton budget est équilibré !";
    }
    summary.innerHTML = "";
    const result = document.createElement("strong");
    result.className = rest < 0 ? "negative" : "positive";
    result.textContent = "Reste à vivre : " + formatEuro(rest);
    summary.appendChild(result);
    summary.appendChild(document.createElement("br"));
    summary.appendChild(document.createTextNode(
        "Revenus : " + formatEuro(incomes) + " - Dépenses : " + formatEuro(expenses) + ". " + advice));
    document.getElementById("result-section").hidden = false;
}

// Graphique en barres fait uniquement en HTML/CSS
function drawChart(details, total) {
    const chart = document.getElementById("bar-chart");
    chart.innerHTML = "";
    for (const id in details) {
        const percent = total > 0 ? Math.round(details[id] / total * 100) : 0;

        const row = document.createElement("div");
        row.className = "bar-row";

        const label = document.createElement("span");
        label.textContent = expenseFields[id];

        const track = document.createElement("div");
        track.className = "bar-track";
        const fill = document.createElement("div");
        fill.className = "bar-fill";
        track.appendChild(fill);

        const value = document.createElement("span");
        value.textContent = percent + " %";

        row.appendChild(label);
        row.appendChild(track);
        row.appendChild(value);
        chart.appendChild(row);

        // Petit délai pour que la transition CSS de la largeur se voie
        setTimeout(function () {
            fill.style.width = percent + "%";
        }, 50);
    }
}

// Ajoute une ligne dans le tableau des résultats (comme le score du TP3)
function addResultRow(incomes, expenses, rest) {
    tryNumber++;
    const tbody = document.querySelector("#result tbody");
    const row = tbody.insertRow();
    row.insertCell().textContent = tryNumber;
    row.insertCell().textContent = formatEuro(incomes);
    row.insertCell().textContent = formatEuro(expenses);
    const restCell = row.insertCell();
    restCell.textContent = formatEuro(rest);
    restCell.className = rest < 0 ? "negative" : "positive";

    if (tryNumber >= MAX_TRIES) {
        document.getElementById("calculate-button").disabled = true;
        showFormMessage("Tu as atteint " + MAX_TRIES + " simulations. Efface l'historique pour recommencer.", "error");
    }
}

function clearHistory() {
    document.querySelector("#result tbody").innerHTML = "";
    tryNumber = 0;
    document.getElementById("calculate-button").disabled = false;
    document.getElementById("budget-message").hidden = true;
}

document.getElementById("clear-history").addEventListener("click", clearHistory);
document.getElementById("budget-form").addEventListener("reset", function () {
    document.getElementById("budget-message").hidden = true;
    document.querySelectorAll("#budget-form .invalid").forEach(function (input) {
        input.classList.remove("invalid");
    });
});
