const Sprite = require('./sprite');

class Weapon {
    constructor(name, damage, speed, bulletCost, move, sprite) {
        this.name = name;
        this.sprite = sprite;
        this.damage = damage;
        this.move = move;
        this.speed = speed;
        this.bulletCost = bulletCost;
    }
}

module.exports = Weapon;
