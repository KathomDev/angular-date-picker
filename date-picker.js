(function (){
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

          scope.selectDate = function (date) {
            var parentElement = scope.$parent.hasOwnProperty('element') ? scope.$parent.element : undefined;
            scope.date.year(date.year()).month(date.month()).date(date.date());
            if (parentElement && parentElement.prop('tagName').toLowerCase() === 'kt-date-time-picker') {
              scope.$parent.$broadcast('datePickerSelect');
            }
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
            scope.dayPicker.month = date.month();
            scope.dayPicker.year = date.year();
            scope.dayPicker.weeks = service.getWeeksInMonth(scope.dayPicker.year, scope.dayPicker.month);
          }
        }
      };
    }]);




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




  angular

    .module('kt.components.datePicker')

    .directive('ktTimePicker', [function () {
      var hours, minutes;

      function getHours() {
        if (!hours) {
          hours = [];
          for (var i = 0; i < 24; i++) {
            hours.push(i);
          }
        }

        return hours;
      }

      function getMinutes() {
        if (!minutes) {
          minutes = [];
          for (var i = 0; i < 60; i++) {
            minutes.push(i);
          }
        }

        return minutes;
      }

      return {
        restrict: 'E',
        templateUrl: 'kt-time-picker.html',
        scope: {
          date: '='
        },
        link: function (scope) {
          scope.timePicker = {
            hours: getHours(),
            minutes: getMinutes()
          };

          scope.isHourSelected = function (hour) {
            return scope.date.hour() === hour;
          };

          scope.isMinuteSelected = function (minute) {
            return scope.date.minute() === minute;
          };

          scope.selectHour = function (hour) {
            scope.date.hour(hour);
          };

          scope.selectMinute = function (minute) {
            scope.date.minute(minute);
          };
        }
      };
    }]);




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
        templateUrl: 'kt-year-picker.html',
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


angular.module('kt.components.datePicker').run(['$templateCache', function($templateCache) {
  $templateCache.put("kt-day-picker.html",
    "<div>\n" +
    "  <div class=\"kt-date-picker-header\">\n" +
    "    <button type=\"button\" ng-click=\"previousMonth()\">Previous Month</button>\n" +
    "    <button type=\"button\" ng-click=\"monthClick()\">{{dayPicker.month | monthFormat}} {{dayPicker.year}}</button>\n" +
    "    <button type=\"button\" ng-click=\"nextMonth()\">Next Month</button>\n" +
    "  </div>\n" +
    "  <div class=\"kt-date-picker-content\">\n" +
    "    <div class=\"kt-day-picker-row\">\n" +
    "      <div class=\"kt-day-picker-day\" ng-repeat=\"dayHeader in dayPicker.dayHeaders\">\n" +
    "        {{dayHeader}}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"kt-day-picker-row\" ng-repeat=\"week in dayPicker.weeks\">\n" +
    "      <div class=\"kt-day-picker-cell\"\n" +
    "           ng-repeat=\"date in week.dates\"\n" +
    "           ng-class=\"{'kt-date-picker-selected': isSelected(date), 'kt-date-picker-overflow': isOverflowing(date)}\">\n" +
    "        <button type=\"button\" ng-click=\"selectDate(date)\">\n" +
    "          {{date.format('D')}}\n" +
    "        </button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"kt-date-picker-footer\"></div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("kt-month-picker.html",
    "<div>\n" +
    "  <div class=\"kt-date-picker-header\">\n" +
    "    <button type=\"button\" ng-click=\"previousYear()\">Previous Year</button>\n" +
    "    <button type=\"button\" ng-click=\"yearClick()\">{{monthPicker.year}}</button>\n" +
    "    <button type=\"button\" ng-click=\"nextYear()\">Next Year</button>\n" +
    "  </div>\n" +
    "  <div class=\"kt-date-picker-content\">\n" +
    "    <div class=\"kt-month-picker-cell\"\n" +
    "         ng-repeat=\"month in monthPicker.months\"\n" +
    "         ng-class=\"{'kt-date-picker-selected': isSelected(month)}\">\n" +
    "      <button type=\"button\" ng-click=\"selectMonth(month)\">{{month | monthFormat}}</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"kt-date-picker-footer\"></div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("kt-time-picker.html",
    "<div>\n" +
    "  <div class=\"kt-date-picker-header\">\n" +
    "    <div>Hour</div>\n" +
    "    <div>Minute</div>\n" +
    "  </div>\n" +
    "  <div class=\"kt-date-picker-content\">\n" +
    "    <div class=\"kt-time-picker-outer\">\n" +
    "      <div class=\"kt-time-picker-inner\" kt-hide-scrollbar>\n" +
    "        <div class=\"kt-time-picker-cell\"\n" +
    "             ng-repeat=\"hour in timePicker.hours\"\n" +
    "             ng-class=\"{'kt-date-picker-selected': isHourSelected(hour)}\">\n" +
    "          <button type=\"button\" ng-click=\"selectHour(hour)\">{{hour}}</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"kt-time-picker-outer\">\n" +
    "      <div class=\"kt-time-picker-inner\" kt-hide-scrollbar>\n" +
    "        <div class=\"kt-time-picker-cell\"\n" +
    "             ng-repeat=\"minute in timePicker.minutes\"\n" +
    "             ng-class=\"{'kt-date-picker-selected': isMinuteSelected(minute)}\">\n" +
    "          <button type=\"button\" ng-click=\"selectMinute(minute)\">{{minute}}</button>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"kt-date-picker-footer\"></div>\n" +
    "</div>\n" +
    "");
  $templateCache.put("kt-year-picker.html",
    "<div>\n" +
    "  <div class=\"kt-date-picker-header\">\n" +
    "    <button type=\"button\" ng-click=\"previousDecade()\">Previous Decade</button>\n" +
    "    <button type=\"button\" disabled=\"disabled\">{{yearPicker.decade.start}} - {{yearPicker.decade.end}}</button>\n" +
    "    <button type=\"button\" ng-click=\"nextDecade()\">Next Decade</button>\n" +
    "  </div>\n" +
    "  <div class=\"kt-date-picker-content\">\n" +
    "    <div class=\"kt-year-picker-cell\"\n" +
    "         ng-repeat=\"year in yearPicker.years\"\n" +
    "         ng-class=\"{'kt-date-picker-selected': isSelected(year), 'kt-date-picker-overflow': isOverflowing(year)}\">\n" +
    "      <button type=\"button\" ng-click=\"selectYear(year)\">{{year}}</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"kt-date-picker-footer\"></div>\n" +
    "</div>\n" +
    "");
}]);
})();
