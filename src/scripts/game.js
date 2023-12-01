// game.js
import { Player } from "./player.js";

export class Game {
    constructor() {
        this.players = [
            new Player("player1", "fa-female"),
            new Player("player2", "fa-male"),
        ];

        this.position1 = 0;
        this.position2 = 0;
        this.currentPlayerIndex = 0;
        // Initialiser d'autres propriétés du jeu au besoin
    }

    getContrast(hexcolor) {
        // If a leading # is provided, remove it
        if (hexcolor.slice(0, 1) === "#") {
            hexcolor = hexcolor.slice(1);
        }

        // If a three-character hexcode, make six-character
        if (hexcolor.length === 3) {
            hexcolor = hexcolor
                .split("")
                .map(function (hex) {
                    return hex + hex;
                })
                .join("");
        }

        // Convert to RGB value
        let r = parseInt(hexcolor.substr(0, 2), 16);
        let g = parseInt(hexcolor.substr(2, 2), 16);
        let b = parseInt(hexcolor.substr(4, 2), 16);

        // Get YIQ ratio
        let yiq = (r * 299 + g * 587 + b * 114) / 1000;

        // Check contrast
        return yiq >= 128 ? "black" : "white";
    }

    async getRandomChallenge(playerPosition) {
        try {
            // Récupérez la liste de défis associée à la position du joueur depuis le fichier JSON
            const response = await fetch("http://localhost:3000/defis.json");
            const challengesData = await response.json();
            const challengesList =
                challengesData.cases[(playerPosition - 1).toString()];

            if (!challengesList) {
                return "Aucun défi n'est défini pour cette position.";
            }

            // Tire au sort un défi parmi la liste
            const randomChallenge =
                challengesList.challenges[
                    Math.floor(Math.random() * challengesList.challenges.length)
                ];

            return randomChallenge;
        } catch (error) {
            console.error("Erreur lors du chargement du fichier JSON :", error);
            return "Erreur lors du chargement des défis.";
        }
    }

    playTurn() {
        // Affichage de la fenêtre modale d'animation de dé
        const diceAnimation = document.getElementById("diceAnimation");
        diceAnimation.classList.add("fa-spin");
        const shwDiceResult = document.getElementById("shwDiceResult");
        if (shwDiceResult) {
            shwDiceResult.remove();
        }

        const playerName =
            players[currentPlayerIndex].dataset.name || "Joueur 1";
        const playerColor =
            players[currentPlayerIndex].style.backgroundColor || "#ff0000";

        // Faites défiler jusqu'au joueur actuel pendant le tour
        scrollToPlayerDuringTurn(players[currentPlayerIndex]);

        // Délai avant de déplacer le joueur
        setTimeout(() => {
            // Lancer le déplacement du joueur
            const dice1 = rollDice();
            const dice2 = rollDice();
            const totalSteps = dice1[0] + dice2[0];

            const newPosition =
                currentPlayerIndex === 0
                    ? position1 + totalSteps
                    : position2 + totalSteps;

            getRandomChallenge(newPosition)
                .then((playerChallenge) => {
                    const modalResultElement =
                        document.getElementById("dice-modal-result");
                    modalResultElement.innerHTML = `<div id="shwDiceResult"><br>
                  <span style="color:${playerColor}"><i class="fa-solid fa-4x ${dice1[1]}"></i>   <i class="fa-solid fa-4x ${dice2[1]}"></i></span>
                  <br><br>${playerName}, vous avancez de :
                  <br>
                  <span style="color:${playerColor}">${totalSteps}</span> cases
                  <div>
                    Vous arrivez sur la case : <span style="color:${playerColor}">${newPosition}</span>
                    Votre défi est : ${playerChallenge}
                  </div>
              </div>`;
                })
                .catch((error) => {
                    console.error(error);
                });
            // Lancer le déplacement du joueur après le délai
            movePlayer(currentPlayerIndex, totalSteps);
            // Appeler la fonction de défilement pour centrer la vue sur le joueur actuel
            scrollToCurrentPlayer();
            setTimeout(() => {
                // Appeler la fonction de défilement pour centrer la vue sur le joueur suivant
                scrollToNextPlayer();
            }, 500); // Vous pouvez ajuster cette durée en fonction de vos besoins

            // Affichage du résultat du dé
            diceAnimation.classList.remove("fa-spin");
        }, 2500); // Durée totale de l'animation en millisecondes
    }

    resetGame() {
        position1 = 0;
        position2 = 0;
        currentPlayerIndex = 0;
        updatePlayerPosition();
        updatePlayerProgress();
        scrollToPlayer(players[playerIndex]);
        playerNamesForm.style.display = "block"; // Réafficher le formulaire
    }
}
