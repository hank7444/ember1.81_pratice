var Router = Ember.Router.extend();

Router.map(function() {

	this.route('error'),
	this.route('login', function() {

	}),

	// 1.8版的ember可以不用resource, 直接用route就可以做nested route了, 這樣頁面與資料夾結構好多了,
	// 不會像用resouce會要在folder第一層設定, 有助對整個網站結構的認識
	this.route('main', function() {

		this.route('index');

		// 營業人管理
		this.route('companyList', {path: '/company/:page_id'}, function() {


			this.route('companyDetail', {path: '/detail/:company_id'}, function() {
				
			});

		});

		// 測試用
		this.route('companyList2', {path: '/company2/:page_id'}, function() {

		});

		this.route('companyDetail2', {path: '/detail2/:company_id'}, function() {
			
		});

		// 專案管理
		this.route('projectList', {path: '/project/:page_id'}, function() {

		});
		
	})

	// 所有不存在的url, 都會到這個route來處理(404 not found);
	//this.route('missing', { path: "/*path" });
    
});

// 控制URL上的顯示, history會用/posts/new的方式顯示, none, 會將url隱藏起來
Router.reopen({
	//location: 'history'
});

export default Router;