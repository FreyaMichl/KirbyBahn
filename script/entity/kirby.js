import Entity from "../entity.js";
import Sprite from "../sprite.js";
import environment from "../environment.js";

export default class Kirby extends Entity {

    createSprite() {
        let kirbySprite = new Sprite(loadJSON("assets/sprites/kirby.json"));
        kirbySprite.setAnimation("idle")

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

        let right = keyIsDown(RIGHT_ARROW) && onGround;
        if (right) {
            Body.applyForce(this.sprite.body, this.sprite.body.position, Vector.rotate(Vector.create(0.006, 0), this.sprite.body.angle))
        }
        let left = keyIsDown(LEFT_ARROW) && onGround;
        if (left) {
            Body.applyForce(this.sprite.body, this.sprite.body.position, Vector.rotate(Vector.create(-0.006, 0), this.sprite.body.angle))
        }
        if (!this.sprite) {
            return;
        }
        // if (left || right) {
        // this.sprite.setAnimation('running')
        // } else {
        this.sprite.setAnimation('idle')
        // }
        let force = Vector.create(0, 0);
        environment.scene.entities.forEach(entity => {
            if (entity.sprite.body !== this.sprite.body) {
                Vector.add(this.calculateForce(entity.sprite.body), force, force);
            }
        })
        if (this.sprite && this.sprite.body) {
            Body.setAngle(this.sprite.body, 2*Vector.angle(Vector.normalise(force), Vector.create(0, -1)))
            // this.sprite.body.angle = (Math.PI)+;
        }
    }

    calculateForce(bodyB) {
        let result = {x: 0, y: 0};
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