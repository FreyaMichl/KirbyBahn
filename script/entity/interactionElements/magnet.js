import Entity from "../../entity.js";
import {
    SimpleSprite
} from "../../sprite.js";


export default class Magnet extends Entity {

    createSprite() {
        return new class extends SimpleSprite {
            createBody() {
                return Bodies.rectangle(1100, 1870, 32 * 2, 22 * 2, {
                    inertia: Infinity,
                    gravityScale: 0,
                    mass: 0.000001,
                    movementScale: {
                        x: 1,
                        y: 0
                    }
                })

            }
        }("assets/textures/interactionElements/magnet.png")
    }

    afterTick() {
        if (this.sprite && this.sprite.body) {
            Matter.Body.setPosition(this.sprite.body, Vector.create(835 + (Math.sin(Date.now() / 1000) + 1) * 0.5 * 580, 1890))
        }
    }
}