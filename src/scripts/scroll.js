class ScrollManager {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
    }

    setPlayersAndIndex(players, index) {
        this.players = players;
        this.currentPlayerIndex = index;
    }

    scrollToPlayer(player, callback) {
        const playerRect = player.getElement().getBoundingClientRect();

        const scrollLeft =
            playerRect.left +
            window.scrollX -
            (window.innerWidth - playerRect.width) / 2;
        const scrollTop =
            playerRect.top +
            window.scrollY -
            (window.innerHeight - playerRect.height) / 2;

        window.scrollTo({
            top: scrollTop,
            left: scrollLeft,
            behavior: "smooth",
        });

        // Appel de la fonction de rappel une fois le défilement terminé
        setTimeout(callback, 1000); // Vous pouvez ajuster cette durée en fonction de vos besoins
    }

    scrollToCurrentPlayer() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        this.scrollToPlayer(currentPlayer);
    }

    scrollToNextPlayer() {
        const nextPlayerIndex = 1 - this.currentPlayerIndex;
        const nextPlayer = this.players[nextPlayerIndex];
        this.scrollToPlayer(nextPlayer);
    }
}

// Exportez une instance de la classe pour être utilisée dans d'autres fichiers
export default new ScrollManager();
