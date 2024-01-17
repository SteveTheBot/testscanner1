function(getTemplateUrl, snAttachmentHandler, $timeout, i18n, spAriaUtil, $rootScope, spUtil) {
    var templateString = 		'<div>'+
	'<script type="text/ng-template" id="/at-mentions.tpl">' +
    '<style>' +
    '.user-list:hover {' +
     'background-color: #eef8f8;' +
     '}' +
    '.user-list{' +
     'padding: 10px;' +
    '}' +
    '.items{' +
    'border-bottom: 1px solid #e6e9eb;' +
    'width: 100%;' +
    'overflow: hidden;' +
    'text-overflow: ellipsis;' +
    'white-space: nowrap;' +
    'cursor: pointer;' +
    '}' +
    '.list{' +
    'display:block;' +
    'max-height: 52px;' +
     'cursor: pointer;' +
    '}' +
    '</style>' +
    '<div>'+
    '<ul ng-if="items.length===1 && items[0].termLengthIsZero" class="dropdown-menu scrollable-menu '+
        'user-list" style="display:block; cursor: pointer">'+
    '${Enter the Name of the person you want to mention}'+
    '</ul>' +
    '<ul ng-if="items.length === 0 &amp;&amp; items.loading &amp;&amp; visible" class="dropdown-menu '+
		'scrollable-menu list">' +
    '<li class="user-list">' +
        '<span class="icon-loading"></span>' +
        '<span class="user-list">${Loading...}</span></li></ul>' +

        '<ul ng-if="items.length>0 && !items[0].termLengthIsZero" class="dropdown-menu scrollable-menu block padder-t-none padder-b-none">'+
        '<li mentio-menu-item="item" ng-repeat="item in items" class="ng-scope ng-isolate-scope '+
            'user-list items">'+
            '<div class="flex-row items-center">'+
            '<sn-avatar primary="item" show-presence="true"></sn-avatar>'+
            '<span class="user-list flex-column">'+
                '<span ng-bind-html="item.name"></span>'+
                '<span ng-if="!item.record_is_visible" class="text-muted">${Cannot see record}</span>'+
            '</span>'+
            '</div>'+
        '</li>'+
        '</ul>'+

        '<ul ng-if="items.length===0 && !items.loading" class="dropdown-menu scrollable-menu ' +
            'list">'+
        '<li class="user-list">'+
            '<p style="text-align:center">${No users found}</p>'+
        '</li>'+
        '</ul>'+
    '</div>'+
        '</script>'+
				'<div ng-if="::accessibilityEnabled" tabindex="0" role="note">'+
					'${In the following editor, press Alt F10 to focus on the toolbar. Press Escape to return to the editor}'+
				'</div>'+
				'<textarea ui-tinymce="tinyMCEOptions"'+
					'name="{{attrs.name}}"'+
					'label="{{attrs.name}}"'+
					'ng-model="model"'+
					'ng-model-options="options"'+
			        'ng-change="onChangeModel()" rows="10" id="{{textareaId}}"'+
					'mentio=""'+
					'mentio-typed-term="typedTerm"'+
					'mentio-template-url="/at-mentions.tpl"'+
					'mentio-items="members"'+
					'mentio-search="searchMembersAsync(term)"'+
					'mentio-select="selectAtMention(item)"'+
					'mentio-iframe-element="iframeElement">'+
					'</textarea>'
				'<input ng-file-select="attachFiles({files: $files})"'+
					'ng-click="$event.stopPropagation();"'+
					'tabindex="-1"'+
					'aria-hidden="true"'+
					'multiple=""'+
					'type="file"'+
					'style="display: none;">'+
					'</input>'+
					'</div>';
    return {
        template: templateString,
        restrict: 'E',
        replace: true,
        scope: {
            // for paste to attachments, either glideForm or the recordTableName should be provided
            model: '=ngModel',
            field: '=?',
            options: '=ngModelOptions',
            snBlur: '&',
            snDisabled: '=?',
            getGlideForm: '&glideForm',
            ngChange: '&',
            attachmentGuid: '=?',
            recordTableName: '=?',
            textId: '@?',
            toolBar: '=?',
            mentions: '=?'
        },
        controller: function($scope, $element, $attrs, $sce, nowAttachmentHandler, $animate, $rootScope, cabrillo, $timeout, snRecordWatcher, spUtil, spAriaUtil, $http, $window, snAttachmentHandler, i18n, $sanitize, snMention) {
            var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
            $scope.accessibilityEnabled = spAriaUtil.g_accessibility === "true";
            $scope.onChangeModel = function() {
                $timeout(function() {
                    $scope.ngChange();
                });
            }

            $scope.members = [];
            $scope.members.loading = true;

            function getMembersFromPageContext(members, term) {
                var globalMembers = NOW.recordMembers || {};
                var matching = [];
                var memberKeys = Object.keys(globalMembers);
                term = term.toLowerCase().trim();
                // find record members who match the term
                memberKeys.forEach(function(sysId) {
                    var member = globalMembers[sysId];
                    if ((typeof member.name !== "undefined" && member.name.toLowerCase().indexOf(term) == 0) || (typeof member.last_name !== "undefined" && member.last_name.toLowerCase().indexOf(term) == 0))
                        matching.push(member);
                });
                // append members from network, avoid duplicates
                members.forEach(function(member) {
                    if (memberKeys.indexOf(member.sys_id) == -1)
                        matching.push(member);
                });
                return matching;
            }


            //contains a map between a mentioned user and their sys_id
            // WARNING: This technique isn't going to work if you mention two different people with the
            //          same name in a single message.
            //key: User's name
            //value: sys_id
            var mentionMap = {};

            $scope.selectAtMention = function(item) {
                if (item.termLengthIsZero)
                    return (item.name || "") + "\n";

                mentionMap[item.name] = item.sys_id;
                $rootScope.$broadcast("mentionID", mentionMap);
                console.log("broadcasting");
                return "@[" + item.name + "]";

            };


            //Debouncing the name typing input so we aren't hammering the server with requests.
            var typingTimer;
			if ($scope.mentions) {
		         $scope.searchMembersAsync = function(term) {
		             $scope.members = getMembersFromPageContext([], term);
		             $scope.members.loading = true;
		             $timeout.cancel(typingTimer);
		             if (term.length === 0) {
		                 $scope.members = [{
		                     termLengthIsZero: true
		                 }];
		                 $scope.members.loading = false;
		             } else {
		                 typingTimer = $timeout(function() {
		                     snMention.retrieveMembers($scope.recordTableName, $scope.attachmentGuid, term).then(function(members) {
		                         $scope.members = getMembersFromPageContext(members, term);
		                         for (var k = 0; k < $scope.members.length; k++) {
		                             $scope.members[k].label = $scope.members[k].name;
		                         }
		                         $scope.members.loading = false;
		                     }, function() {
		                         $scope.members = getMembersFromPageContext([{
		                             termLengthIsZero: true
		                         }], term);
		                         $scope.members.loading = false;
		                     });
		                 }, 500);
		             }
		         }
			}

            $scope.options = $scope.options || {};
            var thisEditor = {};
            var g_form;
            var field;
            if (typeof $attrs.glideForm != "undefined") {
                g_form = $scope.getGlideForm();
            }

            if (typeof $attrs.field != "undefined") {
                field = $scope.field;
            }

            var guID = new Date().valueOf();
            $scope.textareaId = ($scope.textId ? $scope.textId.replace('.', '-') : 'ui-tinymce-') + guID;

            var tinyMceSettings = tinyMCE && tinyMCE.DOM && tinyMCE.DOM.settings;
            if (tinyMceSettings) {
                tinyMceSettings.lastTinyMceId = $scope.textareaId; // holds id of last rendered tinymce instance
                tinyMceSettings.onSetAttrib = function(args) {
                    var elem = $(args.attrElm);
                    if (args.attrName === 'src' && elem.is('iframe') && args.attrValue.indexOf('javascript') > -1)
                        elem.removeAttr('src');
                }
            }

            var langs = 'cs,de,en,es,fi,fr,fq,he,hu,it,ja,ko,nl,pl,pt,ru,th,tr,zh,zt';
            var userLanguage = g_lang;
            if (!userLanguage || langs.indexOf(userLanguage) == -1)
                userLanguage = g_system_lang;

            if (!userLanguage || langs.indexOf(userLanguage) == -1)
                userLanguage = 'en'; // if we don't have the language, fall back to english

            // Language strings that need to be converted for TinyMCE to load
            var languageMap = {
                pb: 'pt_BR',
                zh: 'zh_CN',
                fr: 'fr_FR',
                fq: 'fr_FR',
                he: 'he_IL',
                hu: 'hu_HU',
                ko: 'ko_KR',
                nb: 'nb_NO',
                pt: 'pt_PT',
                sv: 'sv_SE',
                th: 'th_TH',
                zt: 'zh_TW'
            };
            userLanguage = languageMap[userLanguage] || userLanguage;

            var setMode = function() {
                var isReadOnly = g_form.isReadOnly(field.name);
                thisEditor.setMode(isReadOnly ? 'readonly' : 'design');
                var body = thisEditor.getDoc().body;
                body.style.backgroundColor = isReadOnly ? "#eeeeee" : "#fff";

                // PRB1237925: give whole input appropriate context menu options
                var doc = thisEditor.getDoc();
                doc.documentElement.style.height = '90%';
                doc.body.style.height = '90%';

                $timeout(function(i18n) {
                    body.setAttribute('contenteditable', !isReadOnly);
                    body.setAttribute('aria-label', $scope.field.label);
                    body.setAttribute('aria-required', $scope.field.isMandatory());
                }, 1000); // longer timeout interval will help with visually complete performance
            }

            var updateMode = function() {
                if (typeof thisEditor.setMode == "function") {
                    if (thisEditor.getContainer()) {
                        setMode();
                    } else {
                        thisEditor.on('init', function() {
                            setMode();
                        });
                    }
                } else {
                    $timeout(updateMode, 10);
                }
            }

            var removeScriptHost = true;
            if (typeof g_tinymce_remove_script_host !== "undefined")
                removeScriptHost = g_tinymce_remove_script_host;

            var convertURLs = false;
            if (typeof g_tinymce_convert_urls !== "undefined")
                convertURLs = g_tinymce_convert_urls;

            var relativeURLs = true;
            if (typeof g_tinymce_relative_urls !== "undefined")
                relativeURLs = g_tinymce_relative_urls;

            function getTableAndSysId() {
                var result = {};
                var form = $scope.getGlideForm();
                if (form) {
                    var tableName = form.getTableName();
                    var sysId = form.getSysId();
                    if (tableName) {
                        result.table = tableName;
                        result.sys_id = sysId > -1 ? sysId : $scope.attachmentGuid;
                    } else {
                        result.table = form.recordTableName;
                        result.sys_id = $scope.attachmentGuid || sysId;
                    }
                } else {
                    result.table = $scope.recordTableName;
                    result.sys_id = $scope.attachmentGuid;
                }

                return result;
            }

            function update() {
                $scope.$applyAsync(function() {
                    var rawValue = thisEditor.getContent();
                    var textContent = thisEditor.getContent({
                        format: 'text'
                    }).trim();
                    var content = (textContent || rawValue.indexOf('img') !== -1) ? rawValue : textContent;
                    // In IE11, only on first drag drop of an image getContent({format: 'raw'}) is returning blob instead of correct src value
                    // because of which image is incorrectly stored. As a workaround checking for blob content in src and replacing with actual content
                    if (isIE11 && content.indexOf("src=\"blob:") !== -1)
                        content = thisEditor.getContent();

                    $scope.model = content;
                    if ($scope.field) {
                        $scope.field.value = $scope.field.stagedValue = content;
                    }
                });
            }


            var toolbar = ["bold italic underline", "fontselect", "alignleft aligncenter alignright alignjustify", "bullist numlist"];
            if ($scope.toolBar)
                toolbar = $scope.toolBar;

            $scope.tinyMCEOptions = {
                init_instance_callback: function(editor) {
                    $scope.iframeElement = editor.iframeElement;
                },
                theme: 'silver',
                menubar: false,
                language: userLanguage,
                remove_script_host: removeScriptHost,
                convert_urls: convertURLs,
                relative_urls: relativeURLs,
                statusbar: false,
                contextmenu:false,
                plugins: "codesample code link paste lists",
                toolbar: toolbar.join(" | "),
                paste_data_images: true,
                browser_spellcheck: true,
                setup: function(ed) {
                    thisEditor = ed;

                    ed.on('init', function() {
                        // Remove additional properties added for tinymce dom settings postrender of tinymce
                        if (tinyMceSettings && ed.id === tinyMceSettings.lastTinyMceId) {
                            delete tinyMceSettings.onSetAttrib;
                            delete tinyMceSettings.lastTinyMceId;
                        }
                    });

                    ed.addCommand('imageUpload', function(ui, v) {
                        $scope.clickAttachment();
                    });

                    ed.ui.registry.addButton('image', {
                        icon: 'image',
                        tooltip: 'Insert image',
                        onAction: function(e) {
                            ed.execCommand('imageUpload');
                        },
                        stateSelector: 'img:not([data-mce-object],[data-mce-placeholder])'
                    });

                    ed.on('blur', function() {
                        update();
                        if (angular.isDefined($scope.snBlur))
                            $scope.snBlur();
                    });

                    ed.on('ProgressState', function(e) {
                        $rootScope.$emit('$sp.html.editor.progress', e);
                    });
                },
                images_upload_handler: function(blobInfo, success, failure) {
                    var blob = blobInfo.blob();
                    var fileName = blobInfo.filename();
                    blob.file_name = "Pasted image" + fileName.substr(fileName.lastIndexOf("."));
                    var data = getTableAndSysId();
                    if (data.table && data.sys_id) {
                        thisEditor.setProgressState(true);
                        snAttachmentHandler.create(data.table, data.sys_id).uploadAttachment(blob, null, {}).then(function(response) {
                            success("/sys_attachment.do?sys_id=" + response.sys_id);
                            update();
                            thisEditor.setProgressState(false);
                        });
                    } else {
                        console.warn("GlideForm or table and record id is not provided");
                        failure();
                    }
                }
            };

            if (spUtil.isMobile()) {
                $scope.tinyMCEOptions.toolbar = _.pull(toolbar, 'image').join(' | ');
            }

            $scope.attachFiles = function(result) {
                var data = getTableAndSysId();
                if (data.table && data.sys_id && result.files.length) {
                    thisEditor.setProgressState(true);
                    snAttachmentHandler.create(data.table, data.sys_id).uploadAttachment(result.files[0], null, {}).then(function(response) {
                        var args = tinymce.extend({}, {
                            src: encodeURI("/sys_attachment.do?sys_id=" + response.sys_id),
                            style: "max-width: 100%; max-height: 480px;"
                        });
                        update();
                        thisEditor.setProgressState(false);
                        thisEditor.execCommand('mceInsertContent', false, thisEditor.dom.createHTML('img', args), {
                            skip_undo: 1
                        });
                    });
                }
            };

            // If using g_form we don't need to use watchers
            if (g_form && field) {
                g_form.$private.events.on('propertyChange', function(type, fieldName, propertyName) {
                    if (fieldName != field.name)
                        return;

                    updateMode();
                });

                updateMode();
            } else if (typeof $attrs.snDisabled != "undefined") {
                $scope.$watch('snDisabled', function(newValue) {
                    if (angular.isDefined(newValue) && typeof thisEditor.setMode == "function") {
                        if (thisEditor.getContainer())
                            thisEditor.setMode(newValue ? 'readonly' : 'design');
                        else {
                            thisEditor.on('init', function() {
                                thisEditor.setMode(newValue ? 'readonly' : 'design');
                            });
                        }
                    }
                });
            }

        },
        link: function(scope, element, attrs) {
            scope.attrs = attrs;
            scope.clickAttachment = function() {
                element.find("input").click();
            };
        }
    }
}
