(function() {

	angular.module('searchCatFilter', []).filter('combinedFilter', ['$filter', function($filter) {
		return function(items, searchText) {
			var filtered = [];
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.info.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
					filtered.push(item);
				} else {
					// Check child items
					var childMatch = false;
					for (var j = 0; j < item.info.cats.length; j++) {
						var childItem = item.info.cats[j];
						if (childItem.info.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
							childMatch = true;
							break;
						}
					}
					if (childMatch) {
						filtered.push(item);
					}
				}
			}
			return filtered;
		};
	}]);

})();
