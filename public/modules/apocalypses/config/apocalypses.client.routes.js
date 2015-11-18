'use strict';

//Setting up route
angular.module('apocalypses').config(['$stateProvider',
	function($stateProvider) {
		// Apocalypses state routing
		$stateProvider.
		state('listApocalypses', {
			url: '/apocalypses',
			templateUrl: 'modules/apocalypses/views/list-apocalypses.client.view.html'
		}).
		state('createApocalypse', {
			url: '/apocalypses/create',
			templateUrl: 'modules/apocalypses/views/create-apocalypse.client.view.html'
		}).
		state('viewApocalypse', {
			url: '/apocalypses/:apocalypseId',
			templateUrl: 'modules/apocalypses/views/view-apocalypse.client.view.html'
		}).
		state('editApocalypse', {
			url: '/apocalypses/:apocalypseId/edit',
			templateUrl: 'modules/apocalypses/views/edit-apocalypse.client.view.html'
		});
	}
]);