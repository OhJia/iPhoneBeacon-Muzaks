var eSize = 10;
var x_2000 = 10;
var x_2002 = 10;
var x_2003 = 10;
var center_x, center_y;
var posX2000, posY2000, pos2002, pos2003;
var creature2000, creature2002, creature2003;
var speed = 1;
var distance;

var creatures = [];
var el;
var dist;

// var Creatures = {
//   rssi: null,
//   minor: null,
//   pos_x: null,
//   pos_y: null
// }

var synths = new Array(4);
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
	var myCan = createCanvas(windowWidth, windowHeight-100);
	myCan.parent('p5Container');
	center_x = windowWidth/2;
	center_y = windowHeight/2 - 50;
  posX2000 = random(50, 300);
  posY2000 = random(50, 300);
  pos2002 = random(50, 300);
  pos2003 = random(50, 300);

	initSound();

  creatures.push({
    rssi: null,
    radians: -120,
    color: color(0,0,255),
    tapped: false,
    pos_x: null,
    pos_y: null
  });

  creatures.push({
    rssi: null,
    radians: 120,
    color: color(0,255,0),
    tapped: false
  });

  creatures.push({
    rssi: null,
    radians: 30,
    color: color(255,0,200),
    tapped: false
  });
}

function draw() {
    background(255,0,0);
    var c = color(255, 0, 0, 200);
    var c2 = color(0, 0, 255, 200);
    var c3 = color(0, 255, 0, 200);
    
    // draw region
    noFill();
    stroke(255,255,255);
    for (var i = 0; i < 6; i++) {
      polygon(center_x, center_y, 40 * i);
    }

    // draw me
    noStroke();
    fill(color(255,255,255));
    ellipse(center_x, center_y, 50, 50);
    //console.log(center_x, center_y);
		
    // center based on distance
    var pos_x, pos_y, el;
    for(var i = 0; i < creatures.length; i++) {
      creatures[i].tapped = false;
      fill(creatures[i].color);
      creatures[i].pos_x = center_x + creatures[i].rssi * cos(radians(creatures[i].radians));
      creatures[i].pos_y = center_y + creatures[i].rssi * sin(radians(creatures[i].radians));
      creatures[i].shape = ellipse(creatures[i].pos_x, creatures[i].pos_y, 40 - creatures[i].rssi/10, 40 - creatures[i].rssi/10);
      //creatures[i].radians = creatures[i].radians+0.2;
    }

}

$("#p5Container").click(touching);
function touching(){

  for (var i = 0; i < creatures.length; i++){
    var cx = creatures[i].pos_x;
    var cy = creatures[i].pos_y;

    if (dist(cx,cy,touchX,touchY) < 30) {
      creatures[i].tapped = true;
      //alert ('touched!');
      alert('rssi: '+creatures[i].rssi);
      initSound();
      // If so, keep track of relative location of click to corner of rectangle
      // offsetX = x-mx;
      // offsetY = y-my;
    }
  }
  return false;
}


function polygon(x, y, radius) {
  var angle = TWO_PI / 4;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// document.addEventListener('touchmove', function(e) {
//     e.preventDefault();
//     var touch = e.touches[0];
//     posX2000 = touch.pageX;
//     posY2000 = touch.pageY;
//     console.log(touch.pageX + " - " + touch.pageY);
// }, false);

// document.body.addEventListener('touchstart', function(e){
//     var touchlist = e.touches;
//     e.preventDefault();
//     for (var i=0; i<touchlist.length; i++){ // loop through all touch points currently in contact with surface
//         //do something with each Touch object (point)
//         console.log(touchlist[i]);
//     }
// }, false)

// creature2002.ontouchmove = function(e){
//   e.preventDefault();
//   console.log(e.touches.length);
//   if(e.touches.length == 1){ // Only deal with one finger
//     var touch = e.touches[0]; // Get the information for finger #1
//     var node = touch.target; // Find the node the drag started from
//     node.style.position = "absolute";
//     node.style.left = touch.pageX + "px";
//     node.style.top = touch.pageY + "px";
//   }
// }

function initSound() {

  for (var i = 0; i < synths.length; i++) {
    synths[i] = new Tone.MonoSynth();
    synths[i].oscillator.type = "sine";
    synths[i].toMaster();
  }

  Tone.Transport.setInterval(play2000, "32n");
  Tone.Transport.setInterval(play2001, "32n");
  Tone.Transport.setInterval(play2002, "32n");
  Tone.Transport.setInterval(play2003, "32n");

  Tone.Transport.start();

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
  var i = indexes[0]++ % indexModulos[0];
  if (counters[0][i] === 1 ) {
    synths[0].triggerAttackRelease('C4', 0.12, Tone.Transport.now(), 0.1 );
  }
}

function play2001(time) {
  var i = indexes[1]++ % indexModulos[1];
  if (counters[1][i] === 1 ) {
    synths[1].triggerAttackRelease('E4', 0.1, Tone.Transport.now(), 0.1 );
  }
}

function play2002(time) {
  var i = indexes[2]++ % indexModulos[2];
  if (counters[2][i] === 1 ) {
    synths[2].triggerAttackRelease('G3', 0.1, Tone.Transport.now(), 0.1);
  }
}

function play2003(time) {
  var i = indexes[3]++ % indexModulos[3];
  if (counters[3][i] === 1 ) {
    synths[3].triggerAttackRelease('D4', 0.1, Tone.Transport.now(), 0.1 );
  }
}


function changeSize(rssi) {
  //console.log(rssi);
  for (var i = 0; i < creatures.length; i++){
    // creatures[i].rssi = rssi[2000+i];
    creatures[i].rssi = map(rssi[2000+i], 20, 100, 0, 200);

  }

	// x_2000 = rssi_2000;
	// x_2002 = rssi_2002;
	// x_2003 = rssi_2003;
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

