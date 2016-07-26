(function () {
  'use strict';

  angular

    .module('kt.components.datePicker')

    .directive('ktYearPicker', [function () {
      function getDecade(year) {
        var start = year - year % 10;
        var end = start + 9;

        return {
          start: start,
          end: end
        }
      }

      function getYears(decade) {
        var years = [];

        for (var i = decade.start - 1; i <= decade.end + 1; i++) {
          years.push(i);
        }

        return years;
      }

      return {
        restrict: 'E',
        templateUrl: 'html/year-picker.html',
        scope: {
          date: '='
        },
        link: function (scope) {
          scope.yearPicker = {
            decade: getDecade(scope.date.year()),
            years: getYears(getDecade(scope.date.year()))
          };

          scope.selectYear = function (year) {
            var parentElement = scope.$parent.element ? scope.$parent.element : undefined;
            scope.date.year(year);
            if (parentElement && parentElement.prop('tagName').toLowerCase() === 'kt-date-picker') {
              scope.$emit('yearPicker:yearSelect');
            }
          };

          scope.previousDecade = function () {
            scope.yearPicker.decade.start -= 10;
            scope.yearPicker.decade.end -= 10;
            scope.yearPicker.years = getYears(scope.yearPicker.decade);
          };

          scope.nextDecade = function () {
            scope.yearPicker.decade.start += 10;
            scope.yearPicker.decade.end += 10;
            scope.yearPicker.years = getYears(scope.yearPicker.decade);
          };

          scope.isSelected = function (year) {
            return year === scope.date.year();
          };

          scope.isOverflowing = function (year) {
            return year < scope.yearPicker.decade.start || year > scope.yearPicker.decade.end;
          };
        }
      };
    }]);
})();
