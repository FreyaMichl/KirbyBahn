import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";


export default class Crystal extends Entity {

  constructor(suffix, offset) {
    super();
    this.suffix = suffix;
    this.offset = offset;
  }

  createSprite() {
    let offset = this.offset;
    return new class extends SimpleSprite {
      createBody() {
        return Bodies.rectangle(900 + offset, 2110, 32 * 2, 22 * 2, {
          inertia: Infinity,
          gravityScale: 0,
          mass: 0.0000001,
          isStatic: true,
          movementScale: {
            x: 1,
            y: 0
          }
        })
      }
    }("assets/textures/interactionElements/crystal_" + this.suffix + ".png")
  }

  afterTick() {
  }
}