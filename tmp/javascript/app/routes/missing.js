import auth from 'appkit/utils/auth';

var MissingRoute = Ember.Route.extend({

	beforeModel: function(transition) {

		console.log('into missing route, 404 page!');
		auth.redirectForLogin();	
	}

});

export default MissingRoute;