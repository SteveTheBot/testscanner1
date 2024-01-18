(function() {

	// define Unique Filter
	angular.module("uniqueFilter", []).filter("unique", function() {
		return function(collection, keyname) {
			var uniqueCategories = [];

			for (var i = 0; i < collection.length; i++) {
				if (uniqueCategories[i] === collection[i].article.category ) {
					continue;
				} else {
					uniqueCategories.push(collection[i].article.category);
				}
			}
			return uniqueCategories;
		};
	});
})();
