(function () {
  'use strict';

  angular

    .module('kt.components.datePicker')

    .directive('ktMonthPicker', [function () {
      var months;

      function getMonths() {
        if (!months) {
          months = [];
          for (var i = 0; i < 12; i++) {
            months.push(i);
          }
        }

        return months;
      }

      return {
        restrict: 'E',
        scope: {
          date: '='
        },
        templateUrl: 'kt-month-picker.html',
        link: function (scope) {
          scope.monthPicker = {
            year: scope.date.year(),
            months: getMonths()
          };

          scope.isSelected = function (month) {
            return scope.date.year() === scope.monthPicker.year && scope.date.month() === month;
          };

          scope.selectMonth = function (month) {
            var parentElement = scope.$parent.element ? scope.$parent.element : undefined;
            scope.date.year(scope.monthPicker.year).month(month);
            if (parentElement && parentElement.prop('tagName').toLowerCase() === 'kt-date-picker') {
              scope.$emit('monthPicker:monthSelect');
            }
          };

          scope.previousYear = function () {
            scope.monthPicker.year = scope.monthPicker.year - 1;
          };

          scope.nextYear = function () {
            scope.monthPicker.year = scope.monthPicker.year + 1;
          };

          scope.yearClick = function () {
            var parentElement = scope.$parent.element ? scope.$parent.element : undefined;

            if (parentElement && parentElement.prop('tagName').toLowerCase() === 'kt-date-picker') {
              scope.$emit('monthPicker:yearClick');
            }
          };
        }
      };
    }]);
})();
