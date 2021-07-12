export const Input = Object.freeze({
  "LEFT": () => keyIsDown(37),
  "RIGHT": () => keyIsDown(39),
  "UP": () => keyIsDown(32),
  "DOWN": () => keyIsDown(40)
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

const InputConstraints = new Map;

InputConstraints.set("LEFT", leftRightConstraint)
InputConstraints.set("RIGHT", leftRightConstraint)
InputConstraints.set("UP", upDownConstraint)
InputConstraints.set("DOWN", upDownConstraint)

//this class is used to combine several input combinations. If the combination of pressed keys changes the matching callbacks are excuted
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
    //set the status of all inputs
    Object.keys(Input).forEach(key => {
      this.setInput(key, Input[key]());
    })
    this.validateInputs();
  }

  setInput(key, value) {
    this.currentInputs.set(key, value);
  }

  validateInputs() {
    //check if any input is active
    this.currentInputs.forEach((value, key) => {
      if (this.isPressed(key)) {
        //checking if the inputs are valid
        InputConstraints.get(key).check(this);
      }
    })
    //check if the active input combination is the same as the last one, if not set the active to the new one
    this.combinations.forEach((value, key) => {
      let result = key(this.currentInputs);
      if (result !== this.currentCombinationValues.get(key)) {
        this.currentCombinationValues.set(key, result);
      }
    })
    this.currentCombinationValues.forEach((value, key) => {
      if (this.validatedCombinationValues.get(key) !== this.currentCombinationValues.get(key)) {
        this.validatedCombinationValues.set(key, this.currentCombinationValues.get(key));
        if (this.validatedCombinationValues.get(key)) {
          this.combinations.get(key)(this.currentInputs)
        }
      }
    })
  }
  //register callback to a specific combination
  registerInputCombination(combination, callback) {
    this.combinations.set(combination, callback);
  }

}