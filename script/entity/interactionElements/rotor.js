import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";

let angle = 0;

export default class Rotor extends Entity {

  constructor(texture, x, y, direction) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.angle = 0
  }

  createSprite() {
    return new class extends SimpleSprite {

      constructor(texture, x, y, direction) {
        super(texture);
        this.x = x;
        this.y = y;
        this.direction = direction;
      }

      createBody() {
        let body = Bodies.rectangle(this.x, this.y, 122, 10, {
          isStatic: true,
          mass: 0.5,
          restitution: 0.7
        });
        return body
      }
    }(this.texture, this.x, this.y, this.direction);
  }

  afterTick() {
    if (!this?.sprite?.body) {
      return
    }
    Body.setAngle(this.sprite.body, this.angle);
    Body.setAngularVelocity(this.sprite.body, 0.15);
    this.angle += this.direction;
  }
}