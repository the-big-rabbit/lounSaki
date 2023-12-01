// main.js
import { Game } from "./game.js";

document.addEventListener("DOMContentLoaded", function () {
    const game = new Game();

    const startGameModal = new bootstrap.Modal(
        document.getElementById("startGameModal"),
        {
            keyboard: false,
            backdrop: "static",
        }
    );
    // Ajout
    const startGameButton = document.getElementById("startGame");

    new bootstrap.Modal(document.getElementById("diceModal"), {
        keyboard: false,
        backdrop: "static",
    });
    const diceModal = document.getElementById("diceModal");

    diceModal.addEventListener("hidden.bs.modal", function () {
        // Appeler la fonction de défilement pour centrer la vue sur le joueur actuel
        scrollToCurrentPlayer();
    });
    // Ouvrir la pop-up au chargement de la page
    startGameModal.show();

    startGameButton.addEventListener("click", function () {
        const player1Name =
            document.getElementById("player1Name").value || "Joueur 1";
        const player2Name =
            document.getElementById("player2Name").value || "Joueur 2";
        const player1Color = document.getElementById("player1Color").value;
        const player2Color = document.getElementById("player2Color").value;

        const contrastColor1 = getContrast(player1Color);
        const contrastColor2 = getContrast(player2Color);

        players[0].dataset.name = player1Name;
        players[0].style.backgroundColor = player1Color;
        players[0].style.color = contrastColor1;
        players[1].dataset.name = player2Name;
        players[1].style.backgroundColor = player2Color;
        players[1].style.color = contrastColor2;

        updatePlayerName(players[0]);
        updatePlayerName(players[1]);

        // Fermer la pop-up après le début du jeu
        startGameModal.hide();
    });

    const cells = [];
    for (let i = 0; i <= 99; i++) {
        const cell = document.createElement("div");
        cell.textContent = i;
        board.appendChild(cell);
        cell.classList.add("cell");
        if (i === 0) {
            cell.textContent = "Départ";
        } else if (i === 99) {
            cell.textContent = "Arrivée";
        }

        cells.push(cell);
    }

    let currentPlayerIndex = 0;
    let position1 = 0;
    let position2 = 0;

    document.getElementById("dice").addEventListener("click", playTurn);

    updatePlayerPosition();
    updatePlayerProgress();

    document.getElementById("dice").addEventListener("click", function () {
        game.playTurn();
    });

    // Autres logiques d'initialisation
    // ...
});
