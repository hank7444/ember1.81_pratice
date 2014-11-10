import BaseModel from 'appkit/models/base';
import cookieProxy from 'appkit/utils/cookieProxy';
import globalObjFunc from 'appkit/utils/globalObjFunc';


var InvoiceIntervalModel = BaseModel.extend({

    init: function() {
        this._super();
    },
    invoiceIntervalId: '',
    companyId: '',
    companyName: '',
    startYear: '',
    startMonth: '',
    alphabet: '',
    startInvoiceNo: '',
    endInvoiceNo: '',
    currentNo: '',
    invoiceType: '',

    // Tells the resistance layer what properties to save to localStorage
    // Ember Data does this for you.
    serialize: function() {
        //return this.getProperties(['email', 'password']);
    }
});

InvoiceIntervalModel.reopenClass({

    // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
    storageKey: 'invoiceInterval',

    hash: {},

    find: function(id) {

        var that = this;


        return that.get('/invoiceInterval/' + id, null, null, null).then(function(res) {

            return InvoiceIntervalModel.create(res);  

        });

    },


    findByPage: function(condi) {

        var globalObj = globalObjFunc();

        var that = this;
        var invoiceIntervalDataCookie = cookieProxy.getCookie('invoiceIntervalData');

        var inputCondi = {
            currentPage: condi.currentPage || invoiceIntervalDataCookie.currentPage || 1,
            searchCompanyId: condi.searchCompanyId || invoiceIntervalDataCookie.searchCompanyId || 'all',
            searchYear: condi.searchYear || invoiceIntervalDataCookie.searchYear || globalObj.thisYear,
            searchMonth: condi.searchMonth || invoiceIntervalDataCookie.searchMonth || 'all',
            searchInvoiceType: condi.searchInvoiceType || invoiceIntervalDataCookie.searchInvoiceType || 'all',
            search: condi.search || invoiceIntervalDataCookie.search || ''
        };

        //that.hash['memberId'] = defaultCondi.memberId;
        that.hash['searchCompanyId'] = inputCondi.searchCompanyId;
        that.hash['searchYear'] = inputCondi.searchYear;
        that.hash['searchMonth'] = inputCondi.searchMonth;
        that.hash['searchInvoiceType'] = inputCondi.searchInvoiceType;
        that.hash['search'] = inputCondi.search;

        console.log('show hash');
        console.log(that.hash);


        return that.get('/invoiceInterval', inputCondi, null, null).then(function(res) {

            console.log('res.currentPage: ' +res.currentPage);

            that.hash['currentPage'] = +res.currentPage;
            that.hash['totalPage'] = +res.totalPage;
            that.hash['pageSize'] = +res.pageSize;


            cookieProxy.setCookie('invoiceIntervalData', that.hash);


            var data = Em.A();

            res.invoiceInterval.forEach(function(child) {
                data.pushObject(InvoiceIntervalModel.create(child));
            });

            that.setter(data, 'invoiceIntervalId');
        
            return data;  

        });
    },

    insert: function(data) {

        console.log('新增一筆發票字軌');

        var that = this;

        var success = function(res) {

            console.log('新增成功');

            data.invoiceIntervalId = res.invoiceIntervalId;

            return data;
        };

        var error = function(res) {

        };

        return that.post('/invoiceInterval', data).then(success, error);
    }


});




export default InvoiceIntervalModel;