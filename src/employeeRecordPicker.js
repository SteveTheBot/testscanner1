function($timeout, $http, urlTools, filterExpressionParser, escapeHtml, i18n) {
    "use strict";

    return {
        restrict: 'E',
        replace: true,
        scope: {
            ed: "=?",
            field: "=",
            refTable: "=?", // comes from this table
            refId: "=?", // and this sys_id
            snOptions: "=?",
            atfQualifier: "=?",
            snOnChange: "&",
            snOnBlur: "&",
            snOnClose: "&",
            snOnOpen: '&',
            minimumInputLength: "@",
            snDisabled: "=",
            snPageSize: "@",
            dropdownCssClass: "@",
            formatResultCssClass: "&",
            overlay: "=",
            additionalDisplayColumns: "@",
            displayColumn: "@",
            recordValues: '&',
            getGlideForm: '&glideForm',
            domain: "@",
            snSelectWidth: '@', // Width of the selector. Default to 100%.
        },
        template: '<input type="text" name="{{field.name}}" ng-disabled="snDisabled" style="min-width: 150px;  max-width: 600px;" ng-model="field.displayValue" ' +
            'sn-atf-settable="true" sn-atf-component-value="{{field.value}}" sn-atf-data-type="reference"' +
            'sn-atf-data-type-params=\'{"reference" : "{{ed.reference}}", "reference_qual" : "{{atfQualifier || ed.qualifier}}", ' +
            '"valueField" : "sys_id", "displayField" : "{{ed.searchField}}"}\' ng-attr-sn-atf-disabled="{{ snDisabled || undefined }}" />',
        link: function(scope, element, attrs, ctrl) {

            scope.ed = scope.ed || scope.field.ed;
            scope.selectWidth = scope.snSelectWidth || '100%';
            element.css("opacity", 0);
            var fireReadyEvent = true;
            var g_form;
            if (angular.isDefined(scope.getGlideForm))
                g_form = scope.getGlideForm();

            var fieldAttributes = {};
            if (angular.isDefined(scope.field) && angular.isDefined(scope.field.attributes) && typeof scope.ed.attributes == 'undefined')
                if (Array.isArray(scope.field.attributes))
                    fieldAttributes = scope.field.attributes;
                else
                    fieldAttributes = parseAttributes(scope.field.attributes);
            else
                fieldAttributes = parseAttributes(scope.ed.attributes);

            if (!angular.isDefined(scope.additionalDisplayColumns) && angular.isDefined(fieldAttributes['ref_ac_columns']))
                scope.additionalDisplayColumns = fieldAttributes['ref_ac_columns'];


            // Ensure that the atf-data-type accounts for both the reference qualifier
            // specified in the ed and dependent field, which puts its own qualification
            // on which records can appear.
            // Eg. if our field is a reference to the user table and is dependent on the company field
            // it means that any user we select must have a value in their company field, which is the
            // same as the company field on our record
            var atfQualifier = scope.ed.qualifier || '';
            // There's a special case for group fields on sys_user tables that atf can't quite model
            if (scope.ed.dependent_field && scope.ed.dependent_value && scope.ed.dependent_table &&
                !(scope.ed.reference == 'sys_user' && scope.ed.dependent_field.indexOf('group') != -1)) {
                if (atfQualifier)
                    atfQualifier += "^";

                atfQualifier += scope.ed.dependent_field + "=" + scope.ed.dependent_value;
            }


            scope.atfQualifier = atfQualifier;

            var select2AjaxHelpers = {
                formatSelection: function(item) {
                    return escapeHtml(getDisplayValue(item));
                },
                formatResult: function(item) {

                    var avatar = item["avatar"];
                    var initials = item["initials"];
                    var displayValues = getDisplayValues(item);

                    if (displayValues.length >= 1) {
                        var width = 100 / displayValues.length;

                        var markup = "<div style='display:flex; '>";
                        if (avatar) {
                            markup += "<div style='background-image: url(" + avatar + "?t=small); width: 3.2rem; height: 3.2rem; background-position: 50% center; background-size: cover; border-radius: 50%; margin: 0px 8px 8px 0px;'></div>";
                        } else {
                            markup += "<div style='border: 1px solid #181A1F; display:flex; justify-content: center; align-items: center; font-size:12px; width: 3.2rem; height: 3.2rem; background-position: 50% center; background-size: cover; border-radius: 50%; margin:0px 8px 8px 0px; flex-shrink: 0'>" + initials + "</div>";
                        }

                        //Primary information
                        markup += "<div>"
                        markup += "<div style='flex-grow: 1; '>" + escapeHtml(displayValues[0]) + "</div> ";
                        for (var i = 1; i < displayValues.length; i++) {
                            markup += "<div style='color: #474D5A; flex-grow: 1; '>" + escapeHtml(displayValues[i]) + "</div>";
                        }
                        markup += "</div>";

                        return markup;
                    }
                    return "";
                },

                search: function(queryParams) {

                    var urlQueryParameters = {};
                    var url = urlTools.getURL('ref_list_data', urlQueryParameters);
                    return $http.post(url, queryParams.data).then(function(response) {
                            var additionalDisplay = scope.additionalDisplayColumns || null;
                            var displayColumn = scope.displayColumn || null;
                            var queryResponse = response;
                            url = "/api/sn_ex_sp_pro/org_chart_search/avatarinfo/" + scope.refTable + "/" + displayColumn + "/" + additionalDisplay;
                            return $http.post(url, JSON.stringify(response)).then(function(response) {
                                queryResponse.data.items = response.data.result;
                                queryParams.success(queryResponse);
                            });

                        }

                    );
                },

                initSelection: function(elem, callback) {
                    if (scope.field && scope.field.displayValue)
                        callback({
                            sys_id: scope.field.value,
                            name: scope.field.displayValue
                        });
                }
            };

            var config = {
                width: scope.selectWidth,
                minimumInputLength: scope.minimumInputLength ? parseInt(scope.minimumInputLength, 10) : 0,
                overlay: scope.overlay,
                containerCssClass: 'select2-reference ng-form-element',
                placeholder: '   ',
                formatSearching: '',
                allowClear: attrs.allowClear !== 'false',
                clearAriaLabel: (scope.snOptions) ? scope.snOptions.clearAriaLabel : "",
                id: function(item) {
                    return item.sys_id;
                },
                sortResults: (scope.snOptions && scope.snOptions.sortResults) ? scope.snOptions.sortResults : undefined,
                ajax: {
                    quietMillis: NOW.ac_wait_time,

                    data: function(filterText, page) {
                        var q = _getReferenceQuery(filterText);
                        var params = {
                            start: (scope.pageSize * (page - 1)),
                            count: scope.pageSize,
                            sysparm_target_table: scope.refTable,
                            sysparm_target_sys_id: scope.refId,
                            sysparm_target_field: scope.ed.dependent_field || scope.ed.name,
                            table: scope.ed.reference,
                            qualifier: scope.ed.qualifier,
                            sysparm_for_impersonation: !!scope.ed.for_impersonation,
                            data_adapter: scope.ed.data_adapter,
                            attributes: scope.ed.attributes,
                            dependent_field: scope.ed.dependent_field,
                            dependent_table: scope.ed.dependent_table,
                            dependent_value: scope.ed.dependent_value,
                            p: scope.ed.reference + ';q:' + q + ';r:' + scope.ed.qualifier
                        };

                        if (scope.domain) {
                            params.sysparm_domain = scope.domain;
                        }

                        if (angular.isDefined(scope.field) && scope.field['_cat_variable'] === true) {
                            delete params['sysparm_target_table'];
                            params['sysparm_include_variables'] = true;
                            params['variable_ids'] = scope.field.sys_id;
                            var getFieldSequence = g_form.$private.options('getFieldSequence');
                            if (getFieldSequence) {
                                params['variable_sequence1'] = getFieldSequence();
                            }
                            var itemSysId = g_form.$private.options('itemSysId');
                            params['sysparm_id'] = itemSysId;
                            var getFieldParams = g_form.$private.options('getFieldParams');
                            if (getFieldParams) {
                                angular.extend(params, getFieldParams());
                            }
                        }

                        if (scope.recordValues)
                            params.sysparm_record_values = scope.recordValues();

                        return params;
                    },

                    results: function(data, page) {
                        return ctrl.filterResults(data, page, scope.pageSize);
                    },

                    transport: select2AjaxHelpers.search
                },
                formatSelection: select2AjaxHelpers.formatSelection,
                formatResult: select2AjaxHelpers.formatResult,
                initSelection: select2AjaxHelpers.initSelection,
                dropdownCssClass: attrs.dropdownCssClass,
                formatResultCssClass: scope.formatResultCssClass || null
            };

            if (scope.snOptions) {
                if (scope.snOptions.placeholder) {
                    config.placeholder = scope.snOptions.placeholder;
                }
                if (scope.snOptions.width) {
                    config.width = scope.snOptions.width;
                }
            }

            function _getReferenceQuery(filterText) {
                var filterExpression = filterExpressionParser.parse(filterText, scope.ed.defaultOperator);
                var colToSearch = getReferenceColumnsToSearch();
                var excludedValues = getExcludedValues();
                return colToSearch.map(function(column) {
                    return column + filterExpression.operator + filterExpression.filterText +
                        '^' + column + 'ISNOTEMPTY' + excludedValues;
                }).join("^NQ");
            }

            function getReferenceColumnsToSearch() {
                var colName = ['name'];
                if (scope.ed.searchField) {
                    colName = scope.ed.searchField.split(";");
                } else if (fieldAttributes['ref_ac_columns_search'] == 'true' && 'ref_ac_columns' in fieldAttributes && fieldAttributes['ref_ac_columns'] != '') {
                    colName = fieldAttributes['ref_ac_columns'].split(';');
                } else if (fieldAttributes['ref_ac_order_by']) {
                    colName = [fieldAttributes['ref_ac_order_by']];
                }
                return colName;
            }

            function getExcludedValues() {
                if (scope.ed.excludeValues && scope.ed.excludeValues != '') {
                    return '^sys_idNOT IN' + scope.ed.excludeValues;
                }
                return '';
            }

            function parseAttributes(strAttributes) {
                // Turn an attribute string into a simple object
                // "ref_auto_completer=AJAXTableCompleter,ref_contributions=task_show_ci_map;show_related_records,ref_ac_columns=sys_class_name,ref_ac_order_by=sys_class_name"
                // into: {ref_auto_completer: AJAXTableCompleter, ref_contributions: 'task_show_ci_map;show_related_records' ... }

                var attributeArray = (strAttributes && strAttributes.length ? strAttributes.split(',') : []);
                var attributeObj = {};
                for (var i = 0; i < attributeArray.length; i++) {
                    if (attributeArray[i].length > 0) {
                        var attribute = attributeArray[i].split('=');
                        attributeObj[attribute[0]] = attribute.length > 1 ? attribute[1] : '';
                    }
                }
                return attributeObj;
            }

            function init() {
                scope.model = scope.snModel;
                render();
            }

            function render() {

                $timeout(function() {
                    i18n.getMessage('Searching...', function(searchingMsg) {
                        config.formatSearching = function() {
                            return searchingMsg;
                        };
                    });
                    element.css("opacity", 1);
                    element.select2("destroy");

                    // Assign an empty array to the select2 val so initSelection
                    // is called and will render the value passed to it
                    // see https://github.com/select2/select2/issues/2086
                    var select2 = element.select2(config).select2('val', []);
                    select2.bind("change", select2Change);
                    select2.bind("select2-removed", select2Change);
                    select2.bind("select2-blur", function() {
                        scope.$apply(function() {
                            scope.snOnBlur();
                        });
                    });
                    select2.bind("select2-close", function() {
                        scope.$apply(function() {
                            scope.snOnClose();
                        });
                    });
                    select2.bind("select2-open", function() {
                        scope.$apply(function() {
                            if (scope.snOnOpen)
                                scope.snOnOpen();
                        });
                    });

                    select2.bind('select2-focus', function() {
                        redirectLabel(element);
                    });

                    select2.bind('sn-atf-setvalue', setValueATF);

                    if (fireReadyEvent) {
                        scope.$emit('select2.ready', element);
                        fireReadyEvent = false;
                    }
                    var s2id_autogen2 = document.getElementById('s2id_autogen2');
                    if (s2id_autogen2) {
                        s2id_autogen2.setAttribute('aria-expanded', 'true');
                        s2id_autogen2.setAttribute('aria-controls', 's2id_autogen2')
                    }
                    var select2_drop = document.getElementById('select2-drop');
                    if (select2_drop) {
                        select2_drop.setAttribute('role', 'list');
                    }
                    var select2_results_2 = document.getElementById('select2-results-2');
                    if (select2_results_2) {
                        select2_results_2.setAttribute('aria-label', 'Search results');
                    }
                    var s2id_autogen2_search = document.getElementById('s2id_autogen2_search');
                    if (s2id_autogen2_search) {
                        s2id_autogen2_search.setAttribute('aria-label', 'Search');
                    }
                });
            }

            function select2Change(e) {

                e.stopImmediatePropagation();
                if (e.added) {

                    if (scope.$$phase || scope.$root.$$phase)
                        return;

                    var selectedItem = e.added;
                    var value = selectedItem.sys_id;
                    var displayValue = value ? getDisplayValue(selectedItem) : '';

                    if (scope.snOptions && scope.snOptions.useGlideForm === true) {
                        g_form.setValue(scope.field.name, value, displayValue);
                        scope.rowSelected();
                        e.displayValue = displayValue;
                        triggerSnOnChange();
                    } else {

                        scope.$apply(function() {
                            scope.field.value = value;
                            scope.field.displayValue = displayValue;
                            scope.field.userId = selectedItem.user_id;
                            scope.rowSelected();
                            e.displayValue = displayValue;
                            triggerSnOnChange();
                        });
                    }
                } else if (e.removed) {
                    if (scope.snOptions && scope.snOptions.useGlideForm === true) {
                        g_form.clearValue(scope.field.name);
                        triggerSnOnChange();
                    } else {
                        scope.$apply(function() {
                            scope.field.displayValue = '';
                            scope.field.value = '';
                            triggerSnOnChange();
                        });
                    }
                }

                // Because this directive is currently destroying and rebuilding select2 every time
                // a user makes a selection, we need to be able to focus back on the new input
                $timeout(function() {
                    element.parent().find(".select2-focusser").focus();
                }, 0, false);

                function triggerSnOnChange() {
                    if (scope.snOnChange)
                        scope.snOnChange(e);
                }
            }

            function redirectLabel($select2) {
                if (NOW.select2LabelWorkaround)
                    NOW.select2LabelWorkaround($select2);
            }

            function getDisplayValue(selectedItem) {
                var displayValue = '';
                if (selectedItem && selectedItem.sys_id) {
                    if (scope.displayColumn && typeof selectedItem[scope.displayColumn] != "undefined")
                        displayValue = selectedItem[scope.displayColumn];
                    else if (selectedItem.$$displayValue)
                        displayValue = selectedItem.$$displayValue;
                    else if (selectedItem.name)
                        displayValue = selectedItem.name;
                    else if (selectedItem.title)
                        displayValue = selectedItem.title;
                }
                return displayValue;
            }

            function getDisplayValues(selectedItem) {
                var displayValues = [];
                if (selectedItem && selectedItem.sys_id) {
                    var current = "";
                    if (scope.displayColumn && typeof selectedItem[scope.displayColumn] != "undefined")
                        current = selectedItem[scope.displayColumn];
                    else if (selectedItem.$$displayValue)
                        current = selectedItem.$$displayValue;
                    else if (selectedItem.name)
                        current = selectedItem.name;
                    else if (selectedItem.title)
                        current = selectedItem.title;
                    displayValues.push(current);
                }

                if (scope.additionalDisplayColumns) {
                    var columns = scope.additionalDisplayColumns.split(",");
                    for (var i = 0; i < columns.length; i++) {

                        var column = columns[i];
                        if (selectedItem[column]) {
                            displayValues.push(selectedItem[column]);
                        }
                    }
                }
                return displayValues;
            }

            function setValueATF(e) {
                e.stopImmediatePropagation();

                // Simulate the change event as emitted by the select2
                var changeEventParameters = {
                    type: "change"
                };
                if (scope.field.value)
                    changeEventParameters.removed = element.select2("data");

                var newValue = e.detail && e.detail.newValue;
                if (newValue) {
                    // Run a query looking for the specific sys_id we got
                    var params = config.ajax.data('', 1);
                    if (params.qualifier)
                        params.qualifier += "^";
                    else
                        params.qualifier = "";

                    // NGListDataProcessor skips qualifier checks when we add the
                    // sys_id param, so we need to add a query on sys_id
                    params.qualifier += "sys_id=" + newValue;
                    var data = {
                        data: params,
                        dataType: "json",
                        error: atfHandleNoResults,
                        success: function(answer) {
                            // Make sure that the value existed before setting it
                            if (answer.data.items && answer.data.items.length == 1) {
                                var valueToSet = answer.data.items[0].sys_id;
                                changeEventParameters.added = answer.data.items[0];
                                // Invoke change event after a digest so that select2Change() picks
                                // up on it, as it will return early if in the middle of an apply()
                                // The success() callback executes in an apply() from an HTTP response
                                // so we must use a timeout so that the event is not triggered in this context
                                $timeout(function() {
                                    element.val(valueToSet);
                                    element.triggerHandler(changeEventParameters);
                                }, 0, false);
                            } else
                                atfHandleNoResults();
                        },
                    };

                    select2AjaxHelpers.search(data);
                } else {
                    element.val("");
                    element.triggerHandler(changeEventParameters);
                }

                function atfHandleNoResults() {
                    i18n.getMessage(
                        "Unable to set reference picker to value {0}",
                        function(errorMessage) {
                            throw new Error(i18n.format(errorMessage, newValue));
                        }
                    );
                }
            }

            scope.$watch("field.displayValue", function(newValue, oldValue) {
                if (newValue != oldValue && newValue !== scope.model) {
                    init();
                }
            });

            scope.$on("employeeRecordPicker.activate", function(evt, parms) {
                $timeout(function() {
                    element.select2("open");
                })
            });

            init();
        },

        controller: function($scope, $rootScope) {
            $scope.pageSize = 20;
            if ($scope.snPageSize)
                $scope.pageSize = parseInt($scope.snPageSize);

            $scope.rowSelected = function() {
                $rootScope.$broadcast("@page.reference.selected", {
                    field: $scope.field,
                    ed: $scope.ed
                });
            };

            // Default Results Filter (aka, None)
            this.filterResults = function(data, page) {
                return {
                    results: data.data.items,
                    more: (page * $scope.pageSize < data.data.total)
                };
            };
        }
    };
}
