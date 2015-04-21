# How to build a Cordova iBeacon app

This tutorial shows how to create and build a native iBeacon app written in JavaScript using the Apache Cordova build system. The example app shows how to to range beacons and monitor region enter/exit events. We also explain how to use background notifications on iOS and Android.

## What you need

To build native apps you must install both Cordova and Xcode and/or Android SDK depending on which platforms you wish to build for. The [Cordova IoT Starter Kit](http://evothings.com/cordova-starter-kit/) helps you with the installation process.

## iBeacon example app

The example app for this tutorial is available for download on GitHub. (TODO: Add link)

When the app is in the foreground it displays the nearest ranged beacon and a list of region enter/exit events. When the app is running in the background, it displays region enter/exit events as notifications.

(TODO: Add screenshots)

## The example project setup

The example code consists of a "bare" Cordova project with some minimal settings. What you need to do to build the app is to add plugins and platforms (iOS and/or Android).

Plugins and native platform files can take up quite some space, and are therefore not included in the GitHub repo. Below you will learn how to add them.

HTML and JavaScript code files are found in the www folder in the project. This is the standard location for Cordova application files.

The file www/index.html contains the UI elements of the app. File www/app.js contains all the JavaScript code for the application. Folders www/libs contains JavaScript libraries used by the app. The folder www/ui contains CSS-files used by Evothings example apps. You can replace the CSS files with your own UI styling or use a JavaScript UI framework to get the desired look and feel.

## What you need to modify before the app will work

Open file www/app.js and edit the variables mRegions and mRegionData to contain the UUIDs and major/minor values of your beacons.

## How the Cordova project was created

The following steps have already been performed for the project on GitHub. If you create your Cordova project from scratch, you can use these steps to set up your project.

First the project was created with this command:

    create cordova-ibeacon com.evothings.cordovaibeacon iBeacon

Then this line was added to the config.xml file to prevent the view to bounce on scrolling:

    <preference name="DisallowOverscroll" value="true" />

Finally the files in folder www were deleted and replaced by the example app files.

## Cordova commands to build the app

To build the app you must have cordova installed (see above).

Follow these steps to install plugins and build the app.

Open a command window and go to the app folder, e.g.:

    cd cordova-ibeacon/

Add plugins (this step is done once):

    cordova plugin add https://github.com/petermetz/cordova-plugin-ibeacon#3.3.0
    cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications#0.8.1

Note that specific versions of the plugins are added. This is handy to ensure you get a tested version of the plugin. Check the respective plugin repo on GitHub for the current versions and use them in your project.

Add platform ios if you wish to build for iPhone and iPad (done once):

    cordova platform add ios

Add platform android if you wish to build apps for Android devices (done once):

    cordova platform add android

Build the app for the desired platform(s) (do this after each code update):

    cordova build ios
    cordova build android

For iOS open the Xcode project in folder platforms/ios to deploy and run the app.

For Android install the app using the adb command (name of APK-file may very depending on the Cordova version used):

    adb install -r platforms/android/ant-build/MainActivity-debug.apk

## Finalising the build

To get the app ready for publication on the app stores you also want to include custom icons and launch images.

## How background notifications work

Background notifications are displayed using the plugin [cordova-plugin-local-notifications](https://github.com/katzer/cordova-plugin-local-notifications).

It is very easy to display a notification:

    cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Hello World'
        });

New notifications will replace any previous notification with the same id. Use an id counter to display a sequence of notifications. Check out the code in file www/app.js for how this is done.

Further documentation is found on the [GitHub Wiki for the notification plugin](https://github.com/katzer/cordova-plugin-local-notifications/wiki).

## Quick overview of how iBeacon ranging and monitoring works

For monitoring beacons the plugin [cordova-plugin-ibeacon](https://github.com/petermetz/cordova-plugin-ibeacon) is used.

Ranging and monitoring are two important concepts when developing beacon apps.

Ranging continuously displays all beacons found and is active when an app is in the foreground, but not in the background.

Monitoring only generates events when a region is entered or exited, and works both when the app is in the foreground and in the background.

A region consists of a beacon UUID, and optional major and minor values. It is common that many beacons share the same UUID. All three values uniquely identify a beacon. You can scan more broadly by specifying only the UUID, or only UUID and major value.

Here is a code snippet that creates a region and starts monitoring and ranging that region:

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

Ranging and monitoring events will be delivered to delegate functions. Check out the source code in the file www/app.js for an example of how to set up delegate functions for monitoring and ranging.

For documentation and code examples, visit the [cordova-plugin-ibeacon GitHub page](https://github.com/petermetz/cordova-plugin-ibeacon).

## Use Evothings Studio for a fast workflow

You can use Evothings Studio to develop Cordova apps with live-reload-on-save. What you do is that you simply hook up your Cordova app to connect to Evothings Workbench by modifying config.xml. Then drag index.html into the Workbench project list and click RUN. Now live reload is enabled!

Here is a step-by-step guide:

* Download and run Evothings Workbench on your computer.

* Open the file config.xml in your Cordova project folder. Edit the content tag to refer to the connect URL displayed at the bottom of the Evothings Workbench project window. This will make the app connect to the Workbench when launched.

* Here is an example (use actual IP-address displayed in the Workbench window):

    <content src="http://192.168.43.131:4042" />

* Build the app using the following command and run the app on your phone/tablet:

    cordova build ios

* Drag and drop the file www/index.html to the Workbench project list.

* Click RUN in the Workbench window. You now have live reload
enabled, just save the code in your editor and the app reloads.

**Make sure your computer and phone/tablet are on a WiFi network
that allows connections (client isolation must be off).**

To make it easy to switch between building the production version of the app and the development version that connects to Evothings Workbench you can modify the content tag name and have both tags side by side:

    <xcontent src="index.html" />
    <content src="http://192.168.43.131:4042" />

## Learn more

To learn more read these articles and tutorials:

[Setup Cordova for Evothings Workbench](http://evothings.com/doc/build/cordova-guide.html)

[Cordova IoT Starter Kit](http://evothings.com/cordova-starter-kit/)

[Hybrid app development made fast](http://evothings.com/hybrid-app-development-made-fast/)

[Evothings Studio Starter Kit](http://evothings.com/evothings-studio-starter-kit/)

(TODO: Add link to iBeacon blogpost, check if post needs update)
