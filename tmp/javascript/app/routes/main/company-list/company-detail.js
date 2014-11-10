import auth from 'appkit/utils/auth';
import cookieProxy from 'appkit/utils/cookieProxy';
import CompanyModel from 'appkit/models/company';

var companyDetailRoute = Ember.Route.extend({

	beforeModel: function(transition) {
		auth.loginChecking(transition, this);
	},
	model: function(params) {

		console.log('#########');
		console.log(params);

		var that = this;

		return CompanyModel.find(params.company_id).then(function(data) {

			// sidemenu插入新項目, 要用Ember.copy()
			/*
			var menuItem = {
	            isPage: true,
	            isHidden: false,
	            icon: 'icon-group',
	            name: '新的menu物件',
	            page: {
	                href: 'main.companyList',
	                params: ' '
	            }
	        };

			var sidemenuData = that.controllerFor('main').get('sidemenuDataOrigin');
			sidemenuData = Ember.copy(sidemenuData, true);
			sidemenuData[0].page.push(menuItem);
			that.controllerFor('main').set('sidemenuData', sidemenuData);
			*/
		
		
			return data;
		});
	},
	actions: {

	}

});
export default companyDetailRoute;