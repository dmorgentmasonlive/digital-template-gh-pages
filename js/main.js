window.onload = function() {
    
"use strict";
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Capture the Point', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/player.png', 32, 45);
    game.load.spritesheet('point', 'assets/point.png');

}

var player;
var player2;
var platforms;
var cursors;
var cursors2;
var point;

var stars;
var score = 0;
var score2 = 0;
var scoreText;
var scoreText2;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');
    point = game.add.sprite(400, game.world.height-100, 'point');
    game.physics.arcade.enable(point);
    point.body.gravity.y = 300;
    point.body.collideWorldBounds = true;
    
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    player2 = game.add.sprite(game.world.width-64, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(player2);

    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    
    //player2.body.bounce.y = 0.2;
    player2.body.gravity.y = 300;
    player2.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player2.animations.add('left', [0,1,2,3], 10, true);
    player2.animations.add('right', [5,6,7,8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    scoreText2 = game.add.text(650,16, 'score: 0', {fontSize: '32px', fill: '#000'});
    
    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    cursors2 = {up: game.input.keyboard.addKey(Phaser.Keyboard.W), down: game.input.keyboard.addKey(Phaser.Keyboard.S), left: game.input.keyboard.addKey(Phaser.Keyboard.A), right: game.input.keyboard.addKey(Phaser.Keyboard.D)}
    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player2, platforms);
    game.physics.arcade.collide(point, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, point, collectStar, null, this);
    game.physics.arcade.overlap(player2, point, collectStar2, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player2.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
    
    if(player.body.touching.down == false && cursors.down.isDown)
    {
        player.body.velocity.y = 300;
        player.frame = 4;
        if(game.physics.arcade.collide(player,player2))
        {
            player2.x = game.world.width - 64;
            player2.y = game.world.height-150;
        }
    }
    
    if (cursors2.left.isDown)
    {
        //  Move to the left
        player2.body.velocity.x = -150;

        player2.animations.play('left');
    }
    else if (cursors2.right.isDown)
    {
        //  Move to the right
        player2.body.velocity.x = 150;

        player2.animations.play('right');
    }
    else
    {
        //  Stand still
        player2.animations.stop();

        player2.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors2.up.isDown && player2.body.touching.down)
    {
        player2.body.velocity.y = -350;
    }
    
    if(player2.body.touching.down == false && cursors2.down.isDown)
    {
        player2.body.velocity.y = 300;
        player2.frame = 4;
        if(game.physics.arcade.collide(player,player2))
        {
            player.x = 32;
            player.y = game.world.height-150;
        }
    }
}

function collectStar2 (player2, point)
{
    score2 += 1;
    scoreText2.text = 'score: ' + score2;
}

function collectStar (player, point) {

    //  Add and update the score
    score += 1;
    scoreText.text = 'score: ' + score;

}
}