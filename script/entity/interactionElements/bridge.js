import Entity from "../../entity.js";
import {
  SimpleSprite
} from "../../sprite.js";

// // add bridge
// const group = Body.nextGroup(true);
// const rects = Composites.stack(100, 200, 10, 1, 10, 10, function(x, y) {
//   return Bodies.rectangle(x, y, 50, 20, {
//     collisionFilter: {
//       group: group
//     }
//   });
// });
// bridge = Composites.chain(rects, 0.5, 0, -0.5, 0, {
//   stiffness: 0.8,
//   length: 2,
//   render: {
//     type: 'line'
//   }
// });
//
// // left and right fix point of bridge
// Composite.add(rects, Constraint.create({
//   pointA: {
//     x: 100,
//     y: 200
//   },
//   bodyB: rects.bodies[0],
//   pointB: {
//     x: -25,
//     y: 0
//   },
//   stiffness: 0.1
// }));
// Composite.add(rects, Constraint.create({
//   pointA: {
//     x: 700,
//     y: 200
//   },
//   bodyB: rects.bodies[rects.bodies.length - 1],
//   pointB: {
//     x: +25,
//     y: 0
//   },
//   stiffness: 0.02
// }));
//
// function draw() {
//   stroke(128);
//   strokeWeight(2);
//   drawConstraints(bridge.constraints);
// }
//
// function drawConstraints(constraints) {
//   for (let i = 0; i < constraints.length; i++) {
//     drawConstraint(constraints[i]);
//   }
// }
//
//
// function drawConstraint(constraint) {
//   const offsetA = constraint.pointA;
//   let posA = {
//     x: 0,
//     y: 0
//   };
//   if (constraint.bodyA) {
//     posA = constraint.bodyA.position;
//   }
//   const offsetB = constraint.pointB;
//   let posB = {
//     x: 0,
//     y: 0
//   };
//   if (constraint.bodyB) {
//     posB = constraint.bodyB.position;
//   }
//   line(
//     posA.x + offsetA.x,
//     posA.y + offsetA.y,
//     posB.x + offsetB.x,
//     posB.y + offsetB.y
//   );
// }


class BridgeSprite extends SimpleSprite {
  constructor(texture, x, y, afterInit) {
    super(texture)
    this.x = x
    this.y = y
    this.afterInit = afterInit;
  }

  createBody() {
    let body = Bodies.rectangle(
      this.x,
      this.y,
      21,
      11, {
        mass: 0.05,
        restitution: 0.3,
      });
    // body.plugin.attractors = [
    //     function (bodyA, bodyB) {
    //         if (!bodyB.isParticle) {
    //             var vw = windowWidth / 100;
    //             var vh = windowHeight / 100;
    //             // use Newton's law of gravitation
    //             var bToA = Matter.Vector.sub(bodyB.position, bodyA.position),
    //                 distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.001;
    //             distanceSq /= 600;
    //             var normal = Matter.Vector.normalise(bToA),
    //                 magnitude = -MatterAttractors.Attractors.gravityConstant * (bodyA.mass * bodyB.mass / distanceSq),
    //                 force = Matter.Vector.mult(normal, magnitude);
    //             force.x /= vw / 16;
    //             force.y /= vw / 16;
    //             // to apply forces to both bodies
    //             Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
    //             Body.applyForce(bodyB, bodyB.position, force);
    //         }
    //     }
    // ]
    return body;
  }

  draw() {
    super.draw();
    if (!this.body) return
    if (this.initialized) return
    this.initialized = true
    this.afterInit();
  }
}

export default class Bridge extends Entity {

  constructor(texture, x, y, afterInit) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.afterInit = afterInit;
  }

  createSprite() {
    return new BridgeSprite(this.texture, this.x, this.y, this.afterInit);
  }


  afterTick() {

  }
}