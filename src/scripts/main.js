import {
    getRandomChallenge,
    getContrast,
    updatePlayerProgress,
    updateChallengeResult,
    setBackGroundColor,
    setColor,
    dragPlayerZone,
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
        new Player("player3", "fa-ghost"),
    ];
    const cells = createBoard();
    const dice = new Dice();
    const startGameButton = document.getElementById("startGame");
    const startGameModal = initModal("startGameModal");
    initModal("diceModal");
    const diceModal = document.getElementById("diceModal");
    var draggable = document.getElementById("draggable");
    let numberOfPlayers = 1;
    let currentPlayerIndex = 0;

    players.forEach((player) => {
        board.appendChild(player.getElement());
    });
    dragPlayerZone(draggable);

    startGameModal.show(); // Ouvrir la pop-up au chargement de la page
    startGameButton.addEventListener("click", function () {
        players.forEach((player) => {
            const playerName =
                document.getElementById(`player${numberOfPlayers}Name`).value ||
                `Joueur ${numberOfPlayers}`;
            const playerColor = document.getElementById(
                `player${numberOfPlayers}Color`
            ).value;
            const contrastColor = getContrast(playerColor);
            const contrastColorProgessBar = document.getElementById(
                `player${numberOfPlayers}-progress`
            );
            const buttonDice = document.getElementById("dice");
            buttonDice.innerHTML = `${
                players[currentPlayerIndex].getElement().dataset.name
            } lance les dés`;
            player.getElement().dataset.name = playerName;
            player.getElement().style.backgroundColor = playerColor;
            player.getElement().style.color = contrastColor;
            player.updatePlayerName();
            setColor(contrastColorProgessBar, players, currentPlayerIndex);
            setBackGroundColor(buttonDice, players, currentPlayerIndex);
            setColor(buttonDice, players, currentPlayerIndex);
            numberOfPlayers++;
        }); // Ajouter les joueurs au tableau de jeu (board)
        startGameModal.hide(); // Fermer la pop-up après le début du jeu
    });
    scrollManager.setPlayersAndIndex(players, currentPlayerIndex); // Initialiser le scrollManager
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
    }); // Réinitialiser le scrollManager, l'affichage des défis et des résultats après la fermeture de la pop-up des dés

    function playTurn() {
        // Fonction qui gère le tour de jeu
        const diceAnimation = document.getElementById("diceAnimation");
        diceAnimation.classList.add("fa-spin");
        const shwDiceResult = document.getElementById("shwDiceResult");
        const playerName =
            players[currentPlayerIndex].getElement().dataset.name || "Joueur 1";
        const playerColor =
            players[currentPlayerIndex].getElement().style.backgroundColor ||
            "#ff0000";
        if (shwDiceResult) {
            shwDiceResult.remove();
        }

        setTimeout(() => {
            // Lancer les dés
            const dice1 = dice.roll();
            const dice2 = dice.roll();
            const dices = dice1[0] + dice2[0];
            const playerCurrentPosition =
                players[currentPlayerIndex].currentPosition;
            const newPosition = players[
                currentPlayerIndex
            ].updateCurrentPlayerPosition(playerCurrentPosition, dices);

            const { currentPlayerIndex: newCurrentPlayerIndex } = movePlayer(
                currentPlayerIndex,
                newPosition,
                players,
                cells,
                playerColor
            ); // Déplacer le joueur sur le plateau

            getRandomChallenge(newPosition)
                .then(() => {
                    updatePlayerProgress(
                        newPosition,
                        cells,
                        players,
                        currentPlayerIndex
                    ); // Mettre à jour la progression du joueur
                    currentPlayerIndex = newCurrentPlayerIndex;
                    dice.displayDiceResult(
                        playerName,
                        playerColor,
                        dice1,
                        dice2,
                        newPosition
                    ); // Afficher le résultat des dés
                    setTimeout(() => {
                        updateChallengeResult(newPosition); // Afficher le défi
                    }, 1000);
                })
                .catch((error) => {
                    console.error(error);
                });
            setTimeout(() => {
                scrollManager.scrollToNextPlayer(players); // Faire défiler le tableau de jeu jusqu'au joueur suivant
            }, 500);
            diceAnimation.classList.remove("fa-spin");
        }, 2500);
    }

    players.forEach((player) => {
        updatePlayerPosition(player.currentPosition, cells, player); // Mettre à jour la position du joueur
    });

    document.getElementById("dice").addEventListener("click", playTurn);
});
