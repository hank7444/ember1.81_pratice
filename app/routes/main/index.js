import auth from 'appkit/utils/auth';

var MainIndexRoute = Ember.Route.extend({


	// 一進網站就從 / redirect 到想要的初始位置
	beforeModel: function(transition) {
		//auth.loginChecking(transition, this, false);
	},

	model: function(params) {

		return '';
	}


});

export default MainIndexRoute;