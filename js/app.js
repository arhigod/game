// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
(function() {
    // const Player = require('./Player');
    // const Bullet = require('./Bullet');
    // const Weapon = require('./Weapon');

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

        if (!isPause) {
            spawnWeapon();
            update(dt);
            render();
        }
        lastTime = now;
        requestAnimFrame(main);
    };

    function init() {
        terrainPattern = ctx.createPattern(resources.get('img/background.jpg'), 'repeat');
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
        document.querySelector('.play-again').addEventListener('click', function() {
            document.querySelector('.pause').style.display = 'none';
            document.querySelector('.pause-overlay').style.display = 'none';
            isPause = false;
        });

        document.querySelector('.sound').addEventListener('click', function() {
            isSound = !isSound;
            this.style.background = 'url(./img/sound'+isSound+'.png)';
        });

        [].forEach.call(document.querySelectorAll('.changeskin.player1 li'), (e, i) => e.addEventListener('click', function() {
            [].forEach.call(document.querySelectorAll('.changeskin.player1 li'), item => item.classList.remove('selected'));
            e.classList.add('selected');
            players[0].changeskin('img/player' + (i + 1) + '.png');
        }));
        [].forEach.call(document.querySelectorAll('.changeskin.player2 li'), (e, i) => e.addEventListener('click', function() {
            [].forEach.call(document.querySelectorAll('.changeskin.player2 li'), item => item.classList.remove('selected'));
            e.classList.add('selected');
            players[1].changeskin('img/player' + (i + 1) + '.png');
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

    // Game state
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
            this.weapon = defaultWeapon;
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
            this.pos[0] -= playerSpeed * dt;
            this.direction = 'left';
            this.sprite = new Sprite(this.skin, [57 + 31 * Math.floor((this.event++ % 18) / 3), 100], [31, 38]);
        }
        actionRight(dt) {
            this.pos[0] += playerSpeed * dt;
            this.direction = 'right';
            this.sprite = new Sprite(this.skin, [57 + 31 * Math.floor((this.event++ % 18) / 3), 100], [31, 38]);
        }
        actionUp() {
            for (let i = 0; i < terra.length; i++) {
                if (boxCollides([terra[i].pos[0] + 2, terra[i].pos[1]], [16, 1], [this.pos[0], this.pos[1] + this.sprite.size[1]], [this.sprite.size[0], 1])) {
                    this.jumpCount = 25;
                }
            }
        }
        actionShoot() {
            if (isSound) {
                var audio = new Audio('./sound/' + this.weapon.name + this.id + '.mp3');
                audio.play();
            }
            let [x, y] = [this.pos[0] + this.sprite.size[0] / 2, this.pos[1] + this.sprite.size[1] / 2 - 8];
            this.weapon.move.forEach(move => {
                let moveDirection = [this.direction == 'right' ? move[0] : -1 * move[0], move[1]];
                bullets.push(new Bullet(this.id, [x, y], this.direction, moveDirection, new Sprite('img/sprites.png', [0, 39], [18, 8]), this.weapon.damage));
            });
            this.lastFire = Date.now();
            this.bullets -= this.weapon.bulletCost;
            if (this.bullets <= 0) {
                this.weapon = defaultWeapon;
                this.weaponBar.sprite = this.weapon.sprite;
                this.bullets = 100;
            }
            this.ammoBar = { sprite: new Sprite('img/ammo.png', [0, this.bullets * 4], [20, 4]), pos: [this.pos[0], this.pos[1] - 10] };
        }
    }
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
            this.pos[0] += (bulletSpeed * dt) * this.moveDirection[0];
            this.pos[1] += (bulletSpeed * dt) * this.moveDirection[1];
        }
    }
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
    var players = [];

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
    var bullets = [];
    var explosions = [];
    var terra = [];
    let weapons = [];
    let respawnPos = [];
    let weaponPos = [];
    let weaponSprite = [
        new Sprite('img/weapons.png', [35, 0], [33, 15]),
        new Sprite('img/weapons.png', [70, 70], [33, 15]),
        new Sprite('img/weapons.png', [152, 21], [51, 17]),
    ];
    let weaponSpawnSpeed = 2000;
    let lastWeaponSpawnTime = Date.now();

    var isPause = false;
    var isSound = true;
    var terrainPattern;

    // Speed in pixels per second
    var playerSpeed = 200;
    var bulletSpeed = 500;


    players.push(new Player(0, { up: 's', left: 'z', right: 'c', shoot: 'SHIFT' }, 'img/player3.png'));
    players.push(new Player(1, { up: 'k', left: 'm', right: '.', shoot: '/' }, 'img/player2.png'));
    // Update game objects
    function update(dt) {
        handleInput(dt);
        updateEntities(dt);

        checkCollisions();
    };

    function spawnWeapon() {
        if (Date.now() - lastWeaponSpawnTime > weaponSpawnSpeed) {
            let weapon = {};
            weapon.id = Math.floor(Math.random() * weaponPack.length);
            weapon.sprite = weaponPack[weapon.id].sprite;
            weapon.pos = weaponPos[Math.floor(Math.random() * weaponPos.length)];
            weapons.push(weapon);
            lastWeaponSpawnTime = Date.now();
        }
    }

    function handleInput(dt) {
        players.forEach(player => player.actions(dt));
        if (input.isDown('esc')) {
            isPause = true;
            document.querySelector('.pause').style.display = 'block';
            document.querySelector('.pause-overlay').style.display = 'block';
        }
    }

    function updateEntities(dt) {
        // Update all the bullets
        bullets.forEach((bullet, i) => {
            bullet.update(dt);
            if (bullet.pos[0] < 0 || bullet.pos[0] > canvas.width) bullets.splice(i, 1);
        });

        // Update the players sprite animation
        players.forEach((player) => {
            player.sprite.update(dt);
            player.ammoBar.pos = [player.pos[0], player.pos[1] - 10];
            player.weaponBar.pos = [player.pos[0] + 23, player.pos[1] - 12];

            //players jump and falling
            if (player.jumpCount > 0) {
                player.jumpCount--;
                player.pos[1] -= playerSpeed * 2 * dt;
            } else {
                for (let i = 0; i < terra.length; i++) {
                    if (boxCollides([terra[i].pos[0] + 2, terra[i].pos[1]], [16, 1], [player.pos[0], player.pos[1] + player.sprite.size[1]], [player.sprite.size[0], 1])) break;
                    if (i == terra.length - 1) {
                        player.pos[1] += playerSpeed * dt;
                        player.sprite = new Sprite(player.skin, [185 + (player.skin == 'img/player2.png' ? 8 : 0), 176], [31, 38]);
                        for (let i = 0; i < terra.length; i++) {
                            if (boxCollides([terra[i].pos[0] + 2, terra[i].pos[1]], [16, 3], [player.pos[0], player.pos[1] + player.sprite.size[1]], [player.sprite.size[0], 1])) {
                                player.pos[1] = terra[i].pos[1] - player.sprite.size[1];
                            }
                        }
                    }
                }
            }
        });

        // Update all the explosions
        explosions.forEach((expl, i) => {
            expl.sprite.update(dt);
            if (expl.sprite.done) explosions.splice(i, 1);
        });
    }

    // Collisions

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

    function checkCollisions() {
        checkPlayerBounds();

        for (let i = 0; i < weapons.length - 1; i++) {
            for (let j = i + 1; j < weapons.length; j++) {
                if (boxCollides(weapons[i].pos, weapons[i].sprite.size, weapons[j].pos, weapons[j].sprite.size)) {
                    weapons.splice(j, 1);
                    j--;
                }
            }
        }

        players.forEach(player => {
            bullets.forEach((bullet, i) => {
                if (player.id != bullet.id && boxCollides(bullet.pos, bullet.sprite.size, player.pos, player.sprite.size)) {
                    bullets.splice(i, 1);
                    player.health = player.health - bullet.damage;
                    player.healthBar = { sprite: new Sprite('img/hp.png', [0, player.health * 4], [40, 4]), pos: player.pos };
                    if (player.health <= 0) {
                        players[bullet.id].score++;
                        players[bullet.id].scoreBar1.sprite = new Sprite('img/numbers.png', [50 + (60 * (players[bullet.id].score / 10 | 0)), 50], [60, 90], [60, 130]);
                        players[bullet.id].scoreBar2.sprite = new Sprite('img/numbers.png', [50 + (60 * (players[bullet.id].score % 10)), 50], [60, 90], [60, 130]);
                        explosions.push({
                            pos: player.pos,
                            sprite: new Sprite('img/sprites.png', [0, 117], [39, 39], 16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], null, true)
                        });
                        player.health = 100;
                        player.pos = respawnPos[Math.floor(Math.random() * respawnPos.length)];
                        player.healthBar = { sprite: new Sprite('img/hp.png', [0, 400], [40, 4]), pos: player.pos };
                    }
                }
            });
            weapons.forEach((weapon, i) => {
                if (boxCollides(weapon.pos, weapon.sprite.size, player.pos, player.sprite.size)) {
                    weapons.splice(i, 1);
                    player.weapon = weaponPack[weapon.id];
                    player.weaponBar.sprite = player.weapon.sprite;
                    player.bullets = 100;
                    player.ammoBar = { sprite: new Sprite('img/ammo.png', [0, 400], [20, 4]), pos: [player.pos[0], player.pos[1] - 10] };
                }
            });
        });
    }

    function checkPlayerBounds() {
        // Check bounds
        players.forEach((player) => {
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
        ctx.fillStyle = terrainPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderEntities(terra);
        players.forEach((player) => {
            renderEntity(player.scoreBar1);
            renderEntity(player.scoreBar2);

        });
        players.forEach((player) => {
            if (player.direction == 'left') player.pos[0] += player.sprite.size[0];
            renderEntity(player);
            if (player.direction == 'left') player.pos[0] -= player.sprite.size[0];
            renderEntity(player.healthBar);
            renderEntity(player.ammoBar);
            renderEntity(player.weaponBar);
        });
        renderEntities(bullets);
        renderEntities(explosions);
        renderEntities(weapons);
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
