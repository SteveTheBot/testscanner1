function($window) {
	return {
		restrict: 'AE',
		link: function (scope, element, attrs) {
			var header = angular.element(element);
			
			angular.element($window).bind("scroll", function () {
				var fromTop = $window.pageYOffset;
				var body = angular.element(document).find('body');

				body.toggleClass('down', (fromTop > 400));

				if (fromTop >= 80) {
					angular.element(document.querySelector('#nav-menu-landing')).addClass("sticky");
				} else {
					angular.element(document.querySelector('#nav-menu-landing')).removeClass("sticky");
				}
			});
		}
	};}
