// chatbot.js : assistant étudiant (repris de la structure du TP4)

// ---- 1. Classe qui garde l'historique des messages ----
class ChatHistory {
    constructor() {
        this.messages = [];
    }

    addMessage(message) {
        this.messages.push(message);
    }

    getHistory() {
        return this.messages;
    }
}

const historyMessages = new ChatHistory();

// ---- 2. Récupérer les intentions dans le fichier JSON ----
function fetchJSON(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                throw new Error("Empty JSON or malformed JSON");
            }
            sendMessage(data.intents);
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
            showMessage("Oups, je n'arrive pas à lire mes réponses. Ouvre le site avec Live Server.", "bot");
        });
}

// ---- 3. Algorithme d'envoi d'un message ----
function sendMessage(intents) {
    const input = document.getElementById("user-input");
    // a. Récupérer la saisie de l'utilisateur
    const messageUser = input.value.trim();
    if (messageUser === "") {
        return;
    }
    // b. Afficher le message de l'utilisateur
    showMessage(messageUser, "user");
    // c. Obtenir la réponse du bot
    const response = processMessage(intents, messageUser);
    // d. Afficher la réponse avec un petit délai, comme si le bot écrivait
    setTimeout(function () {
        showMessage(response, "bot");
    }, 400);
    // e. Effacer le champ de saisie
    input.value = "";
}

// ---- 4. Afficher un message dans la boîte de chat ----
function showMessage(message, type) {
    const chatBox = document.getElementById("chat-box");
    const bubble = document.createElement("p");
    bubble.classList.add("message", type);
    // textContent (et non innerHTML) : le texte tapé n'est jamais interprété comme du HTML
    bubble.textContent = message;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
    historyMessages.addMessage({ message: message, sender: type });
}

// Enlève les accents et met en minuscules : "Où" et "ou" sont reconnus pareil
function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ---- 5. Trouver la réponse (fonction du TP4, améliorée avec normalize) ----
function processMessage(intents, message) {
    let response = "Je suis désolé, je ne suis pas sûr de comprendre. Essaie avec : logement, tram, manger, bourse ou budget.";
    intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
            if (normalize(message).includes(normalize(pattern))) {
                response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }
        });
    });
    return response;
}

// ---- 6. Sauvegarder et recharger l'historique (sessionStorage) ----
function saveMessages() {
    try {
        sessionStorage.setItem("chatHistory", JSON.stringify(historyMessages.getHistory()));
    } catch (error) {
        console.error(error);
    }
}

function loadMessages() {
    let chatHistory = null;
    try {
        chatHistory = JSON.parse(sessionStorage.getItem("chatHistory"));
    } catch (error) {
        console.error(error);
    }
    if (chatHistory && chatHistory.length > 0) {
        chatHistory.forEach(item => {
            showMessage(item.message, item.sender);
        });
    } else {
        showMessage("Bonjour ! Je suis l'assistant du guide. Pose-moi une question sur la vie étudiante à Bordeaux.", "bot");
    }
}

// ---- 7. Événements ----
window.addEventListener("beforeunload", saveMessages);
window.addEventListener("load", loadMessages);

// Touche Entrée dans le champ de saisie
document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        fetchJSON("json/intents.json");
    }
});

// Boutons de questions rapides
document.querySelectorAll("#chat-suggestions button").forEach(function (button) {
    button.addEventListener("click", function () {
        document.getElementById("user-input").value = button.dataset.question;
        fetchJSON("json/intents.json");
    });
});
