import Entity from "../entity.js";
import Sprite from "../sprite.js";

export default class Spaceship extends Entity {

  createSprite() {
    let sprite = new class extends Sprite {

      createBody(animation) {
        let body = super.createBody(animation);
        Body.setPosition(body, Vector.create(900, 2200));
        return body;
      }
    }(loadJSON("assets/sprites/spaceship_outline.json"), {
      isStatic: true,
      mass: 0.01,
      draw: false
    });
    sprite.setAnimation("idle")
    return sprite;
  }

  preload() {
    super.preload();
    this.actualOutline = loadImage("assets/textures/spaceship/spaceship_outline-2.png")
  }

  draw() {
    super.draw();
    if (this.sprite.body) {
      let width = this.sprite.body.bounds.max.x - this.sprite.body.bounds.min.x;
      let height = this.sprite.body.bounds.max.y - this.sprite.body.bounds.min.y;
      image(this.actualOutline, this.sprite.body.position.x - width / 2 + 23, this.sprite.body.position.y - height / 2, width, height)
    }
  }

}