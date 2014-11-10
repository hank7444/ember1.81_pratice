define("appkit/routes/main/index", 
  ["appkit/utils/auth","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];

    var MainIndexRoute = Ember.Route.extend({


    	// 一進網站就從 / redirect 到想要的初始位置
    	beforeModel: function(transition) {
    		//auth.loginChecking(transition, this, false);
    	},

    	model: function(params) {

    		return '';
    	}


    });

    __exports__["default"] = MainIndexRoute;
  });