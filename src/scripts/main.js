import {
    getRandomChallenge,
    getContrast,
    updatePlayerProgress,
} from "./utils.js";
import Player from "./player.js";
import Dice from "./dice.js";
import scrollManager from "./scroll.js";

document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const players = [
        new Player("player1", "fa-female"),
        new Player("player2", "fa-male"),
    ];

    const dice = new Dice();

    players.forEach((player) => {
        board.appendChild(player.getElement());
    });

    const playerNamesForm = document.getElementById("playerNamesForm");
    const startGameButton = document.getElementById("startGame");
    const startGameModal = new bootstrap.Modal(
        document.getElementById("startGameModal"),
        {
            keyboard: false,
            backdrop: "static",
        }
    );

    new bootstrap.Modal(document.getElementById("diceModal"), {
        keyboard: false,
        backdrop: "static",
    });
    const diceModal = document.getElementById("diceModal");

    startGameModal.show(); // Ouvrir la pop-up au chargement de la page

    startGameButton.addEventListener("click", function () {
        const player1Name =
            document.getElementById("player1Name").value || "Joueur 1";
        const player2Name =
            document.getElementById("player2Name").value || "Joueur 2";
        const player1Color = document.getElementById("player1Color").value;
        const player2Color = document.getElementById("player2Color").value;

        const contrastColor1 = getContrast(player1Color);
        const contrastColor2 = getContrast(player2Color);

        players[0].getElement().dataset.name = player1Name;
        players[0].getElement().style.backgroundColor = player1Color;
        players[0].getElement().style.color = contrastColor1;
        players[1].getElement().dataset.name = player2Name;
        players[1].getElement().style.backgroundColor = player2Color;
        players[1].getElement().style.color = contrastColor2;

        players[0].updatePlayerName();
        players[1].updatePlayerName();

        startGameModal.hide(); // Fermer la pop-up après le début du jeu
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

    function movePlayer(playerIndex, steps) {
        const currentPosition = playerIndex === 0 ? position1 : position2;
        const newPosition = currentPosition + steps;

        if (newPosition >= cells.length) {
            alert(`${players[playerIndex].dataset.name}, vous avez gagné !`);
            resetGame();
        } else {
            if (playerIndex === 0) {
                position1 = newPosition;
            } else {
                position2 = newPosition;
            }
            updatePlayerPosition();
            updatePlayerProgress(position1, position2, cells, players);
            scrollManager.setPlayersAndIndex(players, currentPlayerIndex);
            currentPlayerIndex = 1 - currentPlayerIndex;
        }
    }

    function updatePlayerPosition() {
        const boardRect = board.getBoundingClientRect(); // Obtenir les dimensions du board
        const cellSize = cells[0].getBoundingClientRect().width; // Taille de la cellule + espacement
        const playerSize = players[0]
            .getElement()
            .getBoundingClientRect().width; // Taille du joueur

        // Ajuster la position pour centrer le joueur dans la cellule
        const { top: top1, left: left1 } =
            cells[position1].getBoundingClientRect();
        players[0].getElement().style.transform = `translate(${
            left1 - boardRect.left + (cellSize - playerSize) / 2
        }px, ${top1 - boardRect.top + (cellSize - playerSize) / 2}px)`;

        // Faire de même pour le deuxième joueur
        const { top: top2, left: left2 } =
            cells[position2].getBoundingClientRect();
        players[1].getElement().style.transform = `translate(${
            left2 - boardRect.left + (cellSize - playerSize) / 2
        }px, ${top2 - boardRect.top + (cellSize - playerSize) / 2}px)`;
    }

    scrollManager.setPlayersAndIndex(players, currentPlayerIndex);

    diceModal.addEventListener("hidden.bs.modal", function () {
        scrollManager.scrollToNextPlayer(); // Appeler la fonction de défilement pour centrer la vue sur le joueur actuel
    });

    function playTurn() {
        // Affichage de la fenêtre modale d'animation de dé
        const diceAnimation = document.getElementById("diceAnimation");
        diceAnimation.classList.add("fa-spin");
        const shwDiceResult = document.getElementById("shwDiceResult");
        if (shwDiceResult) {
            shwDiceResult.remove();
        }

        const playerName =
            players[currentPlayerIndex].getElement().dataset.name || "Joueur 1";
        const playerColor =
            players[currentPlayerIndex].getElement().style.backgroundColor ||
            "#ff0000";

        // Délai avant de déplacer le joueur
        setTimeout(() => {
            // Lancer le déplacement du joueur
            const dice1 = dice.roll();
            const dice2 = dice.roll();
            const totalSteps = dice1[0] + dice2[0];

            const newPosition =
                currentPlayerIndex === 0
                    ? position1 + totalSteps
                    : position2 + totalSteps;

            getRandomChallenge(newPosition)
                .then((playerChallenge) => {
                    const modalResultElement =
                        document.getElementById("dice-modal-result");
                    modalResultElement.innerHTML = `<div id="shwDiceResult"><br>
                    <span style="color:${playerColor}"><i class="fa-solid fa-4x ${dice1[1]}"></i>   <i class="fa-solid fa-4x ${dice2[1]}"></i></span>
                    <br><br>${playerName}, vous avancez de :
                    <br>
                    <span style="color:${playerColor}">${totalSteps}</span> cases
                    <div>
                        Vous arrivez sur la case : <span style="color:${playerColor}">${newPosition}</span>
                        Votre défi est : ${playerChallenge}
                    </div>
                </div>`;
                })
                .catch((error) => {
                    console.error(error);
                });

            movePlayer(currentPlayerIndex, totalSteps); // Lancer le déplacement du joueur après le délai
            scrollManager.scrollToNextPlayer();

            setTimeout(() => {
                scrollManager.scrollToCurrentPlayer();
            }, 500); // Vous pouvez ajuster cette durée en fonction de vos besoins

            // Affichage du résultat du dé
            diceAnimation.classList.remove("fa-spin");
        }, 2500); // Durée totale de l'animation en millisecondes
    }

    function resetGame() {
        position1 = 0;
        position2 = 0;
        currentPlayerIndex = 0;
        updatePlayerPosition();
        updatePlayerProgress(position1, position2, cells, players);
        scrollManager.scrollToPlayer(() => {});
        players[currentPlayerIndex].getElement();
        playerNamesForm.style.display = "block"; // Réafficher le formulaire
    }

    document.getElementById("dice").addEventListener("click", playTurn);

    updatePlayerPosition();
    updatePlayerProgress(position1, position2, cells, players);
});
