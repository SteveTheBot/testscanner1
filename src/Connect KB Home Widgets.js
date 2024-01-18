document.addEventListener('readystatechange', function () {
	
	var catScope = angular.element( document.getElementById('xbb0128814f84a200db44334d0210c7dd') ).scope(),
		subcatScope = angular.element( document.getElementById('xbbab114c13b4e200196f7e276144b047') ).scope();
	
	catScope.subcatScope = subcatScope;
	
	console.log(catScope.subcatScope);
});
