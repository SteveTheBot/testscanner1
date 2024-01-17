function(i18n, $rootScope) {

	return {
		template:   '<div ng-repeat="page in pages track by $index" ng-if="(isMobile && (c.state == $index || (c.state == 0 && pagination == \'none\')))  || (!isMobile && ((c.state == $index || (c.state == 0 && pagination == \'none\')) || data.isKioskSurvey))">' +
		'<div class="assessable-record" ng-if="pagination != \'none\'  && (data.evaluation_method == \'assessment\' || data.evaluation_method == \'attestation_v2\' || data.evaluation_method == \'risk_assessment\') " >' +
		'<h3 class="assessable-record-text">'+
		'{{::page.assessableRecord.asrName}}'+ 
		'</h3></div>' +
		'<div class="panel-heading survey-heading" ng-if="pagination != \'none\' || $index == 0 && !data.isKioskSurvey">' +
		'<h3 class="survey-heading-text">' +
		'<a ng-if="::data.trigger_id && (data.evaluation_method == \'survey\' || data.evaluation_method == \'quiz\') " class="survey-heading" style="font-weight: 100;" href="?id=ticket&table={{::data.trigger_table}}&sys_id={{::data.trigger_id}}">{{::data.trigger_display}}&nbsp;</a>' +
		'<span ng-if="pagination == \'none\'">{{::data.title}}</span>' +
		'<span ng-if="pagination != \'none\'">{{page.display}}&nbsp;</span>'+
		'</h3>' +
		'<span class="category-description" ng-if="(pagination != \'none\') &amp;&amp; (page.catDesc &amp;&amp; page.catDesc.length)" >{{::page.catDesc}}</span>'+
		'</div>' +
		'<div class="text-center intro-text" ng-class="{\'wrapper-md\': !data.isKioskSurvey}" ng-style="{\'margin-top\':data.isKioskSurvey ? \'15px\' : \'\'}" ng-if= "data.one_click_survey == \'true\' && data.introduction">' +
		'<span ng-bind-html="::data.introduction"></span>' +
		'</div>' +
		'<div ng-class="{\'wrapper-md\': !data.isKioskSurvey}" ng-if="((!data.asr[page.assessableRecord.asrId].collapsed) || page.showAsrName == \'true\' || pagination != \'none\')">' +
		'<div id="walkup_lang_picker" style="text-align: justify; text-align-last: right;">'+
		'<label ng-if="data.showLanguagePicker == \'true\' && data.one_click_survey == \'true\'" for="spLanguagePicker">${Language}: </label>'+
		'<select ng-if="data.showLanguagePicker == \'true\' && data.one_click_survey == \'true\'" ng-model="data.pickedLanguage" name="spLanguagePicker" id="spLanguagePicker" '+
		'ng-options="lang.label for lang in data.languages track by lang.value" ng-change="c.setLanguage()">'+
		'</select>'+
		'</div>'+
		'<!-- Category collapse - show only in no-pagination case -->' +
		'<div class="" ng-if="pagination == \'none\' && pages.length > 1 && (data.evaluation_method == \'assessment\' || data.evaluation_method == \'attestation_v2\' || data.evaluation_method == \'risk_assessment\') &amp;&amp; page.showAsrName == \'true\'" >' +
		'<h3 class="col-xs-11 category-label">'+
		'{{::page.assessableRecord.asrName}}'+ 
		'</h3>' +
		'<h3 class="col-xs-1 text-right">' +
		'<a ng-if="!data.asr[page.assessableRecord.asrId].collapsed" href="javascript:void(0)"><span class="glyphicon glyphicon-menu-down" ng-click="data.asr[page.assessableRecord.asrId].collapsed = true"></span></a>' +
		'<a ng-if="data.asr[page.assessableRecord.asrId].collapsed" href="javascript:void(0)"><span class="glyphicon glyphicon-menu-right" ng-click="data.asr[page.assessableRecord.asrId].collapsed = false"></span></a>' +
		'</h3>' +
		'</div>' +
		'<div class="wrapper-sm row" ng-if="pagination == \'none\' && pages.length > 1 && !data.asr[page.assessableRecord.asrId].collapsed" ng-style="{\'border-top\': (($index > 0 && !(page.showAsrName == \'true\')) ? \'1px solid #e6e8ea\' : \'\'), \'margin-left\':(data.evaluation_method == \'assessment\' || data.evaluation_method == \'attestation_v2\' || data.evaluation_method == \'risk_assessment\') ? \'5px\' : \'\' }">' +
		'<h3 class="col-xs-11 category-label" ng-style="{\'font-size\':(data.evaluation_method == \'assessment\' || data.evaluation_method == \'attestation_v2\' || data.evaluation_method == \'risk_assessment\') ? \'1.5em\' : \'\' }">'+
		'</span>{{::page.display}}' +
		'</h3>' +
		'<h3 class="col-xs-1 text-right">' +
		'<a ng-if="!page.collapsed" href="javascript:void(0)"><span class="glyphicon glyphicon-menu-down" ng-click="page.collapsed = true"></span></a>' +
		'<a ng-if="page.collapsed" href="javascript:void(0)"><span class="glyphicon glyphicon-menu-right" ng-click="page.collapsed = false"></span></a>' +
		'</h3>' +
		'<span  style="margin-left:10px;" ng-if="(page.catDesc &amp;&amp; page.catDesc.length)">{{::page.catDesc}}</span>'+
		'</div>' +
		'<div id="category-questions-{{::page.id}}" class="collapse" ng-class="(data.asr[page.assessableRecord.asrId].collapsed || page.collapsed) ? \'\' : \'in\'" ng-style="{\'margin-left\':(data.evaluation_method == \'assessment\' || data.evaluation_method == \'attestation_v2\' || data.evaluation_method == \'risk_assessment\') ? \'30px\' : \'\' }">' +
		'<div ng-repeat="id in page.questions track by $index" ng-init="field = data.questions.idMap[id]" ng-if="::(data.questions.idMap[id].type != \'template\' || data.questions.idMap[id].template.firstQuestion == true || isMobile)">' +
		'<div class="wrapper-sm row" ng-class=" { \'text-center\': data.isKioskSurvey, \'form-group\': !data.isKioskSurvey }" style="margin-left: 0" ng-if="!field.depends_on || c.isAnyDependencySatisfied(field)">' +
		'<h4 class="question-label" ng-if="field.type != \'checkbox\' && field.type != \'signature\' && field.type != \'template\' && field.type != \'attachment\'">' +
		'<span class="field-decorations">' +
		'<span ng-show="field.mandatory" class="fa fa-asterisk mandatory" ng-class="{\'mandatory-filled\': c.isMandatoryFilled(field)}" title="{{::data.parameterizedMsgsMap.mandatory}}" style="padding-right: .25em" ></span>' +
		'<span ng-repeat="decoration in field.decorations track by $index" class="decoration {{ decoration.icon }}" title="{{ decoration.text }}"></span>' +
		'</span>' +
		'{{::field.label}}' +
		'</h4>' +
		'<div class="details-text" ng-if="::field.details && field.type != \'checkbox\' && field.type != \'signature\' && field.type != \'template\' && field.type != \'attachment\'" ng-bind-html="field.details"></div>' +
		'<sp-survey-field ng-class=" { \'text-center\': data.isKioskSurvey } " field="field" data="data" c="c" mobile-prefix="mobilePrefix" ng-style="{\'pointer-events\': disabled ? \'none\' : \'inherit\'}"></sp-survey-field>' +
		'</div> <!-- end form-group -->' +
		'</div> <!-- end ng-repeat field in data.questions -->' +
		'</div>' +
		'</div> <!-- end wrapper-md -->' +
		'<!-- Nav Buttons -->' +
		'<div class="wrapper-md" ng-if="pagination != \'none\' || $index == pages.length - 1 && !data.isKioskSurvey">' +
		'<div class="row">' +
		'<div class="col-xs-6 col-sm-4" ng-if="!isMobile || $index > 0">' +
		'<div class="wrapper-xs">' +
		'<div ng-if="pagination == \'none\' || $index == 0">' +
		'<button class="btn btn-default cancel-feedback hidden-xs" ng-click="cancel(page, c.state)">${Cancel}</button>' +
		'</div>' +
		'<div style="display: inline-block; width: 40%;">' +
		'<button style="width: 80%;" ng-disabled="pagination == \'none\' || $index == 0" class="btn btn-default hidden-xs" ng-click="previousPage(c.state)">${Previous}</button>' +
		'<button style="width: 80%;" ng-disabled="pagination == \'none\' || $index == 0" class="btn btn-default btn-block btn-lg visible-xs" ng-click="previousPage(c.state)">${Previous}</button>' +
		'</div>' +
		'<div style="display: inline-block; width: 40%;" ng-if="pagination != \'none\' && !isLastPage(page)">' +
		'<button style="width: 80%;" class="btn  btn-default hidden-xs" ng-click="nextPage(page, c.state)" ng-disabled="disableNextButton(page)">${Next}</button>' +
		'<button style="width: 80%;" class="btn  btn-default btn-block btn-lg visible-xs" ng-click="nextPage(page, c.state)" ng-disabled="disableNextButton(page)">${Next}</button>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'<div class="col-xs-6 col-sm-8 text-right" ng-class="(pagination != \'none\' && $index > 0) ? \'\' : \'col-xs-12\'">' +
		'<div class="wrapper-xs hidden-xs" ng-if="!c.isPublic" style="width: 100%; display:inline-block;">' +
		'<div style="display: inline-block; width: auto; margin: 0 5%;">'+
		'<button class="btn btn-default md-raised" ng-click="showAdvanced($event)" ng-disabled="disabled"> Reassign Survey </button>'+
		'</div>'+
		'<div style="display: inline-block; width: auto;">' +
		'<button class="btn btn-default save-button" ng-disabled="disabled" ng-click="save(page, c.state)">${Save}</button>' +
		'</div>' +
		'</div>' +
		'<div style="width: 15%; display:inline-block;" class="wrapper-xs">' +
		'<div  ng-if="pagination == \'none\' || isLastPage(page)">' +
		'<button class="btn btn-primary submit-feedback hidden-xs" ng-click="submit(page, c.state)" ng-disabled="disabled || disableNextButton(page)">${Submit}</button>' +
		'<button class="btn btn-primary submit-feedback btn-block btn-lg visible-xs" ng-click="submit(page, c.state)" ng-disabled="disabled || disableNextButton(page)">${Submit}</button>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div> <!-- end ng-repeat category in data.categories -->' +
		'<!-- Survey thank you page -->' +
		'<div class="wrapper-md" ng-if="(c.state == pages.length) && data.successMessage && data.successMessage.length  && (!data.isKioskSurvey || isMobile)">' +
		'<div class="text-center intro-text">' +
		'<div class="wrapper-sm">' +
		'<div class="outer-circle">'+   
		'<span class = "intro-icon-assessment survey-icon glyphicon icon-article-document"ng-if="(data.evaluation_method == \'assessment\' || data.evaluation_method == \'attestation_v2\' || data.evaluation_method == \'risk_assessment\')"></span>'+
		'<span ng-if="(data.evaluation_method == \'survey\' || data.evaluation_method == \'quiz\')" class="survey-icon glyphicon icon-form"></span>'+
		'</div>'+
		'</div>' +
		'</div>' +
		'<div class="wrapper-sm text-center">' +
		'<h4 class="description-text" ng-bind-html="data.successMessage"></h4>' +
		'</div>' +
		'</div>',

		scope: {
			pagination: '=',
			isMobile: '=',
			data: '=',
			c: '=',
			disabled: '='
		},
		controller: function($scope,$mdDialog,$timeout) {

			var init = function() {
				$scope.mobilePrefix = "mobile-";
				$scope.pages = [];
				if($scope.c.data.evaluation_method == 'assessment' || $scope.c.data.evaluation_method == 'attestation_v2' || $scope.c.data.evaluation_method == 'risk_assessment'){
					if ($scope.pagination == 'question')
						$scope.pages = $scope.c.data.questions.idList.map(function(qid) {return {id: qid, questions: [qid], display: $scope.c.data.questions.idMap[qid].category.display, catDesc: $scope.c.data.questions.idMap[qid].category.description,assessableRecord: $scope.c.data.questions.idMap[qid].assessableRecord}});

					else if ($scope.pagination == 'category')
						$scope.pages = $scope.c.data.categories.idList.map(function(catid) {
							var obj = $scope.c.data.categories.idMap[catid];
							return {id: catid, display: obj.display, questions: obj.questions,
											catDesc: obj.description, assessableRecord: obj.assessableRecord};	
						});

					else
						$scope.pages = $scope.c.data.categories.idList.map(function(catid) {
							var obj = $scope.c.data.categories.idMap[catid];
							return {id: catid, display: obj.display, questions: obj.questions,
											catDesc: obj.description, assessableRecord: obj.assessableRecord,showAsrName: obj.showAsrName};	
						});
				} else {
					if ($scope.pagination == 'question')
						$scope.pages = $scope.c.data.questions.idList.map(function(qid) {return {id: qid, questions: [qid], catDesc: $scope.c.data.questions.idMap[qid].category.description,display: $scope.c.data.questions.idMap[qid].category.display}});		

					else
						$scope.pages = $scope.c.data.categories.idList.map(function(catid) {
							var category = $scope.c.data.categories.idMap[catid];
							return {id: catid, display: category.display, catDesc: category.description,questions: category.questions};
						});
				}

				var signature = $scope.c.data.signature;
				if (signature && !$scope.c.isPublic) {
					if ($scope.pagination == 'none')
						$scope.pages[$scope.pages.length - 1].questions.push(signature.sys_id);
					else
						$scope.pages.push({id: signature.sys_id, display: $scope.c.data.title, questions: [signature.sys_id]});

					$scope.c.data.questions.idMap[signature.sys_id] = {
						type: 'signature',
						name: 'signature_result',
						label: signature.label,
						value: signature.value,
						sys_id: signature.sys_id,
						signType: signature.type,
						depends_on: ''
					};
				}
			};
			init();

			$scope.status = '  ';
			$scope.customFullscreen = false;


			$scope.showAdvanced = function (ev) {
				$mdDialog.show({
					locals:{users: $scope.c.users},
					controller: DialogController,
					scope: $scope,
					preserveScope:true,
					templateUrl: 'rh-reassign-template.html',
					// Appending dialog to document.body to cover sidenav in docs app
					// Modal dialogs should fully cover application to prevent interaction outside of dialog
					parent: angular.element(document.body),
					targetEvent: ev,
					panelClass: 'reassign-button',
					clickOutsideToClose: false,
					escapeToClose: false,
					fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
				}).then(function (answer) {
				//	$scope.status = 'You said the information was "' + answer + '".';
				}, function () {
					//$scope.status = 'You cancelled the dialog.';
				});
			};

			function DialogController($scope, $mdDialog, $timeout, users, parent, $rootScope) {
				
				$scope.enable_loader = false;
				$scope.show_ajax_loader = false;
				
				
				$rootScope.$on("enable-loader", function(event, result){
					
						if(result.result == 'success')
							$scope.enable_loader = true;
						else
							$scope.enable_loader = false;
				});
					
				$scope.Homepage = function() {
					window.location.replace("/help");
				}
				$scope.SurveyPage = function() {
					window.location.replace("/help?id=my_surveys");
				}
				
				$scope.users = users;
				
				$scope.username = '';
				$scope.clearUsername = function () {
					$scope.username = '';
				};

				$scope.hide = function () {
					$mdDialog.hide();
				};

				$scope.cancel = function () {
					$mdDialog.cancel();
				};

				$scope.answer = function (user) {
					$scope.show_ajax_loader = true;
					// I'm using rootScope event triggers and listeners because, this is the way. Sorry
					$rootScope.$broadcast("reassign-survey", { new_user_id:  user.id});
					//$mdDialog.hide(user);
				};

			}

			var mapReduceAllTrue = function(questions, callback) {
				return questions.map(function(qid) {
					return callback($scope.c.data.questions.idMap[qid]);
				}).reduce(function(x, y) {
					return x && y;
				}, true);
			};

			var disableNextButtonHelper = function(page) {
				if (!page || !page.questions || !page.questions.length)
					return true;

				return !$scope.isPageValid(page) || !$scope.isPageMandatoryFilled(page);
			};

			$scope.disableNextButton = function(page) {
				if ($scope.pagination == 'none')
					return $scope.pages.map(function(x) {return disableNextButtonHelper(x)})
						.reduce(function(x, y) {return x || y}, false);
				return disableNextButtonHelper(page);
			};

			// Returns true if all questions within this page have a valid response
			var isPageValidHelper = function(page) {
				return mapReduceAllTrue(page.questions, function(question) {return !question.invalidValue});
			};

			$scope.isPageValid = function(page) {
				if ($scope.pagination == 'none')
					return $scope.pages.map(function(x) {return isPageValidHelper(x)})
						.reduce(function(x, y) {return x && y}, true);
				return isPageValidHelper(page);
			};

			$scope.isSignatureFilled = function(page) {
				if ($scope.pagination != 'none' && !page.questions.reduce(function(x, y) {return x || $scope.c.data.questions.idMap[y].type == 'signature'}, false))
					return true;

				var signature = $scope.data.signature;
				if (!signature || signature.type == 'assertion_only')
					return true;

				if (signature.type == 'full_name' && !signature.validated) {
					signature.validationCallback = function(validated) {
						if (validated)
							$scope.submit(page, $scope.c.state);
						else
							$scope.c.showSignatureMessage();
					};
					$scope.c.showSignatureAuthModal();
					return false;
				}

				if (signature.type == 'checkbox') {
					if ($scope.c.data.questions.idMap[signature.sys_id].value != 'true')
						return false;
					else
						$scope.c.data.questions.idMap[signature.sys_id].value = 'checked';
				}

				return true;
			};

			// Returns true if all mandatory questions within this page are filled
			var isPageMandatoryFilledHelper = function(page) {
				var questionsList = page.questions.concat([]);
				if (!$scope.isMobile)
					page.questions.forEach(function(qid) {
						var question = $scope.c.data.questions.idMap[qid];
						if (question.type == 'template' && question.template.firstQuestion) {
							var templateGroup = $scope.c.data.templateGroups[question.templateGroup];
							questionsList = questionsList.concat(templateGroup.questions.filter(function(tid) {return tid != qid;}));
						}
					});
				return mapReduceAllTrue(questionsList, function(question) {return !question.mandatory || $scope.c.isMandatoryFilled(question)});
			};

			$scope.isPageMandatoryFilled = function(page) {
				if ($scope.pagination == 'none')
					return $scope.pages.map(function(x){return isPageMandatoryFilledHelper(x)})
						.reduce(function(x, y) {return x && y}, true);
				return isPageMandatoryFilledHelper(page);
			};

			// Saves questions
			var saveCurrentQuestions = function(questions, action, updateSuccessMessage) {
				var formdata = {"sysparm_instance_id": $scope.c.data.instanceId, "sysparm_action": action};
				questions.forEach(function(qid) { $scope.c.updateQuestion(qid, formdata) });
				formdata['percent_answered'] = $scope.c.getPercentAnswered();
				if (!!updateSuccessMessage)
					formdata['updateSuccessMessage'] = true;
				$scope.c.submitAjax(formdata);
			};

			// Saves questions on current page or all pages depending on pagination setting
			$scope.saveCurrentPage = function(page, action, updateSuccessMessage) {
				if ($scope.pagination == 'none')
					return saveCurrentQuestions($scope.pages.reduce(function(p1, p2) {return p1.concat(p2.questions)}, []), action, updateSuccessMessage);
				else if ($scope.pagination == 'question' && !$scope.isMobile) {
					var question = $scope.data.questions.idMap[page.questions[0]];
					if (question.type == 'template')
						return saveCurrentQuestions($scope.data.templateGroups[question.templateGroup].questions, action, updateSuccessMessage);
				}
				return saveCurrentQuestions(page.questions, action, updateSuccessMessage);
			};

			// Get the next (or) previous navigable page
			var nextNavigablePage = function(state, forwardDirection) {
				var current = state;
				while (1) {
					// Get next value within bounds
					current = forwardDirection ? current + 1 : current - 1;

					if (current <= 0)
						return 0;

					if (current >= $scope.pages.length)
						return $scope.pages.length;

					if (!$scope.isMobile && mapReduceAllTrue($scope.pages[current].questions, function(q) {return q.template && !q.template.firstQuestion}))
						continue;

					if (mapReduceAllTrue($scope.pages[current].questions, function(question) {return !!question.depends_on && !$scope.c.isAnyDependencySatisfied(question)})) {
						if (current == $scope.pages.length - 1)
							return state;
					} else
						return current;
				}
			};

			var doValidations = function(page, saveAndExit) {
				if (!$scope.isPageValid(page)) {
					$scope.c.showInvalidResponseMessage();
					return false;
				}

				if (!saveAndExit && !$scope.isPageMandatoryFilled(page)) {
					$scope.c.showMandatoryMessage();
					return false;
				}

				if (!saveAndExit && !$scope.isSignatureFilled(page)) {
					if ($scope.c.data.signature.type != 'full_name')
						$scope.c.showSignatureMessage();
					return false;
				}

				return true;
			};

			var nextPageHelper = function(page, state, action, showSuccessMessage) {
				// Clear any existing messages
				$scope.c.hideInlineErrorMessage();

				// Always skip validation if clicking cancel button
				if (action != 'cancel') {
					// Only do the validations if the user is not trying to save & exit
					var saveAndExit = (action == 'save' && showSuccessMessage);

					if ($scope.pagination == 'none') {
						if ($scope.pages.reduce(function (x, y) {return x || !doValidations(y, saveAndExit)}, false))
							return false;
					} else {
						if (!doValidations(page, saveAndExit))
							return false;
					}
				}

				// Save page
				$scope.saveCurrentPage(page, action, !!showSuccessMessage);

				// Navigate to the next page
				if (!!showSuccessMessage)
					$scope.c.state = $scope.pages.length;
				else
					$scope.c.state = nextNavigablePage(state, true);

				// Scroll to the top
				$('section.page').scrollTop(0);
			};


			$scope.nextPage = function(page, state) {
				nextPageHelper(page, state, 'save');
			};

			$scope.submit = function(page,state) {
				nextPageHelper(page, state, 'submit', true);
			};

			$rootScope.submit = function(page, state) {
				nextPageHelper(page, state, 'submit', true);
			};

			$scope.save = function(page, state) {
				nextPageHelper(page, state, 'save', true);
			};

			$scope.cancel = function(page, state) {
				nextPageHelper(page, state, 'cancel', true);
			};

			$scope.previousPage = function(state) {
				$scope.c.state = nextNavigablePage(state, false);

				// Scroll to the top
				$('section.page').scrollTop(0);
			};

			$scope.isLastPage = function(page) {
				var retVal = true;
				var i;
				if ($scope.c.state == $scope.pages.length - 1)
					return retVal;
				var question = $scope.data.questions.idMap[page.questions[0]];
				var tmpGroup = question.templateGroup;
				if(!$scope.isMobile 
					 && $scope.pagination == 'question' 
					 && question.type == 'template'){
					var numQuestionsOnTemplate = $scope.c.data.templateGroups[tmpGroup].questions.length;
					if($scope.c.state == $scope.pages.length-numQuestionsOnTemplate)
						return retVal;
				}
				for (i=$scope.c.state + 1; i<$scope.pages.length; i++) {
					var nextPage = $scope.pages[i];

					if (!mapReduceAllTrue(nextPage.questions, function(question) {return !!question.depends_on && !$scope.c.isAnyDependencySatisfied(question)})) {
						retVal = false;
						break;
					}
				}

				return retVal;
			};
		}
	}
}
