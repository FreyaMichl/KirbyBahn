//this class is for all entities it contains all the needed functions to generate one
export default class Entity {

  draw() {
    this.ensureSpriteExists();
    this.sprite.draw()
  }

  ensureSpriteExists() {
    if (!this.sprite) {
      this.sprite = this.createSprite();
    }
  }

  preload() {}

  afterTick() {
    if (!this.sprite) {
      return;
    }
    this.sprite.afterTick();
  }

  createSprite() {
    throw "not implemented Entity#createSprite"
  }



}