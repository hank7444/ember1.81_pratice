import BaseModel from 'appkit/models/base';


var LoginModel = BaseModel.extend({

    init: function() {
        this._super();
    },
    account: '',
    password: '',
    errorMsg: '',
    isRemember: false,
    // Tells the resistance layer what properties to save to localStorage
    // Ember Data does this for you.
    serialize: function() {
        //return this.getProperties(['email', 'password']);
    }
})

LoginModel.reopenClass({

    // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
    storageKey: 'login',

    login: function(account, password) {

        console.log('######## hello login!');

        var that = this;
        var data = {
            account: account,
            password: password
        };

        var success = function(res) {
            console.log('into success2');
            return res;
            
        };

        var error = function(res) {
            console.log('into error2');
            return res;
        };

        return that.get('/login', data).then(success, error);
    }

});

export default LoginModel;