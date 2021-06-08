import Scene from "../scene.js";
import Kirby from "../entity/kirby.js";
import Planet from "../entity/planet.js";
import Spaceship from "../entity/spaceship.js";

class SpaceScene extends Scene {

  constructor() {
    super();
    this.spaceship = new Spaceship();
    this.planet = new Planet();
    this.kirby = new Kirby();
    this.addEntity(this.planet);
    this.addEntity(this.kirby);
    this.addEntity(this.spaceship);
  }

  preload() {
    this.background = loadImage("assets/textures/background.png",
      result => {
        console.log(this.background.width);
        this.background.resize(this.background.width, this.background.height);
      });
  }
  draw() {
    image(this.background, -windowWidth / 2, -windowHeight / 2);
    super.draw()
    this.entities.forEach(entity => {
      entity.draw()
    });
  }


}


export default new SpaceScene()