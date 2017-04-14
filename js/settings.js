const Sprite = require('./sprite');
const Weapon = require('./Weapon');

let map = [
    '############################################################',
    '#..........................................................#',
    '#.............W..............................W.............#',
    '#.......XXXXXXXXXXXXXX................XXXXXXXXXXXXXX.......#',
    '#...0....................0........0....................0...#',
    '#..XXXXXX............XXXXXXX....XXXXXXX............XXXXXX..#',
    '#..........................................................#',
    '#.......0............0................0............0.......#',
    '#.....XXXXXX......XXXXXX............XXXXXX......XXXXXX.....#',
    '#..........................................................#',
    '#0..........................0..0..........................0#',
    '#XXX..........W...........XXX..XXX..........W...........XXX#',
    '#............XXXX..........................XXXX............#',
    '#0..........................0..0..........................0#',
    '#..........................................................#',
    '#..........................................................#',
    '#..........................................................#',
    '#.............W..............................W.............#',
    '#.......XXXXXXXXXXXXXX................XXXXXXXXXXXXXX.......#',
    '#...0....................0........0....................0...#',
    '#..XXXXXX............XXXXXXX....XXXXXXX............XXXXXX..#',
    '#..........................................................#',
    '#.......0............0................0............0.......#',
    '#.....XXXXXX......XXXXXX............XXXXXX......XXXXXX.....#',
    '#..........................................................#',
    '#0..........................0..0..........................0#',
    '#XXX..........W...........XXX..XXX..........W...........XXX#',
    '#............XXXX..........................XXXX............#',
    '#0..........................0..0..........................0#',
    '############################################################',
];

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
let terra = [];
let respawnPos = [];
let weaponPos = [];
let weaponSpawnSpeed = 2000;

let playerSpeed = 200;
let bulletSpeed = 500;
let music = new Audio('./sound/sound.mp3');
music.loop = true;

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

module.exports = { music, map, boxCollides, defaultWeapon, weaponPack, terra, respawnPos, weaponPos, weaponSpawnSpeed, playerSpeed, bulletSpeed };
