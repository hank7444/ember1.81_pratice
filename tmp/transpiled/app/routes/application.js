define("appkit/routes/application", 
  ["appkit/utils/auth","appkit/utils/routeProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];

    var ApplicationRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		routeProxy.init(transition, this);
    		auth.loginChecking(transition, this, false);
    	},
    	model: function() {

    	}
    });

    __exports__["default"] = ApplicationRoute;
  });