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
  constructor(texture, x, y) {
    super(texture)
    this.x = x
    this.y = y
  }
  createBody() {
    let body = Bodies.rectangle(
      this.x,
      this.y,
      21,
      11, {
        mass: 10,
        restitution: 0.3,
      });
    return body;
  }
  draw() {
    super.draw();
  }
}

export default class Bridge extends Entity {

  constructor(texture, x, y) {
    super();
    this.texture = texture;
    this.x = x;
    this.y = y;
  }

  createSprite() {
    return new BridgeSprite(this.texture, this.x, this.y);
  }


  afterTick() {

  }
}