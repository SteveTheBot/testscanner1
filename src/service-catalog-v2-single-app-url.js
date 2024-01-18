(function (angular) {
	angular.module('spaRoutersSCR', ['ngRoute'])
		.config(['$routeProvider', function($routeProvider) {
            $routeProvider
            .when('/help?id=bb_service_catalog_v2/scrhome', {
               templateUrl: 'serviceCatalogHomepage.html'
            })
            .when('/scrallservices', {
               templateUrl: 'allServices.html'
            })
            .otherwise({
               redirectTo: '/scrhome'
            });
         }]);
})(angular);
