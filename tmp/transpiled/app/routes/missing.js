define("appkit/routes/missing", 
  ["appkit/utils/auth","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];

    var MissingRoute = Ember.Route.extend({

    	beforeModel: function(transition) {

    		console.log('into missing route, 404 page!');
    		auth.redirectForLogin();	
    	}

    });

    __exports__["default"] = MissingRoute;
  });