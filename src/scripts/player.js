class Player {
    constructor(id, icon) {
        this.element = this.createPlayerElement(id, icon);
        this.position = 0;
    }

    createPlayerElement(id, icon) {
        const player = document.createElement("div");
        player.id = id;
        player.classList.add("player");

        const playerName = document.createElement("div");
        playerName.classList.add("player-name");
        player.appendChild(playerName);

        const playerIcon = document.createElement("i");
        playerIcon.classList.add("fas", icon);
        playerName.appendChild(playerIcon);

        return player;
    }

    updateName(name) {
        this.element.dataset.name = name;
        this.updatePlayerName();
    }

    updateColor(color) {
        this.element.style.backgroundColor = color;
        const contrastColor = getContrast(color);
        this.element.style.color = contrastColor;
    }

    updatePlayerName() {
        const playerName = this.element.dataset.name || "Joueur";
        this.element.querySelector(".player-name").textContent = playerName;
    }

    getElement() {
        return this.element;
    }
}

export default Player;
