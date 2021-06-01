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

const drawVertices = Helpers.drawVertices;

let canvas;
let engine;
let player;
let jumping;
let planet;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  engine = Engine.create();

  engine.world.gravity.scale = 0.0
  Matter.Resolver._restingThresh = 0.001
  MatterAttractors.Attractors.gravityConstant = 0.00081

  console.log(Matter)
  // create a body with an attractor
  player = Bodies.circle(
    700,
    100,
    10, {
      mass: 0.01,
      restitution: 0.7,
      // example of an attractor function that
      // returns a force vector that applies to bodyB
      plugin: {
        attractors: [
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
      }

    });

  let planets = [Bodies.circle(
      windowWidth / 2,
      100,
      50, {
        mass: 1,
        restitution: 0.7,
      }),
    Bodies.circle(
      windowWidth / 2,
      500,
      50, {
        mass: 1,
        restitution: 0.7,
      })
  ];

  // add all of the bodies to the world
  World.add(engine.world, [player]);
  for (var i = 0; i < planets.length; i++) {
    World.add(engine.world, planets[i])
  }
  // run the engine
  Engine.run(engine);
  Events.on(engine, "afterTick", function() {
    if (jumping) {
      engine.world.bodies.forEach((body, i) => {
        if (body === player) return;
        if (Matter.SAT.collides(player, body).collided) {
          Body.applyForce(player, player.position, Vector.create(0, 0.00008))
        }
      });

    }
  })
}

function keyPressed() {
  if (keyCode == 32) {
    jumping = true;
  }
}

function keyReleased() {
  if (keyCode == 32) {
    jumping = false;
  }
}

function draw() {
  background(0);
  fill(255);

  engine.world.bodies.forEach((body, i) => {
    drawVertices(body.vertices);
  });

}