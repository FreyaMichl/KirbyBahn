import Entity from "../entity.js";
import Sprite from "../sprite.js";

export default class Interior extends Entity {

  createSprite() {
    let sprite = new class extends Sprite {

      createBody(animation) {
        let body = super.createBody(animation);
        Body.setPosition(body, Vector.create(910, 2385));
        return body;
      }
    }(loadJSON("assets/sprites/spaceship_whole_interior.json"), {
      isStatic: true,
      mass: 0.01
    });
    sprite.setAnimation("idle")
    return sprite;
  }

  preload() {
    super.preload();
    this.actualOutline = loadImage("assets/textures/interiorSpaceship/whole_interior.png")
  }

  draw() {
    super.draw();
    if (this.sprite.body) {
      let width = 432 * 2 * 1.5;
      let height = 1227 * 2 * 1.5;
      image(
        this.actualOutline,
        this.sprite.body.position.x - width / 2 + 7 * 2,
        this.sprite.body.position.y - height / 2 + 79 * 2,
        width,
        height)
    }
  }

}