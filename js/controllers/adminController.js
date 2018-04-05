/*global angular*/
/*global app*/
/*global firebase*/

app.controller("adminController", function ($scope) {
	$scope.pairItems = [];
	
	var dict = {},
		transactionsList,
		objectsToArray = function (objects) {
		var res = [];
		
		for (var obj in objects) {
			res.push(objects[obj]);
		}

		return res;
	}, parseSaleItems = function (input) {
		var itemsAndQuantity = input.split('-'),
			result = [];
		
		//Iterate all over elements 
		for (var i = 0; i < itemsAndQuantity.length; i++) {
			//Get item's title and quantity 
			
			var item = itemsAndQuantity[i],
				leftBracket = item.indexOf('('),
				rightBracket = item.indexOf(')'),
				itemClass = {
				title: item.substr(0, leftBracket),
				quantity: parseInt(item.substr(leftBracket+1, rightBracket-leftBracket - 1))
			};

			result.push(itemClass);
		}
		
		return result;
	}, updateRelevantItems = function (transactions) {
		dict = {};
		var mostOccr = 0,
			result = [];
		
		for (var t = 0; t < transactions.length; t ++) {
			var items = parseSaleItems(transactions[t].items);
			for (var i = 0; i < items.length; i++){
				for (var j = i + 1; j < items.length; j++){

					var pair1 = items[i].title + '-' + items[j].title;
					var pair2 = items[j].title + '-' + items[i].title;

					if (dict[pair1] == undefined && dict[pair2] == undefined) {
						dict[pair1] = 1;
						if (dict[pair1] > mostOccr) {
							mostOccr = dict[pair1];
							result = [];
							result.push(pair1);
						} else if (dict[pair1] == mostOccr){
							result.push(pair1);
						}
					} else if (dict[pair1] != undefined && dict[pair2] == undefined) {
						dict[pair1] ++;
						if (dict[pair1] > mostOccr) {
							mostOccr = dict[pair1];
							result = [];
							result.push(pair1);
						} else if (dict[pair1] == mostOccr){
							result.push(pair1);
						}
					} else if (dict[pair1] != undefined && dict[pair2] == undefined) {
						dict[pair2] ++;
						if (dict[pair2] > mostOccr) {
							mostOccr = dict[pair2];
							result = [];
							result.push(pair2);
						} else if (dict[pair2] == mostOccr){
							result.push(pair2);
						}
					}
				}
			}
		}
		$scope.pairItems = result;
	}, updateTotalCustomers = function (transactions) {
		var TotalProfit = 0;
		$scope.numberofCustomers = transactions.length;
		
		for (var t = 0; t < transactions.length; t ++) {
			var profit = parseInt(transactions[t].profit);
			TotalProfit = TotalProfit + profit;
		}
		$scope.TotalProfit = TotalProfit;
		if (transactions.length == 0){
			$scope.AverageProfit = 0;
		} else {
		$scope.AverageProfit = TotalProfit / transactions.length;
		}
	}, predictItemSales = function(transactions) {
		var dict = {},
			listItems = [],
			prediction = [];
		//Predict Items
		for (var t = 0; t < transactions.length; t ++) {
			var items = parseSaleItems(transactions[t].items);
			for (var i = 0; i < items.length; i++){
				var quantity = items[i].quantity;
				var itemName = items[i].title;
				var averageQuantity = 0;
				
				if (dict[itemName] != undefined) {
					dict[itemName] += quantity;
				} else {
					listItems.push(itemName);
					dict[itemName] = quantity;
				}
			}
		}
		
		listItems.sort(function (a,b) { return  dict[b] - dict[a] });
		
		if (transactions.length > 0) {
			for (var i = 0; i < listItems.length; i++) {
				var predictedItem = { name: listItems[i], quantity: Math.max(1, dict[listItems[i]] / transactions.length)};
				prediction[i] = predictedItem;
			}
		}
		$scope.predictedItems = prediction;
		$scope.top10 = listItems.slice(0, 10);
	}, getTransMonth = function (date){
		var lSlash = date.indexOf('/'),
			rSlash = date.indexOf('/', lSlash + 1);
		var	month = parseInt(date.substring(lSlash+1, rSlash));
		
		return month;
	}, getReport = function () {
		
		var result = [[]],
			months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			transByMonth = [[]],
			itemsByMonth = [[]];
		
		result[0] = [];
		result[0].push("Item");
		for (var i = 0; i < months.length; i ++){
			result[0].push(months[i]);
		}
		
		for (var i = 0; i < transactionsList.length; i++){
			var month = getTransMonth(transactionsList[i].date);
			if (transByMonth[month] == undefined) {
				transByMonth[month] = [];
				transByMonth[month].push(transactionsList[i]);
				
			} else {
				transByMonth[month].push(transactionsList[i]);
			}
		}
		var byItems = {},
			listItems = [];
		
		for (var m = 1; m <= 12; m++) {
			if (transByMonth[m] != undefined){
				for (var i = 0; i < transByMonth[m].length; i++) {
					var trans = transByMonth[m][i],
						items = parseSaleItems(trans.items);
					for (var j = 0; j < items.length; j++){
						if (byItems[items[j].title] == undefined) {
							byItems[items[j].title] = {}; 
							byItems[items[j].title][m] = items[j].quantity;
							listItems.push(items[j].title);
						} else if (byItems[items[j].title][m] == undefined) {
							byItems[items[j].title][m] = items[j].quantity;
						}
						else {
							byItems[items[j].title][m] += items[j].quantity;
						}
					}
				}
			}
		}
		
		for (var i = 0; i < listItems.length; i++) {
			result[i+1] = [];
			result[i+1].push(listItems[i]);
			
			for (var j = 1; j <= 12; j++) {
				if (byItems[listItems[i]][j] == undefined) {
					result[i+1].push(0);
				} else {
					result[i+1].push(byItems[listItems[i]][j]);
				}
			}
		}
		
		return result;
	};
	
	$scope.GenerateCSV = function() {
		//Source: StackOverflow - How to export JavaScript array info to csv (on client side)?
		//Link address: http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
	
		var sampleData = getReport();
			content = "data:text/csv;charset=utf-8,";
		
		
		for (var i = 0; i < sampleData.length; i++) {
			var data = sampleData[i].join(',');
			content += (i < sampleData.length)? data + "\n" : data;
		}
		
		var encodedUri = encodeURI(content);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "report.csv");
		document.body.appendChild(link);

		link.click();
	}
	
	firebase.database().ref('sales/').on('value',
		function (snapshot) {
			//getting arrays of transactions
			var transactions = objectsToArray(snapshot.val());
			updateRelevantItems(transactions);
			updateTotalCustomers(transactions);
			predictItemSales(transactions);
			transactionsList = transactions;
			$scope.$digest();
	});
});