// INSTRUMENTS
var aimSampler, aimInDown, drumSampler;

var aimSamplePaths = ['audio/windows/messenger.mp3', 'audio/apple/apple.wav', 'audio/aim/im.wav', 'audio/whatsapp/whatsappmsg.mp3', 'audio/fb/fb2.mp3', 'audio/skype/skypeContinueCall.mp3'];

// either choose from a scale
var pitchScale = [-12, -9, -7, -5, 0, 2, 7];
var pitchOffset = 0;

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
masterFilter.Q.value = 10;
masterFilter.frequency.value = 0;
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

// TO DO:
// 
// - door open sound
// - beat only happens when other people are around
// - trigger sounds when you click on them
// - use play button. when you press, it plays everything. Otherwise, it just plays the one dot sound.
// - distance for both volume and Tempo
// - playOtherSound()

function initAIMSampler(index) {
  var samplePath = aimSamplePaths[index];

  aimSampler = new Tone.Sampler(samplePath);

  aimInDown = new Tone.Sampler('audio/aim/imIn.mp3');

  drumSampler = new Tone.Sampler( {
    '1' : 'audio/bongo_01.mp3',
    '2' : 'audio/aim/thwap.mp3',
    '3' : 'audio/fb/fbPercussion1.mp3',
    '4' : 'audio/aim/rmblock.wav',
    '5' : 'audio/bongo_02.mp3',
    '6' : 'audio/triangle_01.mp3',
    '7' : 'audio/triangle_03.mp3',
    'me' : samplePath
  });

  aimSampler.connect(masterMix);
  aimInDown.connect(masterMix);
  drumSampler.connect(masterMix);

  aimInDown.pitchScale = [-13, -6, -8, -25];

  //document.addEventListener('mousedown', playOtherSound);

  setupDrumPattern1();
}

function playAIM() {
  // var pitchIndex = Math.floor( Math.random() * pitchScale.length);
  // var pitch = pitchScale[pitchIndex];
  // aimSampler.pitch = pitch;

  aimSampler.pitch = pattern[iPat % pattern.length] + pitchOffset;
  iPat++;

  aimSampler.triggerAttack(0);
}

Tone.Transport.setInterval(playAIM, "4n");
Tone.Transport.setInterval(function(time){
    aimInDown.pitch = 12;

    aimInDown.triggerAttack(0, time);

  }, "14 * 1n");

Tone.Transport.bpm.value = 132;

Tone.Buffer.onload = function() {
  Tone.Transport.start();
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
  } else {
    // pick a random drum loop
    var x = Math.random();
    x > 0.5 ? setupDrumPattern1() : setupDrumPattern2();
  }
}

////// person enter / leaving: play AOL door open/close

var doorOpen = new Tone.Player('audio/skype/skype_signInHIFI.mp3');
var doorClose = new Tone.Player('audio/skype/skype_callFailedNICE.mp3');
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

  // change pith
  drumSampler.pitch = pitchOffset;

  drumSampler.triggerAttack('me', time);
  triggered = 1;
  masterFilter.frequency.cancelScheduledValues(masterFilter.now());
  masterFilter.frequency.exponentialRampToValueAtTime(20000, masterFilter.now() + 0.1 );
}

// release my sound
function releaseMySound() {
  var time = Tone.Transport.now();
  drumSampler.triggerRelease('me', time);
  var freq = constrain( map(triggered, 0, 1, 20, 18000), 20, 20000);
  masterFilter.frequency.exponentialRampToValueAtTime(freq, masterFilter.now() + 3 );
}

/**
 *  set up drum to represent each possible minor, to play back at a variable interval tied to RSSI
 *  @return {[type]} [description]
 */
// function setupPatternForCreatures() {
//   drumIntervals.push(x);
// }

// play drums to represent each creature
function addDrumForCreature(minor) {

}


function initSound() {

  // for (var i = 0; i < synths.length; i++) {
  //   synths[i] = new Tone.MonoSynth();
  //   synths[i].oscillator.type = "sine";
  //   synths[i].toMaster();
  // }

  // Tone.Transport.setInterval(play2000, "32n");
  // Tone.Transport.setInterval(play2001, "32n");
  // Tone.Transport.setInterval(play2002, "32n");
  // Tone.Transport.setInterval(play2003, "32n");

}


// function play2000(time) {
//   var i = indexes[0]++ % indexModulos[0];
//   if (counters[0][i] === 1 ) {
//     synths[0].triggerAttackRelease('C4', 0.12, Tone.Transport.now(), 0.1 );
//   }
// }

// function play2001(time) {
//   var i = indexes[1]++ % indexModulos[1];
//   if (counters[1][i] === 1 ) {
//     synths[1].triggerAttackRelease('E4', 0.1, Tone.Transport.now(), 0.1 );
//   }
// }

// function play2002(time) {
//   var i = indexes[2]++ % indexModulos[2];
//   if (counters[2][i] === 1 ) {
//     synths[2].triggerAttackRelease('G3', 0.1, Tone.Transport.now(), 0.1);
//   }
// }

// function play2003(time) {
//   var i = indexes[3]++ % indexModulos[3];
//   if (counters[3][i] === 1 ) {
//     synths[3].triggerAttackRelease('D4', 0.1, Tone.Transport.now(), 0.1 );
//   }
// }

// var tempos = [100/4, 100/8*3, 100/2, 100];


function tweakBeaconSound(beacon) {
  // var intervals[beacon.minor]

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