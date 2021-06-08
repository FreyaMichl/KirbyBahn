import environment from "./environment.js";

export default class Scene {

  constructor() {
    this.entities = [];
    this.shown = false;
  }

  draw() {
    this.open();
  }

  afterTick() {
    this.entities.forEach(entity => {
      entity.afterTick();
    });
  }

  preload() {}

  open() {
    if (this.shown) {
      return;
    }
    this.shown = true;
    this.entities.forEach((item, i) => {
      item.ensureSpriteExists();
      if (item.sprite.ensureSimpleBodyAvailable) {
        item.sprite.ensureSimpleBodyAvailable();
      }
      if (item.sprite.body) {
        World.add(environment.engine.world, item.sprite.body);
      }
    });

  }

  close() {
    if (!this.shown) {
      return;
    }
    this.shown = false;
    this.entities.forEach(entity => {
      World.removeEntity(this.engine.world, entity);
    });
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  removeEntity(entity) {
    this.entities.remove(entity);
  }
}