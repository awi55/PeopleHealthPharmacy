/*global angular*/
var app = angular.module("PHPApp", ["ngRoute"]);

app.controller("mainController", function ($scope, $route) {
    
   // $scope.isActive = function (viewLocation) { 
     //   return viewLocation == $location.path();
    //.};
    
   // function widgetsController($scope, $route) {
    $scope.$route = $route;
});

app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('!');
	
	$routeProvider.
	when("/sales", {
		templateUrl: "templates/sales.html",
		controller: "salesController",
        activetab: 'sales'
	}).
	when("/items", {
		templateUrl: "templates/items.html",
		controller: "itemsController",
        activetab: 'items'
	}).
    when("/admin", {
		templateUrl: "templates/admin.html",
		controller: "adminController",
        activetab: 'admin'
	}).
	otherwise({redirectTo: "/sales"});
}]);


