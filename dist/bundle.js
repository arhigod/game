/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Sprite {
    constructor(url, pos, size, speed, frames, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
    }
    update(dt) {
        this._index += this.speed * dt;
    }
    render(ctx) {
        var frame;

        if (this.speed > 0) {
            var max = this.frames.length;
            var idx = Math.floor(this._index);
            frame = this.frames[idx % max];

            if (this.once && idx >= max) {
                this.done = true;
                return;
            }
        } else {
            frame = 0;
        }


        var x = this.pos[0];
        var y = this.pos[1];

        if (this.dir == 'vertical') {
            y += frame * this.size[1];
        } else {
            x += frame * this.size[0];
        }

        ctx.drawImage(resources.get(this.url),
            x, y,
            this.size[0], this.size[1],
            0, 0,
            this.size[0], this.size[1]);
    }
}

module.exports = Sprite;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Sprite = __webpack_require__(0);

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Sprite = __webpack_require__(0);
const Weapon = __webpack_require__(1);


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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const settings = __webpack_require__(2);

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Sprite = __webpack_require__(0);
const Weapon = __webpack_require__(1);
const settings = __webpack_require__(2);
const Bullet = __webpack_require__(3);

class Player {
    constructor(id, controls, skin) {
        this.id = id;
        this.controls = controls;
        this.skin = skin;
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
        if (settings.isSound) {
            var audio = new Audio('./sound/' + this.weapon.name + this.id + '.mp3');
            audio.play();
        }
        let [x, y] = [this.pos[0] + this.sprite.size[0] / 2, this.pos[1] + this.sprite.size[1] / 2 - 8];
        this.weapon.move.forEach(move => {
            let moveDirection = [this.direction == 'right' ? move[0] : -1 * move[0], move[1]];
            settings.bullets.push(new Bullet(this.id, [x, y], this.direction, moveDirection, new Sprite('img/sprites.png', [0, 39], [18, 8]), this.weapon.damage));
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


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var pressedKeys = {};

function setKey(event, status) {
    var code = event.keyCode;
    var key;

    switch (code) {
        case 16:
            key = 'SHIFT';
            break;
        case 17:
            key = 'CTRL';
            break;
        case 27:
            key = 'ESC';
            break;
        case 32:
            key = 'SPACE';
            break;
        case 37:
            key = 'LEFT';
            break;
        case 38:
            key = 'UP';
            break;
        case 39:
            key = 'RIGHT';
            break;
        case 40:
            key = 'DOWN';
            break;
        case 190:
            key = '.';
            break;
        case 191:
            key = '/';
            break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code).toUpperCase();
    }
    pressedKeys[key] = status;
    //console.log(pressedKeys);
}

document.addEventListener('keydown', function(e) {
    setKey(e, true);
});

document.addEventListener('keyup', function(e) {
    setKey(e, false);
});

window.addEventListener('blur', function() {
    pressedKeys = {};
});

module.exports = input = {
    isDown: function(key) {
        return pressedKeys[key.toUpperCase()];
    }
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var resourceCache = {};
var loading = [];
var readyCallbacks = [];

// Load an image url or an array of image urls
function load(urlOrArr) {
    if (urlOrArr instanceof Array) {
        urlOrArr.forEach(function(url) {
            _load(url);
        });
    } else {
        _load(urlOrArr);
    }
}

function _load(url) {
    if (resourceCache[url]) {
        return resourceCache[url];
    } else {
        var img = new Image();
        img.onload = function() {
            resourceCache[url] = img;

            if (isReady()) {
                readyCallbacks.forEach(function(func) { func(); });
            }
        };
        resourceCache[url] = false;
        img.src = url;
    }
}

function get(url) {
    return resourceCache[url];
}

function isReady() {
    var ready = true;
    for (var k in resourceCache) {
        if (resourceCache.hasOwnProperty(k) &&
            !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

function onReady(func) {
    readyCallbacks.push(func);
}

module.exports = resources = {
    load: load,
    get: get,
    onReady: onReady,
    isReady: isReady
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
(function() {

    const resources = __webpack_require__(6);
    const Sprite = __webpack_require__(0);
    const input = __webpack_require__(5);
    const Player = __webpack_require__(4);
    const Bullet = __webpack_require__(3);
    const Weapon = __webpack_require__(1);
    const settings = __webpack_require__(2);

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

    var requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 1200;
    canvas.height = 600;
    document.body.appendChild(canvas);

    // The main game loop
    var lastTime;

    function main() {
        var now = Date.now();
        var dt = (now - lastTime) / 1000.0;

        if (!settings.isPause) {
            spawnWeapon();
            update(dt);
            render();
        }
        lastTime = now;
        requestAnimFrame(main);
    };

    function init() {
        settings.terrainPattern = ctx.createPattern(resources.get('img/background.jpg'), 'repeat');
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j] == '#') {
                    settings.terra.push({
                        pos: [j * 20, i * 20],
                        sprite: new Sprite('img/spritesheetmini.jpg', [40, 0], [20, 20])
                    })
                }
                if (map[i][j] == 'X') {
                    settings.terra.push({
                        pos: [j * 20, i * 20],
                        sprite: new Sprite('img/spritesheetmini.jpg', [0, 0], [20, 20])
                    })
                }
                if (map[i][j] == '0') {
                    settings.respawnPos.push([]);
                    settings.respawnPos[settings.respawnPos.length - 1] = [j * 20, i * 20 - 25];
                }
                if (map[i][j] == 'W') {
                    settings.weaponPos.push([]);
                    settings.weaponPos[settings.weaponPos.length - 1] = [j * 20, i * 20];
                }
            }
        }
        document.querySelector('.play-again').addEventListener('click', function() {
            document.querySelector('.pause').style.display = 'none';
            document.querySelector('.pause-overlay').style.display = 'none';
            settings.isPause = false;
        });

        document.querySelector('.sound').addEventListener('click', function() {
            settings.isSound = !settings.isSound;
            this.style.background = 'url(./img/sound' + settings.isSound + '.png)';
        });

        [].forEach.call(document.querySelectorAll('.changeskin.player1 li'), (e, i) => e.addEventListener('click', function() {
            [].forEach.call(document.querySelectorAll('.changeskin.player1 li'), item => item.classList.remove('selected'));
            e.classList.add('selected');
            settings.players[0].changeskin('img/player' + (i + 1) + '.png');
        }));
        [].forEach.call(document.querySelectorAll('.changeskin.player2 li'), (e, i) => e.addEventListener('click', function() {
            [].forEach.call(document.querySelectorAll('.changeskin.player2 li'), item => item.classList.remove('selected'));
            e.classList.add('selected');
            settings.players[1].changeskin('img/player' + (i + 1) + '.png');
        }));

        lastTime = Date.now();
        main();
    }

    resources.load([
        'img/background.jpg',
        'img/sprites.png',
        'img/hp.png',
        'img/ammo.png',
        'img/player1.png',
        'img/player2.png',
        'img/player3.png',
        'img/numbers.png',
        'img/weapons.png',
        'img/spritesheetmini.jpg'
    ]);
    resources.onReady(init);

    settings.players.push(new Player(0, { up: 'w', left: 'a', right: 'd', shoot: 't' }, 'img/player3.png'));
    settings.players.push(new Player(1, { up: 'up', left: 'left', right: 'right', shoot: '.' }, 'img/player2.png'));

    // Update game objects
    function update(dt) {
        handleInput(dt);
        updateEntities(dt);

        checkCollisions();
    };

    function spawnWeapon() {
        if (Date.now() - settings.lastWeaponSpawnTime > settings.weaponSpawnSpeed) {
            let weapon = {};
            weapon.id = Math.floor(Math.random() * settings.weaponPack.length);
            weapon.sprite = settings.weaponPack[weapon.id].sprite;
            weapon.pos = settings.weaponPos[Math.floor(Math.random() * settings.weaponPos.length)];
            settings.weapons.push(weapon);
            settings.lastWeaponSpawnTime = Date.now();
        }
    }

    function handleInput(dt) {
        settings.players.forEach(player => player.actions(dt));
        if (input.isDown('esc')) {
            settings.isPause = true;
            document.querySelector('.pause').style.display = 'block';
            document.querySelector('.pause-overlay').style.display = 'block';
        }
    }

    function updateEntities(dt) {
        // Update all the settings.bullets
        settings.bullets.forEach((bullet, i) => {
            bullet.update(dt);
            if (bullet.pos[0] < 0 || bullet.pos[0] > canvas.width) settings.bullets.splice(i, 1);
        });

        // Update the settings.players sprite animation
        settings.players.forEach((player) => {
            player.sprite.update(dt);
            player.ammoBar.pos = [player.pos[0], player.pos[1] - 10];
            player.weaponBar.pos = [player.pos[0] + 23, player.pos[1] - 12];

            //settings.players jump and falling
            if (player.jumpCount > 0) {
                player.jumpCount--;
                player.pos[1] -= settings.playerSpeed * 2 * dt;
            } else {
                for (let i = 0; i < settings.terra.length; i++) {
                    if (settings.boxCollides([settings.terra[i].pos[0] + 2, settings.terra[i].pos[1]], [16, 1], [player.pos[0], player.pos[1] + player.sprite.size[1]], [player.sprite.size[0], 1])) break;
                    if (i == settings.terra.length - 1) {
                        player.pos[1] += settings.playerSpeed * dt;
                        player.sprite = new Sprite(player.skin, [185 + (player.skin == 'img/player2.png' ? 8 : 0), 176], [31, 38]);
                        for (let i = 0; i < settings.terra.length; i++) {
                            if (settings.boxCollides([settings.terra[i].pos[0] + 2, settings.terra[i].pos[1]], [16, 3], [player.pos[0], player.pos[1] + player.sprite.size[1]], [player.sprite.size[0], 1])) {
                                player.pos[1] = settings.terra[i].pos[1] - player.sprite.size[1];
                            }
                        }
                    }
                }
            }
        });

        // Update all the settings.explosions
        settings.explosions.forEach((expl, i) => {
            expl.sprite.update(dt);
            if (expl.sprite.done) settings.explosions.splice(i, 1);
        });
    }

    // Collisions
    function checkCollisions() {
        checkPlayerBounds();

        for (let i = 0; i < settings.weapons.length - 1; i++) {
            for (let j = i + 1; j < settings.weapons.length; j++) {
                if (settings.boxCollides(settings.weapons[i].pos, settings.weapons[i].sprite.size, settings.weapons[j].pos, settings.weapons[j].sprite.size)) {
                    settings.weapons.splice(j, 1);
                    j--;
                }
            }
        }

        settings.players.forEach(player => {
            settings.bullets.forEach((bullet, i) => {
                if (player.id != bullet.id && settings.boxCollides(bullet.pos, bullet.sprite.size, player.pos, player.sprite.size)) {
                    settings.bullets.splice(i, 1);
                    player.health = player.health - bullet.damage;
                    player.healthBar = { sprite: new Sprite('img/hp.png', [0, player.health * 4], [40, 4]), pos: player.pos };
                    if (player.health <= 0) {
                        settings.players[bullet.id].score++;
                        settings.players[bullet.id].scoreBar1.sprite = new Sprite('img/numbers.png', [50 + (60 * (settings.players[bullet.id].score / 10 | 0)), 50], [60, 90], [60, 130]);
                        settings.players[bullet.id].scoreBar2.sprite = new Sprite('img/numbers.png', [50 + (60 * (settings.players[bullet.id].score % 10)), 50], [60, 90], [60, 130]);
                        settings.explosions.push({
                            pos: player.pos,
                            sprite: new Sprite('img/sprites.png', [0, 117], [39, 39], 16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], null, true)
                        });
                        player.health = 100;
                        player.pos = settings.respawnPos[Math.floor(Math.random() * settings.respawnPos.length)];
                        player.healthBar = { sprite: new Sprite('img/hp.png', [0, 400], [40, 4]), pos: player.pos };
                    }
                }
            });
            settings.weapons.forEach((weapon, i) => {
                if (settings.boxCollides(weapon.pos, weapon.sprite.size, player.pos, player.sprite.size)) {
                    settings.weapons.splice(i, 1);
                    player.weapon = settings.weaponPack[weapon.id];
                    player.weaponBar.sprite = player.weapon.sprite;
                    player.bullets = 100;
                    player.ammoBar = { sprite: new Sprite('img/ammo.png', [0, 400], [20, 4]), pos: [player.pos[0], player.pos[1] - 10] };
                }
            });
        });
    }

    function checkPlayerBounds() {
        // Check bounds
        settings.players.forEach((player) => {
            if (player.pos[0] < 20) {
                player.pos[0] = 20;
            } else if (player.pos[0] > canvas.width - player.sprite.size[0] - 21) {
                player.pos[0] = canvas.width - player.sprite.size[0] - 21;
            }

            if (player.pos[1] < 20) {
                player.pos[1] = 20;
            } else if (player.pos[1] > canvas.height - player.sprite.size[1] - 20) {
                player.pos[1] = canvas.height - player.sprite.size[1] - 20;
            }
        });
    }

    // Draw everything
    function render() {
        ctx.fillStyle = settings.terrainPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderEntities(settings.terra);
        settings.players.forEach((player) => {
            renderEntity(player.scoreBar1);
            renderEntity(player.scoreBar2);

        });
        settings.players.forEach((player) => {
            if (player.direction == 'left') player.pos[0] += player.sprite.size[0];
            renderEntity(player);
            if (player.direction == 'left') player.pos[0] -= player.sprite.size[0];
            renderEntity(player.healthBar);
            renderEntity(player.ammoBar);
            renderEntity(player.weaponBar);
        });
        renderEntities(settings.bullets);
        renderEntities(settings.explosions);
        renderEntities(settings.weapons);
    };

    function renderEntities(list) {
        list.forEach(entity => renderEntity(entity));
    }

    function renderEntity(entity) {
        ctx.save();
        ctx.translate(entity.pos[0], entity.pos[1]);

        if (entity.direction == 'left') ctx.scale(-1, 1);
        if (entity.weaponBar === true) ctx.scale(0.5, 0.5);

        entity.sprite.render(ctx);
        ctx.restore();
    }
})();


/***/ })
/******/ ]);