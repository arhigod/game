const Sprite = require('./sprite');
const Weapon = require('./Weapon');
const config = JSON.parse(JSON.stringify(require('./config.json')));

let map = config.map;
let weaponSpawnSpeed = config.weaponSpawnSpeed;
let playerSpeed = config.playerSpeed;
let bulletSpeed = config.bulletSpeed;
let music = new Audio(config.music);
music.loop = true;

let terra = [];
let respawnPos = [];
let weaponPos = [];

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] == '#') {
            terra.push({
                pos: [j * 20, i * 20],
                sprite: new Sprite('img/spritesheetmini.jpg', [40, 0], [20, 20])
            })
        }
        if (map[i][j] == 'X') {
            terra.push({
                pos: [j * 20, i * 20],
                sprite: new Sprite('img/spritesheetmini.jpg', [0, 0], [20, 20])
            })
        }
        if (map[i][j] == '0') {
            respawnPos.push([]);
            respawnPos[respawnPos.length - 1] = [j * 20, i * 20 - 25];
        }
        if (map[i][j] == 'W') {
            weaponPos.push([]);
            weaponPos[weaponPos.length - 1] = [j * 20, i * 20];
        }
    }
}

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

module.exports = { music, map, boxCollides, defaultWeapon, weaponPack, terra, respawnPos, weaponPos, weaponSpawnSpeed, playerSpeed, bulletSpeed };
