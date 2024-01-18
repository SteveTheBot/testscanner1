(function (angular) {
	angular.module('feedbackWidgetLanding', ['ui.router'])
		.config(function ($stateProvider) {
		$stateProvider
			.state('success-left-group', {
			view: {
				'feedback@': {
					templateUrl: 'success-leave-group.html'
				}
			},
		})
			.state('success-joined-group', {
			view: {
				'feedback@': {
					templateUrl: "success-feedback-group.html"
				}
			},	
		})
			.state('feedback-user-group-landing', {
			view: {
				'feedback@': {
					templateUrl: "feedback-group-landing.html"
				}
			}
		});
	});

})(angular);
