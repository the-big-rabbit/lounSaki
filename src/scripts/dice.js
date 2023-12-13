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
    } // Initialiser les icones des dés

    roll() {
        const result = Math.floor(Math.random() * 6) + 1;
        const faceClass = this.faces[result - 1];
        return [result, faceClass]; // Retourne un tableau contenant le résultat du dé et la classe CSS correspondante
    } // Lancer les dés

    displayDiceResult(playerName, playerColor, dice1, dice2, newPosition) {
        const modalResultElement = document.getElementById("dice-modal-result");

        modalResultElement.innerHTML = `
        <div id="shwDiceResult">
            <span style="color:${playerColor}">
                <i class="fa-solid fa-4x ${dice1[1]}"></i>
                <i class="fa-solid fa-4x ${dice2[1]}"></i>
            </span>
            <div>
                ${playerName}, vous avancez de :
                <span style="color:${playerColor}">${
            dice1[0] + dice2[0]
        }</span> cases
            </div>
            <div class="cellModal">
                <span class="numberModal" style="color:${playerColor}">${newPosition}</span>
            </div>
        </div>`;
    } // Affiche le résultat des dés dans la modale
}

export default Dice;
