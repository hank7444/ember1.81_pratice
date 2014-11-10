define("appkit/routes/company-list", 
  ["appkit/utils/auth","appkit/utils/cookieProxy","appkit/models/company","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var CompanyModel = __dependency3__["default"];

    var CompanyListRoute = Ember.Route.extend({
    	
    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this);
    	},
    	model: function(params) {


    		// 還原原始狀態, 不要用Ember.copy()
    		var sidemenuData = this.controllerFor('main').get('sidemenuDataOrigin');
    		this.controllerFor('main').set('sidemenuData', sidemenuData);
    		


    		if (params.page_id == ' ') {

    			cookieProxy.removeCookie('companyData');
    			params.page_id = 1;
    			this.controllerFor('companyList').set('search', '');
    			this.transitionTo('companyList', 1);
    		}

    		var searchData = {
    			currentPage: params.page_id,
    		};

    		return CompanyModel.findByPage(searchData).then(function(data) {
    			return data;
    		});
    	},

    });
    __exports__["default"] = CompanyListRoute;
  });