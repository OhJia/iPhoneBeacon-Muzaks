var eSize = 10;
var x_2000 = 10;
var x_2002 = 10;
var x_2003 = 10;
var center_x, center_y;
//var posX2000, posY2000, pos2002, pos2003;
//var creature2000, creature2002, creature2003;
var speed = 1;
var distance;
var background_color = [255,128,255]
var center_tapped = false;

/** uncomment this when not testing **/
//var creatures = {};
var cCount;

/** TESTING ONLY --> **/
var creatures = {
  '2000' : {
    'minor' : 2000,
    'rssi' : -20,
    'pos_x' : 1,
    'pos_y' : 3,
    'color' : [250, 0, 0],
    'radians' : 45,
    'tapped' : true,
    'id' : 'Sleepy Taiga',
    'info' : 'I\'m sleepy. Stay happy.'
  },
  '2001' : {
    'minor' : 2000,
    'rssi' : -50,
    'pos_x' : 1,
    'pos_y' : 3,
    'color' : [0, 250, 0],
    'radians' : 180,
    'tapped' : true,
    'id' : 'Sleepy Taiga',
    'info' : 'I\'m sleepy. Stay happy.'
  },
  '2002' : {
    'minor' : 2000,
    'rssi' : -70,
    'pos_x' : 1,
    'pos_y' : 3,
    'color' : [0, 0, 250],
    'radians' : 90,
    'tapped' : true,
    'id' : 'Sleepy Taiga',
    'info' : 'I\'m sleepy. Stay happy.'
  },
  '2003' : {
    'minor' : 2000,
    'rssi' : -50,
    'pos_x' : 1,
    'pos_y' : 3,
    'color' : [0, 250, 250],
    'radians' : 270,
    'tapped' : true,
    'id' : 'Sleepy Taiga',
    'info' : 'I\'m sleepy. Stay happy.'
  }
}
otherMinors = Object.keys(creatures);
/** <-- end testing **/


var dist;
var tappedC, tapped;


var bgColor;

function setup() {
	//createCanvas(windowWidth, windowHeight);
	//background(0,160,0);
  // var p5Container = document.getElementById('p5Container');
  var myCan = createCanvas(windowWidth, windowHeight);
	myCan.parent('p5Container');
	center_x = windowWidth/2;
	center_y = windowHeight/2 - 50;
  // posX2000 = random(50, 300);
  // posY2000 = random(50, 300);
  // pos2002 = random(50, 300);
  // pos2003 = random(50, 300);
  center_tapped = false;

  setupDeviceEvents();

  center_tapped = true;
  cCount = 0;
}

function draw() {
    background(background_color[0], background_color[1], background_color[2]);
    var c = color(255, 0, 0, 200);
    var c2 = color(0, 0, 255, 200);
    var c3 = color(0, 255, 0, 200);

    if (center_tapped === true) center_tapped = 25; // set increment value
    
    // draw region
    noStroke();
    //stroke(255,255,255);
    //strokeWeight(3);
    for (var i = 0; i < 6; i++) {
      //if (center_tapped && center_tapped >= 0) {
        fill(250, 80-i*10);
        push();
        // TODO : SMARTER ROTATE HERE
        translate(center_x, center_y)
        rotate(frameCount / (200.0 + (10*i)));
        polygon(i,i, 40 * i);
        pop();
      //} else {
        //polygon(center_x, center_y, 40 * i);
      //}
    }

    // draw me
    noStroke();
    // draw if center tapped
    if (center_tapped && center_tapped >= 0) {
      fill(color(255,255,255, center_tapped * 10.2)); // (25 steps, need to be based on 255 for opacity)
      ellipse(center_x, center_y, 50 + (25 - center_tapped), 50 + (25 - center_tapped)); // increase size of ellipse as fade out
      --center_tapped; // decrement to 0
    }
    // draw center
    fill(color(255,255,255));
    ellipse(center_x, center_y, 50, 50);

    // update count
    cCount = Object.keys(creatures).length;
    console.log(cCount);
    $('#left-count').html(cCount);
		
    // draw each creature
    //var pos_x, pos_y;
    for(var minor in creatures) {
      // draw if creature was tapped
      if (creatures[minor].tapped === true) {
        creatures[minor].tapped = 25; // set increment value
        tappedC = creatures[minor];
        
      } 
      if (creatures[minor].tapped && creatures[minor].tapped >= 0) {
        //console.log(creatures[minor]);
        fill(color(creatures[minor].color[0], creatures[minor].color[1], creatures[minor].color[2],creatures[minor].tapped * 10.2)); // (25 steps, need to be based on 255 for opacity)
        creatures[minor].pos_x = center_x + 2.5*creatures[minor].rssi * cos(radians(creatures[minor].radians));
        creatures[minor].pos_y = center_y + 3*creatures[minor].rssi * sin(radians(creatures[minor].radians));
        creatures[minor].shape = ellipse(creatures[minor].pos_x, creatures[minor].pos_y, (40 - creatures[minor].rssi/10) + (25 - creatures[minor].tapped), 40 - creatures[minor].rssi/10 + (25 - creatures[minor].tapped) ); // increase size of ellipse as fade out
        
        --creatures[minor].tapped; // decrement to 0
      }


      fill(creatures[minor].color);
      creatures[minor].pos_x = center_x + 2.5*creatures[minor].rssi * cos(radians(creatures[minor].radians));
      creatures[minor].pos_y = center_y + 3*creatures[minor].rssi * sin(radians(creatures[minor].radians));
      creatures[minor].shape = ellipse(creatures[minor].pos_x, creatures[minor].pos_y, 40 - creatures[minor].rssi/10, 40 - creatures[minor].rssi/10);
      //creatures[minor].radians = creatures[minor].radians+0.2;
    }

    if (tapped === true){
      showTappedInfo(tappedC);
    }

  updateCreatures();

}

// rotate creatures
function updateCreatures() {
  var creatureList = Object.keys(creatures);
  for (var i = 0; i < creatureList.length; i++) {
    creatures[creatureList[i]].radians += sin(creatures[creatureList[i]].rssi);
  }
}

// called when a sound is played to inflate the creature size
function tapCreature(minorNumber) {
  creatures[String(minorNumber)].tapped = 25; // set increment value
}

// $("#p5Container").click(touchEnd);
$('#p5Container').on('touchstart', touchStart);
$('#p5Container').on('touchend', touchEnd);

function touchStart(e){
  console.log('touch start');
  e.preventDefault();

  if (tapped === true) tapped = false;

  var tX = e.originalEvent.touches[0].pageX;
  var tY = e.originalEvent.touches[0].pageY;

  // detect if creature is touched
  for (var minor in creatures){
    var cx = creatures[minor].pos_x;
    var cy = creatures[minor].pos_y;
    
    if (dist(cx,cy,tX,tY) < 30) {
      creatures[minor].tapped = true;
      tappedC = creatures[String(minor)];
      tapped = true; // to show creature info

      var velocity = map(creatures[minor].rssi, -120, -20, 0.7, 0.9);

      // play their sound
      playDrumBasedOnMinor(minor, Tone.Transport.now(), velocity);

      return false;     
    }
  }

  // detect if center is touched
  if (dist(center_x,center_y,tX,tY) < 50) {
    center_tapped = true;
    attackMySound();
    return false;
  }

  return false;
}

function touchEnd(e) {
  console.log('touch end');
  releaseMySound();
}

function showTappedInfo(creature){
  if (tapped){
    fill(0, 200);
    rect(creature.pos_x-2, creature.pos_y+30, textWidth(creature.id)+10, 30);
    fill(255);
    text(creature.id, creature.pos_x, creature.pos_y+30, textWidth(creature.id)+10, 30);
    fill(0, 200);
    rect(creature.pos_x-2, creature.pos_y+70, textWidth(creature.info)+10, 30);
    fill(255);
    text(creature.info, creature.pos_x, creature.pos_y+70, textWidth(creature.info)+10, 30);
  }
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

// ctx.beginPath();
// ctx.moveTo(20, 10);
// ctx.lineTo(80, 10);
// ctx.quadraticCurveTo(90, 10, 90, 20);
// ctx.lineTo(90, 80);
// ctx.quadraticCurveTo(90, 90, 80, 90);
// ctx.lineTo(20, 90);
// ctx.quadraticCurveTo(10, 90, 10, 80);
// ctx.lineTo(10, 20);
// ctx.quadraticCurveTo(10, 10, 20, 10);
// ctx.stroke();

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

// function changeSize(rssi) {
//   //console.log(rssi);
//   // for (var i = 0; i < creatures.length; i++){
//     for (var minor in creatures){
//     // creatures[i].rssi = rssi[2000+i];
//     creatures[minor].rssi = map(rssi[2000+i], 20, 100, 0, 200);

//   }

//  //console.log("size changed!");
// }


// toggle play mode when play button is clicked

var playMode = false;

function playClicked(e) {
  playMode = !playMode;

  // change SVG
  if (playMode){
    $('#play-on').hide();
    $('#pause-off').show();
  } else {
    $('#play-on').show();
    $('#pause-off').hide();
  }

  toggleLoops(playMode);
}

