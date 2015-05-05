// INSTRUMENTS
var aimSampler, aimInDown, drumSampler;

var aimSamplePaths = ['audio/fb/fb2.mp3', 'audio/apple/apple.wav', 'audio/aim/im.wav'];

var doorOpen = new Tone.Player() doorClose;

// either choose from a scale
var pitchScale = [-12, -9, -7, -5, 0, 2];
var pitchOffset = 0;

// or play a pattern
var iPat = 0;
// var pattern = [ -12, -12, -12, -12,
//                 -12, -12, -12, -12,
//                 -12, -12,
//                 -7, -9, -11, -11
//                 ];

// var pattern = [ -12, 0, 12, 0,
//                 12, -12, -7, -5,
//                 -2, -3,
//                 -7, -9, -5, -5
//                 ];

var pattern = [-12];


///////////// MASTER OUTPUT MIX

// everything connects to the MasterMix, then to WetDry to control convolution and filter
var masterMix = Tone.context.createGain();

// MasterMix connects to MasterWetDry. 0 is dry, 1 is wet (convolver)
var masterWetDry = new Tone.CrossFade(0.5);

// convolver goes to 1 (wet)
var masterConvolver = Tone.context.createConvolver();
// masterMix.connect(masterConvolver);
// masterConvolver.connect(masterWetDry, 0, 1);

var convolverBuffer = new Tone.Buffer('./audio/IR/small-plate.mp3', function() {
    masterConvolver.buffer = convolverBuffer._buffer;
});

// filter goes to both 0 (dry) and 1 (wet)
var masterFilter = new Tone.Filter();
masterMix.connect(masterFilter);
masterFilter.connect(masterConvolver, 0, 0);
masterFilter.connect(masterWetDry, 0, 1);
masterFilter.Q.value = 10;
masterFilter.frequency.value = 0;
masterFilter.type = 'lowpass';
// wetDry goes to master
masterWetDry.toMaster();

// TO DO:
// - only trigger output on mousedown
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
    '7' : 'audio/triangle_03.mp3'
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

////// person enter / leaving: play AOL door open/close


function personEnters() {
  doorOpen.start();
}

function personLeaves() {
  doorClose.start();
}

