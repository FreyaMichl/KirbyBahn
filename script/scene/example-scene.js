import Scene from "../scene.js";
import Kirby from "../entity/kirby.js";

class ExampleScene extends Scene {

  constructor() {
    super();
    this.kirby = new Kirby();
    this.addEntity(this.kirby);
  }

  draw() {
    super.draw()
    this.entities.forEach(entity => {
      entity.draw()
    });
  }


}

export default new ExampleScene()