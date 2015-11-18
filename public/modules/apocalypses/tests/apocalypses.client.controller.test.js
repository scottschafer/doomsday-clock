'use strict';

(function() {
	// Apocalypses Controller Spec
	describe('Apocalypses Controller Tests', function() {
		// Initialize global variables
		var ApocalypsesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Apocalypses controller.
			ApocalypsesController = $controller('ApocalypsesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Apocalypse object fetched from XHR', inject(function(Apocalypses) {
			// Create sample Apocalypse using the Apocalypses service
			var sampleApocalypse = new Apocalypses({
				name: 'New Apocalypse'
			});

			// Create a sample Apocalypses array that includes the new Apocalypse
			var sampleApocalypses = [sampleApocalypse];

			// Set GET response
			$httpBackend.expectGET('apocalypses').respond(sampleApocalypses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.apocalypses).toEqualData(sampleApocalypses);
		}));

		it('$scope.findOne() should create an array with one Apocalypse object fetched from XHR using a apocalypseId URL parameter', inject(function(Apocalypses) {
			// Define a sample Apocalypse object
			var sampleApocalypse = new Apocalypses({
				name: 'New Apocalypse'
			});

			// Set the URL parameter
			$stateParams.apocalypseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/apocalypses\/([0-9a-fA-F]{24})$/).respond(sampleApocalypse);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.apocalypse).toEqualData(sampleApocalypse);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Apocalypses) {
			// Create a sample Apocalypse object
			var sampleApocalypsePostData = new Apocalypses({
				name: 'New Apocalypse'
			});

			// Create a sample Apocalypse response
			var sampleApocalypseResponse = new Apocalypses({
				_id: '525cf20451979dea2c000001',
				name: 'New Apocalypse'
			});

			// Fixture mock form input values
			scope.name = 'New Apocalypse';

			// Set POST response
			$httpBackend.expectPOST('apocalypses', sampleApocalypsePostData).respond(sampleApocalypseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Apocalypse was created
			expect($location.path()).toBe('/apocalypses/' + sampleApocalypseResponse._id);
		}));

		it('$scope.update() should update a valid Apocalypse', inject(function(Apocalypses) {
			// Define a sample Apocalypse put data
			var sampleApocalypsePutData = new Apocalypses({
				_id: '525cf20451979dea2c000001',
				name: 'New Apocalypse'
			});

			// Mock Apocalypse in scope
			scope.apocalypse = sampleApocalypsePutData;

			// Set PUT response
			$httpBackend.expectPUT(/apocalypses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/apocalypses/' + sampleApocalypsePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid apocalypseId and remove the Apocalypse from the scope', inject(function(Apocalypses) {
			// Create new Apocalypse object
			var sampleApocalypse = new Apocalypses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Apocalypses array and include the Apocalypse
			scope.apocalypses = [sampleApocalypse];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/apocalypses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleApocalypse);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.apocalypses.length).toBe(0);
		}));
	});
}());