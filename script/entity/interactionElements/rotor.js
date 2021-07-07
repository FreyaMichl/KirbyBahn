import Entity from "../../entity.js";
import {
    SimpleSprite
} from "../../sprite.js";


export default class Portal extends Entity {

    constructor(texture, x, y) {
        super();
        this.texture = texture;
        this.x = x;
        this.y = y;
    }

    createSprite() {
        return new class extends SimpleSprite{

            createBody() {
                let body = Bodies.rectangle(100, 100, )
            }
        }(this.texture, this.x, this.y);
    }


    afterTick() {

    }
}