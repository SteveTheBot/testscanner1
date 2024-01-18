var w = (window || top.window);
var $j = w.jQuery;

rh_list = {

    get: function (fieldName) {

        function RHGLideList(fieldName) {

            this.field_name = fieldName;
            var retObj = { retValue: '' };

            this.setMandatory = function (bool) {
                $j(w.document).trigger(this.field_name + 'setMandatory', [bool]);
            };

            this.setFilterAndRefresh = function (filter) {
                $j(w.document).trigger(this.field_name + 'setFilterAndRefresh', [filter]);
            };

            this.setFilter = function (filter) {
                $j(w.document).trigger(this.field_name + 'setFilter', [filter]);
            };

            this.getChecked = function () {
                $j(w.document).trigger(this.field_name + 'getChecked', [retObj]);
                return retObj.retValue;
            };

            this.getTableName = function () {
                $j(w.document).trigger(this.field_name + 'getTableName', [retObj]);
                return retObj.retValue;
            };

            this.setTableName = function (newTable) {
                $j(w.document).trigger(this.field_name + 'setTableName', [newTable]);
            };

            this.getTitle = function () {
                $j(w.document).trigger(this.field_name + 'getTitle', [retObj]);
                return retObj.retValue;
            };

            this.getGroupBy = function () {
                $j(w.document).trigger(this.field_name + 'getGroupBy', [retObj]);
                return retObj.retValue;
            };

            this.getListName = function () {
                $j(w.document).trigger(this.field_name + 'getListName', [retObj]);
                return retObj.retValue;
            };

            this.getRowCount = function () {
                return c.records.length;
            };

            this.setValue = function (idArray) {
                $j(w.document).trigger(this.field_name + 'setValue', [idArray]);
            }

            return this;
        };

        return new RHGLideList(fieldName);
    },

};

rh_list = $j.extend(true, {}, rh_list, {
    rh: function (c) {
        // var g_form = c.$scope.page.g_form || c.spUtil;

        var extended = {
            trigger: function (name, fn, type) {
                $j(w.document).off(name).on(name, function (ev, p1) { fn(type, p1) });
            }
        };

        return extended;
    }
})
