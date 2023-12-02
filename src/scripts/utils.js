export function getContrast(hexcolor) {
    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === "#") {
        hexcolor = hexcolor.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (hexcolor.length === 3) {
        hexcolor = hexcolor
            .split("")
            .map(function (hex) {
                return hex + hex;
            })
            .join("");
    }

    // Convert to RGB value
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);

    // Get YIQ ratio
    let yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Check contrast
    return yiq >= 128 ? "black" : "white";
}

export function getRandomChallenge(playerPosition) {
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
}
export function updatePlayerProgress(position1, position2, cells, players) {
    const progress1 = (position1 / cells.length) * 100;
    const progress2 = (position2 / cells.length) * 100;

    const player1Name = players[0].getElement().dataset.name || "Joueur 1";
    const player2Name = players[1].getElement().dataset.name || "Joueur 2";

    const player1Color =
        players[0].getElement().style.backgroundColor || "#ff0000";
    const player2Color =
        players[1].getElement().style.backgroundColor || "#0000ff";

    document.getElementById(
        "player1-progress"
    ).textContent = `${player1Name} - ${Math.floor(progress1)}%`;
    document.getElementById("player1-progress").style.backgroundColor =
        player1Color;
    document.getElementById("player1-progress").style.width = `${progress1}%`;
    document
        .getElementById("player1-progress")
        .setAttribute("aria-valuenow", progress1);
    document.getElementById(
        "player2-progress"
    ).textContent = `${player2Name} - ${Math.floor(progress2)}%`;
    document.getElementById(
        "player2-progress"
    ).style.backgroundColor = `${player2Color}`;
    document.getElementById("player2-progress").style.width = `${progress2}%`;
    document
        .getElementById("player2-progress")
        .setAttribute("aria-valuenow", progress2);
}
