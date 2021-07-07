import Entity from "../entity.js";
import Sprite from "../sprite.js";
import environment from "../environment.js";

export default class Spaceship extends Entity {


    constructor(direction, offsetX, offsetY) {
        super()
        this.direction = direction;
        this.offsetX = offsetX
        this.offsetY = offsetY
    }

    createSprite() {
        let parent = this;
        let sprite = new class extends Sprite {

            createBody(animation) {
                let body = super.createBody(animation);
                Body.setPosition(body, Vector.create(900 + parent.offsetX, 3200 + parent.offsetY));
                return body;
            }
        }(loadJSON("assets/sprites/spaceship_outline_"+this.direction+".json"), {
            isStatic: true,
            mass: 0.01,
            draw: false
        });
        sprite.setAnimation("idle")
        return sprite;
    }

    draw() {
        super.draw();
    }

}