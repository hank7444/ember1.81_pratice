import auth from 'appkit/utils/auth';
import cookieProxy from 'appkit/utils/cookieProxy';
import CompanyModel from 'appkit/models/company';

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
			this.controllerFor('main.companyList').set('search', '');
			this.transitionTo('main.companyList', 1);
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
export default CompanyListRoute;