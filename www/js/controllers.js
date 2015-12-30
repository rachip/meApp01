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
			}
			else {
				
				localStorage.setItem("loginUserType", resp.data["Type"]);
				if(resp.data["Type"] == "user") {
					loginUserType = "user";
					localStorage.setItem("id", resp.data["UserId"]);
					localStorage.setItem("isAdmin", resp.data["IsAdmin"]);
					localStorage.setItem("branch", resp.data["BranchId"]);
					localStorage.setItem("email", $scope.userDetail.email);
					localStorage.setItem("password", $scope.userDetail.password);	
				}
				else {
					loginUserType = "client";
					localStorage.setItem("id", resp.data["ClientId"]);
					localStorage.setItem("email", $scope.userDetail.email);
					localStorage.setItem("password", $scope.userDetail.password);
				}				
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

.controller('ChatsCtrl', function($scope, $firebaseObject, $firebaseArray, $rootScope ) {

	var ref = new Firebase("https://updatemeapp.firebaseio.com/");

	$scope.chats = $firebaseArray(ref);

	if (localStorage.getItem("email") != null) {

		var username = localStorage.getItem("email");

	}

	else {

		var username = 'user';
	}





	$scope.sendChat = function(chat) {

		$scope.chats.$add({
		user: username,
        message: chat.message
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
