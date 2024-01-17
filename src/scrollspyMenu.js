function($timeout, $window, $animate) {
	return {
		restrict : "AC",
		link: function($scope, element, attr){
			/*
			var menuItems = [];
			var config = {offset: 0, duration: 500};
			var userConfig = $scope.$eval(attr.scrollspyMenu);
			angular.extend(config, userConfig);
			
			var scrollTo = function(event){
				event.preventDefault();
				var target = angular.element(event.target.hash);
				angular.element("html,body").animate({
					scrollTop: target.offset().top - Number(config.offset) + 1
				}, config.duration);
				
			}

			//bind click events of menu items
			var setup = function(){
				angular.forEach(element.find('a'), function(el){
					var self = $(el);
					var target = $(self.attr('href'));
					if(target.length){
						self.click(scrollTo);
						menuItems.push({self: self, target: target});
					}
					$scope.$apply();	
				});
			}

			$timeout(setup, 0);

			// Bind to scroll
			angular.element($window).bind("mousewheel", function(e) {

				var winTop = $(self).scrollTop() + Number(config.offset);
				var current = menuItems[0];
				angular.forEach(menuItems, function(item){
					item.fromTop = item.target.offset().top - winTop;
					if(item.fromTop < 0)
						current = item;
				});
				angular.forEach(menuItems, function(item){
					console.log(item, current);
					if(item === current)
						item.self.addClass('active');
					else
						item.self.removeClass('active');
				});

			});  */

		}
	};
}
