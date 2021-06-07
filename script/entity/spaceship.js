import Entity from "../entity.js";
import {
  SimpleSprite
} from "../sprite.js";

class SpaceshipSprite extends SimpleSprite {
  createBody() {
    let body = Bodies.rectangle(
      0,
      0,
      200,
      40, {
        mass: 100,
        isStatic: true,
        mass: 20,
        restitution: 0.7,
      });
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
    fill('black')
    super.draw();
  }
}

export default class Spaceship extends Entity {

  createSprite() {
    return new SpaceshipSprite();
  }


  afterTick() {

  }
}