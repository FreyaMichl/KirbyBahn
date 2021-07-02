import Entity from "../entity.js";
import Sprite from "../sprite.js";
import environment from "../environment.js";
import {Input, MovementController} from "./movement.js";

class KirbyMovementController extends MovementController {
    constructor(kirby) {
        super();
        this.kirby = kirby;

        this.lastDirection = Input.RIGHT;
        let right = this.pressed(Input.RIGHT)
        let left = this.pressed(Input.LEFT);
        let down = this.pressed(Input.DOWN);
        let up = this.pressed(Input.UP);

        let rollRight = this.and(down, right);
        let rollLeft = this.and(down, left);

        let walkRight = this.and(this.not(rollRight), right)
        let walkLeft = this.and(this.not(rollLeft), left)

        let idle = this.and(
            this.and(
                this.not(walkRight),
                this.not(walkLeft)
            ),
            this.and(
                this.not(rollRight),
                this.not(rollLeft)
            ),
            this.and(
                this.not(down)
            )
        );

        this.registerInputCombination(
            right,
            () => this.lastDirection = Input.RIGHT
        )

        this.registerInputCombination(
            left,
            () => this.lastDirection = Input.LEFT
        )

        this.registerInputCombination(
            rollRight,
            () => this.kirby.sprite.setAnimation("roll-entry-right")
        )
        this.registerInputCombination(
            rollLeft,
            () => this.kirby.sprite.setAnimation("roll-entry-left")
        )

        this.registerInputCombination(
            walkRight,
            () => this.kirby.sprite.setAnimation("run-right")
        )

        this.registerInputCombination(
            walkLeft,
            () => this.kirby.sprite.setAnimation("run-left")
        )

        this.registerInputCombination(
            idle,
            () => {
                switch (this.lastDirection) {
                    case Input.RIGHT:
                        this.kirby.sprite.setAnimation("roll-right")
                        break
                    case Input.LEFT:
                        this.kirby.sprite.setAnimation("roll-left")
                        break
                }
            }
        )
    }


    pressed(input) {
        return inputs => inputs.get(input)
    }

    or(func1, func2) {
        return inputs => func1(inputs) || func2(inputs)
    }

    and(func1, func2) {
        return inputs => func1(inputs) && func2(inputs)
    }

    not(func) {
        return inputs => !func(inputs)
    }

}

export default class Kirby extends Entity {

    constructor() {
        super();
        this.movementController = new KirbyMovementController(this)
    }

    createSprite() {
        let kirbySprite = new class extends Sprite {
            createBody(animation) {
                let body = super.createBody(animation);
                body.plugin.attractors = [
                    function (bodyA, bodyB) {
                        if (!bodyB.isParticle) {
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
        }(loadJSON("assets/sprites/kirby.json"), {position: {x: 1200, y: 200}, restitution: 0.8});
        kirbySprite.setAnimation("idle-right")
        return kirbySprite;
    }


    afterTick() {
        super.afterTick();
        let onGround = false;
        environment.scene.entities.forEach(entity => {
            if (entity.sprite && entity.sprite.body && this.sprite && this.sprite.body) {
                if (entity.sprite.body !== this.sprite.body && Matter.SAT.collides(entity.sprite.body, this.sprite.body).collided) {
                    onGround = true;
                }
            }
        });

        if (!this.sprite) {
            return;
        }
        if (this.movementController) {
            this.movementController.updateInputs();
        }
    }

    calculateForce(bodyB) {
        let result = Vector.create(0, 0);
        if (!bodyB) return result;
        let bodyA = this.sprite.body;
        if (!bodyA) return result;

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
            result.x += force.x;
            result.y += force.y;
            // Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
            // Body.applyForce(bodyB, bodyB.position, force);
        }
        return result;
    }
}