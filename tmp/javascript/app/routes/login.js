import auth from 'appkit/utils/auth';
import Login from 'appkit/models/login';

var LoginRoute = Ember.Route.extend({

	beforeModel: function(transition) {

		auth.loginChecking(transition, this, false);	
	},
	model: function() {

		return Login.create();
	}

});

export default LoginRoute;