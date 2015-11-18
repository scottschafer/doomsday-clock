'use strict';

// Apocalypses controller
angular.module('apocalypses').controller('ApocalypsesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Apocalypses',
	function($scope, $stateParams, $location, Authentication, Apocalypses) {
		$scope.authentication = Authentication;

		// Create new Apocalypse
		$scope.create = function() {
			// Create new Apocalypse object
			var apocalypse = new Apocalypses ({
				name: this.name
			});

			// Redirect after save
			apocalypse.$save(function(response) {
				$location.path('apocalypses/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Apocalypse
		$scope.remove = function(apocalypse) {
			if ( apocalypse ) { 
				apocalypse.$remove();

				for (var i in $scope.apocalypses) {
					if ($scope.apocalypses [i] === apocalypse) {
						$scope.apocalypses.splice(i, 1);
					}
				}
			} else {
				$scope.apocalypse.$remove(function() {
					$location.path('apocalypses');
				});
			}
		};

		// Update existing Apocalypse
		$scope.update = function() {
			var apocalypse = $scope.apocalypse;

			apocalypse.$update(function() {
				$location.path('apocalypses/' + apocalypse._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Apocalypses
		$scope.find = function() {
			$scope.apocalypses = Apocalypses.query();
		};

		// Find existing Apocalypse
		$scope.findOne = function() {
			$scope.apocalypse = Apocalypses.get({ 
				apocalypseId: $stateParams.apocalypseId
			});
		};
	}
]);