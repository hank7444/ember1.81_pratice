define("appkit/routes/login", 
  ["appkit/utils/auth","appkit/models/login","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var Login = __dependency2__["default"];

    var LoginRoute = Ember.Route.extend({

    	beforeModel: function(transition) {

    		auth.loginChecking(transition, this, false);	
    	},
    	model: function() {

    		return Login.create();
    	},
    	actions:  { // 如果controller沒設相對應的action, 就會一路來到route這裡
    		fromView: function(param1, param2) {
    			console.log('route action trigger!!')
    			console.log(param1);
    			console.log(param2);
    		}
    	}

    });

    __exports__["default"] = LoginRoute;
  });