// housing.js : checklist du dossier de logement (sauvegardée dans localStorage)

const checkboxes = document.querySelectorAll("#checklist input[type='checkbox']");

function updateProgress() {
    let checkedCount = 0;
    checkboxes.forEach(function (box) {
        if (box.checked) {
            checkedCount++;
        }
    });
    const percent = Math.round(checkedCount / checkboxes.length * 100);
    document.getElementById("progress-bar").style.width = percent + "%";

    const text = document.getElementById("progress-text");
    if (checkedCount === checkboxes.length) {
        text.textContent = "Bravo, ton dossier est complet !";
    } else {
        const word = checkedCount > 1 ? " documents prêts" : " document prêt";
        text.textContent = checkedCount + word + " sur " + checkboxes.length;
    }
}

function saveChecklist() {
    const checkedValues = [];
    checkboxes.forEach(function (box) {
        if (box.checked) {
            checkedValues.push(box.value);
        }
    });
    try {
        localStorage.setItem("housingChecklist", JSON.stringify(checkedValues));
    } catch (error) {
        console.error(error);
    }
}

function loadChecklist() {
    let checkedValues = [];
    try {
        checkedValues = JSON.parse(localStorage.getItem("housingChecklist")) || [];
    } catch (error) {
        console.error(error);
    }
    checkboxes.forEach(function (box) {
        box.checked = checkedValues.includes(box.value);
    });
    updateProgress();
}

checkboxes.forEach(function (box) {
    box.addEventListener("change", function () {
        updateProgress();
        saveChecklist();
    });
});

loadChecklist();
