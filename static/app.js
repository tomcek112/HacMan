
// define constants
var canvas = document.getElementById("canvas"),
	keys = [],
	ctx = canvas.getContext("2d"),
	width = 600,
	height = 600,
	numRows = 33,
	numCols = 33,
	backgroundColor = "black",
	wallThickness = 3;

// set canvas
canvas.width = width;
canvas.height = height;
canvas.style.backgroundColor = backgroundColor;


// global object to help transform grid values to pixel values for rendering
var GridHelper = function(){
	this.castPoint = function(p){
		var retPoint = new Point(
			p.x*(width/numCols),
			p.y*(height/numRows)
			);
		return retPoint;
	}

	this.translateX = function(x){
		return x*(width/numCols);
	}

	this.translateY = function(y){
		return y*(height/numRows);
	}
}

//define global GridHelper
var gH = new GridHelper();

// Point Object

var Point = function(x,y){
	this.x = x;
	this.y = y;

	this.render = function(color){
		ctx.fillStyle = color;
		var tempP = gH.castPoint(this);
		ctx.fillRect(tempP.x, tempP.y, wallThickness, wallThickness )
		ctx.fill();
	}
}

// Wall Object

var Wall = function(p1, p2){
	//Always initliaize with left most, top most point as p1 
	if(!(p1 instanceof Point) ||!(p2 instanceof Point)) {
		throw new TypeError('Construct <Wall> using Wall(Point p1, Points p2)');
	}
	else {
		this.p1 = p1;
		this.p2 = p2;
		this.render = function(color) {
			ctx.fillStyle = color;
			var castedP1 = gH.castPoint(this.p1);
			var castedP2 = gH.castPoint(this.p2);
			ctx.fillRect(
				castedP1.x - Math.round(wallThickness/2),
				castedP1.y - Math.round(wallThickness/2),
				(castedP2.x - castedP1.x < wallThickness ? wallThickness : castedP2.x - castedP1.x),
				(castedP2.y - castedP1.y < wallThickness ? wallThickness : castedP2.y - castedP1.y)
				);
			ctx.fill();
		}
	}
}

// Rectangle Object

var Rectangle = function(p1, rectWidth, rectHeight){
	// p1 as top left corner 
	this.p1 = p1;
	this.rectWidth = rectWidth;
	this.rectHeight = rectHeight;

	// draws rectangle with rounded edges
	this.drawRoundRect = function (x, y, width, height, radius) {
		ctx.strokeStyle = "blue";
		ctx.lineWidth = wallThickness;
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
		ctx.beginPath();
		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		ctx.closePath();
	  ctx.stroke();
	}

	this.render = function(color){
		ctx.fillStyle = color;
		var castedP1 = gH.castPoint(this.p1);
		var castedP2 = gH.castPoint(new Point((this.p1.x + this.rectWidth), (this.p1.y + this.rectHeight)));
		this.drawRoundRect(castedP1.x, castedP1.y, gH.translateX(rectWidth), gH.translateY(rectHeight), 10);
	}

	this.pointInRectangle = function(x, y) {
		return (x >= p1.x - 1) && (x <= p1.x + rectWidth-1) && (y >= p1.y - 1) && (y <= p1.y + rectHeight-1);
	}

}


// Player Object

var Player = function(){
	this.x = 16;
	this.y = 22;
	this.heading = "l";
	this.spriteState = 0;

	this.render = function() {

		// get appropriate sprite for direction facing
		if(this.heading == "l"){
			var sprite=document.getElementById("sprite-l");
		}
		else if(this.heading == "r"){
			var sprite=document.getElementById("sprite-r");
		}
		else if(this.heading == "u"){
			var sprite=document.getElementById("sprite-u");
		}
		else {
			var sprite=document.getElementById("sprite-d");
		}

		// open/close mouth
		if(this.spriteState > 2){
			this.spriteState++;
			if(this.spriteState == 4){
				this.spriteState = 0;
			}
			var sprite=document.getElementById("sprite-c");
		}
		else{
			this.spriteState++;
		}
		
    	ctx.drawImage(sprite,gH.translateX(this.x),gH.translateY(this.y), gH.translateX(2), gH.translateY(2));
	}

	// gets next position to be moved to
	this.getNextPos = function(dir) {
		var a = player.x;
		var b = player.y;
		if(dir == "l"){
			a -= 1;
		}
		else if (dir == "r"){
			a += 1;
		}
		else if (dir == "u"){
			b -= 1;
		}
		else if(dir == "d"){
			b += 1;
		}
		var pnt = new Point(a,b);
		return pnt;
	}

	// moves player
	this.move = function(dir) {
		if(this.heading == "l"){
			player.x -= 1;
		}
		else if (this.heading == "r"){
			player.x += 1;
		}
		else if (this.heading == "u"){
			player.y -= 1;
		}
		else if(this.heading == "d"){
			player.y += 1;
		}
	}

	// changes direction
	this.changeDirection = function(dir) {
		if(dir == "l"){
			this.heading = "l";
		}
		else if (dir == "r"){
			this.heading = "r";
		}
		else if (dir == "u"){
			this.heading = "u";
		}
		else if(dir == "d"){
			this.heading = "d"
		}
	}

	this.resetPosition = function() {
		this.x = 16;
		this.y = 22;
	}

}


obstacles = [];

// Outer Walls

obstacles.push(new Wall(
	new Point(1, 1),
	new Point(numCols-1, 1)
	));

obstacles.push(new Wall(
	new Point(1, 1),
	new Point(1, numRows-1)
	));

obstacles.push(new Wall(
	new Point(1, numRows-1),
	new Point(numCols-1, numRows-1)
	));

obstacles.push(new Wall(
	new Point(numCols-1, 1),
	new Point(numCols-1, numRows-1)
	));

// Inner Walls

// first level
obstacles.push(new Rectangle(
	new Point(3, 3),
	4, 3
	));

obstacles.push(new Rectangle(
	new Point(9, 3),
	5, 3
	));

obstacles.push(new Rectangle(
	new Point(16, 1),
	1, 5
	));

obstacles.push(new Rectangle(
	new Point(19, 3),
	5, 3
	));

obstacles.push(new Rectangle(
	new Point(26, 3),
	4, 3
	));

// second level

obstacles.push(new Rectangle(
	new Point(3, 8),
	4, 3
	));

obstacles.push(new Rectangle(
	new Point(9, 8),
	1, 8
	));

obstacles.push(new Rectangle(
	new Point(12, 8),
	9, 1
	));

obstacles.push(new Rectangle(
	new Point(23, 8),
	1, 8
	));

obstacles.push(new Rectangle(
	new Point(26, 8),
	4, 3
	));

// third level

obstacles.push(new Rectangle(
	new Point(1, 13),
	6, 7
	));

obstacles.push(new Rectangle(
	new Point(12, 8),
	9, 1
	));


obstacles.push(new Rectangle(
	new Point(26, 13),
	6, 7
	));

// fourth level

obstacles.push(new Rectangle(
	new Point(3, 22),
	4, 3
	));


obstacles.push(new Rectangle(
	new Point(9, 18),
	1, 7
	));

obstacles.push(new Rectangle(
	new Point(12, 24),
	9, 1
	));

obstacles.push(new Rectangle(
	new Point(23, 18),
	1, 7
	));

obstacles.push(new Rectangle(
	new Point(26, 22),
	4, 3
	));

// fifth level

obstacles.push(new Rectangle(
	new Point(3, 27),
	4, 3
	));

obstacles.push(new Rectangle(
	new Point(9, 27),
	5, 3
	));

obstacles.push(new Rectangle(
	new Point(16, 27),
	1, 5
	));

obstacles.push(new Rectangle(
	new Point(19, 27),
	5, 3
	));

obstacles.push(new Rectangle(
	new Point(26, 27),
	4, 3
	));

// middle spawn box

obstacles.push(new Rectangle(
	new Point(12, 11),
	9, 11
	));




var player = new Player();

var pointInObstacle = function(x,y) {
	for (var i = 0; i < obstacles.length; i++) {
		if (obstacles[i] instanceof Rectangle && obstacles[i].pointInRectangle(x,y)) {
			return true;
		}
		
	}
	return false;
}

//Passes player/ghost object
var canMove = function(ob, dir) {
	var nextPost = ob.getNextPos(dir);
	if (nextPost.x == 0 && dir == "l") {return false;}
	if (nextPost.x == numCols-2 && dir == "r") {return false;}
	if (nextPost.y == 0 && dir == "u") {return false;}
	if (nextPost.y == numRows-2 && dir == "d") {return false;}
	return !pointInObstacle(nextPost.x, nextPost.y);
}

//Ghost object
var Ghost = function(color) {
	this.color = color; 
	if (this.color == "red") {
		this.x = 13;
		this.y = 15;
	} else if (this.color == "blue") {
		this.x = 15;
		this.y = 15;
	}
	this.heading;
	this.counter = 0;
	this.reset = false;
	this.ai = true;
	this.canBeEaten = false;
	
	this.render = function(color) {
		if(this.heading == "l"){
			var sprite=document.getElementById(color.concat("-l"));
		}
		else if(this.heading == "r"){
			var sprite=document.getElementById(color.concat("-r"));
		}
		else if(this.heading == "u"){
			var sprite=document.getElementById(color.concat("-u"));
		}
		else {
			var sprite=document.getElementById(color.concat("-d"));
		}
		
    	ctx.drawImage(sprite,gH.translateX(this.x),gH.translateY(this.y), gH.translateX(2), gH.translateY(2));

    	if (this.ai) {
    		this.run();
    	}

	}

	this.getNextPos = function(dir) {
		var a = this.x;
		var b = this.y;
		if(dir == "l"){
			a -= 1;
		}
		else if (dir == "r"){
			a += 1;
		}
		else if (dir == "u"){
			b -= 1;
		}
		else if(dir == "d"){
			b += 1;
		}
		var pnt = new Point(a,b);
		return pnt;
	}
	
	this.getDir = function() {
		//Generate random number between 0 and 4
		var randNum = Math.floor(Math.random() * (4));
		if (randNum == 0) { return "l";}
		else if(randNum == 1) {return "r";}
		else if(randNum == 2) {return "u";}
		else if(randNum == 3) {return "d";}
	}

	this.changeDirection = function(dir) {
		if(dir == "l"){
			this.heading = "l";
		}
		else if (dir == "r"){
			this.heading = "r";
		}
		else if (dir == "u"){
			this.heading = "u";
		}
		else if(dir == "d"){
			this.heading = "d"
		}
	}

	this.leaveSafe = function() {
		this.changeDirection("u");
		if (this.counter > 10 && this.counter < 17) {
			this.y -= 1;
		}
	}

	this.move = function() {
		if (!canMove(this, this.heading)) {
			var dir = this.getDir();
			while(!canMove(this, dir)) {
				dir = this.getDir();
			}
		}	
		this.changeDirection(dir);
		if(this.heading == "l"){
			this.x -= 0.5;
		}
		else if (this.heading == "r"){
			this.x += 0.5;
		}
		else if (this.heading == "u"){
			this.y -= 0.5;
		}
		else if(this.heading == "d"){
			this.y += 0.5;
		}

	}

	this.resetPosition = function() {
		this.x = 13;
		this.y = 15;
		this.counter = 0;
		this.reset = false;
	}

	this.collide = function(a,b) {
		return (this.x <= a + 1 && this.x >= a-1) && (this.y <= b + 1 && this.y >= b-1);
	}

	this.run = function() {
		if (this.counter <17) {
			this.leaveSafe();
		}
		if (this.counter > 16 && !this.reset) {
			this.move();
		}
		this.counter += 1;
		if (this.collide(player.x, player.y)) {
			player.resetPosition();
		}
		if (this.reset) {
			this.resetPosition();
		}

	}
}

var ghostRed = new Ghost("red");
var ghostBlue = new Ghost("blue");

var draw = function() {
	ctx.clearRect(0, 0, width, height);
	// render movable scene
	obstacles.forEach(function(e){
		e.render("blue");
	})

	player.render();
	ghostRed.render("red");
	ghostBlue.render("blue");

	// listen to inputs

	if ((keys[39] || keys[68]) && canMove(player,"r") ) {
		// right arrow
		player.changeDirection("r");
	}
	if ((keys[37] || keys[65]) && canMove(player,"l")) {
		// left arrow
		player.changeDirection("l");
	}
	if (keys[38] && canMove(player,"u")){
		player.changeDirection("u");
	}
	if (keys[40] && canMove(player,"d")){
		player.changeDirection("d");
	}
	if(canMove(player, player.heading)){
		 player.move();
	}
	

	//requestAnimationFrame(draw);
}

//key listeners
document.body.addEventListener("keydown", function (e) {
	keys = [];
	keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
	keys[e.keyCode] = false;
});

//start the loop
/*window.addEventListener("load", function () {
	draw();
});*/
setInterval(draw, 100);
/*obstacles = [];
var r = new Rectangle(new Point(1,1), 3,3);
var r2 = new Rectangle(new Point(5,5), 3,3);
r.render();
r2.render();
obstacles.push(r);
obstacles.push(r2);
console.log(pointInObstacle(5,5));*/


