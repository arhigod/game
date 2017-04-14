const Sprite = require('./sprite');
const Weapon = require('./Weapon');


let players = [];

let defaultWeapon = new Weapon('pistol', 10, 300, 0, [
    [1, 0]
], new Sprite('img/weapons.png', [0, 0], [33, 15]));
let weaponPack = [
    new Weapon('ak47', 5, 100, 3, [
        [1, 0]
    ], new Sprite('img/weapons.png', [35, 0], [33, 15])),
    new Weapon('shotgun', 10, 400, 10, [
        [0.8, 0.2],
        [0.9, 0.1],
        [1, 0],
        [0.9, -0.1],
        [0.8, -0.2]
    ], new Sprite('img/weapons.png', [70, 70], [33, 15])),
    new Weapon('rpg', 50, 600, 12, [
        [1, 0]
    ], new Sprite('img/weapons.png', [152, 21], [51, 17]))
];
let bullets = [];
let explosions = [];
let terra = [];
let weapons = [];
let respawnPos = [];
let weaponPos = [];
let weaponSpawnSpeed = 2000;
let lastWeaponSpawnTime = Date.now();

let isPause = false;
let isSound = true;
let terrainPattern;

// Speed in pixels per second
let playerSpeed = 200;
let bulletSpeed = 500;

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
        b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
        pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1],
        pos2[0] + size2[0], pos2[1] + size2[1]);
}

module.exports = { boxCollides,players, defaultWeapon, weaponPack, bullets, explosions, terra, weapons, respawnPos, weaponPos, weaponSpawnSpeed, lastWeaponSpawnTime, isPause, isSound, terrainPattern, playerSpeed, bulletSpeed };
