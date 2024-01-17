function spFileAttachmentButton (cabrillo, $rootScope, i18n, spAttachmentUpload, $timeout) {
    'use strict';
    return {
        restrict: 'E',
        template: function () {
            var inputTemplate;
            if (cabrillo.isNative()) {
                inputTemplate = '<button href="#" title="" ng-click="showAttachOptions()" class="panel-button sp-attachment-add btn btn-link" aria-label=""><span class="glyphicon glyphicon-camera"></span></button>';
            } else {
                inputTemplate = '<input type="file" style="display: none" multiple="true" ng-file-select="uploadAttachments($files)" class="sp-attachments-input"/>';
                inputTemplate += '<span class="sr-only" aria-live="assertive"></span>';
                inputTemplate += '<button title="" ng-click="attachmentHandler.openSelector($event)" class="panel-button sp-attachment-add btn btn-link" aria-label=""><span class="glyphicon glyphicon-plus"></span></button>';
            }
            return [
                '<span class="file-upload-input">',
                inputTemplate,
                '</span>'
            ].join('');
        },
        controller: function ($element, $scope) {
            var attachedMsg = i18n.getMessage("Attached");
            $scope.showAttachOptions = function () {
                var handler = $scope.attachmentHandler;
                cabrillo.attachments.addFile(
                    handler.tableName,
                    handler.tableId,
                    null,
                    { maxWidth: 1000, maxHeight: 1000 }
                ).then(function (data) {
                    handler.getAttachmentList();
                    $rootScope.$broadcast("added_attachment");
                }, function () {
                    console.log('Failed to attach new file');
                });
            };
            $scope.uploadAttachments = function (files) {
                spAttachmentUpload.uploadAttachments($scope.attachmentHandler, files)
            }
            $scope.$on('attachment_select_files', function (e) {
                $scope.$evalAsync(function () {
                    $($element).find('.sp-attachments-input').click();
                });
            });
            $scope.$on('attachment.upload.success', function (evt, args) {
                $timeout(function () {
                    $element.find('.sr-only').html(args.names + " " + attachedMsg);
                }, 500);
            });
        },
        link: function (scope, el, attr) {
            i18n.getMessages(["Add attachment", "Required"], function (msgs) {
                var msg = msgs["Add attachment"];
                if (attr.required === "true")
                    msg = msg + " " + msgs["Required"];
                el.find("button").attr("title", msg);
                el.find("button").attr("aria-label", msg);
            });
        }
    }
};
