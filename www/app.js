var app = (function()
{
	// Application object.
	var app = {};

	// History of enter/exit events.
	var mRegionEvents = [];

	// Nearest ranged beacon.
	var mNearestBeacon = null;

	
	var rssiObj = {};

	// Timer that displays nearby beacons.
	var mNearestBeaconDisplayTimer = null;

	// Background flag.
	var mAppInBackground = false;

	// Background notification id counter.
	var mNotificationId = 0;

	// Mapping of region event state names.
	// These are used in the event display string.
	var mRegionStateNames =
	{
		'CLRegionStateInside': 'Enter',
		'CLRegionStateOutside': 'Exit'
	};

	// Here monitored regions are defined.
	// TODO: Update with uuid/major/minor for your beacons.
	// You can add as many beacons as you want to use.
	var mRegions =
	[
		{
			id: 'LukeBeacon',
			uuid: 'DA5336AE-2042-453A-A57F-F80DD34DFCD9',
			major: 5,
			minor: 2000
		},
		{
			id: 'jajaBeacon',
			uuid: 'DA5336AE-2042-453A-A57F-F80DD34DFCD9',
			major: 5,
			minor: 2001
		},
		{
			id: 'jasonBeacon',
			uuid: 'DA5336AE-2042-453A-A57F-F80DD34DFCD9',
			major: 5,
			minor: 2002
		},
		{
			id: 'jaBeacon',
			uuid: 'DA5336AE-2042-453A-A57F-F80DD34DFCD9',
			major: 5,
			minor: 2003
		}
	];

	// Region data is defined here. Mapping used is from
	// region id to a string. You can adapt this to your
	// own needs, and add other data to be displayed.
	// TODO: Update with major/minor for your own beacons.
	var mRegionData =
	{
		'jaBeacon': 'Ja Phone!!!',
		'LukeBeacon': 'Luke Phone!!!',
		'someCoolID': 'what is up!'
	};

	app.initialize = function()
	{

		document.addEventListener('deviceready', onDeviceReady, false);
		document.addEventListener('pause', onAppToBackground, false);
		document.addEventListener('resume', onAppToForeground, false);

	};

	function onDeviceReady()
	{
		alert('device ready!!!')

 		startMonitoringAndRanging();
 
		//startMonitoringAndRanging().then(advertiser.startAdvertising);
		startNearestBeaconDisplayTimer();

		displayRegionEvents();
 
		// wait to start advertising so that we know who else is advertising
		setTimeout(function() {
			// start the advertiser
			advertiser.startAdvertising();
			startMonitoringAndRanging();
			startNearestBeaconDisplayTimer();
			displayRegionEvents();
		}, 5000);
	}


	function onAppToBackground()
	{
		mAppInBackground = true;
		stopNearestBeaconDisplayTimer();
	}

	function onAppToForeground()
	{
		mAppInBackground = false;
		startNearestBeaconDisplayTimer();
		displayRegionEvents();
	}

	function startNearestBeaconDisplayTimer()
	{
		mNearestBeaconDisplayTimer = setInterval(displayNearestBeacon, 10);
	}

	function stopNearestBeaconDisplayTimer()
	{
		clearInterval(mNearestBeaconDisplayTimer);
		mNearestBeaconDisplayTimer = null;
	}

	function startMonitoringAndRanging()
	{
		console.log('start mon');
		function onDidDetermineStateForRegion(result)
		{
			saveRegionEvent(result.state, result.region.identifier);
			displayRecentRegionEvent();
		}

		function onDidRangeBeaconsInRegion(result)
		{
			updateNearestBeacon(result.beacons);
		}

		function onError(errorMessage)
		{
			console.log('Monitoring beacons did fail: ' + errorMessage);
		}

		// Request permission from user to access location info.
		cordova.plugins.locationManager.requestAlwaysAuthorization();

		// Create delegate object that holds beacon callback functions.
		var delegate = new cordova.plugins.locationManager.Delegate();
		cordova.plugins.locationManager.setDelegate(delegate);

		// Set delegate functions.
		delegate.didDetermineStateForRegion = onDidDetermineStateForRegion;
		delegate.didRangeBeaconsInRegion = onDidRangeBeaconsInRegion;

		// Start monitoring and ranging beacons.
		startMonitoringAndRangingRegions(mRegions, onError);

	}

	function startMonitoringAndRangingRegions(regions, errorCallback)
	{
		// Start monitoring and ranging regions.
		for (var i in regions)
		{
			startMonitoringAndRangingRegion(regions[i], errorCallback);
		}
	}

	function startMonitoringAndRangingRegion(region, errorCallback)
	{
		// Create a region object.
		var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
			region.id,
			region.uuid,
			region.major,
			region.minor);

		// Start ranging.
		cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
			.fail(errorCallback)
			.done();

		// Start monitoring.
		cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
			.fail(errorCallback)
			.done();
	}

	function saveRegionEvent(eventType, regionId)
	{
		// Save event.
		mRegionEvents.push(
		{
			type: eventType,
			time: getTimeNow(),
			regionId: regionId
		});

		// Truncate if more than ten entries.
		if (mRegionEvents.length > 10)
		{
			mRegionEvents.shift();
		}
	}

	function getBeaconId(beacon)
	{
		//console.log('get beacon id!');
		return beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
	}

	function isSameBeacon(beacon1, beacon2)
	{
		return getBeaconId(beacon1) == getBeaconId(beacon2);
	}

	function isNearerThan(beacon1, beacon2)
	{
		return beacon1.accuracy > 0
			&& beacon2.accuracy > 0
			&& beacon1.accuracy < beacon2.accuracy;
	}

function updateNearestBeacon(beacons)
	{
		
		for (var i = 0; i < beacons.length; ++i)
		{
			var beacon = beacons[i];
			//console.log(beacon);
			var minor = String(beacon.minor);
			
			// Add new
			if (typeof(creatures[minor]) == 'undefined') {
				creatures[minor] = {
				    minor: minor,
				    id: 'creature x',
				    sound: null,
				    time: null,
				    rssi: beacon.rssi,
				    radians: -120,
				    color: [0,0,255],
				    tapped: true, // do ripple
				    pos_x: null,
				    pos_y: null
				};

				creatureEnterSound();

			// Otherwise update the rssi
			} else {
				creatures[minor].rssi = beacon.rssi;
				creatures[minor].prevRSSI = beacon.rssi;
			}

			// if creature rssi is zero, play creatureLeavesSound()
			if (creatures[minor].rssi === 0 && creatures[minor].prevRSSI !== 0) {
				creatureLeaveSound();

				// prevRSSI ensures we only play creatureLeaveSound once...hopefully!
				creatures[minor].prevRSSI = 0;
			}

			// update otherMinors
			otherMinors = Object.keys(creatures);
			console.log(otherMinors);

			if (!mNearestBeacon)
			{
				mNearestBeacon = beacon;
			}
			else
			{
				if (isSameBeacon(beacon, mNearestBeacon) ||
					isNearerThan(beacon, mNearestBeacon))
				{
					mNearestBeacon = beacon;
				}
			}
		}

		//console.log(creatures);

		// access each beacon by its minor (key)
		for (var minor in creatures) {
			//console.log(creatures[minor]);
			tweakBeaconSound(creatures[minor]);
		}


	}

	function displayNearestBeacon()
	{
		//if (!mNearestBeacon) { return; }
		//if (Object.keys(creatures).length <= 0) {return;}
		
		// Clear element.
		$('#beacon').empty();
 
		for (var minor in creatures) {
			// Update element.
			// var element = $(
			// 	'<li>'
			// 	+	'<strong>Nearest Beacon</strong><br />'
			// 	+	'UUID: ' + creatures[minor].uuid + '<br />'
			// 	+	'Major: ' + creatures[minor].major + '<br />'
			// 	+	'Minor: ' + creatures[minor].minor + '<br />'
			// 	+	'Proximity: ' + creatures[minor].proximity + '<br />'
			// 	+	'Distance: ' + creatures[minor].accuracy + '<br />'
			// 	+	'RSSI: ' + creatures[minor].rssi + '<br />'
			// 	+ '</li>'
			// 	);

			var element = $(
				'<li>'
				+	'<div class="profile-img"></div>'
				+	'<div class ="profile-id"><h1>'+creatures[minor].id+'</h1></div>'
				+	'<div class="mo-info"><p>'+creatures[minor].minor+'</p><p>'+creatures[minor].rssi+'</p></div>'
				+ '</li>'
				);
			$('#beacon').append(element);

			//changeBpm(creatures[minor].rssi);
			if (creatures[minor].rssi === 0) {
				rssiObj[minor] = 0;
			} else if (creatures[minor].rssi < 0) {
				// rssiObj[minor] = 200 + creatures[minor].rssi * 3;
				rssiObj[minor] = Math.abs(creatures[minor].rssi);
			} 
		}	

		// changeSize(rssiObj[2003], rssiObj[2002], rssiObj[2001]);
		//changeSize(rssiObj);
						


			// changeBpm(creatures[minor].rssi);
		}
	//}

	function displayRegionEvents()
	{
		// Clear list.
		$('#events').empty();

		// Update list.
		for (var i = mRegionEvents.length - 1; i >= 0; --i)
		{
			var event = mRegionEvents[i];
			var title = getEventDisplayString(event);
			var element = $(
				'<li>'
				+ '<strong>' + title + '</strong>'
				+ '</li>'
				);
			$('#events').append(element);
		}

		// If the list is empty display a help text.
		if (mRegionEvents.length <= 0)
		{
			var element = $(
				'<li>'
				+ '<strong>'
				+	'Waiting for region events, please move into or out of a beacon region.'
				+ '</strong>'
				+ '</li>'
				);
			$('#events').append(element);
		}
	}

	function getEventDisplayString(event)
	{
		return event.time + ': '
			+ mRegionStateNames[event.type] + ' '
			+ mRegionData[event.regionId];
	}

	function getTimeNow()
	{
		function pad(n)
		{
			return (n < 10) ? '0' + n : n;
		}

		function format(h, m, s)
		{
			return pad(h) + ':' + pad(m)  + ':' + pad(s);
		}

		var d = new Date();
		return format(d.getHours(), d.getMinutes(), d.getSeconds());
	}

	return app;

})();

app.initialize();