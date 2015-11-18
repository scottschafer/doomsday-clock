'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Apocalypses',
	function($scope, Authentication, Apocalypses) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

    // get the list of apocalypses
    $scope.apocalypses = Apocalypses.query();

    // watch for changes and determine the next upcoming apocalypse
    $scope.$watch('apocalypses', function() {
      var curDate = new Date();
      var bestTime = Number.MAX_VALUE;

      $scope.apocalypses.forEach(function(apocalypse) {

        var aDate = new Date(apocalypse.date);
        var timeTillDoom = aDate.getTime() - curDate.getTime();

        if (timeTillDoom > 0 && timeTillDoom < bestTime) {
          // if it hasn't past yet, and it's earlier than the best contender, set it into the scope
          $scope.nextApocalypse = apocalypse;
          bestTime = timeTillDoom;
        }
      });
    }, true);
	}
]);