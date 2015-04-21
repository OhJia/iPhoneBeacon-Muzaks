var eSize = 10;
var x_2000 = 10;
var y_2000 = 10;
var x_2002 = 10;
var y_2002 = 10;
var x_2003 = 10;
var y_2003 = 10;
var speed = 1;
var distance;

var osc;
var env;
var ampReader;

var bgColor;
var notes = [60, 62, 61, 55, 53, 50, 48, 50];
var index = 0;
var myLoop;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(153);
	var p5Container = document.getElementById(p5Container);
	var myCan = createCanvas(windowWidth, windowHeight);
	myCan.parent('p5Container');
	x = windowWidth/2;
	y = windowHeight/2;

	myPhrase = new p5.Phrase('phrase', playSound, notes);

	myLoop = new p5.Part();
	myLoop.addPhrase(myPhrase);
	myLoop.loop();

	initSound();
}

function draw() {
	//if (touchIsDown){
		background(255);
		var c = color(255, 0, 0, 200);
		var c2 = color(0, 0, 255, 200);
		var c3 = color(0, 255, 0, 200);
		
		

		fill(c2);
		noStroke();
		ellipse(20, 20, x_2000, x_2000);
		fill(c);
		ellipse(100, 100, x_2002, x_2002);
		fill(c3);
		ellipse(50, 50, x_2003, x_2003);
		// fill(c);
		// ellipse(windowWidth/2, windowHeight/2, eSize, eSize);

	 // 	if ((x > windowWidth) || (x < 0) || (y > windowHeight) || (y < 0)) {
	 // 		speed = -speed;
	 // 	}
	 // 	distance = dist(windowWidth/2, windowHeight/2, x, y);
	 // 	if (distance <= 10) {
	 // 		speed = -speed;
	 // 	}


	//}
}

function initSound() {
  osc = new p5.Oscillator();
  osc.setType('triangle');
  // env = new p5.Env(0.01, .75, 0.5, 0.2, 0.5, 0);
  osc.start();
  osc.amp(1);
  // osc.amp(env);
}

function playSound(note) {
  // alert('play sound!');
  // var note = notes[index % notes.length];
  note = midiToFreq(note + 12);
  osc.freq(note)
  // env.play();
  index++;
}

function changeBpm(rssi){
	// get bpm based on distance
	var bpm = map(rssi, -100, 0, 10, 300);

	if (typeof (myLoop) !== 'undefined') {
		myLoop.setBPM(bpm);
	}
}

function changeSize(rssi_2000, rssi_2002, rssi_2003) {
	x_2000 = rssi_2000;
	x_2002 = rssi_2002;
	x_2003 = rssi_2003;
	console.log("size changed!");
}
