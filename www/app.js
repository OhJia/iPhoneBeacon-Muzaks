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

	// parse
	// Parse.initialize("nFP8dKA5DuspZfsi0uIWDHMLicCMO8ZjaxvDjug2", "U55ZOoqJBF1GfAWvbZJEhEF34Z3i9Hv45ZtI5FPX");
	// var TestObject = Parse.Object.extend("TestObject");
	// var testObject = new TestObject();
	// console.log(TestObject);

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
			id: 'region',
			uuid: 'DA5336AE-2042-453A-A57F-F80DD34DFCD9',
			major: 5
			// minor: 2000
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
		//alert('init')
		document.addEventListener('deviceready', onDeviceReady, false);
		document.addEventListener('pause', onAppToBackground, false);
		document.addEventListener('resume', onAppToForeground, false);

	};

	function onDeviceReady()
	{
		alert('device ready!!!')
		window.localStorage.setItem("key", "value");
        var value = window.localStorage.getItem("key");
        //console.log(value);

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
		}, 2000);

		// testObject.save({foo: "bar"}).then(function(object) {
		//   alert("yay! it worked");
		// });

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
			console.log('displayRecentRegionEvent');
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
			if (typeof(creatures[minor]) == 'undefined' && beacon.rssi != 0) {
				creatures[minor] = {
				    minor: minor,
				    id: devices[minor].id,
				    info: devices[minor].info,
				    sound: null,
				    time: null,
				    rssi: beacon.rssi,
				    radians: -120,
				    color: [0,0,255],
				    tapped: true, // do ripple
				    pos_x: null,
				    pos_y: null,
				    coverSrc: devices[minor].coverSrc,
				    img: null
				};

				loadImage("ui/images/covers/"+devices[minor].coverSrc, function(img){
					creatures[minor].img = img;
				}) 

				creatureEnterSound();

			// Otherwise update the rssi
			} else {
				creatures[minor].rssi = beacon.rssi;
			}

			// update otherMinors
			otherMinors = Object.keys(creatures);

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
			var creatR = creatures[String(minor)];

			// if creature rssi is zero, play creatureLeavesSound()
			if (creatR.rssi === 0 && creatR.prevRSSI !== 0) {
				creatureLeaveSound();
					delete creatures[String(minor)];
					otherMinors.splice(otherMinors.indexOf( String(minor) ), 1);
			}
			creatR.prevRSSI = creatR.rssi;
		}


	}

	function displayNearestBeacon()
	{
		//if (!mNearestBeacon) { return; }
		//if (Object.keys(creatures).length <= 0) {return;}
		
		// Clear old beacons.
		var creatureKeys = Object.keys(creatures);
		$('#beacon li').each(function() {
			var id = $(this).data('minor');
			if (creatureKeys.indexOf(id) == -1) {
				$(this).remove();
			}
		})
 
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

			// Update existing beacon
			if ($('#beacon-' + minor).size() > 0) {
				$('#beacon-' + minor +' .rssi').text(creatures[minor].rssi);
			
			// Add new beacon if not exist
			} else {
				// var element = $(
				// 	'<li id="beacon-' + minor + '">'
				// 	+	'<div class="profile-img"></div>'
				// 	+	'<div class="mo-info"><p>'+creatures[minor].minor+'</p><p class="rssi">'+creatures[minor].rssi+'</p></div>'
				// 	+	'<div class ="profile-id"><h1>'+creatures[minor].id+'</h1></div>'
				// 	+ '</li>'
				// 	);
				// element.data('minor', minor);

				var element = $(
					'<li id="beacon-' + minor + '">'
					+	'<div class="profile-img"><img src=\'ui/images/covers/'+creatures[minor].coverSrc+'\'></div>'
					+	'<div class="profile-middle">'
						+	'<div class ="profile-id"><h1>'+creatures[minor].id+'</h1></div>'
						+	'<div class="profile-info"><p>'+ creatures[minor].info+'</p></div>'
						+	'<div class="profile-dist-time"><p>rssi: '+creatures[minor].rssi + '</p></div>'
					+	'</div>'
					+	'<div class="profile-play" ontouchstart=playDrumBasedOnMinor('+minor+')>'
					+ 		'<svg version="1.1" id="playButton_' + minor + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 792" enable-background="new 0 0 612 792" xml:space="preserve"><circle fill="#020202" cx="301.4" cy="393.7" r="282.9"/><polygon fill="#FFFFFF" points="216.7,267.6 439.6,395.2 216.7,524.4 "/></svg>'
					+	'</div>'
					+ '</li>'
					);
				element.data('minor', minor);

				
				
				$('#beacon').append(element);

				// <li id="beacon-x">
				// 	<div class="profile-img"></div>
				// 	<div class ="profile-id"><h1>creatures[minor].id</h1></div>
				// 	<div class="profile-info">creatures[minor].minor + creatures[minor].info</div>
				// 	<div class="profile-dist-time">creatures[minor].rssi + 'for x min'</div>
				// 	<div class="profile-play">
				// 		<svg version="1.1" id="play-on" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 500 500" enable-background="new 0 0 500 500" xml:space="preserve"><polygon fill="#F1F1F2" points="128,86.8 411,250.1 128,413.5 "/></svg>
				// 	</div>

				// </li>
			}

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

	function displayRecentRegionEvent()
	{	console.log('in background');
		if (mAppInBackground)
		{
			// Set notification title.
			var event = mRegionEvents[mRegionEvents.length - 1];
			if (!event) { return; }
			var title = getEventDisplayString(event);


			// Create notification.
			cordova.plugins.notification.local.schedule({
    			id: ++mNotificationId,
    			title: title });
		}
		else
		{
			displayRegionEvents();
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