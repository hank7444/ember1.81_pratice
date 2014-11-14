import BaseModel from 'appkit/models/base';
import cookieProxy from 'appkit/utils/cookieProxy';


var CompanyModel = BaseModel.extend({

    init: function() {
        this._super();
    },
    companyId: '',
    companyName: '',
    registrationNo: '',
    permitDate: '',
    permitWord: '',
    contactPersonEmail: '',
    auditStatus: '',
    status: '',
    hasProject: '',
    hasSoftwareCerf: '',

    serialize: function() {
        //return this.getProperties(['email', 'password']);
    }
});

CompanyModel.reopenClass({

    // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
    storageKey: 'company',

    hash: {},

    find: function(id) {


        var that = this;

        var success = function(res) {
            console.log('success2');
            console.log(res);
            return CompanyModel.create(res);  
        };

        var error = function(res) {
            console.log('error2');
            return res;
        };

        return that.get('/company/' + id, null, 'json', null).then(success, error);

    },


    findByPage: function(condi) {
 
        var that = this;
        var companyDataCookie = cookieProxy.getCookie('companyData');

        var inputCondi = {
            currentPage: condi.currentPage || companyDataCookie.currentPage || 1,
            search: condi.search || companyDataCookie.search || ''
        };

        that.hash['search'] = inputCondi.search;

        return that.get('/company', inputCondi, 'json', null).then(function(res) {

            console.log('res.currentPage: ' +res.currentPage);

            that.hash['currentPage'] = +res.currentPage;
            that.hash['totalPage'] = +res.totalPage;
            that.hash['pageSize'] = +res.pageSize;

            console.log(res);


            cookieProxy.setCookie('companyData', that.hash);


            var data = Em.A();

            res.company.forEach(function(child) {
                data.pushObject(CompanyModel.create(child));
            });

            that.setter(data, 'companyId');
        
            return data;  

        }, function(data) {

            console.log('error3!!!!');
            return data;
        });
    },

    insert: function(data) {

        console.log('新增一筆營業人');

        var that = this;

        var success = function(res) {

            console.log('新增成功');

            data.companyId = res.companyId;

            return data;
        };

        var error = function(res) {

        };

        return that.post('/company', data, 'text').then(success, error);
    },

    update: function(data) {

        console.log('更新一筆營業人');

        var that = this;

        var success = function(res) {

            console.log('更新成功');

            data.companyId = res.companyId;

            return data;
        };

        var error = function(res) {

        };

        return that.put('/company/' + data.companyId, data, 'text').then(success, error);
    },

    delete: function(data) {

        console.log('刪除一筆營業人');

        console.log(data.companyId);


        var that = this;

        var success = function(res) {
            console.log('刪除成功');
            return true;
        };

        var error = function(res) {
            console.log('刪除失敗');
            return false;
        };

        // TODO: api-stub用delete會有問題, 所以先用get假裝一下
        return that.get('/company', data.companyId, 'text').then(success, error);
    }

});

export default CompanyModel;