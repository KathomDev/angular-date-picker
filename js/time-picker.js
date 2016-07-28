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
    }])

    .directive('ktTimePickerInput', ['$timeout', function ($timeout) {
      function findParentByTag(el, tag) {
        while (el.parentNode) {
          el = el.parentNode;
          if (el.tagName === tag)
            return el;
        }
        return null;
      }

      function findParentByClass(el, className) {
        while (el.parentNode) {
          el = el.parentNode;
          if ((' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1) {
            return el;
          }
        }
        return null;
      }

      function findParentElement(element, selector) {
        switch (selector.indexOf('.')) {
          case 0: return findParentByClass(element, selector.substring(1));
          default: return findParentByTag(element, selector.toUpperCase());
        }
      }

      return {
        restrict: 'E',
        template:
        '<input type="text" ng-model="timePickerInput.timeString" ng-change="timeStringChanged()" ng-click="showTimePicker()">' +
        '<kt-time-picker date="$parent.date" ng-if="timePickerInput.visible"></kt-time-picker>',
        scope: {
          date: '=',
          format: '@'
        },
        link: function (scope) {
          scope.timePickerInput = {
            timeString: '',
            visible: false
          };

          var listenerIgnore = [
            'kt-time-picker-input'
          ];

          document.addEventListener('click', function (e) {
            e = e || window.event;
            var target = angular.element(e.target || e.srcElement);
            var ignore;
            listenerIgnore.forEach(function (selector) {
              if (findParentElement(target[0], selector)) {
                ignore = true;
              }
            });

            if (ignore) {
              return;
            }

            $timeout(function () {
              scope.timePickerInput.visible = false;
            });
          }, false);

          scope.showTimePicker = function () {
            scope.timePickerInput.visible = true;
          };

          scope.timeStringChanged = function () {
            var date = moment(scope.timePickerInput.timeString, scope.format, true);
            if (date.isValid()) {
              scope.date.hour(date.hour()).minute(date.minute());
            }
          };

          scope.$watch('date', function (date) {
            if (!date) {
              return;
            }

            scope.timePickerInput.timeString = date.format(scope.format);
          }, true);
        }
      };
    }])

    .directive('ktTimeRangePicker', [function () {
      return {
        restrict: 'E',
        scope: {
          startDate: '=',
          endDate: '='
        },
        template:
        '<kt-time-picker date="startDate"></kt-time-picker>' +
        '<kt-time-picker date="endDate"></kt-time-picker>',
        link: function (scope) {

        }
      };
    }]);
})();
