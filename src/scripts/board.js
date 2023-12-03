// board.js

export let cells = [];

export function createBoard() {
    const board = document.getElementById("board");
    const cells = [];

    for (let i = 0; i <= 99; i++) {
        const cell = document.createElement("div");
        cell.textContent = i;
        board.appendChild(cell);
        cell.classList.add("cell");

        if (i === 0) {
            cell.textContent = "Départ";
        } else if (i === 99) {
            cell.textContent = "Arrivée";
        }

        cells.push(cell);
    }

    return cells;
}
