var eSize = 10;
var x_2000 = 10;
var x_2001 = 10;
var x_2002 = 10;
var x_2003 = 10;
var x_2004 = 10;
var posX2000, posY2000, pos2001, pos2002, pos2003, pos2004;
var creature2000, creature2001, creature2002, creature2003, creature2004;
var speed = 1;
var distance;

// var synths = new Array(4);
var samplers = new Array(4);
var samplerNames = ['balafon', 'bongo', 'dink', 'panflute', 'triangle'];

var counters = [new Array(100), new Array(100), new Array(100), new Array(100)];
var indexes = [0, 0, 0, 0];
// var indexModulos = [20, 33, 10, 66]; // good for tests

var indexModulos = [10000, 10000, 10000, 10000]; // good for tests

for (var i = 0; i < counters.length; i++) {
  counters[i][0] = 1; 
}

var ampReader;

var bgColor;

function setup() {
	//createCanvas(windowWidth, windowHeight);
	//background(0,160,0);
	var p5Container = document.getElementById(p5Container);
	var myCan = createCanvas(windowWidth, windowHeight);
	myCan.parent('p5Container');
	x = windowWidth/2;
	y = windowHeight/2;
  posX2000 = random(50, 300);
  posY2000 = random(50, 300);
  pos2001 = random(50, 300);
  pos2002 = random(50, 300);
  pos2003 = random(50, 300);
  pos2004 = random(50, 300);

	initSound();
}

function draw() {
	//if (touchIsDown){
    noStroke();
		background(255,0,0);
		var c = color(255, 0, 200, 200);
    var c1 = color(0, 255, 200, 200);
		var c2 = color(0, 0, 255, 200);
		var c3 = color(0, 255, 0, 200);
    var c4 = color(255, 200, 0, 200);
		
		
		fill(c); 
		noStroke();
		creature2000 = ellipse(posX2000, posY2000, x_2000, x_2000);
		fill(c1);
    creature2001 = ellipse(pos2001, pos2001, x_2001, x_2001);
    fill(c2);
		creature2002 = ellipse(pos2002, pos2002, x_2002, x_2002);
		fill(c3);
		creature2003 = ellipse(pos2003, pos2003, x_2003, x_2003);
    fill(c4);
    creature2004 = ellipse(pos2004, pos2004, x_2004, x_2004);

}

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var touch = e.touches[0];
    posX2000 = touch.pageX;
    posY2000 = touch.pageY;
    console.log(touch.pageX + " - " + touch.pageY);
}, false);

// $(document).on('tap', '#pocket-bttn', function(){ 
//         $.mobile.changePage( $('#pocket') );
//         return false;
//         //alert('change page!');
// });

// $(document).on('tap', '#main-bttn', function(){ 
//         $.mobile.changePage( $('#main') );
//         draw();
//         return false;
//         //alert('change page!');
// });

function initSound() {

  // samplers
  for (var i = 0; i < samplers.length; i++) {
    var samplerName = samplerNames[i];
    samplers[i] = new Tone.Sampler ( [
      "../www/audio/" + samplerName + "_01.mp3",
       "../www/audio/" + samplerName + "_02.mp3", "../www/audio/" + samplerName + "_03.mp3", 
      "../www/audio/" + samplerName + "_04.mp3"
    ]
    );
    samplers[i].toMaster();
  }

  Tone.Transport.setInterval(play2000, "32n");
  Tone.Transport.setInterval(play2001, "32n");
  Tone.Transport.setInterval(play2002, "32n");
  Tone.Transport.setInterval(play2003, "32n");

  // start once all the audio buffers have loaded
  Tone.Buffer.onload = function() {
    console.log('loaded buffer');
    Tone.Transport.start();
  }

}

// function initLoop(playMinor) {
//   Tone.Transport.setInterval(playMinor, "32n");
//   // Tone.Transport.setInterval(play2000, "32n");
//   // Tone.Transport.setInterval(play2001, "32n");
//   // Tone.Transport.setInterval(play2002, "32n");
//   // Tone.Transport.setInterval(play2003, "32n");
// }

// function removeLoop(playMinor) {
//   Tone.Transport.clearInterval(playMinor);
// }


function play2000(time) {
  var t = time || Tone.Transport.now();
  var i = indexes[0]++ % indexModulos[0];
  if (counters[0][i] === 1 ) {
    var whichSample = Math.floor(Math.random()*4);
    var velocity = map( Math.random(), 0, 1, 0.5, 0.75);
    samplers[0].triggerAttack(whichSample, t, velocity);
    // synths[0].triggerAttackRelease('C4', 0.12, Tone.Transport.now(), 0.1 );
  }
}

function play2001(time) {
  var t = time || Tone.Transport.now();
  var i = indexes[1]++ % indexModulos[1];
  if (counters[1][i] === 1 ) {
    var whichSample = Math.floor(Math.random()*4);
    var velocity = map( Math.random(), 0, 1, 0.5, 0.75);
    samplers[1].triggerAttack(whichSample, t, velocity);

    // synths[1].triggerAttackRelease('E4', 0.1, Tone.Transport.now(), 0.1 );
  }
}

function play2002(time) {
  var t = time || Tone.Transport.now();
  var i = indexes[2]++ % indexModulos[2];
  if (counters[2][i] === 1 ) {
    var whichSample = Math.floor(Math.random()*4);
    var velocity = map( Math.random(), 0, 1, 0.5, 0.75);
    samplers[2].triggerAttack(String(whichSample), t, velocity);

    // synths[2].triggerAttackRelease('G3', 0.1, Tone.Transport.now(), 0.1);
  }
}

function play2003(time) {
  var t = time || Tone.Transport.now();
  var i = indexes[3]++ % indexModulos[3];
  if (counters[3][i] === 1 ) {
    var whichSample = Math.floor(Math.random()*4);
    var velocity = map( Math.random(), 0, 1, 0.5, 0.75);
    samplers[3].triggerAttack(String(whichSample), t, velocity);

    // synths[3].triggerAttackRelease('D4', 0.1, Tone.Transport.now(), 0.1 );
  }
}


// function changeSize(rssi_2000, rssi_2002, rssi_2003) {
// 	x_2000 = rssi_2000;
// 	x_2002 = rssi_2002;
// 	x_2003 = rssi_2003;
// 	//console.log("size changed!");
// }

function changeSize(rssi_2000, rssi_2001, rssi_2002, rssi_2003, rssi_2004) {
  //console.log('size changed')
  x_2000 = rssi_2000;
  x_2001 = rssi_2001;
  x_2002 = rssi_2002;
  x_2003 = rssi_2003;
  x_2004 = rssi_2004;
  //console.log("size changed!");
}

// var tempos = [100/4, 100/8*3, 100/2, 100];


function tweakBeaconSound(beacon) {
  var minor = beacon.minor;
  var rssi = beacon.rssi;
  var indexModulo = Math.round( map(rssi, -80, -20, 50, 2) );

  if (rssi === 0) {
    indexModulo = 10000000;
  }

  //console.log('tweakin beacon' + minor);

  switch(Number(minor)) {
    case 2000:
      indexModulos[0] = indexModulo;
      break;
    case 2001:
      indexModulos[1] = indexModulo;
      break;
    case 2002:
      indexModulos[2] = indexModulo;
      break;
    case 2003:
      indexModulos[3] = indexModulo;
      break;
  }

  //console.log(indexModulos);

}

