angular.module('sliceItFilter', []).filter('slice', function() {
	
	return function(arr, start, end) {
		console.log(arr);
		console.log("            Start: " + start, "            End: " + end);
    return arr.slice(start, end);
  };
});
