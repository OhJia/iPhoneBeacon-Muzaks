// INSTRUMENTS
var aimSampler, aimInDown, drumSampler;


var aimSamplePaths = ['a0.mp3', 'a1.wav', 'a2.mp3', 'a3.mp3', 'a4.wav'];

// either choose from a scale

var pitchScale = [-12, -9, -7, -5, 0, 2, 7];
var pitchOffset = 0;
var pitcher = 22;

var drumPitchOffset = 0;

// or play a pattern
var iPat = 0;
var pattern = [-12];


///////////// MASTER OUTPUT MIX

var highPass = new Tone.Filter();
highPass.type = 'highpass';
highPass.frequency.value = 70;
highPass.Q.value = 0.2;
highPass.toMaster();

// everything connects to the MasterMix, then to WetDry to control convolution and filter
var masterMix = Tone.context.createGain();

// MasterMix connects to MasterWetDry. 1 is the only channel we are currently using...
var masterWetDry = new Tone.CrossFade(1);

// filter goes to both 0 (dry) and 1 (wet)
var masterFilter = new Tone.Filter();
masterMix.connect(masterFilter);
// masterFilter.connect(masterConvolver, 0, 0);
masterFilter.connect(masterWetDry, 0, 1);
masterFilter.Q.value = 3;
masterFilter.frequency.value = 20;
masterFilter.type = 'lowpass';
// wetDry goes to master
var finalEQ = new Tone.EQ(-4, -12, -3);
finalEQ.lowFrequency.value = 105;
finalEQ.highFrequency.value = 4700;
masterWetDry.connect(finalEQ);
// finalEQ.toMaster();
finalEQ.connect(highPass);

var delay = new Tone.FeedbackDelay('8n', 0.12);

var delayFilter = new Tone.Filter();

delayFilter.output.gain.value = 0.02;
delay.output.gain.value = 0.02;
delayFilter.connect(delay);
delay.connect(delayFilter);
masterWetDry.connect(delay);
// delayFilter.toMaster();
// delay.toMaster();
delayFilter.connect(highPass);
delay.connect(highPass);

var masterConvolver = Tone.context.createConvolver();
var convolverBuffer = new Tone.Buffer('./audio/IR/small-plate.mp3', function() {
    masterConvolver.buffer = convolverBuffer._buffer;
});
delay.connect(masterConvolver);
// masterConvolver.toMaster();
masterConvolver.connect(highPass);


function initAIMSampler(index) {
  var samplePath = aimSamplePaths[index];

  aimSampler = new Tone.Sampler(samplePath);

  aimInDown = new Tone.Sampler('b1.mp3');

  drumSampler = new Tone.Sampler( {
    '1' : 'audio/bongo_01.mp3',
    // '2' : 'audio/aim/thwap.mp3',
    // '3' : 'audio/fb/fbPercussion1.mp3',
    '2' : 'audio/tom_01.wav',
    '3' : 'audio/dink_04.mp3',
    '4' : 'audio/aim/rmblock.wav',
    '5' : 'audio/bongo_02.mp3',
    '6' : 'audio/triangle_01.mp3',
    '7' : 'audio/triangle_03.mp3',
    'me' : samplePath
  });

  drumSampler.envelope.attack = 0.02;
  drumSampler.envelope.release = 0.50;

  aimSampler.connect(masterMix);
  aimInDown.connect(masterMix);
  drumSampler.connect(masterMix);

  var drumGain = Tone.context.createGain();
  drumGain.gain.value = 0.4;
  drumSampler.connect(drumGain);
  drumGain.connect(masterConvolver);

  aimInDown.pitchScale = [-13, -6, -8, -25];

  //document.addEventListener('mousedown', playOtherSound);

  // setupDrumPattern1();
}

function playAIM() {
  // var pitchIndex = Math.floor( Math.random() * pitchScale.length);
  // var pitch = pitchScale[pitchIndex];
  // aimSampler.pitch = pitch;
  if (typeof(aimSampler) !== 'undefined' && aimSampler._buffers[0].loaded) {
    aimSampler.pitch = pattern[iPat % pattern.length] + pitchOffset;

    iPat++;

    aimSampler.triggerAttack(0);

  }
  
}


Tone.Transport.bpm.value = 132;

Tone.Buffer.onload = function() {
  Tone.Transport.start();

  Tone.Transport.setInterval(playAIM, "4n");

  Tone.Transport.setInterval(function(time){
    if (typeof(aimInDown) !== 'undefined' && aimInDown._buffers[0].loaded) {

      aimInDown.pitch = 12;

      aimInDown.triggerAttack(0, time);
    }
  }, "14 * 1n");
}

function playOtherSound() {
  var pitchIndex = Math.floor( Math.random() * aimInDown.pitchScale.length);
  var pitch = aimInDown.pitchScale[pitchIndex] + pitchOffset;
  aimInDown.pitch = pitch;

  aimInDown.triggerAttack(0);
}


// drum loop
var drumIntervals = [];
drumSampler.pitch = -8;

function setupDrumPattern1() {
  var x = Tone.Transport.setInterval(function(time){
    drumSampler.triggerAttack(1, time);
  }, "1m");

  drumIntervals.push(x);

  x = Tone.Transport.setInterval(function(time){
    // drumSampler.pitch = -5;
    drumSampler.triggerAttack(5, "+3*4n");
  }, "2m");

  drumIntervals.push(x);

  x = Tone.Transport.setInterval(function(time){
    drumSampler.triggerAttack(4, "+2n");
  }, "1n");

  drumIntervals.push(x);
}


function setupDrumPattern2() {
  var x = Tone.Transport.setInterval(function(time){
    drumSampler.triggerAttack(1, time, 0.2);
  }, "4n");

  drumIntervals.push(x);

  x = Tone.Transport.setInterval(function(time){
    // drumSampler.pitch = -5;
    drumSampler.triggerAttack(5, "+3*4n");
  }, "2m");

  drumIntervals.push(x);

  x = Tone.Transport.setInterval(function(time){
    drumSampler.triggerAttack(4, "+2n");
  }, "1n");

  drumIntervals.push(x);

  x = Tone.Transport.setInterval(function(time){
    drumSampler.triggerAttack(7, time);
  }, "4m");

  drumIntervals.push(x);

  x = Tone.Transport.setInterval(function(time){
    drumSampler.triggerAttack(6, "+4m -1n");
  }, "4m");

  drumIntervals.push(x);
}


function toggleLoops(playMode) {
  if (!playMode) {
    for (var i = 0; i < drumIntervals.length; i++) {
      Tone.Transport.clearInterval(drumIntervals[i]);
    }
  }

  // if there are no other beacons, use the default loop
  else if (otherMinors.length === 0 && Object.keys(creatures).length === 0) {
    // pick a random drum loop
    var x = Math.random();
    x > 0.5 ? setupDrumPattern1() : setupDrumPattern2();
  }

  // if there are beacons and playMode is true, start loop based on RSSI's
  else {
    startDrumRSSILoop();
  }
}

////// person enter / leaving: play AOL door open/close

var doorOpen = new Tone.Player('audio/s0.mp3');
var doorClose = new Tone.Player('audio/s1.mp3');
doorOpen.toMaster();
doorClose.toMaster();

function creatureEnterSound(minor) {
  doorOpen.start();

  addDrumForCreature(minor);
}

function creatureLeaveSound() {
  doorClose.start();
}


// trigger my sound
function attackMySound() {
  var time = Tone.Transport.now();

  // change pitch
  drumSampler.pitch = pitchOffset;

  drumSampler.triggerAttack('me', time);
  triggered = 1;

  var oldFreq = masterFilter.frequency.value;
  masterFilter.frequency.setValueAtTime(oldFreq, masterFilter.now() );


  masterFilter.frequency.cancelScheduledValues(masterFilter.now());
  masterFilter.frequency.exponentialRampToValueAtTime(20000, masterFilter.now() + 0.5 );
}

// release my sound
function releaseMySound() {
  var time = Tone.Transport.now();
  drumSampler.triggerRelease(time);
  var freq = constrain( map(triggered, 0, 1, 20, 18000), 20, 20000);
  masterFilter.frequency.exponentialRampToValueAtTime(freq, masterFilter.now() + 3 );
}


//////////// Drum playback & Loops based on RSSI

function startDrumRSSILoop() {

  var x = Tone.Transport.setInterval(playAllTheDrums32, "32n");
  drumIntervals.push(x);

  x =  Tone.Transport.setInterval(playAllTheDrums16, "16n");
  drumIntervals.push(x);

  x = Tone.Transport.setInterval(playAllTheDrums4, "4n");
  drumIntervals.push(x);
}


// every 32nd note, decide whether to play each drum based on its creature's RSSI and some randomness...
function playAllTheDrums32(time) {

  for (var i = 0; i < otherMinors.length; i++) {
    var _minor = otherMinors[i];
    var _rssi = creatures[_minor].rssi;
    var randomness = Math.random();
    var rssiMap = logScale(_rssi);
    // var rssiMap = map(logRSSI, 1, 100, 0.5, 1);

    var tapped = creatures[String(_minor)].tapped;

    if (randomness * rssiMap > 80 && tapped < 15) {
      var velocity = map(_rssi, -120, -20, 0.1, 0.7);
      playDrumBasedOnMinor(_minor, time, velocity);

      tapCreature(_minor);
    }
  }
}

// every 16th note, decide whether to play each drum based on its creature's RSSI and some randomness...
function playAllTheDrums16(time) {

  for (var i = 0; i < otherMinors.length; i++) {
    var _minor = otherMinors[i];
    var _rssi = creatures[_minor].rssi;
    var randomness = Math.random();
    var rssiMap = logScale(_rssi);

    var tapped = creatures[String(_minor)].tapped;

    if (randomness * rssiMap > 75 && tapped < 10) {
      var velocity = map(_rssi, -120, -20, 0.1, 0.8);
      playDrumBasedOnMinor(_minor, time, velocity);

      tapCreature(_minor);
    }

  }
}

// every 1/4 note
function playAllTheDrums4(time) {

  for (var i = 0; i < otherMinors.length; i++) {
    var _minor = otherMinors[i];
    var _rssi = creatures[_minor].rssi;
    var randomness = Math.random();

    var rssiMap = logScale(_rssi);

    var tapped = creatures[String(_minor)].tapped;

    if (randomness * rssiMap > 50 && tapped < 10) {
      var velocity = map(_rssi, -120, -20, 0.1, 0.9);
      playDrumBasedOnMinor(_minor, time, velocity);
      tapCreature(_minor);
    }
  }
}

// play the drum samples
function playDrumBasedOnMinor(_minor, time, velocity) {
  var t = time || Tone.Transport.now();
  var v = velocity || 1;
  var whichDrum = possibleMinors.indexOf(Number(_minor)) + 1;
  drumSampler.pitch = drumPitchOffset;
  // drumSampler.triggerRelease(time);
  drumSampler.triggerAttack(whichDrum, time + 0.02, v);
}

// thank you http://stackoverflow.com/a/846249/2994108
function logScale(num) {
  // rssi will be between -120 and -10
  var minp = -120;
  var maxp = -10;

  // The result should be between 50 an 100
  var minv = Math.log(20);
  var maxv = Math.log(100);

  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);

  return Math.exp(minv + scale*(num-minp));
}