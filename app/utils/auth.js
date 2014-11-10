import cookieProxy from 'appkit/utils/cookieProxy';
import routeProxy from 'appkit/utils/routeProxy';

'use strict';

var auth = { 

    loginPath: window.ENV.loginPath, // 登入頁位置
    indexPath: window.ENV.mainPath, // 首頁位置 
    /*
     *  導頁到login頁面
     *  $param (array)  cookieName cookie名稱
     *  $param (string or object) cookieValue cookie的值 
     *  $param (string) settingObj 設定的物件, ex: {expire: 5, path: '/'}
     *  $param (string) groupName cookie群組名稱
     *  $param (boolean) isLogin 是否為判斷login的參數 
     */
    redirectForLogin: function() {
        console.log('loginRedirect');
        routeProxy.getRoute().transitionTo(this.indexPath);
    },

    /*
     *  導頁到主頁面
     *  $param (array)  cookieName cookie名稱
     *  $param (string or object) cookieValue cookie的值 
     *  $param (string) settingObj 設定的物件, ex: {expire: 5, path: '/'}
     *  $param (string) groupName cookie群組名稱
     *  $param (boolean) isLogin 是否為判斷login的參數 
     */
    redirectForLogout: function() {
        cookieProxy.logout();
        routeProxy.getRoute().transitionTo(this.loginPath);
    },
    /*
     *  判斷使用者登入狀況, 如果沒登入則導頁或跳出警示modal, 有登入則導頁到目標頁面
     *  $param (object)  transition ember transition物件
     *  $param (route) route ember route物件 
     *  $param (boolean) isModal 是否要跳出警示modal
     *  $param (string) 登入頁url
     *  $param (string) 主頁面url
     */
    loginChecking: function(transition, route, isModal, loginPath, indexPath) {


        // TODO: 錯誤處理失效, 無法再app.js的Ember.Error裡面接到
        if (!transition) {
            throw 'auth.js, func:loginChecking, 請輸入transition';
        }

        if (!route) {
            throw 'auth.js, func:loginChecking, 請輸入route';
        }

        var isModal = (isModal === false) ? false : true;

        if (cookieProxy.isLogin() === false) {

            if (transition.targetName == 'index' || transition.targetName == this.loginPath) {
                route.transitionTo(this.loginPath);
            }
            else if (isModal === false) {
                route.transitionTo(this.loginPath);
            }
            else {
                var feedback = routeProxy.send('showLoginModal');
                
                // 如果找不到controll(reload時, 直接導回login頁面)
                if (feedback === false) {
                    route.transitionTo(this.loginPath);
                }
            }
        }
        else if (transition.targetName == 'index' || transition.targetName == this.loginPath) {
            route.transitionTo(this.indexPath);
        }
    }
};

export default auth;