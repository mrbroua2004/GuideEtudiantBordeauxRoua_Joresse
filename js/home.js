// home.js : page d'accueil (message de bienvenue, carrousel, chiffres animés)

// ---- 1. Message de bienvenue (TP3 : window.onload + createElement) ----
function showWelcome() {
    try {
        if (sessionStorage.getItem("welcomeShown")) {
            return;
        }
        sessionStorage.setItem("welcomeShown", "yes");
    } catch (error) {
        console.error(error);
    }

    const hour = new Date().getHours();
    const greeting = hour < 18 ? "Bonjour" : "Bonsoir";

    const welcome = document.createElement("p");
    welcome.id = "welcome";
    welcome.textContent = greeting + " et bienvenue sur le guide de l'étudiant à Bordeaux !";

    const main = document.querySelector("main");
    main.insertBefore(welcome, main.firstChild);

    // Le message disparaît tout seul après 6 secondes
    setTimeout(function () {
        welcome.remove();
    }, 6000);
}

// ---- 2. Carrousel (setInterval, comme le décompte du TP3) ----
let currentSlide = 0;
let carouselInterval;

function goToSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll("#carousel-dots button");
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    // Le modulo permet de revenir au début après la dernière diapositive
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
}

function startCarousel() {
    carouselInterval = setInterval(function () {
        goToSlide(currentSlide + 1);
    }, 5000);
}

function initCarousel() {
    const carousel = document.getElementById("carousel");
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.getElementById("carousel-dots");
    if (!carousel || slides.length === 0) {
        return;
    }

    // Création d'un point par diapositive
    slides.forEach(function (slide, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Aller à la diapositive " + (index + 1));
        if (index === 0) {
            dot.classList.add("active");
        }
        dot.addEventListener("click", function () {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });

    document.getElementById("carousel-prev").addEventListener("click", function () {
        goToSlide(currentSlide - 1);
    });
    document.getElementById("carousel-next").addEventListener("click", function () {
        goToSlide(currentSlide + 1);
    });

    // Pause quand la souris est sur le carrousel
    carousel.addEventListener("mouseenter", function () {
        clearInterval(carouselInterval);
    });
    carousel.addEventListener("mouseleave", startCarousel);

    startCarousel();
}

// ---- 3. Chiffres qui défilent quand ils deviennent visibles ----
function animateNumber(element) {
    const target = Number(element.dataset.target);
    const steps = 40;
    let step = 0;
    const interval = setInterval(function () {
        step++;
        const value = Math.round(target * step / steps);
        element.textContent = value.toLocaleString("fr-FR");
        if (step === steps) {
            clearInterval(interval);
        }
    }, 30);
}

function initCounters() {
    const numbers = document.querySelectorAll(".stat-number");
    try {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        numbers.forEach(function (number) {
            observer.observe(number);
        });
    } catch (error) {
        numbers.forEach(function (number) {
            number.textContent = Number(number.dataset.target).toLocaleString("fr-FR");
        });
    }
}

window.addEventListener("load", showWelcome);
initCarousel();
initCounters();
