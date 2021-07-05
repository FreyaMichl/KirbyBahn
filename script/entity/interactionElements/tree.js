import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";

class TreeSprite extends SimpleSprite {
  constructor(texture, x, y, sizeX, sizeY) {
    super(texture)
    this.x = x
    this.y = y
    this.sizeX = sizeX
    this.sizeY = sizeY
  }
  createBody() {
    let body = Bodies.rectangle(
      this.x,
      this.y,
      this.sizeX,
      this.sizeY, {
        isStatic: true,
        mass: 0.1,
        restitution: 1,
      });
    return body;
  }
  draw() {
    super.draw();
  }
}

export default class Tree extends Entity {

  constructor(texture, x, y, sizeX, sizeY) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  createSprite() {
    return new TreeSprite(this.texture, this.x, this.y, this.sizeX, this.sizeY);
  }


  afterTick() {

  }
}