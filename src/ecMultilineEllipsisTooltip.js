//usage : <XYZ ec-ellipsis-tooltip ec-ellipsis-tooltip-title="" ec-ellipsis-tooltip-data-toggle="" ec-ellipsis-tooltip-data-placement="" ec-ellipsis-tooltip-data-container="" />
//Default : ec-ellipsis-tooltip-title -> '' ec-ellipsis-tooltip-data-toggle -> 'tooltip' ec-ellipsis-tooltip-data-placement -> 'auto' ec-ellipsis-tooltip-data-container -> 'body' 
function ecMultilineEllipsisTooltip(i18n, $rootScope) {
    "use strict";
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            angular.element(document).ready(function() {
                setTimeout(function() {
                    showTooltip(elem, attrs);
                }, 100);
            });
            // window resize should recalculate if tooltip is required, 
            // currently the tooltip attribute does not work on window resize or text zoom
            $(window).resize(function(e) {
                if(e.type == 'resize') {
                    showTooltip(elem, attrs);
                }
            });

            // To show tooltip for ellipsis without page reload on enabling text-spacing for WCAG testing
            scope.$watch(
               function () {
                  return elem.css("line-height");
               },
               function (newVal, oldVal) {
                  if (newVal !== oldVal) {
                     showTooltip(elem, attrs);
                  }
            });

            function showTooltip(element, attrs) {
                if (element && element.length > 0) {
                    if (isEllipsisActive(element.get(0))) {
                        var title = attrs.ecEllipsisTooltipTitle ? attrs.ecEllipsisTooltipTitle : '';
                        var html = (attrs.ecEllipsisTooltipDataHtml === 'true');
                        var dataToggle = attrs.ecEllipsisTooltipDataToggle ? attrs.ecEllipsisTooltipDataToggle : 'tooltip';
                        var dataPlacement = attrs.ecEllipsisTooltipDataPlacement ? attrs.ecEllipsisTooltipDataPlacement : 'auto';
                        var dataContainer = attrs.ecEllipsisTooltipDataContainer ? attrs.ecEllipsisTooltipDataContainer : 'body';

                        element.attr('title', title);
                        if (html)
                            element.attr('data-html', 'true');
                        element.attr('data-toggle', dataToggle);
                        element.attr('data-placement', dataPlacement);
                        element.attr('data-container', dataContainer);
                    }
                    else {
                        // if ellipsis is not active need to remove the title and data-toggle related attribute,
                        // to have consistent behaviour also removes malformed attributes.
                        element.removeAttr('title');
                        element.removeAttr('data-html');
                        element.removeAttr('data-toggle');
                        element.removeAttr('data-placement');
                        element.removeAttr('data-container');
                    }
                }
            }

            function isEllipsisActive(element) {
                    return element.clientWidth < element.scrollWidth || element.clientHeight < element.scrollHeight;
                }
            }
        };
    }
