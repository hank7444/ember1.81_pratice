import BaseModel from 'appkit/models/base';
import cookieProxy from 'appkit/utils/cookieProxy';


var MemberCompanyModel = BaseModel.extend({

    init: function() {
        this._super();
    },
    companyId: '',
    companyName: '',

    // Tells the resistance layer what properties to save to localStorage
    // Ember Data does this for you.
    serialize: function() {
        //return this.getProperties(['email', 'password']);
    }
});

MemberCompanyModel.reopenClass({

    // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
    storageKey: 'memberCompany',

    hash: {},
    
    findAll: function(type) {

        console.log('findAll');

        var data = [];

        if (type == 'search') {

            data.push({
                companyId: 'all',
                companyName: '全部'
            });
        }


        var memberId = cookieProxy.getCookie('memberId');

        var success = function(res) {

            res.company.forEach(function(child) {
                data.pushObject(MemberCompanyModel.create(child));
            });

            that.setter(data, 'comapnyId');
        };

        var error = function(res) {

        };

        this.get('/memberCompany/' + memberId, null, null, null).then(success, error);

        return  data;
    }
});

export default MemberCompanyModel;