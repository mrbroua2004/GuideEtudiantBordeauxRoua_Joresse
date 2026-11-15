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


function sendMessage(intents) {
    const input = document.getElementById("user-input");
    // a. Récupérer la saisie de l'utilisateur
    const messageUser = input.value.trim();
    if (messageUser === "") {
        return;
    }
    
    showMessage(messageUser, "user");
    
    const response = processMessage(intents, messageUser);
    
    setTimeout(function () {
        showMessage(response, "bot");
    }, 400);
    
    input.value = "";
}


function showMessage(message, type) {
    const chatBox = document.getElementById("chat-box");
    const bubble = document.createElement("p");
    bubble.classList.add("message", type);
    
    bubble.textContent = message;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
    historyMessages.addMessage({ message: message, sender: type });
}


function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


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


window.addEventListener("beforeunload", saveMessages);
window.addEventListener("load", loadMessages);


document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        fetchJSON("json/intents.json");
    }
});


document.querySelectorAll("#chat-suggestions button").forEach(function (button) {
    button.addEventListener("click", function () {
        document.getElementById("user-input").value = button.dataset.question;
        fetchJSON("json/intents.json");
    });
});
