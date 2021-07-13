import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";
import environment from "../../environment.js";


export default class Magnet extends Entity {


  constructor() {
    super();
    this.animated = true
    this.movementTick = 0
  }

  createSprite() {
    return new class extends SimpleSprite {
      createBody() {
        return Bodies.rectangle(1100, 1870, 32 * 2, 22 * 2, {
          isStatic: true,
          inertia: Infinity,
          gravityScale: 0,
          mass: 0.000001,
          movementScale: {
            x: 1,
            y: 0
          }
        })

      }
    }("assets/textures/interactionElements/magnet.png")
  }

  afterTick() {
    if (this.sprite && this.sprite.body) {
      let x = 830 + (Math.sin(this.movementTick / 100) + 1) * 0.5 * 580;
      if (this.waiting && x > (environment.scene.kirby.sprite.body.position.x - 5) && x < (environment.scene.kirby.sprite.body.position.x + 5) && !this.stopped) {
        this.animated = false;
        this.stopped = true;
        this.constraint = Matter.Constraint.create({
          bodyA: environment.scene.kirby.sprite.body,
          pointB: {
            x: this.sprite.body.position.x,
            y: this.sprite.body.position.y + 70
          },
          stiffness: 0.2,
          damping: 1
        })

        let i = 0;
        let interval = setInterval(() => {
          if (this.constraint.length < 5) {
            clearInterval(interval);
            setTimeout(() => {
              this.animated = true;
            }, 1000);
          }
          this.constraint.length *= 0.99
          i++;
        }, 5)
        Matter.World.add(environment.engine.world, this.constraint)
      }
      if (!this.animated) {
        return
      }
      Matter.Body.setPosition(this.sprite.body, Vector.create(x, 1890))
      if (this.constraint) {
        this.constraint.pointB.x = this.sprite.body.position.x
        this.constraint.pointB.y = this.sprite.body.position.y + 70
      }
      this.movementTick++;
    }
  }

  awaitKirby() {
    this.waiting = true;
  }

  dropKirby() {
    console.log("Drop Kirby")
    World.remove(environment.engine.world, this.constraint)
    this.waiting = false
    this.stopped = false
    this.constraint = undefined
  }
}