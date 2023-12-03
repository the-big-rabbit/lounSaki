import {
    getRandomChallenge,
    getContrast,
    updatePlayerProgress,
} from "./utils.js";
import Player from "./player.js";
import Dice from "./dice.js";
import scrollManager from "./scroll.js";
import { createBoard } from "./board.js";
import { initModal } from "./modals.js";
import { updatePlayerPosition, movePlayer } from "./gameLogic.js";

document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const players = [
        new Player("player1", "fa-female"),
        new Player("player2", "fa-male"),
    ];
    const cells = createBoard();
    const dice = new Dice();

    players.forEach((player) => {
        board.appendChild(player.getElement());
    });

    const startGameButton = document.getElementById("startGame");
    const startGameModal = initModal("startGameModal");
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

    let currentPlayerIndex = 0;
    let position1 = 0;
    let position2 = 0;

    scrollManager.setPlayersAndIndex(players, currentPlayerIndex);
    diceModal.addEventListener("hidden.bs.modal", function () {
        scrollManager.scrollToCurrentPlayer();
    });

    function playTurn() {
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

        setTimeout(() => {
            const dice1 = dice.roll();
            const dice2 = dice.roll();
            const totalSteps = dice1[0] + dice2[0];

            const {
                position1: newPosition1,
                position2: newPosition2,
                currentPlayerIndex: newCurrentPlayerIndex,
            } = movePlayer(
                currentPlayerIndex,
                totalSteps,
                position1,
                position2,
                players,
                cells
            );

            position1 = newPosition1;
            position2 = newPosition2;
            currentPlayerIndex = newCurrentPlayerIndex;
            console.log(newPosition1);
            getRandomChallenge(newPosition1 + newPosition2)
                .then((playerChallenge) => {
                    const modalResultElement =
                        document.getElementById("dice-modal-result");
                    modalResultElement.innerHTML = `
                    <div id="shwDiceResult"><br>
                        <span style="color:${playerColor}"><i class="fa-solid fa-4x ${
                        dice1[1]
                    }"></i><i class="fa-solid fa-4x ${dice2[1]}"></i></span>
                    <br><br>${playerName}, vous avancez de :
                    <br>
                    <span style="color:${playerColor}">${totalSteps}</span> cases
                    <div>
                        Vous arrivez sur la case : <span style="color:${playerColor}">${
                        newPosition1 + newPosition2
                    }</span>
                        Votre défi est : ${playerChallenge}
                    </div>
                </div>`;
                    updatePlayerProgress(position1, position2, cells, players);
                })
                .catch((error) => {
                    console.error(error);
                });

            setTimeout(() => {
                scrollManager.scrollToNextPlayer();
            }, 500);

            diceAnimation.classList.remove("fa-spin");
        }, 2500);
    }
    updatePlayerPosition(
        currentPlayerIndex,
        position1,
        position2,
        cells,
        players
    );

    document.getElementById("dice").addEventListener("click", playTurn);
});
