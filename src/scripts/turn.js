import { getRandomChallenge } from "./utils.js";
import { movePlayer } from "./gameLogic.js";
import scrollManager from "./scroll.js";

export function playTurn(
    dice,
    currentPlayerIndex,
    position1,
    position2,
    players,
    cells
) {
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
                modalResultElement.innerHTML = `<div id="shwDiceResult"><br>
                    <span style="color:${playerColor}"><i class="fa-solid fa-4x ${
                    dice1[1]
                }"></i>   <i class="fa-solid fa-4x ${dice2[1]}"></i></span>
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

        // scrollManager.scrollToNextPlayer();

        setTimeout(() => {
            scrollManager.scrollToCurrentPlayer();
        }, 500);

        diceAnimation.classList.remove("fa-spin");
    }, 2500);
}
