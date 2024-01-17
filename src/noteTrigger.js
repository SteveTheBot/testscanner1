function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr ,$event) {
			element.on('click', function() {
				//var toggle_sign = angular.element($event.target).find("a.ahref-release-notes");
				var findSpan = angular.element(element).find("a.ahref-release-notes span");
				//console.log(toggle_sign);
				//console.log(findSpan);
				if(element.hasClass('collapsed')) {
					console.log('true');
					angular.element(findSpan).removeClass("glyphicon glyphicon-plus");
					angular.element(findSpan).addClass("glyphicon glyphicon-minus");
				} else {
					angular.element(findSpan).removeClass("glyphicon glyphicon-plus");
					angular.element(findSpan).addClass("glyphicon glyphicon-minus");
				}
			});
		}
	};
}
