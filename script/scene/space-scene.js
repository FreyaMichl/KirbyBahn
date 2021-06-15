import Scene from "../scene.js";
import Kirby from "../entity/kirby.js";
import Planet from "../entity/planet.js";
import Spaceship from "../entity/spaceship.js";

class SpaceScene extends Scene {

  constructor() {
    super();
    // this.spaceship = new Spaceship();
    this.kirby = new Kirby();
    this.addEntity(new Planet("assets/textures/planet.png", 1500, 600, 250));
    this.addEntity(new Planet("assets/textures/erdePlanet.png", 300, 250, 200));
    this.addEntity(this.kirby);
    // this.addEntity(this.spaceship);
  }

  afterTick() {
    super.afterTick();
    let sprite = this.kirby.sprite;
    if (!sprite) return;
    let body = sprite.body;
    if (!body) return;
    let page = Math.floor((body.position.y + 60) / windowHeight);
    environment.scrollToPage(page);
  }


  preload() {
    this.background = loadImage("assets/textures/background.png",
      result => {
        console.log(this.background.width);
        this.background.resize(this.background.width, this.background.height);
      });
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