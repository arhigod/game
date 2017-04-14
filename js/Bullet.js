const settings = require('./settings');

class Bullet {
    constructor(id, pos, dir, moveDirection, sprite, damage) {
        this.id = id;
        this.pos = pos;
        this.direction = dir;
        this.moveDirection = moveDirection;
        this.sprite = sprite;
        this.damage = damage;
    }
    update(dt) {
        this.pos[0] += (settings.bulletSpeed * dt) * this.moveDirection[0];
        this.pos[1] += (settings.bulletSpeed * dt) * this.moveDirection[1];
    }
}

module.exports = Bullet;
