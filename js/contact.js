// contact.js : validation du formulaire de contact

const form = document.getElementById("contact-form");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Affiche (ou retire) un message d'erreur sous un champ
function setError(input, message) {
    const row = input.closest(".form-row") || input.parentElement;
    let error = row.querySelector(".error-message");
    if (message) {
        input.classList.add("invalid");
        if (!error) {
            error = document.createElement("p");
            error.className = "error-message";
            row.appendChild(error);
        }
        error.textContent = message;
    } else {
        input.classList.remove("invalid");
        if (error) {
            error.remove();
        }
    }
}

function validateForm() {
    let isValid = true;

    const lastname = document.getElementById("lastname");
    const firstname = document.getElementById("firstname");
    const email = document.getElementById("email");
    const status = document.getElementById("status");
    const message = document.getElementById("message");

    [lastname, firstname].forEach(function (input) {
        if (input.value.trim().length < 2) {
            setError(input, "Au moins 2 caractères.");
            isValid = false;
        } else {
            setError(input, "");
        }
    });

    if (!emailPattern.test(email.value.trim())) {
        setError(email, "Adresse mail invalide (exemple : prenom.nom@exemple.fr).");
        isValid = false;
    } else {
        setError(email, "");
    }

    if (status.value === "") {
        setError(status, "Choisissez un statut.");
        isValid = false;
    } else {
        setError(status, "");
    }

    if (message.value.trim().length < 10) {
        setError(message, "Le message doit faire au moins 10 caractères.");
        isValid = false;
    } else {
        setError(message, "");
    }

    const subject = document.querySelector("input[name='subject']:checked");
    const consent = document.getElementById("consent");
    return { isValid: isValid && subject !== null && consent.checked, subject: subject, consent: consent.checked };
}

form.addEventListener("submit", function (event) {
    // On empêche l'envoi réel (pas de serveur) et le rechargement de la page
    event.preventDefault();
    const result = validateForm();
    const box = document.getElementById("contact-message");
    box.hidden = false;

    if (result.isValid) {
        const firstname = document.getElementById("firstname").value.trim();
        box.className = "form-message success";
        box.textContent = "Merci " + firstname + " ! Ton message a bien été pris en compte.";
        form.reset();
    } else {
        box.className = "form-message error";
        let text = "Veuillez corriger les champs en rouge.";
        if (result.subject === null) {
            text += " Choisissez un sujet.";
        }
        if (!result.consent) {
            text += " Cochez la case d'accord.";
        }
        box.textContent = text;
    }
});
