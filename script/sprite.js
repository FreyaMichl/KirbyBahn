export default class Sprite {

    constructor(animations, options) {
        this.animations = animations;
        this.options = options || {};
    }

    setAnimation(name) {
        let currentAnimation = this.animations[this.currentAnimationName];
        if (this.currentAnimationName && currentAnimation) {
            currentAnimation.playedFrames = 0;
        }
        this.currentAnimationName = name
    }

    createBody(animation) {

        let body = Bodies
            .fromVertices(
                200,
                200,
                this.animations[animation].vertices,
                Object.assign({}, {
                        frictionAir: 0,
                        plugin: {
                            wrap: {
                                min: {
                                    x: 0,
                                    y: 0
                                },
                                max: {
                                    x: environment.canvas.width,
                                    y: environment.canvas.height
                                }
                            }
                        }
                    },
                    this.options
                ),
                true
            );
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
        if (frame >= this.animations[this.currentAnimationName].frames.length && this.animations[this.currentAnimationName].nextAnimation) {
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


    drawVertices2(vertices) {
        beginShape();
        for (let i = 0; i < vertices.length; i++) {
            let bodyVertex = vertices[i];
            if (this.currentAnimationName) {
                vertex(bodyVertex.x, bodyVertex.y, bodyVertex.u, bodyVertex.v);
            } else {
                vertex(bodyVertex.x, bodyVertex.y);
            }
        }
        endShape(CLOSE);
    }


    drawVertices() {
        if (this.body.draw === false) {
            return
        }
        if (this.body.drawMode) {
            beginShape(this.body.drawMode);
        } else {
            beginShape();
        }
        if (this.currentAnimationName) {
            smooth()
            texture(this.currentFrame.loadedTexture);
            textureMode(NORMAL)
        }

        noStroke();
        if (this.body.parts && this.body.parts.length > 1) {
            for (let p = 1; p < this.body.parts.length; p++) {
                this.drawVertices2(this.body.parts[p].vertices)
            }
        } else {
            this.drawVertices2(this.body.vertices);
        }
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