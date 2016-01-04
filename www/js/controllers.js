angular.module('starter.controllers', ['firebase'])

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function($scope, $location, $ionicConfig, $rootScope, $http, $ionicPopup) {
})

//LOGIN
.controller('LoginCtrl', function($scope, $http, $state, $location) {



	$scope.loginClick= 0;
	$scope.errorLogin=0;

	$scope.updateMe = function() {  

		$scope.loginClick= 1;
		//$location.path( "/app/manageProperty" );
    };
    
    $scope.investMe = function() {
	    $state.go('invest.chooseProperty');
    };


    $scope.userDetail = {};
	
	if(localStorage.getItem("email") != null) {
		$scope.userDetail.email = localStorage.getItem("email");
		$scope.userDetail.password = localStorage.getItem("password");
	}

	$scope.submit = function() {    
	   $http({
		    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/Login', 
		    method: "POST",
		    data:  {mail:$scope.userDetail.email,
		    	    password:$scope.userDetail.password}, 
		    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		    
		}).then(function(resp) {
			if(resp.data == "false") {
				$scope.msg = "The Email or Password incorrect";
				$scope.errorLogin=1;
				Ionic.io();

					// this will give you a fresh user or the previously saved 'current user'
					var user = Ionic.User.current();
					  user.id = Ionic.User.anonymousId();

					//persist the user
					user.save();

			}
			else {

					// kick off the platform web client
					Ionic.io();

					// this will give you a fresh user or the previously saved 'current user'
					var user = Ionic.User.current();

					// if the user doesn't have an id, you'll need to give it one.
					if (!user.id) {
					  user.id = Ionic.User.anonymousId();
					  // user.id = 'your-custom-user-id';
					}

					user.set('name', resp.data["ClientName"]);
					user.set('userid', resp.data["UserId"]);

					//persist the user
					user.save();

				
				
				localStorage.setItem("loginUserType", resp.data["Type"]);
				if(resp.data["Type"] == "user") {
					loginUserType = "user";
					localStorage.setItem("id", resp.data["UserId"]);
					localStorage.setItem("ClientName", resp.data["ClientName"]);
					localStorage.setItem("isAdmin", resp.data["IsAdmin"]);
					localStorage.setItem("branch", resp.data["BranchId"]);
					localStorage.setItem("email", $scope.userDetail.email);
					localStorage.setItem("password", $scope.userDetail.password);


				}
				else {
					user.set('name', resp.data["ClientName"]);
					loginUserType = "client";
					localStorage.setItem("id", resp.data["ClientId"]);
					localStorage.setItem("ClientName", resp.data["ClientName"]);
					localStorage.setItem("email", $scope.userDetail.email);
					localStorage.setItem("password", $scope.userDetail.password);
				}

					console.log(resp.data);				
				 $state.go('invest.chooseProperty');
			}
		
		}, function(err) {
		    $scope.msg = err;

		    console.error('ERR', err);
		})
    };


})

//ChooseProperty Ctrl - show all marketing properties
.controller('ChoosePropertyCtrl', function($scope, $http, $state, $rootScope, $timeout)  {
    
	$http({
	    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/Marketing', 
	    method: "GET", 
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(function(resp) {

		$scope.properties = [];

		$scope.properties = resp.data;
	
	}, function(err) {
	    console.error('ERR', err);
	});
	
	$scope.chooseMarketingProperty = function(propertyId) {
		console.log("chooseMarketingProperty function " + propertyId);		
		$state.go('tab.propertyDetails');
		$timeout(function() {
	    	var unbind = $rootScope.$broadcast( "propertyId", {marketingPropertyId:propertyId} );
	    });
	};
})

.controller('ChatsCtrl', function($scope, $firebaseObject,$firebaseArray, $rootScope ) {

	var userId = localStorage.getItem("id");

	var ref = new Firebase("https://updatemeapp.firebaseio.com/messages/" + userId);



		ref.on("child_added", function(messageSnapshot) {
			 
			var messageData = messageSnapshot.val();

			console.log(messageData);


		});

	$scope.chats = $firebaseArray(ref);

	var username = localStorage.getItem("ClientName");



	$scope.sendChat = function(chat) {

		$scope.chats.$add({
		user: username,
		userid: userId,
        message: chat.message,
        timestamp: new Date().getTime()
        });

		chat.message = "";



	}


})


//propertyDetails ctrl
.controller('PropertyDetailsCtrl', function($scope, $http, $rootScope, $ionicHistory, $ionicPlatform) {
	console.log("PropertyDetailsCtrl");
	var marketingPropertyId;
	
	$scope.$on( "propertyId", function(event, data) {		
		marketingPropertyId = data.marketingPropertyId;
		console.log("ccc " + marketingPropertyId);
		
		$http({
			url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/Marketing/getMarketingId', 
			method: "GET",
			params:  {index:marketingPropertyId}, 
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).then(function(resp) {
			$scope.details = [];

			$scope.details = resp.data;
			console.log($scope.details);

		}, function(err) {
		    console.error('ERR', err);
		});	
	
	});
})

//ManageProperty Ctrl - logged in user
.controller('ManagePropertyCtrl', function($scope) {
	console.log('ManagePropertyCtrl');
})

.controller('DashCtrl', function($scope) {})

/*.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})*/

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
