'use strict';

// Configuring the Articles module
angular.module('apocalypses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Apocalypses', 'apocalypses', 'dropdown', '/apocalypses(/create)?');
		Menus.addSubMenuItem('topbar', 'apocalypses', 'List Apocalypses', 'apocalypses');
		Menus.addSubMenuItem('topbar', 'apocalypses', 'New Apocalypse', 'apocalypses/create');
	}
]);