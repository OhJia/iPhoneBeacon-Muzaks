var app = (function()
{
	// Application object.
	var app = {};

	// History of enter/exit events.
	var mRegionEvents = [];

	// Nearest ranged beacon.
	var mNearestBeacon = null;

	// all the beacons!
	var allTheBeacons = {};

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
			id: 'jaBeacon',
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
			id: 'jajaBeacon',
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
		advertiser.startAdvertising();

		startMonitoringAndRanging();

		startNearestBeaconDisplayTimer();

		displayRegionEvents();

		// start the advertiser
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
		mNearestBeaconDisplayTimer = setInterval(displayNearestBeacon, 1000);
	}

	function stopNearestBeaconDisplayTimer()
	{
		clearInterval(mNearestBeaconDisplayTimer);
		mNearestBeaconDisplayTimer = null;
	}

	function startMonitoringAndRanging()
	{

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
		console.log('get beacon id!');
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
		console.log(beacons);
		for (var i = 0; i < beacons.length; ++i)
		{
			var beacon = beacons[i];
			var minor = String(beacon.minor);
			allTheBeacons[minor] = beacon;

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

		console.log(allTheBeacons);

		// access each beacon by its minor (key)
		for (var minor in allTheBeacons) {
			console.log(allTheBeacons[minor]);
			tweakBeaconSound(allTheBeacons[minor]);
		}


	}

	function displayNearestBeacon()
	{
		//if (!mNearestBeacon) { return; }
		//if (Object.keys(allTheBeacons).length <= 0) {return;}
		
		// Clear element.
		$('#beacon').empty();
 
		for (var minor in allTheBeacons) {
 
			// Update element.
			var element = $(
				'<li>'
				+	'<strong>Nearest Beacon</strong><br />'
				+	'UUID: ' + allTheBeacons[minor].uuid + '<br />'
				+	'Major: ' + allTheBeacons[minor].major + '<br />'
				+	'Minor: ' + allTheBeacons[minor].minor + '<br />'
				+	'Proximity: ' + allTheBeacons[minor].proximity + '<br />'
				+	'Distance: ' + allTheBeacons[minor].accuracy + '<br />'
				+	'RSSI: ' + allTheBeacons[minor].rssi + '<br />'
				+ '</li>'
				);
			$('#beacon').append(element);

			// changeBpm(allTheBeacons[minor].rssi);
		}
	}

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