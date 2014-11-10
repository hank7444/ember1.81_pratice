import auth from 'appkit/utils/auth';
import cookieProxy from 'appkit/utils/cookieProxy';
import ProjectModel from 'appkit/models/project';


var ProjectListRoute = Ember.Route.extend({

	beforeModel: function(transition) {
		auth.loginChecking(transition, this);
	},
	model: function(params) {


		// sidemenu插入新項目, 要用Ember.copy()
		var menuItem = {
            isPage: true,
            isHidden: false,
            icon: 'icon-stop',
            name: '另一個新的menu物件',
            page: {
                href: 'main.companyList',
                params: ' '
            }
        };

		var sidemenuData = this.controllerFor('main').get('sidemenuDataOrigin');
		sidemenuData = Ember.copy(sidemenuData, true);
		sidemenuData[0].page.push(menuItem);
		this.controllerFor('main').set('sidemenuData', sidemenuData);
		


		if (params.page_id == ' ') {

			cookieProxy.removeCookie('projectData');
			params.page_id = 1;

			this.controllerFor('main.projectList').set('search', '');
			this.controllerFor('main.projectList').set('statisticListSelectedItem', 'all');
			this.transitionTo('main.projectList', 1);
		}

		var searchData = {
			currentPage: params.page_id,
		};

		return ProjectModel.findByPage(searchData).then(function(data) {
			return data;
		});
	},
	actions: {

	}

});
export default ProjectListRoute;