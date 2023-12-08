// gameLogic.js
import scrollManager from "./scroll.js";

export function movePlayer(
    playerIndex,
    totalSteps,
    position1,
    position2,
    totalSteps1,
    totalSteps2,
    players,
    cells,
    playerColor,
    playerContrastColor
) {
    const currentPosition = playerIndex === 0 ? position1 : position2;
    const newPosition = currentPosition + totalSteps;

    let rgba;

    rgba = playerColor.replace(/rgb/i, "rgba");
    rgba = rgba.replace(/\)/i, ",0.15)");

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
            totalSteps1 = totalSteps1;
            cells[newPosition].classList.add("cell--active");
            cells[
                newPosition
            ].style.boxShadow = `1px 1px 0 1px ${playerColor}, -1px 0 28px 0 ${rgba},
        54px 54px 28px -10px ${rgba}`;
            cells[newPosition].innerHtml = "Défi relevé !";
        } else {
            position2 = newPosition;
            totalSteps2 = totalSteps2;
            cells[newPosition].classList.add("cell--active");
            cells[
                newPosition
            ].style.boxShadow = `1px 1px 0 1px ${playerColor}, -1px 0 28px 0 ${rgba},
        54px 54px 28px -10px ${rgba}`;
            cells[newPosition].innerHtml = "Défi relevé !";
        }
        updatePlayerPosition(
            updatedPlayerIndex,
            position1,
            position2,
            cells,
            players
        );

        scrollManager.setPlayersAndIndex(players, updatedPlayerIndex);

        return {
            position1,
            position2,
            currentPlayerIndex: updatedPlayerIndex,
            totalSteps1,
            totalSteps2,
        };
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

    const defiText = document.createTextNode("Défi relevé !");

    diceModal.addEventListener("hidden.bs.modal", function () {
        if (playerIndex === 1) {
            position1 !== 0 ? cells[position1].appendChild(defiText) : "";
        } else {
            position2 !== 0 ? cells[position2].appendChild(defiText) : "";
        }
    });

    // Ajuster la position pour centrer le joueur dans la cellule
    const { top: top1, left: left1 } = cells[position1].getBoundingClientRect();
    players[0].getElement().style.transform = `translate(${
        left1 - boardRect.left + (cellSize - playerSize / 5) / 2
    }px, ${top1 - boardRect.top + (cellSize - playerSize) / 2}px)`;

    // Faire de même pour le deuxième joueur
    const { top: top2, left: left2 } = cells[position2].getBoundingClientRect();
    players[1].getElement().style.transform = `translate(${
        left2 - boardRect.left + (cellSize - playerSize / 5) / 2
    }px, ${top2 - boardRect.top + (cellSize - playerSize) / 2}px)`;
}
