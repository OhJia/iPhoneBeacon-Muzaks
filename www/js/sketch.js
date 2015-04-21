var eSize = 10;
var x = 10;
var y = 10;
var speed = 1;
var distance;

var osc2000, osc2001, osc2002, osc2003;
var env2000, env2001, env2002, env2003;
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

  phrase2000 = new p5.Phrase('phrase2000', play2000, [60, 0, 0, 0]);
  phrase2001 = new p5.Phrase('phrase2001', play2001, [52, 0, 0, 0]);
  phrase2002 = new p5.Phrase('phrase2002', play2002, [64, 0, 0, 0]);
  phrase2003 = new p5.Phrase('phrase2003', play2003, [72, 0, 0 , 0]);


	// myLoop = new p5.Part();
	// myLoop.addPhrase(myPhrase);
	// myLoop.loop();

  loop2000 = new p5.Part();
  loop2001 = new p5.Part();
  loop2002 = new p5.Part();
  loop2003 = new p5.Part();


  loop2000.addPhrase(phrase2000);
  loop2001.addPhrase(phrase2001);
  loop2002.addPhrase(phrase2002);
  loop2003.addPhrase(phrase2003);

  loop2000.setBPM(80);
  loop2000.loop();

	initSound();
}

function draw() {
	//if (touchIsDown){
		background(255);
		var c = color(255, 0, 0, 200);
		var c2 = color(0, 0, 255, 200)
		fill(c2);
		noStroke();
		x += speed;
 		y += speed;
		ellipse(x, y, 10, 10);
		fill(c);
		ellipse(windowWidth/2, windowHeight/2, eSize, eSize);

	 	if ((x > windowWidth) || (x < 0) || (y > windowHeight) || (y < 0)) {
	 		speed = -speed;
	 	}
	 	distance = dist(windowWidth/2, windowHeight/2, x, y);
	 	if (distance <= 10) {
	 		speed = -speed;
	 	}


	//}
}

function initSound() {
  osc2000 = new p5.Oscillator();
  osc2000.setType('sine');

  osc2001 = new p5.Oscillator();
  osc2001.setType('sine');

  osc2002 = new p5.Oscillator();
  osc2002.setType('sine');

  osc2003 = new p5.Oscillator();
  osc2003.setType('sine');

  env2000 = new p5.Env(0.1, .8, 0.02, 0.01);
  env2001 = new p5.Env(0.1, .8, 0.02, 0.01);
  env2002 = new p5.Env(0.1, .8, 0.02, 0.01);
  env2003 = new p5.Env(0.1, .8, 0.02, 0.01);


  // env2001 = new p5.Env(0.02, .75, 0.5, 0.2, 0.5, 0);
  // env2002 = new p5.Env(0.02, .75, 0.5, 0.2, 0.5, 0);
  // env2003 = new p5.Env(0.02, .75, 0.5, 0.2, 0.5, 0);

  osc2000.start();
  osc2001.start();
  osc2002.start();
  osc2003.start();

  env2000.setInput(osc2000);
  env2001.setInput(osc2001);
  env2002.setInput(osc2002);
  env2003.setInput(osc2003);

}


function play2000(note) {
  console.log('play2000');
  note = midiToFreq(note);
  osc2000.freq(note);
  env2000.play();
}

function play2001(note) {
  console.log('play2001');
  note = midiToFreq(note);
  osc2001.freq(note);
  env2001.play();
}

function play2002(note) {
  console.log('play2002');
  note = midiToFreq(note);
  osc2002.freq(note);
  env2002.play();
}

function play2003(note) {
  console.log('play2003');

  note = midiToFreq(note);
  osc2003.freq(note);
  env2003.play();
}




// function playSound(note) {
//   // alert('play sound!');
//   // var note = notes[index % notes.length];
//   note = midiToFreq(note + 12);
//   osc.freq(note)
//   // env.play();
//   index++;
// }

// function changeBpm(rssi){
// 	// get bpm based on distance
// 	var bpm = map(rssi, -100, 0, 10, 300);

// 	if (typeof (myLoop) !== 'undefined') {
// 		myLoop.setBPM(bpm);
// 	}
// }


//////// NEW MUSIC STUFF
var tempos = [100/4, 100/8*3, 100/2, 100];


function tweakBeaconSound(beacon) {
  var minor = beacon.minor;
  var rssi = beacon.rssi;

  // switch(Number(minor)) {
  //   case 2000:
  //     .
  // }
}
