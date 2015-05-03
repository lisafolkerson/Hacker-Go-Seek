//create canvas
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

//set canvas size
canvas.width = 714;
canvas.height = 531;
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
	e.preventDefault();
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e){
	delete keysDown[e.keyCode];
}, false);

//handle reset when hero catches monster
var reset = function(){
	hero.x = 32 + (Math.random() * (canvas.width - 64))
	hero.y = 32 + (Math.random() * (canvas.width - 64))

	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
}; //end reset();

function render() {
	// SCOREBOARD
	context.fillStyle = 'rgba(209, 32, 38, 1)';
	context.font = "24px Courier";
	context.textAlign = "left";
	context.textBaseline = "top";
	context.fillText('Hambuns Caught: ' + monstersCaught, 32, 32);
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
		hero.x <= (monster.x + 58)
		&& monster.x <= (hero.x + 58)
		&& hero.y <= (monster.y + 58)
		&& monster.y <= (hero.y + 58)
		) {
		++monstersCaught;
		reset();
	}
}; // end update()

function warpZone() {
	if (hero.x > canvas.width) {
		hero.x = 0;
	}
	else if (hero.x < 0) {
		hero.x = canvas.width;
	}

	if (hero.y > canvas.height) {
		hero.y = 0;
	}
	else if (hero.y < 0) {
		hero.y = canvas.height;
	}
}


function drawBG() {
	bgImage = new Image();
	bgImage.src = 'images/01_theLab.jpg';
	bgImage.onload = function() {
		context.drawImage(bgImage, 0,0, canvas.width, canvas.height);
	}
};

function drawHero() {
    heroImage = new Image();
    heroImage.src = 'images/03-heather-payne.png';
    heroImage.onload = function() {
        context.drawImage(heroImage, hero.x,hero.y);
    }
};

function drawMonster(){
	monsterImage = new Image();
	monsterArray = ['images/allison72.png', 'images/Andrea72.png', 'images/Anna72.png', 'images/Hannah272.png', 'images/Heather72.png', 'images/Ian72.png', 'images/Jenny72.png', 'images/Jeremy72.png', 'images/Jordan72.png', 'images/Jordyn72.png', 'images/Karley-72.png', 'images/Kate-72.png', 'images/Kevin-72.png', 'images/Laura72.png', 'images/Lisa72.png', 'images/Lola72.png', 'images/Lucas72.png', 'images/Nate72.png', 'images/Omar72.png', 'images/Ross72.png', 'images/SarahL72.png', 'images/Sarah72.png', 'images/Steph-72.png', 'images/Tammy72.png', 'images/Trudy72.png', 'images/Vivi72.png', 'Winston72.png'];
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

	warpZone();

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


