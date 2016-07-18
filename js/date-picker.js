(function () {
  'use strict';

  angular

    .module('kt.components.datePicker', [])

    .filter('monthFormat', [function () {
      return function (input) {
        return moment.months()[input];
      };
    }])

    .factory('ktDatePickerSvc', [function () {
      var service = {};
      var dayHeaders;

      service.getNumberOfWeeksInMonth = function (year, month) {
        var date = moment().set({year: year, month: month});
        var startWeek = date.clone().startOf('month').week();
        var endWeek = date.clone().endOf('month').week();

        if (startWeek > endWeek) {
          endWeek = startWeek + endWeek;
        }

        return endWeek - startWeek + 1;
      };

      service.getWeekRangeForMonth = function (year, month) {
        var date = moment().set({year: year, month: month});
        var startWeek = date.clone().startOf('month').week();
        var endWeek = date.clone().endOf('month').week();

        if (startWeek > endWeek) {
          startWeek = 0;
        }

        return {
          startWeek: startWeek,
          endWeek: endWeek
        };
      };

      service.getDatesInWeek = function (year, month, week) {
        var date = moment().year(year).month(month).week(week);
        var days = [];
        for (var i = 0; i < 7; i++) {
          days.push(date.clone().weekday(i));
        }

        return days;
      };

      service.getWeeksInMonth = function (year, month) {
        var weeksInMonth = service.getWeekRangeForMonth(year, month);
        var weeks = [];
        for (var i = weeksInMonth.startWeek; i <= weeksInMonth.endWeek; i++) {
          weeks.push({week: i, dates: service.getDatesInWeek(year, month, i)});
        }

        return weeks;
      };

      service.getDayHeaders = function () {
        if (!dayHeaders) {
          dayHeaders = [];
          for (var i = 0; i < 7; i++) {
            dayHeaders.push(moment().clone().weekday(i).format('dd'));
          }
        }

        return dayHeaders;
      };

      return service;
    }])

    .directive('ktDatePicker', ['ktDatePickerSvc', function (service) {
      return {
        restrict: 'E',
        templateUrl: 'html/date-picker.html',
        scope: {
          date: '='
        },
        link: function (scope) {
          scope.calendar = {
            month: scope.date.month(),
            year: scope.date.year(),
            weeks: service.getWeeksInMonth(scope.date.year(), scope.date.month()),
            dayHeaders: service.getDayHeaders()
          };

          scope.selectDate = function (date) {
            scope.date = date;
          };

          scope.previousMonth = function () {
            var date = moment({year: scope.calendar.year, month: scope.calendar.month});
            date.subtract(1, 'months');
            scope.calendar.month = date.month();
            scope.calendar.year = date.year();
            scope.calendar.weeks = service.getWeeksInMonth(scope.calendar.year, scope.calendar.month);
          };

          scope.nextMonth = function () {
            var date = moment({year: scope.calendar.year, month: scope.calendar.month});
            date.add(1, 'months');
            scope.calendar.month = date.month();
            scope.calendar.year = date.year();
            scope.calendar.weeks = service.getWeeksInMonth(scope.calendar.year, scope.calendar.month);
          };

          scope.isSelected = function (date) {
            return date.year() === scope.date.year()
              && date.month() === scope.date.month()
              && date.date() === scope.date.date();
          };

          scope.isOverflowing = function (date) {
            return date.month() !== scope.calendar.month;
          };
        }
      };
    }]);
})();
