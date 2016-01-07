// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'starter.services', 'ionic.service.analytics', 'firebase', 'ionicLazyLoad', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    /*var push = new Ionic.Push({
      "onNotification": function (nutification) {

        alert("soooo");
        
      },
      "ploginConfig": {
        "android": {
          "iconColor" : "#ccc"


        }


      }
 
    });

    var user = new Ionic.User.current();

    if (!user.id) {
          user.id = Ionic.User.anonymousId();
          // user.id = 'your-custom-user-id';
        }

        user.save();

        var callBack = function (argument) {

          push.addTokenToUser(user);
          user.save();
          
        }

        push.register(callBack);*/



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
  
  //overview
  .state('overview', {
    url: "/overview",
    templateUrl: "views/app/overview.html",
   controller: 'OverviewPropertiesCtrl'
  })
  
  //property details
  .state('app.propertyDetails', {
    url: "/propertyDetails",
    views: {
    	'menuContent': {
    		templateUrl: "views/app/propertyDetails.html",
    		controller: 'PropertyDetailsCtrl'
    	}
    }
  })
  
  // setup an abstract state for the tabs directive
  .state('invest', {
    url: '/invest',
    abstract: true,
    templateUrl: 'views/invest/index.html',
    controller: 'AuthCtrl'
  })

  // Each tab has its own nav history stack:
  .state('invest.marketing', {
	  url: '/marketing',
    views: {
      'menuContent': {
		  templateUrl: 'views/invest/marketing.html',
          controller: 'MarketingCtrl'
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
