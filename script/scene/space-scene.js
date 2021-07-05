import Scene from "../scene.js";
import Kirby from "../entity/kirby.js";
import Planet from "../entity/planet.js";
import Spaceship from "../entity/spaceship.js";
import Interior from "../entity/interior.js";
import Bridge from "../entity/interactionElements/bridge.js";

class SpaceScene extends Scene {

    constructor() {
        super();
        this.interior = new Interior();
        this.spaceship = new Spaceship();
        this.kirby = new Kirby();
        this.planet1 = new Planet("assets/textures/interactionElements/planet.png", 1500, 200, 250);
        this.planet2 = new Planet("assets/textures/interactionElements/earth_planet.png", 400, 400, 200);
        this.addEntity(this.planet1);
        this.addEntity(this.planet2);
        this.addEntity(this.spaceship);
        this.addEntity(this.interior);
        this.addEntity(this.kirby);
        this.createBridge();
    }

    createBridge() {
        let parts = []
        for (let i = 0; i < 14; i++) {
            parts[i]  = new Bridge("assets/textures/interactionElements/bridge_wood.png", 540 + i * 23, 1000, () => {
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
                            pointA: {x: 10.5, y: 0},
                            bodyB: bodyB,
                            pointB: {x: -10.5, y: 0},
                            stiffness: 0.2,
                            damping: 0,
                            length: 2
                        }))
                    }

                    Matter.World.add(environment.engine.world, Matter.Constraint.create({
                        bodyB: parts[0].sprite.body,
                        pointA: {x: 520, y: 1165, length: 100, stiffness: 1},
                        pointB: {x: -10.5, y: 0},
                        stiffness: 1,
                        length: 2
                    }))
                    Matter.World.add(environment.engine.world, Matter.Constraint.create({
                        bodyB: parts[parts.length - 1].sprite.body,
                        pointA: {x: 860, y: 1165, length: 100, stiffness: 1},
                        pointB: {x: 10.5, y: 0},
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
            let posA = {x: 0, y: 0};
            if (constraint.bodyA) {
                posA = constraint.bodyA.position;
            }
            const offsetB = constraint.pointB;
            let posB = {x: 0, y: 0};
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