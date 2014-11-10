import BaseModel from 'appkit/models/base';
import cookieProxy from 'appkit/utils/cookieProxy';


var ProjectModel = BaseModel.extend({

    init: function() {
        this._super();
    },
    projectId: '',
    projectName: '',
    ownerAccount: '',
    companyId: '',
    companyName: '',
    consoleStatus: '',
    status: '',

    serialize: function() {
        //return this.getProperties(['email', 'password']);
    }
});


ProjectModel.reopenClass({

    // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
    storageKey: 'project',

    hash: {},

    find: function(id) {

        var that = this;

        return that.get('/project/' + id, null, null, null).then(function(res) {

            res.projectId = res.projectId.toString();
            res.companyId = res.companyId.toString();

            return ProjectModel.create(res);  

        });
    },
    findByPage: function(condi) {
 
        var that = this;
        var projectDataCookie = cookieProxy.getCookie('projectData');

        var inputCondi = {
            currentPage: condi.currentPage || projectDataCookie.currentPage || 1,
            search: condi.search || projectDataCookie.search || '',
            searchCompanyStatus: condi.searchCompanyStatus || projectDataCookie.searchCompanyStatus || 'all'
        };

        that.hash['search'] = inputCondi.search;
        that.hash['searchCompanyStatus'] = inputCondi.searchCompanyStatus;


        console.log(inputCondi);

        return that.get('/project', inputCondi, 'json', null).then(function(res) {

            console.log('res.currentPage: ' +res.currentPage);

            that.hash['currentPage'] = +res.currentPage;
            that.hash['totalPage'] = +res.totalPage;
            that.hash['pageSize'] = +res.pageSize;


            cookieProxy.setCookie('projectData', that.hash);

            var data = Em.A();

            res.project.forEach(function(child) {

                child.projectId = child.projectId.toString();
                child.companyId = child.companyId.toString();

                data.pushObject(ProjectModel.create(child));
            });


            // 儲存數量清單用數據
            that.hash['companyStatusCount'] = res.companyStatusCount;

            console.log(that.hash['companyStatusCount']);

            that.setter(data, 'projectId');
        
            return data;  

        });
    },
    /*
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
    */

    update: function(data) {

        console.log('更新一筆專案營業人設定');

        var that = this;

        var success = function(res) {

            console.log('更新成功');

            data.projectId = res.projectId;

            return data;
        };

        var error = function(res) {

        };

        return that.put('/project/' + data.projectId, data, 'text').then(success, error);
    },
    /*
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
    */

});

export default ProjectModel;