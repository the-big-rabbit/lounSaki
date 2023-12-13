// board.js

export let cells = [];

export function createBoard() {
    const board = document.getElementById("board");
    const cells = [];

    for (let i = 0; i <= 99; i++) {
        const cell = document.createElement("div");
        cell.innerHTML = `<span class='number'>${i}</span>`;
        board.appendChild(cell);
        cell.classList.add("cell");
        if (i === 0) {
            cell.innerHTML = "<span class='alphaOmega'>Départ</span>";
        } else if (i === 99) {
            cell.innerHTML = "<span class='alphaOmega'>Arrivée</span>";
        }
        cells.push(cell);
    }
    return cells; // Retourne un tableau contenant toutes les cellules du plateau
}
