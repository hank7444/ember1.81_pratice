define("appkit/routes/index", 
  ["appkit/utils/auth","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];

    var IndexRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this, false);
    	},
    	model: function() {

    	}

    });

    __exports__["default"] = IndexRoute;
  });