export const Input = Object.freeze({
    "LEFT": 37,
    "RIGHT": 39,
    "UP": 38,
    "DOWN": 40
})

class InputConstraint {
    constructor(key1, key2) {
        this.key1 = key1;
        this.key2 = key2;
    }

    check(movementController) {
        if (movementController.isPressed(this.key1) && movementController.isPressed(this.key2)) {
            movementController.setInput(this.key1, false);
            movementController.setInput(this.key2, false);
        }
    }
}

const leftRightConstraint = new InputConstraint(Input.LEFT, Input.RIGHT);
const upDownConstraint = new InputConstraint(Input.UP, Input.DOWN);

const InputConstraints = {
    37: leftRightConstraint,
    39: leftRightConstraint,
    38: upDownConstraint,
    40: upDownConstraint
}

export class MovementController {

    constructor() {
        this.currentInputs = new Map();
        this.currentCombinationValues = new Map();
        this.validatedCombinationValues = new Map();
        this.combinations = new Map();
    }

    isPressed(key) {
        return this.currentInputs.get(key);
    }

    updateInputs() {
        Object.values(Input).forEach(value => {
            this.setInput(value, keyIsDown(value));
        })
        this.validateInputs();
    }

    setInput(key, value) {
        this.currentInputs.set(key, value);
    }

    validateInputs() {
        this.currentInputs.forEach((value, key) => {
            if (this.isPressed(key)) {
                InputConstraints[key].check(this);
            }
        })
        this.combinations.forEach((value, key) => {
            let result = key(this.currentInputs);
            if(result !== this.currentCombinationValues.get(key)){
                this.currentCombinationValues.set(key, result);
            }
        })
        this.currentCombinationValues.forEach((value, key) => {
            if (this.validatedCombinationValues.get(key) !== this.currentCombinationValues.get(key)) {
                this.validatedCombinationValues.set(key, this.currentCombinationValues.get(key));
                if(this.validatedCombinationValues.get(key)){
                    this.combinations.get(key)(this.currentInputs)
                }
            }
        })
    }

    registerInputCombination(combination, callback){
        this.combinations.set(combination, callback);
    }

}