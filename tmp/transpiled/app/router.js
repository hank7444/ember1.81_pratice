define("appkit/router", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var Router = Ember.Router.extend();

    Router.map(function() {

    	this.resource('login', function() {

    	}),
    	this.resource('main', function() {

    		this.route('index');

    		// 營業人管理
    		this.resource('companyList', {path: '/company/:page_id'}, function() {

    			this.resource('companyDetail', {path: '/detail/:company_id'}, function() {
    				
    			});

    		});

    		// 專案管理
    		this.resource('projectList', {path: '/project/:page_id'}, function() {

    		});
    		
    	});

    	// 所有不存在的url, 都會到這個route來處理(404 not found);
    	//this.route('missing', { path: "/*path" });
        
    });

    // 控制URL上的顯示, history會用/posts/new的方式顯示, none, 會將url隱藏起來
    Router.reopen({
    	//location: 'history'
    });

    __exports__["default"] = Router;
  });