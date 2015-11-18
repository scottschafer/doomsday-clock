'use strict';

angular.module('core').directive('clock', [ '$interval',
  function ($interval) {
    return {
      scope: {
        'time': '='
      },
      template:
      '<h2 style="min-height:50px">' + 
      '  <span ng-show="seconds">' +
      '     Remaining time = {{seconds | number}} seconds</h2>' + 
      '  </span>' +
      '</h2>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        // every second, recalculate the remaining seconds
        $interval(function () {
          if (scope.time) {
            scope.seconds = Math.floor((new Date(scope.time).getTime() - new Date().getTime()) / 1000);
          }
        }, 1000);
      }
    };
  }
]);