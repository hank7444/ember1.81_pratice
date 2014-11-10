define("appkit/routes/company-detail", 
  ["appkit/utils/auth","appkit/utils/cookieProxy","appkit/models/company","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var CompanyModel = __dependency3__["default"];

    var companyDetailRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this);
    	},
    	model: function(params) {

    		var that = this;

    		return CompanyModel.find(params.company_id).then(function(data) {

    			// sidemenu插入新項目, 要用Ember.copy()
    			var menuItem = {
    	            isPage: true,
    	            isHidden: false,
    	            icon: 'icon-group',
    	            name: '新的menu物件',
    	            page: {
    	                href: 'companyList',
    	                params: ' '
    	            }
    	        };

    			var sidemenuData = that.controllerFor('main').get('sidemenuDataOrigin');
    			sidemenuData = Ember.copy(sidemenuData, true);
    			sidemenuData[0].page.push(menuItem);
    			that.controllerFor('main').set('sidemenuData', sidemenuData);
    		
    		
    			return data;
    		});
    	},
    	actions: {

    	}

    });
    __exports__["default"] = companyDetailRoute;
  });