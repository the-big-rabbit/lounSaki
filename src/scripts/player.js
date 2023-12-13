class Player {
    constructor(id, icon) {
        this.element = this.createPlayerElement(id, icon);
        this.currentPosition = 0;
        this.steps = 0;
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
    } // Créer un élément joueur

    updateName(name) {
        this.element.dataset.name = name;
        this.updatePlayerName();
    } // Mettre à jour le nom du joueur

    updateColor(color) {
        this.element.style.backgroundColor = color;
        const contrastColor = getContrast(color);
        this.element.style.color = contrastColor;
    } // Mettre à jour la couleur du joueur

    updatePlayerName() {
        const playerName = this.element.dataset.name || "Joueur";
        this.element.querySelector(".player-name").textContent = playerName;
    } // Mettre à jour le nom du joueur

    updateCurrentPlayerPosition(currentPosition, steps) {
        return (this.currentPosition = currentPosition + steps);
    } // Mettre à jour la position du joueur

    updatePlayerSteps(steps) {
        return (this.steps = steps);
    } // Mettre à jour le lancer de dé du joueur

    getElement() {
        return this.element;
    }
}

export default Player;
