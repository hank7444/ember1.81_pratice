
var ErrorRoute = Ember.Route.extend({

	init: function() {
		console.log('ErrorRoute:' + error);
		alert(error);
	},

});

export default ErrorRoute;