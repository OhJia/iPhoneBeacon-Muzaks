var uuid = 'DA5336AE-2042-453A-A57F-F80DD34DFCD9'; // this will be the same for all beacons
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
    console.log("other minors: "+ otherMinors);

    for (var i = 0; i < possibleMinors.length && !minorToReturn; i++) {
        if (otherMinors.indexOf( String(possibleMinors[i]) ) < 0) {
            minorToReturn = possibleMinors[i];

            // also init sound based on this index
            initAIMSampler(i);

        }
    }

    //return minorToReturn;
    minor = minorToReturn;
    console.log('My minor: ' + minor);
}

var advertiser = (function() {

    var advertiser = {};

    advertiser.startAdvertising = function() {
        alert('the advertisement begins');
        //minor = generateMinor();
        generateMinor();

        thisCreature.minor = minor;
        thisCreature.id = devices[minor].id;
        thisCreature.info = devices[minor].info;
        thisCreature.coverSrc = devices[minor].coverSrc;

        loadImage("ui/images/covers/"+devices[minor].coverSrc, function(img){
                    thisCreature.img = img;
        });
        // console.log(thisCreature.img);

        // name on the main page
        $('#right-name').html(thisCreature.id); 
        // info on the info page
        $('#info-pg-cover').html('<img src=\'ui/images/covers/'+thisCreature.coverSrc+'\'>');
        // $('#info-pg-id').html('<h1>'+thisCreature.id+'</h1>');
        // $('#info-pg-info').html(thisCreature.info);
        $('#creatureNameLabel').html(thisCreature.id);
        $('#creatureInfoLabel').html(thisCreature.info);
        $('#creatureNameInput')[0].value = thisCreature.id;
        $('#creatureInfoInput')[0].value = thisCreature.info;

        console.log('My minor: ' + minor);

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

function editCreatureName() {
    if ($('#creatureNameInput')[0].hidden) {
        $('#creatureNameLabel')[0].style.display = 'none'
        $('#creatureNameInput')[0].hidden = false;
    } else {
        $('#creatureNameLabel')[0].style.display = 'block'
        $('#creatureNameInput')[0].hidden = true;
        thisCreatureIDChanged();
    }
}

function editCreatureInfo() {
    if ($('#creatureInfoInput')[0].hidden) {
        $('#creatureInfoLabel')[0].hidden = true;
        $('#creatureInfoInput')[0].hidden = false;
    } else {
        $('#creatureInfoLabel')[0].hidden = false;
        $('#creatureInfoInput')[0].hidden = true;
        thisCreatureInfoChanged();
    }

}
function thisCreatureIDChanged() {
    thisCreature.id = $('#creatureNameInput')[0].value;
    $('#creatureNameLabel')[0].innerHTML = thisCreature.id;
}

function thisCreatureInfoChanged() {
    thisCreature.info = $('#creatureInfoInput')[0].value;
    $('#creatureInfoLabel')[0].innerHTML = thisCreature.info;
}