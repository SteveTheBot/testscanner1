(function (angular) {
	angular.module('serviceCatalogV2', ['ui.router'])
		.config(function ($stateProvider) {
		
		$stateProvider.state('serviceCatalog', {
			views: {
				'schome': {
					templateUrl: 'serviceCatalogHomepage.html'
				}
			}
		}).state('allServices', {
			views: {
				'scallservices': {
					templateUrl: 'allServices.html'
				}
			}
		}).state('subcategoryPage', {
			views: {
				'subcatpage': {
					templateUrl: 'subCategory.html'
				}
			}
		}).state('rootCategory', {
			views: {
				'rootcategory': {
					templateUrl: 'rootCategory.html'
				}
			}
		});	
	});
})(angular);
