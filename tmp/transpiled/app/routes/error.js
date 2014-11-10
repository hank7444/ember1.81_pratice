define("appkit/routes/error", 
  ["exports"],
  function(__exports__) {
    "use strict";

    var ErrorRoute = Ember.Route.extend({

    	init: function() {
    		console.log('ErrorRoute:' + error);
    		alert(error);
    	},

    });

    __exports__["default"] = ErrorRoute;
  });