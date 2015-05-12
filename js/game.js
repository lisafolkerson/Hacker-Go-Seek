//create canvas
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

//set canvas size
canvas.width = 714;
canvas.height = 571;

//append canvas to the DIV of our choice
canvas.id = "theZone";
document.getElementById('main').appendChild(canvas);


//the start screen!
var startScreen = (function(input) {
	var rate = 0.128; // R/ms

	var hue = 0; 
    
    // are we moving toward red or black?
    var direction = 1; 
    var transitioning = false;
 
    // record the input state from last frame
    // because we need to compare it in the
    // current frame
    var wasButtonDown = false;

	//center the text
	function centerText(context, text, y) {
	    var measurement = context.measureText(text);
	    var x = (context.canvas.width - measurement.width) / 2;
	   context.fillText(text, x, y);
	} // end centerText();

	//draw the starter text
	function draw (context, elapsed) {
		var y = context.canvas.height / 2;
		context.fillStyle = 'white';
		context.font = '48px Courier';
		centerText(context, 'HackerYou-and-Go-Seek', y);

		// aaaand the subtitle
		var color = 'rgb(' + hue + ',0,0)';

		context.fillStyle = color;
		context.font = '24px monospace';
		centerText(context, 'click to begin', y + 30);

	}; // end draw();

	function update(elapsed) {
	    var amount = rate * elapsed;
	    hue += amount * direction;
	    if (hue > 255) direction = -1;
	    if (hue < 0) direction = 1;

	    rounded_hue = Math.round(hue);

	    var isButtonDown = input.isButtonDown();

	    var mouseJustClicked = !isButtonDown && wasButtonDown;

	    if (mouseJustClicked && !transitioning) {
	        transitioning = true;
	        // do something here to transition to the actual game
	    }

	    wasButtonDown = isButtonDown;

	} // end update();

	// this is the object that will be `startScreen`
	return {
	    draw: draw,
	    update: update
	};
	
}); // end startScreen();


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
	context.textAlign = "center";
	context.textBaseline = "top";
	context.fillText('Hambuns Caught: ' + monstersCaught, canvas.width/2, 547, 714);
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
		hero.x = -60 ;
	}
	else if (hero.x < -60) {
		hero.x = canvas.width;
	}

	if (hero.y > canvas.height) {
		hero.y = -40;
	}
	else if (hero.y < -40) {
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

var classArray = ['Allison', 'Andrea', 'Anna', 'Hannah', 'Heather', 'Ian', 'Jenny', 'Jeremy', 'Jordan', 'Jordyn', 'Karley', 'Kate', 'Kevin', 'Laura', 'Lisa', 'Lola', 'Lucas', 'Nate', 'Omar', 'Ross', 'SarahL', 'Sarah', 'Steph', 'Tammy', 'Trudy', 'Vivi', 'Winston'];

var length;
var currentBun;

// We want to randomly choose one name out of the array
// Then remove it from the array.
// Also, check the reset() function, that's where we pick a new hambun!

function pickHambun() {
	length = classArray.length;
	var rando = Math.floor(Math.random()*length);

	if (length <= 0) {
		gameOver();
 
	}
	else {
		currentBun = classArray[rando];
		classArray.splice(rando,1);
		return currentBun;
	}	
}

// Concatenate it into our image source

function drawMonster(){
	monsterImage = new Image();
	monsterImage.src = 'images/' + currentBun + '72.png';
	monsterImage.onload = function() {
		context.drawImage(monsterImage, monster.x, monster.y);
	}
};

var gameOver = function() {
	// clearInterval(interval);
	context.font = "60px Courier";
	context.fillStyle = "rgb(0,0,0)";
	context.textAlign = "center";
	context.textBaseline = "middle"
	context.fillText("YOU WIN!!!", canvas.width/2, canvas.height/2);

}


// MAIN GAME LOOP

var main = function() {

	var now = Date.now();
	var delta = now - then;

	startScreen();
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
startScreen();
reset();
main();


