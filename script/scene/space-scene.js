import Scene from "../scene.js";
import Kirby from "../entity/kirby.js";
import Planet from "../entity/planet.js";
import Spaceship from "../entity/spaceship.js";
import Interior from "../entity/interior.js";
import Bridge from "../entity/interactionElements/bridge.js";
import Tomato from "../entity/interactionElements/tomato.js";
import Tree from "../entity/interactionElements/tree.js";
import Magnet from "../entity/interactionElements/magnet.js";
import Crystal from "../entity/interactionElements/crystal.js";

class SpaceScene extends Scene {

  constructor() {
    super();
    this.tomato1 = new Tomato("assets/textures/interactionElements/tomato.png", 650, 2940);
    this.tomato2 = new Tomato("assets/textures/interactionElements/tomato.png", 800, 2957);
    this.treelittle = new Tree("assets/textures/interactionElements/tree_little.png", 100, 100, 33, 60)
    this.treemiddle = new Tree("assets/textures/interactionElements/tree_middle.png", 200, 100, 44, 77)
    this.treebig = new Tree("assets/textures/interactionElements/tree_big.png", 300, 100, 53, 94)
    this.interior = new Interior();
    this.spaceship = new Spaceship();
    this.kirby = new Kirby();
    this.planet1 = new Planet("assets/textures/interactionElements/planet.png", 1500, 400, 250);
    this.planet2 = new Planet("assets/textures/interactionElements/earth_planet.png", 400, 700, 200);
    this.magnet = new Magnet();
    this.crystal1Left = new Crystal("one_left", 0);
    this.crystal1Right = new Crystal("one_right", 60);
    this.crystal2Left = new Crystal("two_left", 120);
    this.crystal2Right = new Crystal("two_right", 200);
    this.addEntity(this.planet1);
    this.addEntity(this.planet2);
    this.addEntity(this.spaceship);
    this.addEntity(this.interior);
    this.addEntity(this.kirby);
    this.addEntity(this.tomato1);
    this.addEntity(this.tomato2);
    this.addEntity(this.treelittle);
    this.addEntity(this.treemiddle);
    this.addEntity(this.treebig);
    this.addEntity(this.magnet);
    this.addEntity(this.crystal1Left);
    this.addEntity(this.crystal1Right);
    this.addEntity(this.crystal2Left);
    this.addEntity(this.crystal2Right);
    this.createBridge();
  }

  createBridge() {
    let parts = []
    for (let i = 0; i < 20; i++) {
      parts[i] = new Bridge("assets/textures/interactionElements/bridge_wood.png", 540 + i * 23, 2130, () => {
        let done = true;
        for (let j = 0; j < parts.length; j++) {
          if (j === i) continue
          if (!parts[j].initialized) {
            done = false
            break
          }
        }
        parts[i].initialized = true
        if (done) {
          for (let j = 0; j < parts.length - 1; j++) {
            let bodyA = parts[j].sprite.body;
            let bodyB = parts[j + 1].sprite.body;
            Matter.World.add(environment.engine.world, Matter.Constraint.create({
              bodyA: bodyA,
              pointA: {
                x: 10.5,
                y: 0
              },
              bodyB: bodyB,
              pointB: {
                x: -10.5,
                y: 0
              },
              restitution: 1,
              stiffness: 0.4,
              damping: 0.0,
              length: 2
            }))
          }

          Matter.World.add(environment.engine.world, Matter.Constraint.create({
            bodyB: parts[0].sprite.body,
            pointA: {
              x: 320,
              y: 2130,
               length: 100,
              stiffness: 0.4,
              restitution: 1,
              damping: 0
            },
            pointB: {
              x: -10.5,
              y: 0
            },
            stiffness: 1,
            length: 2
          }))
          Matter.World.add(environment.engine.world, Matter.Constraint.create({
            bodyB: parts[parts.length - 1].sprite.body,
            pointA: {
              x: 800,
              y: 2130,
              length: 100,
              stiffness: 1
            },
            pointB: {
              x: 10.5,
              y: 0
            },
            stiffness: 1,
            length: 2
          }))
        }
      });
    }

    parts.forEach(bridge => this.addEntity(bridge))

    return {
      parts: parts
    }
  }

  afterTick() {
    super.afterTick();
    let sprite = this.kirby.sprite;
    if (!sprite) return;
    let body = sprite.body;
    if (!body) return;
    let page = Math.floor((body.position.y + 60) / windowHeight);
    if (keyIsDown(32)) {
      if (Matter.SAT.collides(this.planet1.sprite.body, body).collided) {
        Body.applyForce(body, body.position, Vector.mult(Vector.normalise(Vector.sub(this.planet2.sprite.body.position, body.position)), 0.02))
      }
      if (Matter.SAT.collides(this.planet2.sprite.body, body).collided) {
        Body.applyForce(body, body.position, Vector.mult(Vector.normalise(Vector.sub(Vector.add(this.spaceship.sprite.body.position, Vector.create(300, 0)), body.position)), 0.02))
      }
    }
    environment.scrollToPage(page);
  }


  preload() {
    this.background = loadImage("assets/textures/background.png",
      result => {
        this.background.resize(this.background.width, this.background.height);
      });
    this.entities.forEach(entity => entity.preload())
  }

  draw() {
    image(this.background, 0, 0);
    super.draw()
    this.entities.forEach(entity => {
      entity.draw()
    });
    environment.engine.world.constraints.forEach(constraint => {
      const offsetA = constraint.pointA;
      let posA = {
        x: 0,
        y: 0
      };
      if (constraint.bodyA) {
        posA = constraint.bodyA.position;
      }
      const offsetB = constraint.pointB;
      let posB = {
        x: 0,
        y: 0
      };
      if (constraint.bodyB) {
        posB = constraint.bodyB.position;
      }
      stroke(255);

      line(
        posA.x + offsetA.x,
        posA.y + offsetA.y,
        posB.x + offsetB.x,
        posB.y + offsetB.y
      );
    })
  }


}


export default new SpaceScene()