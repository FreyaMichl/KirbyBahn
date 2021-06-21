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
        mass: 100,
        isStatic: true,
        mass: 20,
        restitution: 0.7,
      },
      64);
    body.plugin.attractors = [
      function(bodyA, bodyB) {
        if (bodyB.isParticle != true) {
          var vw = windowWidth / 100;
          var vh = windowHeight / 100;
          // use Newton's law of gravitation
          var bToA = Matter.Vector.sub(bodyB.position, bodyA.position),
            distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.001;
          distanceSq /= 600;
          var normal = Matter.Vector.normalise(bToA),
            magnitude = -MatterAttractors.Attractors.gravityConstant * (bodyA.mass * bodyB.mass / distanceSq),
            force = Matter.Vector.mult(normal, magnitude);
          force.x /= vw / 16;
          force.y /= vw / 16;
          // to apply forces to both bodies
          Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
          Body.applyForce(bodyB, bodyB.position, force);
        }
      }
    ]
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


  afterTick() {

  }
}