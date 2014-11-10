import auth from 'appkit/utils/auth';
import routeProxy from 'appkit/utils/routeProxy';

var ApplicationRoute = Ember.Route.extend({

	beforeModel: function(transition) {
		routeProxy.init(transition, this);
		auth.loginChecking(transition, this, false);
	},
	model: function() {

	}
});

export default ApplicationRoute;