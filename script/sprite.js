export default class Sprite {

  constructor(animations) {
    this.animations = animations;
  }

  setAnimation(name) {
    this.currentAnimation = name
  }

  createBody(frame) {
    let body = Body.create(Common.extend({
      position: {
        x: 0,
        y: 0
      },
      vertices: frame.vertices
    }));
    body.vertices.forEach((vertex, index) => {
      let source = frame.vertices[index];
      vertex.u = source.u;
      vertex.v = source.v;
    })
    body.plugin.wrap = {
      min: {
        x: -windowWidth / 2,
        y: -windowHeight / 2
      },
      max: {
        x: windowWidth / 2,
        y: windowHeight / 2
      }
    }
    return body;
  }

  draw() {
    if (!this.isSelectedAnimationsAvailable()) {
      return;
    }
    this.ensureBodyAvailable();
    this.ensureOnlyCurrentBodyIsShown();

    this.drawVertices();
  }

  ensureOnlyCurrentBodyIsShown() {
    if (!this.body) {
      this.createBody(this.currentFrame);
    }
    // this.body.vertices = this.verticesMap.get(this.currentFrame);
    Body.setVertices(this.body, this.currentFrame.vertices);

    this.body.vertices.forEach((vertex, index) => {
      let source = this.currentFrame.vertices[index];
      vertex.u = source.u;
      vertex.v = source.v;
    })

  }

  isSelectedAnimationsAvailable() {
    if (!this.currentAnimation) {
      return true;
    }
    if (!this.animations[this.currentAnimation]) {
      return false;
    }

    if (!this.currentFrame) {
      return false;
    }

    return !!this.currentFrame.loadedTexture;
  }

  afterTick() {
    this.ensureSelectedAnimationsAvailable();
  }

  ensureSelectedAnimationsAvailable() {
    if (!this.currentAnimation) {
      return true;
    }
    if (!this.animations[this.currentAnimation]) {
      return false;
    }
    let targetFrame = this.animations[this.currentAnimation].frames[(Math.floor(frameCount / 5) % this.animations[this.currentAnimation].frames.length)];
    this.currentFrame = targetFrame;

    if (!targetFrame) {
      return false;
    }

    if (!targetFrame.startedLoading) {
      targetFrame.startedLoading = true;

      loadImage(targetFrame.texture, result => {
        targetFrame.loadedTexture = result.get(targetFrame.textureOffsetX, targetFrame.textureOffsetY, targetFrame.textureWidth, targetFrame.textureHeight);
      });
    }
    return !!targetFrame.loadedTexture;
  }

  ensureBodyAvailable() {
    if (!this.body) {
      console.log(this);
      this.body = this.createBody(this.currentFrame);
      World.add(environment.engine.world, this.body);

    }
  }

  drawVertices() {
    beginShape();
    if (this.currentAnimation) {
      texture(this.currentFrame.loadedTexture);
      textureMode(NORMAL)
    }

    this.body.vertices.forEach(bodyVertex => {
      if (this.currentAnimation) {
        vertex(bodyVertex.x, bodyVertex.y, bodyVertex.u, bodyVertex.v);
      } else {
        vertex(bodyVertex.x, bodyVertex.y);
      }
    });
    endShape(CLOSE);
  }
}

export class SimpleSprite {

  draw() {
    this.ensureSimpleBodyAvailable();
    this.drawVertices();
  }

  ensureSimpleBodyAvailable() {
    if (!this.body) {
      this.body = this.createBody();
    }
  }

  afterTick() {}

  createBody() {
    throw "Not implemented SimpleSprite#createBody"
  }

  drawVertices() {
    beginShape();

    this.body.vertices.forEach(bodyVertex => {
      vertex(bodyVertex.x, bodyVertex.y);
    });
    endShape(CLOSE);
  }


}