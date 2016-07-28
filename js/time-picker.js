(function () {
  'use strict';

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
})();
