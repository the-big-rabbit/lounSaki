import scrollManager from "./scroll.js";

class Dice {
    constructor() {
        this.faces = [
            "fa-dice-one",
            "fa-dice-two",
            "fa-dice-three",
            "fa-dice-four",
            "fa-dice-five",
            "fa-dice-six",
        ];
    }

    roll() {
        const result = Math.floor(Math.random() * 6) + 1;
        const faceClass = this.faces[result - 1];
        return [result, faceClass];
    }

    displayDiceResult(
        playerName,
        playerColor,
        dice1,
        dice2,
        currentPlayerIndex,
        position1,
        position2
    ) {
        const modalResultElement = document.getElementById("dice-modal-result");
        const totalPosition = currentPlayerIndex === 1 ? position1 : position2;

        modalResultElement.innerHTML = `
        <div id="shwDiceResult"><br>
            <span style="color:${playerColor}">
                <i class="fa-solid fa-4x ${dice1[1]}"></i>
                <i class="fa-solid fa-4x ${dice2[1]}"></i>
            </span>
            <br><br>${playerName}, vous avancez de :
            <br>
            <span style="color:${playerColor}">${
            dice1[0] + dice2[0]
        }</span> cases
            <div>
                Vous arrivez sur la case :
                <span style="color:${playerColor}">${totalPosition}</span>
            </div>
        </div>`;
    }
}

export default Dice;
