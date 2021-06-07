import Entity from "../entity.js";
import {
  SimpleSprite
} from "../sprite.js";

class PlanetSprite extends SimpleSprite {
  createBody() {
    let body = Bodies.circle(
      0,
      100,
      200, {
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

export default class Planet extends Entity {

  createSprite() {
    return new PlanetSprite();
  }


  afterTick() {

  }
}
// let planets = [Bodies.circle(
//     windowWidth / 2,
//     100,
//     50, {
//       mass: 2,
//       restitution: 0.7,
//     }),
//   Bodies.circle(
//     windowWidth / 2,
//     500,
//     50, {
//       mass: 2,
//       restitution: 0.7,
//     })
// ];