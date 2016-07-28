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

        if (startWeek > endWeek && startWeek < 10) {
          startWeek = 0;
        }

        if (startWeek > endWeek && startWeek > 40) {
          startWeek = startWeek - date.weeksInYear();
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

    .directive('ktHideScrollbar', [function () {
      var scrollbarWidth = getScrollBarWidth();

      function getScrollBarWidth () {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild (inner);

        document.body.appendChild (outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild (outer);

        return (w1 - w2);
      }

      return {
        restrict: 'A',
        link: function (scope, element) {
          element.css('margin-right', -Math.abs(scrollbarWidth) + 'px');
        }
      };
    }])

    .directive('ktDatePicker', [function () {
      return {
        restrict: 'E',
        scope: {
          date: '='
        },
        template:
        '<kt-day-picker date="date" ng-if="isCurrentPicker(\'day\')"></kt-day-picker>' +
        '<kt-month-picker date="date" ng-if="isCurrentPicker(\'month\')"></kt-month-picker>' +
        '<kt-year-picker date="date" ng-if="isCurrentPicker(\'year\')"></kt-year-picker> ',
        link: function (scope, element) {
          scope.element = element;
          var currentPicker = 'day';

          scope.setCurrentPicker = function (picker) {
            currentPicker = picker;
          };

          scope.isCurrentPicker = function (picker) {
            return currentPicker === picker;
          };

          scope.$on('dayPicker:monthClick', function (ev) {
            currentPicker = 'month';
            ev.stopPropagation();
          });

          scope.$on('monthPicker:monthSelect', function (ev) {
            currentPicker = 'day';
            ev.stopPropagation();
          });

          scope.$on('yearPicker:yearSelect', function (ev) {
            currentPicker = 'month';
            ev.stopPropagation();
          });

          scope.$on('monthPicker:yearClick', function (ev) {
            currentPicker = 'year';
            ev.stopPropagation();
          });
        }
      }
    }]);
})();
