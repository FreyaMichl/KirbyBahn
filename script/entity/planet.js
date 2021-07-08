import Entity from "../entity.js";
import {
  SimpleSprite
} from "../sprite.js";

class PlanetSprite extends SimpleSprite {
  constructor(texture, x, y, size) {
    super(texture)
    this.x = x
    this.y = y
    this.size = size
  }
  createBody() {
    let body = Bodies.circle(
      this.x,
      this.y,
      this.size, {
        isStatic: true,
        mass: 15,
        restitution: 0,
        friction: 1
      },
      64);
    return body;
  }
  draw() {
    super.draw();
  }
}

export default class Planet extends Entity {

  constructor(texture, x, y, size) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  createSprite() {
    return new PlanetSprite(this.texture, this.x, this.y, this.size);
  }

  preload() {
    this.happySound = loadSound("assets/audio/happy.mp3")
    this.happySound.playMode("sustain");
  }

  afterTick() {
    if (!environment.scene.kirby?.sprite?.body) {
      return
    }
    if (Matter.SAT.collides(environment.scene.kirby.sprite.body, this.sprite.body).collided && !this.collided) {
      this.happySound.play();
      this.collided = true;
    }
  }
}