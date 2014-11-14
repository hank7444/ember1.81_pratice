define("appkit/routes/main/company-list2", 
  ["appkit/utils/auth","appkit/utils/cookieProxy","appkit/models/company","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var CompanyModel = __dependency3__["default"];

    var CompanyList2Route = Ember.Route.extend({
    	
    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this);
    	},
    	model: function(params) {


    		if (params.page_id == ' ') {

    			cookieProxy.removeCookie('companyData');
    			params.page_id = 1;
    			this.controllerFor('main.companyList2').set('search', '');
    			this.transitionTo('main.companyList2', 1);
    		}

    		var searchData = {
    			currentPage: params.page_id,
    		};

    		var success = function(data) {
    			console.log('success3');
    			return data;
    		};
    /*
    		var error = function(data) {
    			console.log('error3');
    			console.log(data);
    			return data;
    		};*/

    		return CompanyModel.findByPage(searchData).then(success);
    	},

    });
    __exports__["default"] = CompanyList2Route;
  });