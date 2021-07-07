class Environment {

  engine;

  draw() {
    translate(-this.canvas.width / 2, -this.canvas.height / 2);
    clear()
    if (!this.scene) {
      return;
    }
    this.scene.draw()
  }

  setup() {
    Matter.use('matter-wrap');
    Matter.use('matter-attractors');
    this.canvas = createCanvas(windowWidth, windowHeight * 6, WEBGL);
    this.engine = Engine.create();
    this.engine.world.gravity.scale = 0.0000//4
    Matter.Runner.run(this.engine);
    Events.on(this.engine, "afterUpdate", this.afterTick)
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

  scrollToPage(page) {
    let element = $("body");
    if (element.is(':animated')) return;
    element.animate({
      scrollTop: windowHeight * page
    }, 800);
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