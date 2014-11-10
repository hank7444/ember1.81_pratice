import auth from 'appkit/utils/auth';

var IndexRoute = Ember.Route.extend({

	beforeModel: function(transition) {
		auth.loginChecking(transition, this, false);
	},
	model: function() {

	}

});

export default IndexRoute;