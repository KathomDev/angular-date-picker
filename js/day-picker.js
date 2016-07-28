(function () {
  'use strict';

  angular

    .module('kt.components.datePicker')

    .directive('ktDayPicker', ['ktDatePickerSvc', function (service) {
      return {
        restrict: 'E',
        templateUrl: 'kt-day-picker.html',
        scope: {
          date: '='
        },
        link: function (scope) {
          scope.dayPicker = {
            month: scope.date.month(),
            year: scope.date.year(),
            weeks: service.getWeeksInMonth(scope.date.year(), scope.date.month()),
            dayHeaders: service.getDayHeaders()
          };

          scope.$watch('date', function (date) {
            if (!date) {
              return;
            }

            resetDayPicker(date);
          }, true);

          scope.selectDate = function (date) {
            scope.date.year(date.year()).month(date.month()).date(date.date());
          };

          scope.previousMonth = function () {
            var date = moment({year: scope.dayPicker.year, month: scope.dayPicker.month});
            date.subtract(1, 'months');
            resetDayPicker(date);
          };

          scope.nextMonth = function () {
            var date = moment({year: scope.dayPicker.year, month: scope.dayPicker.month});
            date.add(1, 'months');
            resetDayPicker(date);
          };

          scope.isSelected = function (date) {
            return date.year() === scope.date.year()
              && date.month() === scope.date.month()
              && date.date() === scope.date.date();
          };

          scope.isOverflowing = function (date) {
            return date.month() !== scope.dayPicker.month;
          };

          scope.monthClick = function () {
            var parentElement = scope.$parent.element ? scope.$parent.element : undefined;

            if (parentElement && parentElement.prop('tagName').toLowerCase() === 'kt-date-picker') {
              scope.$emit('dayPicker:monthClick');
            }
          };


          scope.$on('monthPickerSelect', function (event, month) {
            var date = moment({year: scope.dayPicker.year, month: month});
            resetDayPicker(date);
          });

          function resetDayPicker(date) {
            if (scope.dayPicker.month === date.month() && scope.dayPicker.year === date.year()) {
              return;
            }

            scope.dayPicker.month = date.month();
            scope.dayPicker.year = date.year();
            scope.dayPicker.weeks = service.getWeeksInMonth(scope.dayPicker.year, scope.dayPicker.month);
          }
        }
      };
    }]);
})();
