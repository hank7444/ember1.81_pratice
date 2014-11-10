import cookieProxy from 'appkit/utils/cookieProxy';
import auth from 'appkit/utils/auth';
import routeProxy from 'appkit/utils/routeProxy';



var ApplicationController = Ember.ObjectController.extend({

	currentPathDidChange: function() {

		Ember.currentPath = this.get('currentPath');
    	this.set('currentPath', this.get('currentPath'));

    	console.log('app.currentPath: ' + this.get('currentPath'));
  	}.observes('currentPath'),


    loginModalMessage: function() {

        return '您尚未登入，即將跳轉登入頁';

    }.property(),


  	// 設定invoiceInterval跳窗按鈕
    loginModalButton: [
        Ember.Object.create({title: '確定', clicked: 'transitionToLogin'})
    ],

    loadingData: function() {

        return {
            msg: '儲存中',
            isMask: false,
            isShow: false,
            fadeInTime: 500,
            fadeOutTime: 500,
            delayTime: 500
        };

    }.property(),


	didInsertElement: function() {

  	},


    actions: {

    	// 導頁到login頁面
        transitionToLogin: function() {

            // 清除目前$.cookie並導頁到login頁面
            auth.redirectForLogout();
            this.send('hideLoginModal');
        },
        showGrowlNotifications: function(title, msg, type) {

            var title = title || '';
            var msg = msg || '';
            var type = type || 'success';

            console.log(type);

            if (msg) {
                Bootstrap.GNM.push(title, msg, type);
            }
        },
        // 顯示Notification
        showNotification: function(msg) {
            console.log('showNotification');
            var msg = msg || '欄位未通過驗證,無法送出';
            Bootstrap.NM.push(msg, 'danger');
        },
        // 顯示未登入提示Modal
        showLoginModal: function() {

            console.log('into showLoginModal');
            Bootstrap.ModalManager.show('loginModal');
        },
        // 隱藏未登入提示Modal
        hideLoginModal: function() {
        	Bootstrap.ModalManager.hide('loginModal');
        },
        // 顯示login
        showLoading: function(msg) {
            this.set('loadingData.msg', msg);
            this.set('loadingData.isShow', true);
        },
        // 隱藏login
        hideLoading: function() {
            this.set('loadingData.isShow', false);
        }
    }
	
});

export default ApplicationController;