import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";
import environment from "../../environment.js";

class TomatoSprite extends SimpleSprite {
  constructor(texture, x, y) {
    super(texture)
    this.x = x
    this.y = y
  }

  createBody() {
    let body = Bodies.rectangle(
      this.x,
      this.y,
      24,
      20, {
        isStatic: true,
        mass: 0.1,
        restitution: 0.7,
      });
    return body;
  }

  draw() {
    super.draw();
  }
}

export default class Tomato extends Entity {

  constructor(texture, x, y) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
  }

  createSprite() {
    return new TomatoSprite(this.texture, this.x, this.y);
  }


  afterTick() {
    if (!this.sprite || !this.sprite.body || !environment.scene.kirby.sprite || !environment.scene.kirby.sprite.body) return
    if (Matter.SAT.collides(environment.scene.kirby.sprite.body, this.sprite.body).collided) {
      this.sprite.body.collisionFilter = {group: false}
      this.sprite.body.draw = false
    }
  }
}