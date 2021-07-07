import Entity from "../../entity.js";
import {SimpleSprite} from "../../sprite.js";

export default class Collision extends Entity {

    constructor(x, y, width, height, angle, entity, callback) {
        super()
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.entity = entity;
        this.callback = callback;
    }

    createSprite() {
        let collision = this;
        return new class extends SimpleSprite {
            createBody() {
                return Matter.Bodies.rectangle(collision.x, collision.y, collision.width, collision.height, {
                    mass: 0.0001,
                    isStatic: true,
                    angle: collision.angle,
                    collisionFilter: {
                        'category': 0
                    }
                });
            }
        }()
    }


    afterTick() {
        super.afterTick();
        if (!this.sprite || !this.sprite.body) return
        let body = this.entity();
        if(!body) return;
        if (Matter.SAT.collides(body, this.sprite.body).collided) {
            if (!this.collided) {
                this.callback();
            }
            this.collided = true;
        }
    }
}