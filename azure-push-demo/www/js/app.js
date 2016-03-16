// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .controller("appCtrl", function($scope, $window) {
        var vm = this;
        vm.username = '';
        vm.receiver = '';
        vm.msg = 'Hello!';
        vm.register = register;
        vm.send = send;

        function register() {
            var GCM_SENDER_ID = '973405917396'; // Replace with your own ID.
            var mobileServiceClient;
            var pushNotification;

            mobileServiceClient = new WindowsAzure.MobileServiceClient(
                "https://push-demo-azure.azure-mobile.net/",
                "wkklmJIQauLyZCacBFhnHUJixwFlDm51");

            pushNotification = PushNotification.init({
                "android": { senderID: GCM_SENDER_ID, forceShow: "false" },
                "ios": { alert: "true", badge: "true", sound: "true" }
            });


            pushNotification.on('registration', function(data) {

                var handle = data.registrationId;

                // Set the device-specific message template.
                if (isAndroid()) {
                    // Template registration.
                    var template = '{ "data" : {"message":"$(message)"}}';

                    // Register for notifications.
                    mobileServiceClient.push.gcm.registerTemplate(handle,
                        'myTemplate', template, [vm.username])
                        .done(registrationSuccess, registrationFailure);
                } else if (isIOS()) {
                    // Template registration.
                    var template = '{"aps": {"alert": "$(message)",\"badge\":\"#(badge)\" }}';

                    // Register for notifications.            
                    mobileServiceClient.push.apns.registerTemplate(handle,
                        'myTemplate', template, [vm.username])
                        .done(registrationSuccess, registrationFailure);
                }

                function isIOS() {
                    return (ionic.Platform.device().platform.match(/ios/i))
                }

                function isAndroid() {
                    return (ionic.Platform.device().platform.match(/android/i))
                }

                function registrationSuccess() {
                    console.log('Registered Successfully');
                }

                function registrationFailure(e) {
                    alert('Registration failure: ' + e);
                }

            });

            pushNotification.on('notification', function(data) {
                // data.message,
                // data.title,
                // data.count,
                // data.sound,
                // data.image,
                // data.additionalData

                alert(("Message : " + data.message + " \r\nBadge Count: " + data.count));

            });


            // Handles an error event.
            pushNotification.on('error', function(e) {
                // Display the error message in an alert.
                alert('Error: ' + e.message);
            });

        }

        function send() {
            //TODO: Send the push notification to receiver tag
            console.log('Notified ' + vm.receiver);
        }
    });
