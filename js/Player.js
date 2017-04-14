const Sprite = require('./sprite');
const settings = require('./settings');
const game = require('./game');
const Bullet = require('./Bullet');

class Player {
    constructor(id, controls, skin) {
        this.id = id;
        this.controls = controls;
        this.skin = skin || 'img/player1.png';
        this.sprite = new Sprite(this.skin, [57, 62], [31, 38]);
        this.pos = this.id === 0 ? [0, 0] : [2000, 0];
        this.direction = this.id === 0 ? 'right' : 'left';
        this.lastFire = Date.now();
        this.jumpCount = 0;
        this.health = 100;
        this.healthBar = { sprite: new Sprite('img/hp.png', [0, 400], [40, 4]), pos: this.pos };
        this.score = 0;
        this.scoreBar1 = { sprite: new Sprite('img/numbers.png', [50 + (60 * this.score), 50], [60, 90]), pos: [460 + (this.id * 152), 22] };
        this.scoreBar2 = { sprite: new Sprite('img/numbers.png', [50 + (60 * this.score), 50], [60, 90]), pos: [512 + (this.id * 152), 22] };
        this.event = 0;
        this.weapon = settings.defaultWeapon;
        this.bullets = 100;
        this.ammoBar = { sprite: new Sprite('img/ammo.png', [0, 400], [20, 4]), pos: [this.pos[0], this.pos[1] - 10] };
        this.weaponBar = { sprite: this.weapon.sprite, pos: [this.pos[0] + 23, this.pos[1] - 18], weaponBar: true };
    }
    changeskin(skin) {
        this.skin = skin;
        this.sprite = new Sprite(this.skin, [57, 62], [31, 38]);
    }
    actions(dt) {
        this.sprite = new Sprite(this.skin, [57, 62], [31, 38]);
        if (input.isDown(this.controls.left)) this.actionLeft(dt);
        if (input.isDown(this.controls.right)) this.actionRight(dt);
        if (input.isDown(this.controls.up)) this.actionUp();
        if (this.jumpCount > 0) this.sprite = new Sprite(this.skin, [119 + (this.skin == 'img/player2.png' ? 8 : 0), 176], [31, 38]);
        if (input.isDown(this.controls.shoot) && Date.now() - this.lastFire > this.weapon.speed) this.actionShoot();
    }
    actionLeft(dt) {
        this.pos[0] -= settings.playerSpeed * dt;
        this.direction = 'left';
        this.sprite = new Sprite(this.skin, [57 + 31 * Math.floor((this.event++ % 18) / 3), 100], [31, 38]);
    }
    actionRight(dt) {
        this.pos[0] += settings.playerSpeed * dt;
        this.direction = 'right';
        this.sprite = new Sprite(this.skin, [57 + 31 * Math.floor((this.event++ % 18) / 3), 100], [31, 38]);
    }
    actionUp() {
        for (let i = 0; i < settings.terra.length; i++) {
            if (settings.boxCollides([settings.terra[i].pos[0] + 2, settings.terra[i].pos[1]], [16, 1], [this.pos[0], this.pos[1] + this.sprite.size[1]], [this.sprite.size[0], 1])) {
                this.jumpCount = 25;
            }
        }
    }
    actionShoot() {
        if (game.isSound) {
            var audio = new Audio('./sound/' + this.weapon.name + this.id + '.mp3');
            audio.play();
        }
        let [x, y] = [this.pos[0] + this.sprite.size[0] / 2, this.pos[1] + this.sprite.size[1] / 2 - 8];
        this.weapon.move.forEach(move => {
            let moveDirection = [this.direction == 'right' ? move[0] : -1 * move[0], move[1]];
            game.bullets.push(new Bullet(this.id, [x, y], this.direction, moveDirection, new Sprite('img/sprites.png', [0, 39], [18, 8]), this.weapon.damage));
        });
        this.lastFire = Date.now();
        this.bullets -= this.weapon.bulletCost;
        if (this.bullets <= 0) {
            this.weapon = settings.defaultWeapon;
            this.weaponBar.sprite = this.weapon.sprite;
            this.bullets = 100;
        }
        this.ammoBar = { sprite: new Sprite('img/ammo.png', [0, this.bullets * 4], [20, 4]), pos: [this.pos[0], this.pos[1] - 10] };
    }
}

module.exports = Player;
