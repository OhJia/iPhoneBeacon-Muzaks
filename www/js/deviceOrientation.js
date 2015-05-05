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
    map(alpha, -90, 90, 0, 250),
    map(beta, -90, 90, 0, 200),
    map(gamma, -90, 90, 0, 250)
  ]

  var p = Math.round( map(alpha, 0, 360, 0, 12) );
  pitchOffset = pitchScale[p % pitchScale.length];

}


var triggered = 0;

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

  var freq = constrain( map(triggered, 0, 1, 20, 18000), 20, 20000);

  var q = constrain( map(triggered, 0, 1, 0.01, 10), 20, 0.01);

  masterFilter.frequency.cancelScheduledValues(masterFilter.now());
  // masterFilter.frequency.setValue
  masterFilter.frequency.exponentialRampToValueAtTime(freq, masterFilter.now() + 0.01 );

  masterFilter.Q.setTargetAtTime(q, masterFilter.now() + .03, 0.8 );

  // decay - TO DO only decay if there are no touches OR if Play is false
  if (!playMode) {
    triggered *= 0.95;
  } else {
    triggered = 1;
  }

}