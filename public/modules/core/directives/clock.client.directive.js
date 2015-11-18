'use strict';

angular.module('core').directive('clock', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Clock directive logic
				// ...

				element.text('this is the clock directive');
			}
		};
	}
]);