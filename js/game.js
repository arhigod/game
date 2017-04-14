const Sprite = require('./sprite');
const Weapon = require('./Weapon');

let players = [];

let bullets = [];
let explosions = [];
let weapons = [];
let lastWeaponSpawnTime = Date.now();

let isPause = false;
let isSound = true;
let isMusic = true;
let terrainPattern;

module.exports = { players, bullets, explosions, weapons, lastWeaponSpawnTime, isPause, isSound, isMusic, terrainPattern };
