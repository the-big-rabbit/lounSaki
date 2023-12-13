export function getContrast(hexcolor) {
    if (hexcolor.slice(0, 1) === "#") {
        hexcolor = hexcolor.slice(1);
    }
    if (hexcolor.length === 3) {
        hexcolor = hexcolor
            .split("")
            .map(function (hex) {
                return hex + hex;
            })
            .join("");
    }
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);
    let yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? "black" : "white";
} // Récupérer la couleur contrastée pour le texte

export function setColor(colorElement, players, currentPlayerIndex) {
    return (colorElement.style.color =
        players[currentPlayerIndex].getElement().style.color);
} // Mettre à jour la couleur du texte

export function setBackGroundColor(
    backgroundElement,
    players,
    currentPlayerIndex
) {
    return (backgroundElement.style.backgroundColor =
        players[currentPlayerIndex].getElement().style.backgroundColor);
} // Mettre à jour la couleur de fond

export async function getRandomChallenge(playerPosition) {
    // Récupérez la liste de défis associée à la position du joueur depuis le fichier JSON
    return fetch("src/defis/defis.json")
        .then((response) => response.json())
        .then((challengesData) => {
            const challengesList =
                challengesData.cases[(playerPosition - 1).toString()];
            if (!challengesList) {
                return "Aucun défi n'est défini pour cette position.";
            }
            // Tire au sort un défi parmi la liste
            const randomChallenge =
                challengesList.challenges[
                    Math.floor(Math.random() * challengesList.challenges.length)
                ];
            return randomChallenge;
        })
        .catch((error) => {
            console.error("Erreur lors du chargement du fichier JSON :", error);
            return "Erreur lors du chargement des défis.";
        });
} // Récupérer un défi aléatoire selon la position du joueur

export function updatePlayerProgress(
    newPosition,
    cells,
    players,
    currentPlayerIndex
) {
    const progress = (newPosition / cells.length) * 100;
    const playerName =
        players[currentPlayerIndex].getElement().dataset.name ||
        `Joueur ${currentPlayerIndex}`;
    const playerColor =
        players[currentPlayerIndex].getElement().style.backgroundColor ||
        "#ff0000";
    document.getElementById(
        `player${currentPlayerIndex + 1}-progress`
    ).textContent = `${playerName} - ${Math.floor(progress)}%`;
    document.getElementById(
        `player${currentPlayerIndex + 1}-progress`
    ).style.backgroundColor = playerColor;
    document.getElementById(
        `player${currentPlayerIndex + 1}-progress`
    ).style.width = `${progress}%`;
    document
        .getElementById(`player${currentPlayerIndex + 1}-progress`)
        .setAttribute("aria-valuenow", progress);
} // Mettre à jour la progression visuelle du joueur

export function updateChallengeResult(newPosition) {
    getRandomChallenge(newPosition)
        .then((playerChallenge) => {
            const contentModalDice =
                document.getElementById("contentModalDice");
            const defiResultElement = document.createElement("div");
            defiResultElement.setAttribute("id", "defiResult");
            contentModalDice.appendChild(defiResultElement);
            document
                .getElementById("defiResult")
                .addEventListener("click", function () {
                    setTimeout(() => {
                        document.getElementById("startDefi").disabled = false;
                    }, 1000);
                });
            defiResultElement.innerHTML = `
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDefi" aria-expanded="false" aria-controls="collapseDefi">
                    Voir le défi
                </button>
                <div class="collapse" id="collapseDefi">
                    <div class="card card-body" id="defiResult">
                        ${playerChallenge}
                    </div>
                </div>`;
        })
        .catch((error) => {
            console.error(error);
        });
} // Afficher le défi

export function dragPlayerZone(draggable) {
    var posX = 0,
        posY = 0,
        mouseX = 0,
        mouseY = 0;
    draggable.addEventListener("mousedown", mouseDown, false);
    window.addEventListener("mouseup", mouseUp, false);
    function mouseDown(e) {
        e.preventDefault();
        posX = e.clientX - draggable.offsetLeft;
        posY = e.clientY - draggable.offsetTop;
        window.addEventListener("mousemove", moveElement, false);
    }
    function mouseUp() {
        window.removeEventListener("mousemove", moveElement, false);
    }
    function moveElement(e) {
        mouseX = e.clientX - posX;
        mouseY = e.clientY - posY;
        draggable.style.left = mouseX + "px";
        draggable.style.top = mouseY + "px";
    }
} // Déplacer la zone de déplacement du lanceur de dé
