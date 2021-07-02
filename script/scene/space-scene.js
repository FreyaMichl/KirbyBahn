import Scene from "../scene.js";
import Kirby from "../entity/kirby.js";
import Planet from "../entity/planet.js";
import Spaceship from "../entity/spaceship.js";

class SpaceScene extends Scene {

    constructor() {
        super();
        this.spaceship = new Spaceship();
        this.kirby = new Kirby();
        this.planet1 = new Planet("assets/textures/planet.png", 1500, 200, 250);
        this.planet2 = new Planet("assets/textures/erdePlanet.png", 400, 400, 200);
        this.addEntity(this.planet1);
        this.addEntity(this.planet2);
        this.addEntity(this.spaceship);
        this.addEntity(this.kirby);
    }

    afterTick() {
        super.afterTick();
        let sprite = this.kirby.sprite;
        if (!sprite) return;
        let body = sprite.body;
        if (!body) return;
        let page = Math.floor((body.position.y + 60) / windowHeight);
        if (keyIsDown(38)) {
            if (Matter.SAT.collides(this.planet1.sprite.body, body).collided) {
                Body.applyForce(body, body.position, Vector.mult(Vector.normalise(Vector.sub(this.planet2.sprite.body.position, body.position)), 0.1))
            }
            if (Matter.SAT.collides(this.planet2.sprite.body, body).collided) {
                Body.applyForce(body, body.position, Vector.mult(Vector.normalise(Vector.sub(Vector.add(this.spaceship.sprite.body.position, Vector.create(300, 0)), body.position)), 0.1))
            }
        }
        body.angle = 0;
        environment.scrollToPage(page);
    }


    preload() {
        this.background = loadImage("assets/textures/background.png",
            result => {
                console.log(this.background.width);
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
    }


}


export default new SpaceScene()