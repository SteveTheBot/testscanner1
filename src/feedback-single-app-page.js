(function (angular) {
	angular.module('feedbackWidget', ['ui.router'])
		.config(function ($stateProvider) {
		$stateProvider
			.state('feedback', {
			templateUrl: "feedback.html"
		})
			.state('surveys', {
			templateUrl: "surveys.html"
		})
			.state('kbase', {
			templateUrl: "kbase.html"
		})
			.state('success-feedback', {
			templateUrl: "success-feedback.html"
		})
			.state('success-left', {
			templateUrl: "success-leave.html"
		})
			.state('success-joined', {
			templateUrl: "success-joined.html"
		})
			.state('feedback-user-group', {
			templateUrl: "feedback-group.html"
		})
			.state('survey', {
			templateUrl: "survey.html"
		})
			.state('main', {
			templateUrl: "main-page-feedback.html"
		});
	});

})(angular);
