class Environment {

  engine;

  draw() {
    clear()
    if (!this.scene) {
      return;
    }
    this.scene.draw()
  }

  setup() {
    Matter.use('matter-wrap');
    Matter.use('matter-attractors');

    this.canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    this.engine = Engine.create();
    this.engine.world.gravity.scale = 0.00004
    Engine.run(this.engine);
    Events.on(this.engine, "afterTick", this.afterTick)
  }

  afterTick() {
    if (!environment.scene) {
      return;
    }
    environment.scene.afterTick();
  }

  preload() {
    if (!environment.scene) {
      return;
    }
    environment.scene.preload();
  }

  openScene(scene) {
    if (this.scene) {
      this.scene.close();
    }
    this.scene = scene;
  }
}

globalThis.environment = new Environment()

export default globalThis.environment

//Bootstrap p5js global functions

globalThis.preload = () => {
  environment.preload();
};

globalThis.draw = () => {
  environment.draw();
};

globalThis.setup = () => {
  environment.setup();
};