import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";


export default class Crystal extends Entity {

  constructor(suffix, offset, height) {
    super();
    this.suffix = suffix;
    this.offset = offset;
    this.height = height;
  }

  createSprite() {
    let offset = this.offset;
    let height = this.height;
    return new class extends SimpleSprite {
      createBody() {
        return Bodies.rectangle(900 + offset, height, 32 * 2, 22 * 2, {
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

  preload() {
    this.damageSound = loadSound("assets/audio/damage.mp3")
    this.damageSound.playMode("sustain");
  }

  afterTick() {
    if (!environment.scene.kirby?.sprite?.body) {
      return
    }
    if (Matter.SAT.collides(environment.scene.kirby.sprite.body, this.sprite.body).collided) {
      if (!this.damageSound.isPlaying()) {
        this.damageSound.play();
      }
      Body.applyForce(environment.scene.kirby.sprite.body, environment.scene.kirby.sprite.body.position, Vector.create(-0.002, -0.002));
    }
  }
}