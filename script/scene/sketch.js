Matter.use('matter-wrap');
Matter.use('matter-attractors');

const Engine = Matter.Engine,
  Events = Matter.Events,
  Runner = Matter.Runner,
  Render = Matter.Render,
  World = Matter.World,
  Body = Matter.Body,
  Vector = Matter.Vector,
  Mouse = Matter.Mouse,
  Common = Matter.Common,
  Bodies = Matter.Bodies;
MouseConstraint = Matter.MouseConstraint;
Constraint = Matter.Constraint;
Composites = Matter.Composites;
Composite = Matter.Composite;

const drawVertices = Helpers.drawVertices;

let canvas;
let engine;
let player;
let jumping;
let planet;
let bridge;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  engine = Engine.create();

  // engine.world.gravity.scale = 0.0
  Matter.Resolver._restingThresh = 0.002
  MatterAttractors.Attractors.gravityConstant = 0.003

  // create a body with an attractor
  player = Bodies.circle(
    (windowWidth / 2),
    120,
    10, {
      mass: 0.01,
      restitution: 0.7,
      frictionAir: 0,
      // example of an attractor function that
      // returns a force vector that applies to bodyB
      plugin: {
        wrap: {
          min: {
            x: 0,
            y: 0
          },
          max: {
            x: windowWidth,
            y: windowHeight
          }
        },
        attractors: [
          function (bodyA, bodyB) {
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
      }

    });

  let planets = [Bodies.circle(
    windowWidth / 2,
    400,
    200, {
      mass: 3,
      restitution: 0.7,
    }),
    Bodies.circle(
      windowWidth / 2,
      500,
      50, {
        mass: 2,
        restitution: 0.7,
      })
  ];

  // add all of the bodies to the world
  World.add(engine.world, [player]);
  for (var i = 0; i < planets.length; i++) {
    World.add(engine.world, planets[i])
  }

  //add bridge
  const group = Body.nextGroup(true);
  //both x, both y, columns, rows, columnGap, rowGap, callback funktion
  const rects = Composites.stack(200, 100, 10, 1, 10, 10, function (x, y) {
    // x (is filled at composite.add), y (""), length, width,
    return Bodies.rectangle(x, y, 100, 50 /*,{ collisionFilter:{ group : group }}*/);
  });
  //chains, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options(stiffness - hoch steif)
  bridge = Composites.chain(rects, 0.5, 0, -0.5, 0, {stiffness: 0.08, length: 2, render: {type: 'line'}});
  World.add(engine.world, [bridge]);

  // left and right fix point of bridge
  //left point of bridge
  Composite.add(rects, Constraint.create({
    pointA: {x: 300, y: 300},
    bodyB: rects.bodies[0],
    //constrain im rect
    pointB: {x: -50, y: 0},
    stiffness: 0,
    length: 100
  }));
  //right point of bridge
  Composite.add(rects, Constraint.create({
    pointA: {x: 1000, y: 300},
    bodyB: rects.bodies[rects.bodies.length - 1],
    //constrain im rect
    pointB: {x: +50, y: 0},
    stiffness: 0,
    length: 200
  }));

  // run the engine
  Engine.run(engine);
  Events.on(engine, "afterTick", function () {
    if (jumping) {
      let finalForce = Vector.create(0, 0);

      engine.world.bodies.forEach((body, i) => {
        if (body === player) return;

        if (Matter.SAT.collides(player, body).collided) {
          console.log(body)
          var vw = windowWidth / 100;
          var vh = windowHeight / 100;
          // use Newton's law of gravitation
          var bToA = Matter.Vector.sub(body.position, player.position),
            distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.001;
          distanceSq /= 600;
          var normal = Matter.Vector.normalise(bToA),
            magnitude = -MatterAttractors.Attractors.gravityConstant * (player.mass * body.mass / distanceSq),
            force = Matter.Vector.mult(normal, magnitude);
          force.x /= vw / 16;
          force.y /= vw / 16;
          Vector.add(finalForce, force, finalForce);
        }
      });
      finalForce = Vector.normalise(finalForce);
      finalForce = Vector.div(finalForce, 5000);
      Body.applyForce(player, player.position, finalForce)

    }
  })
}

function keyPressed() {
  //32 is space
  if (keyCode == 32) {
    jumping = true;
  }
}

function keyReleased() {
  //32 is space
  if (keyCode == 32) {
    jumping = false;
  }
}

function draw() {
  clear();

  engine.world.bodies.forEach((body, i) => {
    drawVertices(body.vertices);
  });
  drawBodies(bridge.bodies);
  drawConstraints(bridge.constraints);
}

function drawConstraints(constraints) {
  for (let i = 0; i < constraints.length; i++) {
    drawConstraint(constraints[i]);
  }
}

function drawBodies(bodies) {
  for (let i = 0; i < bodies.length; i++) {
    drawVertices(bodies[i].vertices);
  }
}

function drawConstraint(constraint) {
  const offsetA = constraint.pointA;
  let posA = {x: 0, y: 0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  const offsetB = constraint.pointB;
  let posB = {x: 0, y: 0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
}
