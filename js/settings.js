const Sprite = require('./sprite');
const Weapon = require('./Weapon');
const config = require('./config.json');

let map = config.map;
let weaponSpawnSpeed = config.weaponSpawnSpeed;
let playerSpeed = config.playerSpeed;
let bulletSpeed = config.bulletSpeed;
let playerSettings = config.playerSettings;
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
                sprite: new Sprite(config.terra.block.file, config.terra.block.pos, config.terra.block.size)
            })
        }
        if (map[i][j] == 'X') {
            terra.push({
                pos: [j * 20, i * 20],
                sprite: new Sprite(config.terra.ground.file, config.terra.ground.pos, config.terra.ground.size)
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

let defaultWeapon = new Weapon(config.defaultWeapon.name, config.defaultWeapon.damage, config.defaultWeapon.speed, config.defaultWeapon.bulletCost, config.defaultWeapon.move, new Sprite(config.defaultWeapon.sprite.file, config.defaultWeapon.sprite.pos, config.defaultWeapon.sprite.size));

let weaponPack = [];
for (let i = 0; i < config.weaponPack.length; i++) {
    weaponPack.push(new Weapon(config.weaponPack[i].name, config.weaponPack[i].damage, config.weaponPack[i].speed, config.weaponPack[i].bulletCost, config.weaponPack[i].move, new Sprite(config.weaponPack[i].sprite.file, config.weaponPack[i].sprite.pos, config.weaponPack[i].sprite.size)));
}

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

module.exports = { playerSettings, music, map, boxCollides, defaultWeapon, weaponPack, terra, respawnPos, weaponPos, weaponSpawnSpeed, playerSpeed, bulletSpeed };
