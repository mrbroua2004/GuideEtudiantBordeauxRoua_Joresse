// main.js : fonctionnalités communes à toutes les pages
// Chargé avec "defer" : le HTML est entièrement lu avant l'exécution.

// ---- 1. Mode sombre (mémorisé dans localStorage) ----
function applyTheme(theme) {
    const button = document.getElementById("theme-toggle");
    document.documentElement.setAttribute("data-theme", theme);
    if (button) {
        button.textContent = theme === "dark" ? "☀️" : "🌙";
        button.setAttribute("aria-label", theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre");
    }
}

function initTheme() {
    let savedTheme = "light";
    try {
        savedTheme = localStorage.getItem("theme") || "light";
    } catch (error) {
        console.error("localStorage indisponible :", error);
    }
    applyTheme(savedTheme);

    const button = document.getElementById("theme-toggle");
    if (!button) {
        return;
    }
    button.addEventListener("click", function () {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
            localStorage.setItem("theme", next);
        } catch (error) {
            console.error("Impossible d'enregistrer le thème :", error);
        }
    });
}

// ---- 2. Menu burger sur mobile ----
function initMenu() {
    const button = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");
    if (!button || !nav) {
        return;
    }
    button.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        button.setAttribute("aria-expanded", isOpen);
        button.textContent = isOpen ? "✕" : "☰";
    });
}

// ---- 3. Bouton "retour en haut" ----
function initBackToTop() {
    const button = document.getElementById("back-to-top");
    if (!button) {
        return;
    }
    window.addEventListener("scroll", function () {
        if (window.scrollY > 400) {
            button.classList.add("visible");
        } else {
            button.classList.remove("visible");
        }
    });
    button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ---- 4. Apparition des sections au défilement ----
function initReveal() {
    const elements = document.querySelectorAll(".reveal");
    try {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        elements.forEach(function (element) {
            observer.observe(element);
        });
    } catch (error) {
        // Navigateur trop ancien : on affiche tout directement
        elements.forEach(function (element) {
            element.classList.add("visible");
        });
    }
}

// ---- 5. Année automatique dans le footer ----
function initYear() {
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }
}

initTheme();
initMenu();
initBackToTop();
initReveal();
initYear();
