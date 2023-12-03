// gameLogic.js
import scrollManager from "./scroll.js";
import { getRandomChallenge } from "./utils.js";

export function movePlayer(
    playerIndex,
    totalSteps,
    position1,
    position2,
    players,
    cells
) {
    const currentPosition = playerIndex === 0 ? position1 : position2;
    const newPosition = currentPosition + totalSteps;

    if (newPosition >= cells.length) {
        alert(
            `${
                players[playerIndex].getElement().dataset.name
            }, vous avez gagné !`
        );
        resetGame(position1, position2, playerIndex, players);
        return { position1, position2, currentPlayerIndex: playerIndex };
    } else {
        let updatedPlayerIndex = playerIndex === 0 ? 1 : 0;

        if (playerIndex === 0) {
            position1 = newPosition;
        } else {
            position2 = newPosition;
        }
        updatePlayerPosition(
            updatedPlayerIndex,
            position1,
            position2,
            cells,
            players
        );

        scrollManager.setPlayersAndIndex(players, updatedPlayerIndex);

        return { position1, position2, currentPlayerIndex: updatedPlayerIndex };
    }
}

export function resetGame(position1, position2, currentPlayerIndex, players) {
    position1 = 0;
    position2 = 0;
    currentPlayerIndex = 0;
    updatePlayerPosition(
        players,
        currentPlayerIndex,
        position1,
        position2,
        cells
    );
    scrollManager.scrollToPlayer(() => {});
    playerNamesForm.style.display = "block";
}
export function updatePlayerPosition(
    playerIndex,
    position1,
    position2,
    cells,
    players
) {
    const boardRect = board.getBoundingClientRect(); // Obtenir les dimensions du board
    const cellSize = cells[0].getBoundingClientRect().width; // Taille de la cellule + espacement
    const playerSize = players[playerIndex]
        .getElement()
        .getBoundingClientRect().width; // Taille du joueur

    // Ajuster la position pour centrer le joueur dans la cellule
    const { top: top1, left: left1 } = cells[position1].getBoundingClientRect();
    players[0].getElement().style.transform = `translate(${
        left1 - boardRect.left + (cellSize - playerSize) / 2
    }px, ${top1 - boardRect.top + (cellSize - playerSize) / 2}px)`;

    // Faire de même pour le deuxième joueur
    const { top: top2, left: left2 } = cells[position2].getBoundingClientRect();
    players[1].getElement().style.transform = `translate(${
        left2 - boardRect.left + (cellSize - playerSize) / 2
    }px, ${top2 - boardRect.top + (cellSize - playerSize) / 2}px)`;
}
export function playTurn(
    dice,
    currentPlayerIndex,
    position1,
    position2,
    players
) {
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

        movePlayer(
            currentPlayerIndex,
            newPosition,
            position1,
            position2,
            players
        ); // Lancer le déplacement du joueur après le délai
        scrollManager.scrollToNextPlayer();

        setTimeout(() => {
            scrollManager.scrollToCurrentPlayer();
        }, 500); // Vous pouvez ajuster cette durée en fonction de vos besoins

        // Affichage du résultat du dé
        diceAnimation.classList.remove("fa-spin");
    }, 2500); // Durée totale de l'animation en millisecondes
}
