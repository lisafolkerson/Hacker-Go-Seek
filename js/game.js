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
	pickHambun();
	hero.x = 32 + (Math.random() * (canvas.width - 64))
	hero.y = 32 + (Math.random() * (canvas.width - 64))

	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	monster.src = Math.random();
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
		hero.x <= (monster.x + 48)
		&& monster.x <= (hero.x + 48)
		&& hero.y <= (monster.y + 48)
		&& monster.y <= (hero.y + 48)
		) {
		++monstersCaught;
		reset();
	}
}; // end update()

function warpZone() {
	if (hero.x > canvas.width) {
		hero.x = 0 ;
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


// the monster array should be a global variable - otherwise it will be redefined with the full list of classmates everytime drawMonster() is called. 
// Here I'm creating an array with just the names. Since the filepath is similar for each image, we can just concatenate the name in. 

var classArray = ['Allison', 'Andrea', 'Anna', 'Hannah', 'Heather', 'Ian', 'Jenny', 'Jeremy', 'Jordan', 'Jordyn', 'Karley', 'Kate', 'Kevin', 'Laura', 'Lisa', 'Lola', 'Lucas', 'Nate', 'Omar', 'Ross', 'SarahL', 'Sarah', 'Steph-', 'Tammy', 'Trudy', 'Vivi', 'Winston'];

var length;
var currentBun;

// We want to randomly choose one name out of the array
// Then remove it from the array.

function pickHambun() {
	length = classArray.length;
	var rando = Math.floor(Math.random()*length);

	currentBun = classArray[rando];

	classArray.splice(rando,1);

	return currentBun;
}

// Concatenate it into our image source

function drawMonster(){
	monsterImage = new Image();
	monsterImage.src = 'images/' + currentBun + '72.png';
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


