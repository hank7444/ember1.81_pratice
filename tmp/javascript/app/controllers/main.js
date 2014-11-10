import cookieProxy from 'appkit/utils/cookieProxy';
import auth from 'appkit/utils/auth';
import sidemenuData from 'appkit/utils/sidemenuData';

var MainController = Ember.ObjectController.extend({


	menuData: function() {

		var member = cookieProxy.getCookie('member');

		return {

			title: '發票系統-管理者後台',
			titleLink: 'main.index',
			userName: member.name,
			userPhoto: 'assets/images/avatar.jpg',
			hasToggleBtn: true,
			hasUserMenu: true,
			userMenu: [
                {
                    actionName: 'profile',
                    icon: 'icon-user',
                    title: 'Profile',
                    hasDivider: true
                },
	            {
	                actionName: 'logout',
	                icon: 'icon-signout',
	                title: '登出'
	            }
			]
		};

	}.property(),


	sidemenuDataOrigin: function() {

		return sidemenuData;

	}.property(),

	sidemenuData: function() {

        return sidemenuData;

	}.property('this.sidemenuData'),


	actions: {

		headerMenu: function(param) {

			switch (param) {

				case 'profile':
					this.transitionToRoute('main.profile');
					break;

				case 'logout':
					auth.redirectForLogout();
					break;
			}

			console.log(param);
		}
	}
});

export default MainController;