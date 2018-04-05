/*global angular*/
/*global app*/
/*global firebase*/

app.controller("itemsController", function ($scope) {
	
	var refresh = function() {
		$scope.itemID = "";
		$scope.date = "";
		$scope.itemTitle = "";
		$scope.itemDesc = "";
		$scope.price = "";
		$scope.quantity = "";
	}, objectsToArray = function (objects) {
		var res = [];
		
		for (var obj in objects) {
			res.push(objects[obj]);
		}

		return res;
	};
	
    
    //$scope.propertyName = 'itemID';
  //$scope.reverse = true;
 // $scope.itemID  = itemID;

  $scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
    
    
	refresh();
	
	$scope.addItem = function () {
		
		if (!($scope.itemID && $scope.date && $scope.itemTitle &&  $scope.itemDesc &&  $scope.price && $scope.quantity)) {
			return;
		}
		
		var data = {
			itemID: $scope.itemID,
			date: $scope.date,
			itemTitle: $scope.itemTitle,
			itemDesc: $scope.itemDesc,
			price: $scope.price,
			quantity: $scope.quantity
		};
		
		firebase.database().ref().child('items/'+ data.itemID).set(data).then(
		function () {
			refresh();
			$scope.$digest();
		});
	};
	
	$scope.editItem = function (itemObj) {
		$scope.edititemid = itemObj.itemID;
		$scope.edititemtitle = itemObj.itemTitle;
		$scope.edititemdesc = itemObj.itemDesc;
		$scope.editprice = itemObj.price;
		$scope.editdate = itemObj.date;
		$scope.editquantity = itemObj.quantity;
		
		$('#editItemModal').modal('show');
	};
	
	$scope.deleteItemRecord = function () {
		firebase.database().ref().child('items/'+ $scope.edititemid).remove().then(
		function () {
			$('#editItemModal').modal('hide');
		});
	};
	
	$scope.confirmEdit =function () {
		var data = {
			itemID: $scope.edititemid,
			date: $scope.editdate,
			itemTitle: $scope.edititemtitle,
			itemDesc: $scope.edititemdesc,
			price: $scope.editprice,
			quantity: $scope.editquantity
		};
		
		firebase.database().ref().child('items/'+ data.itemID).set(data).then(
		function () {
			$('#editItemModal').modal('hide');
		});
	};
	
	firebase.database().ref('items/').on('value',
		function (snapshot) {
			$scope.itemsData = objectsToArray(snapshot.val());
			$scope.$digest();
	});
});