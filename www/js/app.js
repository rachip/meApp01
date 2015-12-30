// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'firebase', 'ionicLazyLoad', 'starter.controllers', 'starter.services'])





.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  .state('auth', {
    url: "/auth",
    templateUrl: "views/auth/auth.html",
    abstract: true,
    controller: 'AuthCtrl'
  })
  
  .state('auth.main', {
    url: '/main',
    templateUrl: "views/auth/main.html",
    controller: 'LoginCtrl'
  })
  
  .state('app', {
    url: "/app",
    templateUrl: "views/app/template.html",
    abstract: true,
    controller: 'AppCtrl'
  })
  
  //manage property
  .state('app.manageProperty', {
    url: "/manageProperty",
  
        templateUrl: "views/app/manageProperty.html",
        controller: 'ManagePropertyCtrl'
   
  })

  
  // setup an abstract state for the tabs directive
    .state('invest', {
    url: '/invest',
    abstract: true,
    templateUrl: 'views/invest/index.html',
    controller: 'AuthCtrl'
  })

  // Each tab has its own nav history stack:

  .state('invest.chooseProperty', {
	  url: '/chooseProperty',
    views: {
      'menuContent': {
		  templateUrl: 'views/invest/chooseProperty.html',
          controller: 'ChoosePropertyCtrl'
    }
  }
  })


    .state('tab.propertyDetails', {
      url: '/propertyDetails/:id',
      views: {
        'tab-chooseProperty': {
          templateUrl: 'templates/propertyDetails.html',
          controller: 'PropertyDetailsCtrl'
        }
      }
    })

    .state('chats', {
    url: '/chats',
      templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
 
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/auth/main');

});