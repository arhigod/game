console.log("%c ", 'font-size: 1px; color: transparent; padding: 150px 87px;line-height: 300px; background-image: url("https://image.ibb.co/jw4sHS/dev.png")');

const resources = require('./resources');
const Sprite = require('./sprite');
const input = require('./input');
const Player = require('./Player');
const settings = require('./settings');
const game = require('./game');

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

    if (!game.isPause) {
        spawnWeapon();
        update(dt);
        render();
    }
    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    settings.music.play();

    game.terrainPattern = ctx.createPattern(resources.get('img/background.jpg'), 'repeat');
    document.querySelector('.play-again').addEventListener('click', function() {
        document.querySelector('.pause').style.display = 'none';
        document.querySelector('.pause-overlay').style.display = 'none';
        game.isPause = false;
    });

    document.querySelector('.sound').addEventListener('click', function() {
        game.isSound = !game.isSound;
        this.style.background = 'url(./img/sound' + game.isSound + '.png)';
    });

    document.querySelector('.music').addEventListener('click', function() {
        game.isMusic = !game.isMusic;
        this.style.background = 'url(./img/music' + game.isMusic + '.png)';
        game.isMusic ? settings.music.play() : settings.music.pause();
    });

    [].forEach.call(document.querySelectorAll('.changeskin.player1 li'), (e, i) => e.addEventListener('click', function() {
        [].forEach.call(document.querySelectorAll('.changeskin.player1 li'), item => item.classList.remove('selected'));
        e.classList.add('selected');
        game.players[0].changeskin('img/player' + (i + 1) + '.png');
    }));
    [].forEach.call(document.querySelectorAll('.changeskin.player2 li'), (e, i) => e.addEventListener('click', function() {
        [].forEach.call(document.querySelectorAll('.changeskin.player2 li'), item => item.classList.remove('selected'));
        e.classList.add('selected');
        game.players[1].changeskin('img/player' + (i + 1) + '.png');
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

settings.playerSettings.forEach((x, i) => game.players.push(new Player(i, x.controls, x.skin)));

// Update game objects
function update(dt) {
    handleInput(dt);
    updateEntities(dt);

    checkCollisions();
};

function spawnWeapon() {
    if (Date.now() - game.lastWeaponSpawnTime > settings.weaponSpawnSpeed) {
        let weapon = {};
        weapon.id = Math.floor(Math.random() * settings.weaponPack.length);
        weapon.sprite = settings.weaponPack[weapon.id].sprite;
        weapon.pos = settings.weaponPos[Math.floor(Math.random() * settings.weaponPos.length)];
        game.weapons.push(weapon);
        game.lastWeaponSpawnTime = Date.now();
    }
}

function handleInput(dt) {
    game.players.forEach(player => player.actions(dt));
    if (input.isDown('esc')) {
        game.isPause = true;
        document.querySelector('.pause').style.display = 'block';
        document.querySelector('.pause-overlay').style.display = 'block';
    }
}

function updateEntities(dt) {
    // Update all the game.bullets
    game.bullets.forEach((bullet, i) => {
        bullet.update(dt);
        if (bullet.pos[0] < 0 || bullet.pos[0] > canvas.width) game.bullets.splice(i, 1);
    });

    // Update the game.players sprite animation
    game.players.forEach((player) => {
        player.sprite.update(dt);
        player.ammoBar.pos = [player.pos[0], player.pos[1] - 10];
        player.weaponBar.pos = [player.pos[0] + 23, player.pos[1] - 12];

        //game.players jump and falling
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

    // Update all the game.explosions
    game.explosions.forEach((expl, i) => {
        expl.sprite.update(dt);
        if (expl.sprite.done) game.explosions.splice(i, 1);
    });
}

// Collisions
function checkCollisions() {
    checkPlayerBounds();

    for (let i = 0; i < game.weapons.length - 1; i++) {
        for (let j = i + 1; j < game.weapons.length; j++) {
            if (settings.boxCollides(game.weapons[i].pos, game.weapons[i].sprite.size, game.weapons[j].pos, game.weapons[j].sprite.size)) {
                game.weapons.splice(j, 1);
                j--;
            }
        }
    }

    game.players.forEach(player => {
        game.bullets.forEach((bullet, i) => {
            if (player.id != bullet.id && settings.boxCollides(bullet.pos, bullet.sprite.size, player.pos, player.sprite.size)) {
                game.bullets.splice(i, 1);
                player.health = player.health - bullet.damage;
                player.healthBar = { sprite: new Sprite('img/hp.png', [0, player.health * 4], [40, 4]), pos: player.pos };
                if (player.health <= 0) {
                    game.players[bullet.id].score++;
                    game.players[bullet.id].scoreBar1.sprite = new Sprite('img/numbers.png', [50 + (60 * (game.players[bullet.id].score / 10 | 0)), 50], [60, 90], [60, 130]);
                    game.players[bullet.id].scoreBar2.sprite = new Sprite('img/numbers.png', [50 + (60 * (game.players[bullet.id].score % 10)), 50], [60, 90], [60, 130]);
                    game.explosions.push({
                        pos: player.pos,
                        sprite: new Sprite('img/sprites.png', [0, 117], [39, 39], 16, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], null, true)
                    });
                    player.health = 100;
                    player.pos = settings.respawnPos[Math.floor(Math.random() * settings.respawnPos.length)];
                    player.healthBar = { sprite: new Sprite('img/hp.png', [0, 400], [40, 4]), pos: player.pos };
                }
            }
        });
        game.weapons.forEach((weapon, i) => {
            if (settings.boxCollides(weapon.pos, weapon.sprite.size, player.pos, player.sprite.size)) {
                game.weapons.splice(i, 1);
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
    game.players.forEach((player) => {
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
    ctx.fillStyle = game.terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderEntities(settings.terra);
    game.players.forEach((player) => {
        renderEntity(player.scoreBar1);
        renderEntity(player.scoreBar2);

    });
    game.players.forEach((player) => {
        if (player.direction == 'left') player.pos[0] += player.sprite.size[0];
        renderEntity(player);
        if (player.direction == 'left') player.pos[0] -= player.sprite.size[0];
        renderEntity(player.healthBar);
        renderEntity(player.ammoBar);
        renderEntity(player.weaponBar);
    });
    renderEntities(game.bullets);
    renderEntities(game.explosions);
    renderEntities(game.weapons);
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
