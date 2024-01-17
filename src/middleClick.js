function($parse) {
  return {
    restrict: 'A',
    compile: function($element, attrs) {
      var fn = $parse(attrs.middleClick);
      return function(scope, element) {
        element.on('mouseup', function(event) {
          scope.$apply(function() {
            if (event.which === 2) {
              fn(scope, {$event:event});
            }
          });
        });
      };
    }
  };}
