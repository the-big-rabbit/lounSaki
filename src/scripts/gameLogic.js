// gameLogic.js
import scrollManager from "./scroll.js";

export function movePlayer(
    currentPlayerIndex,
    newPosition,
    players,
    cells,
    playerColor
) {
    let rgba;
    rgba = playerColor.replace(/rgb/i, "rgba");
    rgba = rgba.replace(/\)/i, ",0.15)");
    if (newPosition >= cells.length) {
        alert(
            `${
                players[playerIndex].getElement().dataset.name
            }, vous avez gagné !`
        );
        resetGame(newPosition, players);
        return {
            newPosition,
            playerIndex,
        };
    } else {
        let updatedPlayerIndex = (currentPlayerIndex + 1) % players.length;
        cells[newPosition].classList.add("cell--active");
        cells[
            newPosition
        ].style.boxShadow = `1px 1px 0 1px ${playerColor}, -1px 0 28px 0 ${rgba},
        54px 54px 28px -10px ${rgba}`;
        cells[newPosition].innerHtml = "Défi relevé !";
        updatePlayerPosition(newPosition, cells, players[currentPlayerIndex]);
        scrollManager.setPlayersAndIndex(players, updatedPlayerIndex);
        return {
            currentPlayerIndex: updatedPlayerIndex,
        };
    }
} // Déplacer le joueur sur le plateau

export function resetGame(newPosition, players) {
    newPosition = 0;
    newSteps = 0;
    players.forEach((player) => {
        updatePlayerPosition(newPosition, cells, player);
    });
    scrollManager.scrollToPlayer(() => {});
    playerNamesForm.style.display = "block";
} // Réinitialiser le jeu

export function updatePlayerPosition(currentPosition, cells, player) {
    const boardRect = board.getBoundingClientRect(); // Obtenir les dimensions du board
    const cellSize = cells[0].getBoundingClientRect().width; // Taille de la cellule + espacement
    const { top: top, left: left } =
        cells[currentPosition].getBoundingClientRect();
    const playerSize = player.getElement().getBoundingClientRect().width; // Taille du joueur
    const defiText = document.createTextNode("Défi relevé !");
    diceModal.addEventListener("hidden.bs.modal", function () {
        currentPosition !== 0
            ? cells[currentPosition].appendChild(defiText)
            : "";
    });
    // Ajuster la position pour centrer le joueur dans la cellule
    player.getElement().style.transform = `translate(${
        left - boardRect.left + (cellSize - playerSize / 5) / 2
    }px, ${top - boardRect.top + (cellSize - playerSize) / 2}px)`;
} // Mettre à jour la position du joueur sur le plateau
