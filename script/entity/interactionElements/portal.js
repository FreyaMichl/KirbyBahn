import Entity from "../../entity.js";
import {
    SimpleSprite
} from "../../sprite.js";
import environment from "../../environment.js";

class PortalSprite extends SimpleSprite {
    constructor(texture, x, y) {
        super(texture)
        this.x = x
        this.y = y
    }

    createBody() {
        let body = Bodies.rectangle(
            this.x,
            this.y,
            350,
            160, {
                isStatic: true,
                mass: 10,
                restitution: 0.7,
                collisionFilter: {
                    category: 0
                }
            });
        return body;
    }

    draw() {
        super.draw();
    }
}

export default class Portal extends Entity {

    constructor(texture, x, y) {
        super();
        this.texture = texture;
        this.x = x;
        this.y = y;
    }

    createSprite() {
        return new PortalSprite(this.texture, this.x, this.y);
    }


    afterTick() {
        super.afterTick();
        if (this?.sprite?.body && environment.scene?.kirby?.sprite?.body) {
            if (Matter.SAT.collides(environment.scene.kirby.sprite.body, this.sprite.body).collided && !this.collided) {
                this.collided = true;
                World.add(environment.engine.world, Matter.Constraint.create({
                    bodyA: environment.scene.kirby.sprite.body,
                    pointB: {
                        x: this.sprite.body.position.x,
                        y: this.sprite.body.position.y
                    },
                    stiffness: 0.1
                }))
            }
        }

    }
}