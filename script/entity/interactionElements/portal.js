import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";
import environment from "../../environment.js";

class PortalSprite extends SimpleSprite {
  constructor(texture, x, y, animated) {
    super(texture)
    this.x = x
    this.y = y
    this.animated = animated
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
        collisionFilter: {
          category: 0
        }
      });
    if (this.animated) {
      body.alpha = 1;
    }
    return body;
  }

  draw() {
    super.draw();
  }
}

export default class Portal extends Entity {

  constructor(texture, x, y, animated) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.animated = animated;
  }

  createSprite() {
    return new PortalSprite(this.texture, this.x, this.y, this.animated);
  }


  afterTick() {
    if (this.animated) {
      console.log(this.sprite.body.alpha)
    }
    super.afterTick();
    if (this?.sprite?.body && environment.scene?.kirby?.sprite?.body) {
      if (Matter.SAT.collides(environment.scene.kirby.sprite.body, this.sprite.body).collided && !this.collided) {
        this.collided = true;
        if (this.animated) {
          let interval = setInterval(() => {
            if (this.sprite.body.alpha >= 255) {
              clearInterval(interval);
            }
            this.sprite.body.alpha = Math.min(255, this.sprite.body.alpha * 1.003);
          }, 5)
        } else {
          let constraint = Matter.Constraint.create({
            bodyA: environment.scene.kirby.sprite.body,
            pointB: {
              x: this.sprite.body.position.x,
              y: this.sprite.body.position.y
            },
            stiffness: 1
          });
          World.add(environment.engine.world, constraint)
          let interval = setInterval(() => {
            if (constraint.length < 0.01) {
              clearInterval(interval);
            }
            constraint.length *= 0.999
          }, 5)
        }
      }
    }

  }
}