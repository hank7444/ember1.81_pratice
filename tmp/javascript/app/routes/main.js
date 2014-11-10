import auth from 'appkit/utils/auth';

var MainRoute = Ember.Route.extend({

	beforeModel: function(transition) {
		auth.loginChecking(transition, this, false);
	},
	model: function() {


	},
});

export default MainRoute;