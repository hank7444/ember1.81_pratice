var cookieProxy = (function() { 

    //'use strict';

    return {

    /*
     * 判斷是否有登入, 如果cookie logins裡面都沒有值, 那永遠返回true
     */
    isLogin: function() {

        var logins = null;
        var loginParamName = null;
        var isLogin = false;

        logins = $.cookie('logins');

        if (logins) {
            logins = JSON.parse(logins);
        }
        else {
            logins = {};
        }

        // 取得所有login參數名稱
        for (loginParamName in logins) {

            //console.log('loginParamName: ' + loginParamName);

            if (logins.hasOwnProperty(loginParamName) && this.getCookie(loginParamName)) {
                isLogin = true;
            }
            else {
                isLogin = false;
                break;
            }
        }
        return isLogin;
    },
    /*
     * 清除所有login有關的cookie
     */
    logout: function() {

        var logins = null;
        var loginParamName = null;

        logins = $.cookie('logins');

        if (logins) {
            logins = JSON.parse(logins);

             // 取得所有login參數名稱
            for (loginParamName in logins) {

                if (logins.hasOwnProperty(loginParamName)) {
                    $.removeCookie(loginParamName);
                }
            }
        }
        $.removeCookie('logins');
    },
    /*
     *  寫入cookie
     *  $param (array)  cookieName cookie名稱
     *  $param (string or object) cookieValue cookie的值 
     *  $param (string) settingObj 設定的物件, ex: {expire: 5, path: '/'}
     *  $param (string) groupName cookie群組名稱
     *  $param (boolean) isLogin 是否為判斷login的參數 
     */
    setCookie: function(cookieName, cookieValue, settingObj, groupName, isLogin) {

        var value = JSON.stringify(cookieValue);
        var groups = null;
        var logins = null;
        var group = null;

        if (settingObj) {
            $.cookie(cookieName, value, settingObj);
        }
        else {
            $.cookie(cookieName, value);
        }

        // 如果有群組, 將該cookie加入群組
        if (groupName) {

            groups = $.cookie('cookieGroup');

            if (groups) {
                groups = JSON.parse(groups);
            }
            else {
                groups = {};
            }

            group = groups[groupName];
            
            if (!group) {
                group = {};
            }
            group[cookieName] = true;
            groups[groupName] = group;

            $.cookie('cookieGroup', JSON.stringify(groups));
        }

        // 如果此參數為login判斷物件, 就寫入cookie中以供之後判斷用
        if (isLogin) {
            logins = $.cookie('logins');

            if (logins) {
                logins = JSON.parse(logins);
            }
            else {
                logins = {};
            }

            logins[cookieName] = true;
            $.cookie('logins', JSON.stringify(logins));
        }
    },
    /*
     * 取得cookie
     * $param (string) cookieName cookie名稱
     */
    getCookie: function(cookieName) {

        var value = $.cookie(cookieName);

        if (value) {

            try {
                value = JSON.parse(value);
            } 
            catch(e) {
                console.log('cookieProxyError: ' + e);
            }
        }
        else {
            value = '';
        }

        return value
    },
    /*
     * 刪除cookie
     * $param (string) cookieName cookie名稱
     */
    removeCookie: function(cookieName) {
        $.removeCookie(cookieName);
    },
    /*
     * 刪除在群組內的所有cookie
     * $param (string) groupNmae cookie群組名稱
     */
    removeGroup: function(groupName) {

        var groups = null;
        var group = null;
        var cookieName = '';

        if (groupName) {

            groups = $.cookie('cookieGroup');

            if (groups) {
                groups = JSON.parse(groups);
            }
            else {
                groups = {};
            }

            group = groups[groupName];
            
            if (!group) {
                return false;
            }

            // 取得group所有cookie名稱並刪除
            for (cookieName in group) {

                if (group.hasOwnProperty(cookieName)) {
                    $.removeCookie(cookieName);
                }
            }

            // 將該group自groups刪除
            delete groups[groupName];

            // 將groups重新塞回cookie中
            $.cookie('cookieGroup', JSON.stringify(groups));
        }
    }

};
})();


export default cookieProxy;