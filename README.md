# Guide de l'étudiant à Bordeaux

Projet de programmation web TI504N - Efrei Bordeaux (2026-2027).

Site informatif pour les étudiants qui arrivent à Bordeaux : logement, transports, économies et simulateur de budget, avec un chatbot d'aide.

## Membres

- Joresse Brandy Fangouo Tatsing : accueil (carrousel, chiffres animés, chatbot), page Logement, simulateur de budget
- Roua Mihrab: maquette Figma, pages Transports, Économies et À propos (formulaire de contact), mode sombre et menu mobile
- Ensemble : header, footer et feuille de style commune

## Technologies

HTML5, CSS3 et JavaScript, sans framework ni bibliothèque. Toutes les pages sont validées par le validateur du W3C.

## Structure

```
index.html          page d'accueil
pages/              pages de contenu (housing, transport, savings, budget, about)
css/style.css       feuille de style commune
js/                 un script commun (main.js) et un script par page
json/intents.json   intentions du chatbot
img/                logo et images
```

## Lancer le site

Ouvrir le dossier dans VS Code puis clic droit sur `index.html` > « Open with Live Server ».
Le chatbot charge un fichier JSON avec `fetch`, ce qui nécessite un serveur local (Live Server).
