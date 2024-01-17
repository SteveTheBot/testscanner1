function invokeMultiLevelParentFunc($rootScope, $timeout) {
	"use strict";
	return {
		restrict: 'A',
		scope: {
			invokeEvents: '@',
			invokeEventHandlers: '@',
			invokeWithModel: '='
		},
		link: function (scope, elem, attrs) {
			var eventsToHandle = attrs.invokeEvents.split(',').map(function(eItem){
				return eItem.trim();
			});
			var eventHandlers = attrs.invokeEventHandlers.split(',').map(function(ehItem){
				return ehItem.trim();
			});

			eventsToHandle.forEach(function (e, index) {
				elem.bind(e, function ($event) {
					if (typeof $rootScope[eventHandlers[index]] === 'function') {
						$event.stopPropagation();
						$rootScope[eventHandlers[index]]($event, scope.invokeWithModel);
					}
				});
			});
		}
	};
}
