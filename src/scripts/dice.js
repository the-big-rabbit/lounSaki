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
}

export default Dice;
