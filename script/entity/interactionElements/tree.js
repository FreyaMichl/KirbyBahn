import Entity from "../../entity.js";
import Sprite from "../../sprite.js";

class TreeSprite extends Sprite {
  constructor(x, y, sizeX, sizeY) {
    super(loadJSON("assets/sprites/trees.json"), {
      isStatic: true,
      mass: 0.0000001,
      restitution: 1,
      position: {
        x: x,
        y: y
      }
    })
    this.x = x
    this.y = y
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.setAnimation("idle")
  }

  draw() {
    super.draw();
  }
}

export default class Tree extends Entity {

  constructor(x, y, sizeX, sizeY) {
    super();
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  createSprite() {
    return new TreeSprite(this.x, this.y, this.sizeX, this.sizeY);
  }

  preload() {
    this.happySound = loadSound("assets/audio/happy.mp3")
    this.happySound.playMode("sustain");
  }

  afterTick() {
    super.afterTick();
    if (!environment.scene.kirby?.sprite?.body) {
      return
    }
    if (!this?.sprite?.body) {
      return
    }

    if (Matter.SAT.collides(environment.scene.kirby.sprite.body, this.sprite.body).collided && !this.collided) {
      this.happySound.play();
      this.collided = true;
    }
  }

  draw() {
    fill('black');
    super.draw();
  }
}