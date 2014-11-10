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
    	}

    });

    __exports__["default"] = LoginRoute;
  });