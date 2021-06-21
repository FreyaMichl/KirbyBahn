import Entity from "../entity.js";
import Sprite from "../sprite.js";

export default class Kirby extends Entity {

    createSprite() {
        let kirbySprite = new Sprite(loadJSON("assets/sprites/kirby.json"));
        kirbySprite.setAnimation("idle")
        return kirbySprite;
    }


    afterTick() {
        super.afterTick();
        let right = keyIsDown(RIGHT_ARROW);
        if(right){
            Body.setVelocity(this.sprite.body,Vector.create(2, 0))
        }
        let left = keyIsDown(LEFT_ARROW);
        if(left){
            Body.setVelocity(this.sprite.body,Vector.create(-2, 0))
        }
        if(!this.sprite){
            return;
        }
        if(left || right){
            this.sprite.setAnimation('running')
        }else{
            this.sprite.setAnimation('idle')
        }
    }
}