import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";

class PortalSprite extends SimpleSprite {
  constructor(texture, x, y) {
    super(texture)
    this.x = x
    this.y = y
  }
  createBody() {
    let body = Bodies.rectangle(
      this.x,
      this.y,
      350,
      160, {
        isStatic: true,
        mass: 10,
        restitution: 0.7,
          collisionFilter:{
            category: 0
          }
        });
    return body;
  }
  draw() {
    super.draw();
  }
}

export default class Portal extends Entity {

  constructor(texture, x, y) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
  }

  createSprite() {
    return new PortalSprite(this.texture, this.x, this.y);
  }


  afterTick() {

  }
}