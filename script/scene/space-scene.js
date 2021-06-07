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

  draw() {
    super.draw()
    this.entities.forEach(entity => {
      entity.draw()
    });
  }


}


export default new SpaceScene()