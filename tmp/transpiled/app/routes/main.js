define("appkit/routes/main", 
  ["appkit/utils/auth","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];

    var MainRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this, false);
    	},
    	model: function() {


    	},
    });

    __exports__["default"] = MainRoute;
  });