var uuid = 'DA5336AE-2042-453A-A57F-F80DD34DFCD9'; // this will be the same for all beacons
// var identifier = 'jaBeacon'; // this will be a random default name
var identifier = 'randommm'; // this will be a random default name
var minor = null; // this will be randomly generated
var major = 5; // this will be the same for all beacons

var otherMinors = []; // array of strings, updates when other beacons are found
var possibleMinors = [2000, 2001, 2002, 2003, 2004];

/**
 *  generate a minor from the array of possible minors that does not exist in the existingMinors.
 *
 *  @method  generateMinor
 *  @param  {Array} existingMinors an array of all the existing minors that have been found so far
 *  @return {Number}                new minor number
 */
function generateMinor() {

    minorToReturn = null;

    for (var i = 0; i < possibleMinors.length && !minorToReturn; i++) {
        if (otherMinors.indexOf( String(possibleMinors[i]) ) < 0) {
            minorToReturn = possibleMinors[i];
        }
    }

    return minorToReturn;
}


var advertiser = (function() {

    var advertiser = {};

    advertiser.startAdvertising = function() {
        // generate minor
        minor = generateMinor();

        alert('My minor: ' + minor);

        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

        // The Delegate is optional
        var delegate = new cordova.plugins.locationManager.Delegate();

        // Event when advertising starts (there may be a short delay after the request)
        // The property 'region' provides details of the broadcasting Beacon
        delegate.peripheralManagerDidStartAdvertising = function(pluginResult) {
            console.log('peripheralManagerDidStartAdvertising: '+ JSON.stringify(pluginResult.region));
        };
        // Event when bluetooth transmission state changes 
        // If 'state' is not set to BluetoothManagerStatePoweredOn when advertising cannot start
        delegate.peripheralManagerDidUpdateState = function(pluginResult) {
            console.log('peripheralManagerDidUpdateState: '+ pluginResult.state);
        };

        cordova.plugins.locationManager.setDelegate(delegate);

        // Verify the platform supports transmitting as a beacon
        cordova.plugins.locationManager.isAdvertisingAvailable()
            .then(function(isSupported){

                if (isSupported) {
                    cordova.plugins.locationManager.startAdvertising(beaconRegion)
                        .fail(console.error)
                        .done();
                } else {
                    console.log("Advertising not supported");
                }
            })
        .fail(console.error)
        .done();
    }

    return advertiser;

})();