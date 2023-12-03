import {
    getRandomChallenge,
    getContrast,
    updatePlayerProgress,
    updateChallengeResult,
    setBackGroundColor,
    setColor,
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
    initModal("diceModal");
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

        const buttonDice = document.getElementById("dice");
        buttonDice.innerHTML = `${
            players[currentPlayerIndex].getElement().dataset.name
        } lance les dés`;

        setBackGroundColor(buttonDice, players, currentPlayerIndex);
        setColor(buttonDice, players, currentPlayerIndex);

        startGameModal.hide(); // Fermer la pop-up après le début du jeu
    });

    let currentPlayerIndex = 0;
    let position1 = 0;
    let position2 = 0;
    let totalSteps1 = 0;
    let totalSteps2 = 0;

    scrollManager.setPlayersAndIndex(players, currentPlayerIndex);
    diceModal.addEventListener("hidden.bs.modal", function () {
        scrollManager.scrollToCurrentPlayer();
        document.getElementById("startDefi").disabled = true;
        document.getElementById("defiResult").remove();

        const buttonDice = document.getElementById("dice");
        buttonDice.innerHTML = `${
            players[currentPlayerIndex].getElement().dataset.name
        } lance les dés`;

        setBackGroundColor(buttonDice, players, currentPlayerIndex);
        setColor(buttonDice, players, currentPlayerIndex);
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
                totalSteps1: newTotalSteps1,
                totalSteps2: newTotalSteps2,
            } = movePlayer(
                currentPlayerIndex,
                totalSteps,
                position1,
                position2,
                totalSteps1,
                totalSteps2,
                players,
                cells
            );

            position1 = newPosition1;
            position2 = newPosition2;
            totalSteps1 = newTotalSteps1;
            totalSteps2 = newTotalSteps2;

            currentPlayerIndex = newCurrentPlayerIndex;

            const currentPosition =
                currentPlayerIndex === 0 ? position1 : position2;
            const currentTotalSteps =
                currentPlayerIndex === 0 ? totalSteps1 : totalSteps2;
            const newPosition = currentPosition + currentTotalSteps;

            getRandomChallenge(newPosition)
                .then((playerChallenge) => {
                    if (currentPlayerIndex === 0) {
                        position1 = newPosition;
                    } else {
                        position2 = newPosition;
                    }

                    dice.displayDiceResult(
                        playerName,
                        playerColor,
                        dice1,
                        dice2,
                        currentPlayerIndex,
                        position1,
                        position2
                    );

                    setTimeout(() => {
                        updateChallengeResult(
                            position1,
                            position2,
                            currentPlayerIndex
                        );
                    }, 1000);

                    updatePlayerProgress(
                        position1,
                        position2,
                        cells,
                        players,
                        currentPlayerIndex
                    );
                })
                .catch((error) => {
                    console.error(error);
                });

            setTimeout(() => {
                scrollManager.scrollToNextPlayer();
            }, 500);

            diceAnimation.classList.remove("fa-spin");
            getRandomChallenge(position1, position1)
                .then((playerChallenge) => {})
                .catch((error) => {
                    console.error(error);
                });
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
