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
import Collision from "../entity/interactionElements/collision.js";
import Portal from "../entity/interactionElements/portal.js";
import environment from "../environment.js";

class SpaceScene extends Scene {

    constructor() {
        super();
        this.tomato1 = new Tomato("assets/textures/interactionElements/tomato.png", 530, 2830);
        this.tomato2 = new Tomato("assets/textures/interactionElements/tomato.png", 750, 2855);
        this.treelittle = new Tree("assets/textures/interactionElements/tree_little.png", 1390, 3460, 33 * 3, 60 * 3)
        this.treemiddle = new Tree("assets/textures/interactionElements/tree_middle.png", 1310, 3435, 44 * 3, 77 * 3)
        this.treebig = new Tree("assets/textures/interactionElements/tree_big.png", 1200, 3410, 53 * 3, 94 * 3)
        this.interior = new Interior();
        this.spaceshipLeft = new Spaceship("left", -415, 178);
        this.spaceshipRight = new Spaceship("right", 380, 110);
        this.kirby = new Kirby();
        this.planet1 = new Planet("assets/textures/interactionElements/planet.png", 1500, 400, 250);
        this.planet2 = new Planet("assets/textures/interactionElements/earth_planet.png", 300, 700, 200);
        this.magnet = new Magnet();
        this.crystal1Left = new Crystal("one_left", 0);
        this.crystal1Right = new Crystal("one_right", 60);
        this.crystal2Left = new Crystal("two_left", 120);
        this.crystal2Right = new Crystal("two_right", 200);
        this.portal = new Portal("assets/textures/interactionElements/portal.png", 890, 5200)
        this.entryCollision = new Collision(600, 1630, 300, 20, -0.628319,
            () => this.kirby.sprite.body,
            () => {
                this.planet1.sprite.body.mass = 0.00000000000001
                this.planet2.sprite.body.mass = 0.00000000000001
                environment.engine.world.gravity.scale = 0.00016
                this.kirby.setJumpControl("right-down")
                this.kirby.sprite.body.friction = 0

            });
        this.magnetCollision = new Collision(1075 - 10 - 5 - 10, 2000, 550 - 20 - 10 - 20, 300, 0, () => this.kirby.sprite.body, () => {
            this.magnet.awaitKirby();
        })
        this.cafeteriaEnterCollision = new Collision(400 , 2500, 150, 50, 0, () => this.kirby.sprite.body, () => {
            this.kirby.setJumpControl("right-down")
        })
        this.magnetStopCollision = new Collision(1390 + 15, 2000, 90, 300, 0, () => this.kirby.sprite.body, () => {
            this.magnet.dropKirby();
            this.kirby.setJumpControl("left-down")
        })
        this.treeCollision = new Collision(1410, 3250, 120, 100, 0, () => this.kirby.sprite.body, () => {
            this.kirby.setJumpControl("left-up")
        })
        this.addEntity(this.planet1);
        this.addEntity(this.planet2);
        this.addEntity(this.spaceshipLeft);
        this.addEntity(this.spaceshipRight);
        this.addEntity(this.interior);
        this.addEntity(this.kirby);
        this.addEntity(this.tomato1);
        this.addEntity(this.tomato2);
        this.addEntity(this.treelittle);
        this.addEntity(this.treebig);
        this.addEntity(this.treemiddle);
        this.addEntity(this.magnet);
        this.addEntity(this.crystal1Left);
        this.addEntity(this.crystal1Right);
        this.addEntity(this.crystal2Left);
        this.addEntity(this.crystal2Right);
        this.addEntity(this.entryCollision);
        this.addEntity(this.portal);
        this.addEntity(this.magnetCollision);
        this.addEntity(this.magnetStopCollision);
        this.addEntity(this.cafeteriaEnterCollision);
        this.addEntity(this.treeCollision);
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
                            restitution: 0,
                            stiffness: 0.22,
                            damping: 1,
                            length: 2
                        }))
                    }

                    Matter.World.add(environment.engine.world, Matter.Constraint.create({
                        bodyB: parts[0].sprite.body,
                        pointA: {
                            x: 320,
                            y: 2230,
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
                Body.applyForce(body, body.position, Vector.mult(Vector.normalise(Vector.sub(this.planet2.sprite.body.position, body.position)), 0.01))
            }
            if (Matter.SAT.collides(this.planet2.sprite.body, body).collided) {
                Body.applyForce(body, body.position, Vector.mult(Vector.normalise(Vector.sub(Vector.add(this.spaceshipLeft.sprite.body.position, Vector.create(300, 0)), body.position)), 0.02))
            }
        }
        if (body.velocity.y < 0) {
            this.entryCollision.sprite.body.collisionFilter.category = 1
        } else {
            this.entryCollision.sprite.body.collisionFilter.category = 0
        }
        environment.scrollToPage(page);

    }


    preload() {
        this.background = loadImage("assets/textures/background.png",
            result => {
                this.background.resize(this.background.width, this.background.height);
            });
        this.actualOutline = loadImage("assets/textures/spaceship/spaceship_outline-2.png")
        this.entities.forEach(entity => entity.preload())
    }

    draw() {
        environment.canvas.getTexture(this.background).setInterpolation(NEAREST, NEAREST)
        environment.canvas.getTexture(this.actualOutline).setInterpolation(NEAREST, NEAREST)

        image(this.background, 0, 0);

        if (this.spaceshipLeft.sprite && this.spaceshipLeft.sprite.body) {
            let width = 648 * 2;
            let height = 1841 * 2;
            image(this.actualOutline, this.spaceshipLeft.sprite.body.position.x - width / 2 + 423, this.spaceshipLeft.sprite.body.position.y - height / 2 - 165, width, height)
        }

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