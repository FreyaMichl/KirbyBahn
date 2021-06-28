export default class Sprite {

    constructor(animations) {
        this.animations = animations;
    }

    setAnimation(name) {
        let currentAnimation = this.animations[this.currentAnimationName];
        if(this.currentAnimationName && currentAnimation){
            currentAnimation.playedFrames = 0;
        }
        this.currentAnimationName = name
    }

    createBody(animation) {
        let body = Body.create(Common.extend({
            position: {
                x: 600,
                y: 200
            },
            vertices: this.animations[animation].vertices
        }));
        body.plugin.wrap = {
            min: {
                x: 0,
                y: 0
            },
            max: {
                x: environment.canvas.width,
                y: environment.canvas.height
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
            this.createBody(this.currentAnimationName);
        }

        this.body.vertices.forEach((vertex, index) => {
            let source = this.animations[this.currentAnimationName].vertices[index];
            vertex.u = source.u;
            vertex.v = source.v;
        })

    }

    isSelectedAnimationsAvailable() {
        if (!this.currentAnimationName) {
            return true;
        }
        if (!this.animations[this.currentAnimationName]) {
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
        if (!this.currentAnimationName) {
            return true;
        }
        let currentAnimation = this.animations[this.currentAnimationName]
        if (!currentAnimation) {
            return false;
        }
        if (!currentAnimation.playedFrames) {
            currentAnimation.playedFrames = 0;
        }
        currentAnimation.playedFrames++;

        let frame = Math.floor(currentAnimation.playedFrames / 5);
        if(frame >= this.animations[this.currentAnimationName].frames.length && this.animations[this.currentAnimationName].nextAnimation){
          this.setAnimation(this.animations[this.currentAnimationName].nextAnimation);
          return this.ensureSelectedAnimationsAvailable();
        }
        let targetFrame = currentAnimation.frames[(frame % currentAnimation.frames.length)];
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
            this.body = this.createBody(this.currentAnimationName);
            World.add(environment.engine.world, this.body);

        }
    }

    drawVertices() {
        beginShape();
        if (this.currentAnimationName) {
            texture(this.currentFrame.loadedTexture);
            textureMode(NORMAL)
        }

        this.body.vertices.forEach(bodyVertex => {
            if (this.currentAnimationName) {
                vertex(bodyVertex.x, bodyVertex.y, bodyVertex.u, bodyVertex.v);
            } else {
                vertex(bodyVertex.x, bodyVertex.y);
            }
        });
        endShape(CLOSE);
    }
}

export class SimpleSprite {
    constructor(texture) {
        if (!texture) return;
        loadImage(texture, finalTexture => {
            this.texture = finalTexture;
        })
    }

    draw() {
        this.ensureSimpleBodyAvailable();
        this.drawVertices();
    }

    ensureSimpleBodyAvailable() {
        if (!this.body) {
            this.body = this.createBody();
        }
    }

    afterTick() {
    }

    createBody() {
        throw "Not implemented SimpleSprite#createBody"
    }

    drawVertices() {
        beginShape();
        if (!this.texture) {
            this.body.vertices.forEach(bodyVertex => {
                vertex(bodyVertex.x, bodyVertex.y);
            });
        } else {
            texture(this.texture);
            textureMode(NORMAL)

            let max = this.body.bounds.max;
            let min = this.body.bounds.min;

            let bodyWidth = max.x - min.x;
            let bodyHeight = max.y - min.y;

            this.body.vertices.forEach(bodyVertex => {
                let u = (bodyVertex.x - min.x) / bodyWidth
                let v = (bodyVertex.y - min.y) / bodyHeight
                vertex(bodyVertex.x, bodyVertex.y, u, v);
            });
        }

        endShape(CLOSE);
    }


}