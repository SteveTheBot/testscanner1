	angular.module('sn.$sp').filter('highlightSearch', function() {
		return function(text, search) {
			if (!search) {
				return text;
			}
			var regex = new RegExp('('+ search + ')', 'gi');
			return text.replace(regex, '<span class="highlighted">$1</span>');
		};
	});
