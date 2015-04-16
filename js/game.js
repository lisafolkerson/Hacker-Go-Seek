//create canvas
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

//set canvas size
canvas.width = 952;
canvas.height = 708;
document.body.appendChild(canvas);


// the game pieces or objects
var hero = {
	speed: 256, //speed is in pps
};
var monster = {}
var monstersCaught = 0;

//keysDown namespace
var keysDown = {};

addEventListener("keydown", function(e){
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e){
	delete keysDown[e.keyCode];
}, false);

//handle reset when hero catches monster
var reset = function(){
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.width - 64));
}; //end reset();

function render() {
	// SCOREBOARD
	context.fillStyle = 'rgb(250,250,250)';
	context.font = "24px Helvetica";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.fillText('Green Divas Caught: ' + monstersCaught, 32, 32);
};



//update game objects
var update = function(modifier) {
	// UP
	if (38 in keysDown) {
		hero.y -= hero.speed * modifier;
	}
	// DOWN
	if (40 in keysDown) {
		hero.y += hero.speed * modifier;
	}
	// LEFT
	if (37 in keysDown) {
		hero.x -= hero.speed * modifier;
	}
	// RIGHT
	if (39 in keysDown) {
		hero.x += hero.speed * modifier;
	}

	// if statement for if they are touching
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
		) {
		++monstersCaught;
		reset();
	}
}; // end update()

function drawBG() {
	bgImage = new Image();
	bgImage.src = 'images/01_theLab.jpg';
	bgImage.onload = function() {
		context.drawImage(bgImage, 0,0, canvas.width, canvas.height);
	}
};

function drawHero() {
    heroImage = new Image();
    heroImage.src = 'images/hero.png';
    heroImage.onload = function() {
        context.drawImage(heroImage, hero.x,hero.y);
    }
};

function drawMonster(){
	monsterImage = new Image();
	monsterImage.src = 'images/monster.png';
	monsterImage.onload = function() {
		context.drawImage(monsterImage, monster.x, monster.y);
	}
};


// MAIN GAME LOOP

var main = function() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	drawBG();
	render();
	drawMonster();
	drawHero();

	then = now;

	//request to do this again asap
	requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


//CALL DE GAME YAH
var then = Date.now();
reset();
main();


