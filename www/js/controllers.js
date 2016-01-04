var loginUserType;
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
				$state.go('app.overview');
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

//Chats Ctrl
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

//OverviewProperties Ctrl - logged in user
.controller('OverviewPropertiesCtrl', function($scope, $http, $timeout, $rootScope) {
	
	// get properties for 'your properties' section
	var url;
    var id;
    if(loginUserType == "client") {    	
    	url = 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/PropertyImage';
    	id = localStorage.getItem('id');
    	$http({
    	    url: url, 
    	    method: "GET",
    	    params:  {index:id}, 
    	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).then(function(resp) {

    		$scope.propertyImage = [];

    		$scope.propertyImage = resp.data;
    	
    	}, function(err) {
    	    console.error('ERR', err);
    	})
    }
	
	// get properties for 'special deals section'
	if(loginUserType == "client") {    	
		url = 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/PropertyImage/getSpecialDealsPropertyImage';
    	id = localStorage.getItem('id');
    	$http({
    	    url: url, 
    	    method: "GET",
    	    params:  {index:id}, 
    	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).then(function(resp) {

    		$scope.specialPropertyImage = [];

    		$scope.specialPropertyImage = resp.data;
    	
    	}, function(err) {
    	    console.error('ERR', err);
    	})
	}
	
	$scope.showDetails = function(propertyId) {
		console.log("showDetails function " + propertyId);
	    $timeout(function() {
	    	var unbind = $rootScope.$broadcast( "showDetails", {PropertyId:propertyId} );
	    });
	}
})

//propertyDetails ctrl
.controller('PropertyDetailsCtrl', function($scope, $http, $rootScope) {
	console.log("PropertyDetailsCtrl");
	
	var propertyId;
	$scope.$on( "showDetails", function(event, data) {	  
		propertyId = data.PropertyId;
		getPurchaseDetails(propertyId, $scope, $http);
		getClosingDetails(propertyId);
		getRenovationDetails(propertyId);
		getLeasingDetails(propertyId);
		getOccupiedDetails(propertyId);
		getEvictionDetails(propertyId);		
	});	
})

.controller('DashCtrl', function($scope) {})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

function getPurchaseDetails(propertyId, $scope, $http) {
	console.log("getPurchaseDetails");
	$http({
	    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/PurchaseAndSale', 
	    method: "GET",
	    params:  {index: propertyId}, 
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(function(resp) {
		if (resp.data.length != 0) {
			//$scope.isHasData = true;
			//$scope.isMsg = false;
	
			$scope.purchaseAndSale = resp.data[0];
			
			console.log( resp.data[0]);
			$scope.isHasFile = $scope.purchaseAndSale['IsHasFile'] == 1 ? true : false;
			$scope.IsBuyerFile = $scope.purchaseAndSale['IsBuyerFile'] == 1 ? true : false;
			$scope.IsSignedDocsFile = $scope.purchaseAndSale['IsSignedDocsFile'] == 1 ? true : false;
			$scope.IsBalanceFile = $scope.purchaseAndSale['IsBalanceFile'] == 1 ? true : false;
			$scope.IsFilesTo = $scope.purchaseAndSale['IsFilesToS‌ignFile'] == 1 ? true : false;
			$scope.showNote = $scope.purchaseAndSale['ShowNote'] == 1 ? true : false;
							
		} else {
			$scope.msg = "Your property is not on Purchase And Sale status";		
			$scope.isMsg = true;
			$scope.isHasData = false;
		}
		
	}, function(err) {
	    console.error('ERR', err);
	})
}


function getClosingDetails(propertyId) {
	console.log("getClosingDetails");
}


function getRenovationDetails(propertyId) {
	console.log("getRenovationDetails");
}


function getLeasingDetails(propertyId) {
	console.log("getLeasingDetails");
}


function getOccupiedDetails(propertyId) {
	console.log("getOccupiedDetails");
}


function getEvictionDetails(propertyId) {
	console.log("getEvictionDetails");
}
