/*global angular*/
/*global app*/
/*global firebase*/

app.controller("salesController", function ($scope) {
	
	var refresh = function() {
		$scope.saleID = "";
		$scope.date = "";
		$scope.customerID = "";
		$scope.items = "";
		$scope.profit = "";
	}, objectsToArray = function (objects) {
		var res = [];
		
		for (var obj in objects) {
			res.push(objects[obj]);
		}

		return res;
	};
	
    
    //$scope.propertyName = 'saleID';
  //$scope.reverse = true;
 // $scope.saleID  = saleID;

  $scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
    
    
	refresh();
	
	$scope.addSale = function () {
		if (!($scope.saleID && $scope.date && $scope.customerID &&  $scope.items &&  $scope.profit)) {
			return;
		}

		var data = {
			saleID: $scope.saleID,
			date: $scope.date,
			customerID: $scope.customerID,
			items: $scope.items,
			profit: $scope.profit
		};
		
		firebase.database().ref().child('sales/'+ data.saleID).set(data).then(
		function () {
			refresh();
			$scope.$digest();
		});
	};
	
	$scope.editSale = function (saleObj) {
		$scope.editsaleid = saleObj.saleID;
		$scope.editcustomerid = saleObj.customerID;
		$scope.edititems = saleObj.items;
		$scope.editprofit = saleObj.profit;
		$scope.editdate = saleObj.date;
		
		$('#editSaleModal').modal('show');
	};
	
	$scope.deleteSaleRecord = function () {
		firebase.database().ref().child('sales/'+ $scope.editsaleid).remove().then(
		function () {
			$('#editSaleModal').modal('hide');
		});
	};
	
	$scope.confirmEdit =function () {
		var data = {
			saleID: $scope.editsaleid,
			date: $scope.editdate,
			customerID: $scope.editcustomerid,
			items: $scope.edititems,
			profit: $scope.editprofit
		};
		
		firebase.database().ref().child('sales/'+ data.saleID).set(data).then(
		function () {
			$('#editSaleModal').modal('hide');
		});
	};
	
	firebase.database().ref('sales/').on('value',
		function (snapshot) {
			$scope.salesData = objectsToArray(snapshot.val());
			$scope.$digest();
	});
});