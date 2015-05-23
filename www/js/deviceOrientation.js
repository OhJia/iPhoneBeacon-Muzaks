/**
 *   handle device orientation
 */

// thank you http://mobiforge.com/design-development/sense-and-sensor-bility-access-mobile-device-sensors-with-javascript

function setupDeviceEvents() {

  // gyroscope
  window.addEventListener('deviceorientation', handleOrientationEvent, false);
  
  // accelerometer
  window.addEventListener('devicemotion', handleDeviceMotionEvent, false);


}

// gryo
var handleOrientationEvent = function(e) {

  // Get the orientation of the device in 3 axes, known as alpha, beta, and gamma, 
  // represented in degrees from the initial orientation of the device on load

  var alpha = e.alpha,
      beta = e.beta,
      gamma = e.gamma;

  // console.log(alpha, beta, gamma);

  var bpm = map(beta, -90, 90, 1, 240);
  // Tone.Transport.bpm.value = bpm;

  // map background color
  // background_color = [
  //   255 - map(alpha || 0, 0, 360, 0, 128),
  //   128 - map(beta || 0, 0, 360, 0, 64),
  //   255 - map(gamma || 0, 0, 360, 0, 128)
  // ]

  background_color = [
    map(alpha, -90, 90, 100, 175),
    map(beta, -90, 90, 100, 200),
    map(gamma, -90, 90, 100, 200)
  ]

  var p = Math.round( map(alpha, 0, 360, 0, 12) );
  pitchOffset = pitchScale[p % pitchScale.length] + pitcher;

  p = Math.round( map(beta, -90, 90, 0, 12) );
  drumPitchOffset = pitchScale[p % pitchScale.length];

  p = Math.round( map(gamma, -180, 180, 300, 2200) );
  // console.log(gamma);
  aimFilter.frequency.exponentialRampToValueAtTime(p, aimFilter.now() + 0.001);
  // drumPitchOffset = pitchScale[p % pitchScale.length];

}


var triggered = 0, prevTriggered = 0;

var handleDeviceMotionEvent = function(e) {

  // Get the current acceleration values in 3 axes and find the greatest of these
  
  var acc = e.acceleration,
      maxAcc = Math.max(acc.x, acc.y, acc.z),

      // Get the acceleration values including gravity and find the greatest of these

      accGravity = e.accelerationIncludingGravity,
      maxAccGravity = Math.max(accGravity.x, accGravity.y, accGravity.z);


  if (maxAcc > 2 && triggered < 0.2 && playMode) {
    triggered = 1;

  }

  // decay - TO DO only decay if there are no touches OR if Play is false
  if (!playMode) {
    triggered *= 0.95;
  } else {
    triggered = 1;
  }

  // trigger myFilter --> On
  if (triggered >= 0.95 && prevTriggered < 0.95) {

    var oldFreq = myFilter.frequency.value;
    var oldQ = myFilter.Q.value;
    var oldGain = myFilter.output.gain.value;

    myFilter.frequency.cancelScheduledValues(myFilter.now());
    myFilter.frequency.setValueAtTime(oldFreq, myFilter.now() );
   
    myFilter.Q.cancelScheduledValues(myFilter.now());
    myFilter.Q.setValueAtTime(oldQ, myFilter.now() );

    myFilter.output.gain.cancelScheduledValues(myFilter.now());
    myFilter.output.gain.setValueAtTime(oldGain, myFilter.now() );


    myFilter.frequency.exponentialRampToValueAtTime(20000, myFilter.now() + 0.02);
    myFilter.Q.exponentialRampToValueAtTime(20, myFilter.now() + 0.2 );
    myFilter.output.gain.cancelScheduledValues(myFilter.now());
    myFilter.output.gain.linearRampToValueAtTime(1, myFilter.now() + 0.002 );

  }

  // trigger fade out
  else if (triggered < 0.8 && prevTriggered > 0.8) {
    var rampTime = 1;

    var oldFreq = myFilter.frequency.value;
    var oldQ = myFilter.Q.value;
    var oldGain = myFilter.output.gain.value;

    myFilter.frequency.cancelScheduledValues(myFilter.now());
    myFilter.frequency.setValueAtTime(oldFreq, myFilter.now() );
   
    myFilter.Q.cancelScheduledValues(myFilter.now());
    myFilter.Q.setValueAtTime(oldQ, myFilter.now() );

    myFilter.output.gain.cancelScheduledValues(myFilter.now());
    myFilter.output.gain.setValueAtTime(oldGain, myFilter.now() );

    myFilter.Q.setTargetAtTime(12, myFilter.now() + rampTime, 0.9 );
    myFilter.frequency.setTargetAtTime(40, myFilter.now() + rampTime, 0.95);
    myFilter.output.gain.setTargetAtTime(0, myFilter.now() + rampTime, 0.9999 );
  }

  prevTriggered = triggered;

}