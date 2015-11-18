'use strict';

//Apocalypses service used to communicate Apocalypses REST endpoints
angular.module('apocalypses').factory('Apocalypses', ['$resource',
	function($resource) {
		return $resource('apocalypses/:apocalypseId', { apocalypseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);