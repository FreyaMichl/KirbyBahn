import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";

class BridgeSprite extends SimpleSprite {
  constructor(texture, x, y, afterInit) {
    super(texture)
    this.x = x
    this.y = y
    this.afterInit = afterInit;
  }

  createBody() {
    let body = Bodies.rectangle(
      this.x,
      this.y,
      21,
      11, {
        mass: 0.05,
        restitution: 0.3,
      });

    return body;
  }

  draw() {
    super.draw();
    if (!this.body) return
    if (this.initialized) return
    this.initialized = true
    this.afterInit();
  }
}

//one bridge object is one part of the bridge. We fuse this together with constraints in space-scene
export default class Bridge extends Entity {

  constructor(texture, x, y, afterInit) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.afterInit = afterInit;
  }

  createSprite() {
    return new BridgeSprite(this.texture, this.x, this.y, this.afterInit);
  }


  afterTick() {

  }
}