// INSTRUMENTS
var aimSampler, aimInDown, drumSampler;


var aimSamplePaths = ['audio/a0.mp3', 'audio/a1.wav', 'audio/a2.mp3', 'audio/a3.mp3', 'audio/a4.wav'];

// either choose from a scale

var pitchScale = [-12, -9, -7, -5, 0, 2, 7];
var pitchOffset = 0;
var pitcher = 22;

var drumPitchOffset = 0;

// or play a pattern
var iPat = 0;
var pattern = [-12];


///////////// MASTER OUTPUT MIX

/**
 *  aimSampler --> myFilter --> masterMix
 *  aimInDown --> masterMix
 *  drumSampler --> masterMix
 *  
 *  master mix --> finalEQ --> highPass
 *
 *  finalEQ --> delay --> delayFilter --> highPass
 *              delay --> masterConvolver --> highPass
 *
 *  drumSampler --> drumGain --> finalEQ
 */

var highPass = new Tone.Filter();
highPass.type = 'highpass';
highPass.frequency.value = 70;
highPass.Q.value = 0.2;
highPass.toMaster();

// everything connects to the MasterMix, then to WetDry to control convolution and filter
var masterMix = Tone.context.createGain();

// filter goes to both 0 (dry) and 1 (wet)
var myFilter = new Tone.Filter();
myFilter.Q.value = 3;
myFilter.frequency.value = 20;
myFilter.type = 'lowpass';

// wetDry goes to master
var finalEQ = new Tone.EQ(-4, -12, -3);
finalEQ.lowFrequency.value = 105;
finalEQ.highFrequency.value = 4700;
finalEQ.connect(highPass);
masterMix.connect(finalEQ);

myFilter.connect(masterMix);

var delay = new Tone.FeedbackDelay('8n', 0.12);

var delayFilter = new Tone.Filter();

delayFilter.output.gain.value = 0.02;
delay.output.gain.value = 0.02;
delayFilter.connect(delay);
delay.connect(delayFilter);
finalEQ.connect(delay);

delayFilter.connect(highPass);
delay.connect(highPass);

var masterConvolver = Tone.context.createConvolver();
var convolverBuffer = new Tone.Buffer('./audio/IR/small-plate.mp3', function() {
    masterConvolver.buffer = convolverBuffer._buffer;
});
delay.connect(masterConvolver);
// masterConvolver.toMaster();
masterConvolver.connect(highPass);

////// person enter / leaving: play AOL door open/close

var doorOpen = new Tone.Player('audio/s0.mp3');
var doorClose = new Tone.Player('audio/s1.mp3');
doorOpen.toMaster();
doorClose.toMaster();


function initAIMSampler(index) {
  var samplePath = aimSamplePaths[index];

  aimSampler = new Tone.Sampler(samplePath);

  // wait until buffer loads to init the waveform canvas...this is a hack...
  setTimeout(function() {
    _initWaveformCanvas();
  }, 2000);

  aimInDown = new Tone.Sampler('audio/b1.mp3');

  drumSampler = new Tone.Sampler( {
    '1' : 'audio/bongo_01.mp3',
    '2' : 'audio/tom_01.wav',
    '3' : 'audio/dink_04.mp3',
    '4' : 'audio/rmblock.wav',
    '5' : 'audio/bongo_02.mp3',
    '6' : 'audio/triangle_01.mp3',
    '7' : 'audio/triangle_03.mp3',
    // '1' : 'audio/a0.mp3',
    // '2' : 'audio/a1.mp3',
    // '3' : 'audio/a2.mp3', 
    // '4' : 'audio/a3.mp3',
    // '5' : 'audio/a4.mp3',
    // '6' : 'audio/dink_04.mp3',
    // '7' : 'audio/triangle_01.mp3',
    'me' : samplePath
  });

  drumSampler.envelope.attack = 0.02;
  drumSampler.envelope.release = 0.50;

  aimSampler.connect(myFilter);
  aimInDown.connect(myFilter);
  drumSampler.connect(masterMix);

  var drumGain = Tone.context.createGain();
  drumGain.gain.value = 0.4;
  drumSampler.connect(drumGain);
  drumGain.connect(finalEQ);

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

function creatureEnterSound(minor) {

  doorOpen.start();

  addDrumForCreature(minor);

}

function creatureLeaveSound() {
  doorClose.start();
}


// trigger my sound
function attackMySound() {
  center_tapped = true;

  var time = Tone.Transport.now();

  // change pitch
  drumSampler.pitch = pitchOffset;

  drumSampler.triggerAttack('me', time);
  triggered = 1;

  var oldFreq = myFilter.frequency.value;
  myFilter.frequency.setValueAtTime(oldFreq, myFilter.now() );


  myFilter.frequency.cancelScheduledValues(myFilter.now());
  myFilter.frequency.exponentialRampToValueAtTime(20000, myFilter.now() + 0.5 );
}

// release my sound
function releaseMySound() {
  var time = Tone.Transport.now();
  // drumSampler.triggerRelease(time);
  var freq = constrain( map(triggered, 0, 1, 20, 18000), 20, 20000);
  myFilter.frequency.exponentialRampToValueAtTime(30, myFilter.now() + 3 );
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
    }
  }
}

// play the drum samples
function playDrumBasedOnMinor(_minor, time, velocity) {
  console.log('play drum based on minor' + _minor + time + velocity);
  var t = time || Tone.Transport.now();
  var v = velocity || 1;
  var whichDrum = possibleMinors.indexOf(Number(_minor)) + 1;
  drumSampler.pitch = drumPitchOffset;
  drumSampler.triggerAttack(whichDrum, t + 0.02, v);

  tapCreature(_minor);

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



/**
 *  returns multichannel array of peak data
 */
function _computeWaveformPeaks(buffer, length) {
  if (buffer) {
    // set length to window's width if no length is provided
    if (!length) {
      length = 300;
    }
    if (buffer) {
      var sampleSize = buffer.length / length;
      var sampleStep = ~~(sampleSize) || 1;
      var channels = 1; // only one channel for now // buffer.numberOfChannels;
      var peaks = [];
      for (var c = 0; c < channels; c++) {
        peaks[c] = new Float32Array(Math.round(length));
        var chan = buffer.getChannelData(c);
        for (var i = 0; i < length; i++) {
          var start = ~~(i * sampleSize);
          var end = ~~(start + sampleSize);
          var max = 0;
          for (var j = start; j < end; j += sampleStep) {
            var value = chan[j];
            if (Math.abs(value) > max) {
              max = value;
            }
          }
          if (c === 0 ||  Math.abs(max) > peaks[c][i]) {
            peaks[c][i] = max;
          }
        }
      }
      return peaks;
    }
  } else {
    throw 'Cannot load peaks yet, buffer is not loaded';
  }
}

function _initWaveformCanvas() {

  var sk = function( sketch ) {

    sketch.setup = function() {
      var waveformDiv = document.getElementById('waveform');
      var w = 200;
      var h = 70;
      var cnv = sketch.createCanvas(w, h);
      waveformDiv.appendChild(cnv.elt);

      sketch.plotPeaks(aimSampler._buffers['0']._buffer);

      sketch.noLoop();
    }

    sketch.plotPeaks = function(buffer) {
      sketch.background(77,77,77);

      var stereoPeaks = _computeWaveformPeaks(buffer, sketch.width*2);
      var waveform = stereoPeaks[0];
      sketch.strokeWeight(2);
      sketch.stroke(0,255,255);
      sketch.beginShape();
      for (var i = 0; i< waveform.length; i++){
        sketch.vertex(sketch.map(i, 0, waveform.length, 0, sketch.width*2), sketch.map(waveform[i], -.8, .8, sketch.height, 0));
      }
      sketch.endShape();
    };


  }


  window._p5Waveform = new p5(sk, 'waveform');

}

// var plotPeaks = function(buffer) {
//   var stereoPeaks = _computeWaveformPeaks(buffer, width*2);
//   var waveform = stereoPeaks[0];
//   sketch.fill(255,180,120);
//   sketch.noStroke();
//   sketch.beginShape();
//   for (var i = 0; i< waveform.length; i++){
//     sketch.vertex(sketch.map(i, 0, waveform.length, 0, sketch.width), sketch.map(waveform[i], -1, 1, sketch.height, 0));
//   }
//   sketch.endShape();
// }