import CompanyModel from 'appkit/models/company';
import routeProxy from 'appkit/utils/routeProxy';
import cookieProxy from 'appkit/utils/cookieProxy';

var CompanyListController = Ember.ArrayController.extend({

    search: function() {

        return CompanyModel.hash['search'];

    }.property(),


    tableData: function() {

        var data = this.get('model');

        data.forEach(function(item) {

            item['hasSoftwareCerfMsg'] = item.hasSoftwareCerf == 'Y' ? '已上傳' : '尚未上傳';
            item['hasSoftwareCerfLabelClass'] = item.hasSoftwareCerf == 'Y' ? 'badge-success' : 'badge-important';

            item['statusMsg'] = item.status == 'Y' ? '啟用' : '停用';
            item['statusLabelClass'] = item.status == 'Y' ? 'badge-success' : 'badge-important';
            item['auditStatusMsg'] = item.auditStatus == 'pass' ? '審核通過' : '審核中';
            item['auditStatusLabelClass'] = item.auditStatus == 'pass' ? 'badge-success' : 'badge-important';
            
            item['isDelete'] = false;

            if (item['status'] == 'N' && item['hasProject'] == 'N') {
                item['isDelete'] = true;
            }
             
        });
        return data;

    }.property('this.model'),


    pageData: function() {

        return {
            currentPage: CompanyModel.hash['currentPage'],
            totalPage: CompanyModel.hash['totalPage'],
            pageSize: CompanyModel.hash['pageSize']
        };

    }.property('this.model'),


    companyValidateData: function() {

        return {

            // 欲使用自定的驗證方法
            addMethods: {

                alphabet: {
                    method: function(value, element) {
                        return this.optional(element) || /^[A-Z]+$/.test(value);
                    },
                    msg: '只能包括大寫英文字母'
                }
            },
            options: {

                success: 'valid',
                errorElement: 'p',
                errorClass: 'has-error',
                validClass: '',
                errorPlacement: function(error, element) {

                    var helpBlock = $(element).siblings('.help-block');

                    if (helpBlock.length == 0) {
                        helpBlock = $(element.parent()).siblings('.help-block');
                    }
                
                    error.appendTo(helpBlock);
                    
                },
                highlight: function(element, errorClass, validClass) {

                    $(element).parents('.form-group').addClass(errorClass);
                    
                },
                unhighlight: function(element, errorClass, validClass) {

                    $(element).parents('.form-group').removeClass(errorClass);
                    
                },
                rules: {
                    'companyName': {
                        required: true,
                        maxlength: 30,
                        minlength: 2
                    },
                    'registrationNo': {
                        required: true,
                        digits: true,
                        maxlength: 9,
                        minlength: 9
                    },
                    'permitWord': {
                        required: true,
                        maxlength: 50,
                        minlength: 10
                    },
                    'contactPersonEmail': {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    'companyName': {
                        required: '必填',
                        maxlength: '最多30個字',
                        minlength: '最少2個字'
                    },
                    'registrationNo': {
                        required: '必填',
                        digits: '必須為0~9整數',
                        maxlength: '必須為9位數字',
                        minlength: '必須為9位數字'
                    },
                    'permitWord': {
                        required: '必填',
                        maxlength: '最多50個字',
                        minlength: '最少10個字'
                    },
                    'contactPersonEmail': {
                        required: '必填',
                        email: 'email格式錯誤'
                    }
                },
            }
        };

    }.property(),


    // 設定跳窗按鈕
    editCompanyModalButtons: [
        Ember.Object.create({
            title: '儲存',
            clicked: 'saveConfirmModalForCompany'
        }),
        Ember.Object.create({
            title: '取消',
            clicked: 'cancelConfirmModalForCompany'
        })
    ],
    // 空資料並設定初始值
    companyData: function() {

        var data = CompanyModel.create();
        data.auditStatus = 'auditing';
        data.status = 'N';

        return data;

    }.property(),

    actions: {

        // 新增資料
        newCompany: function() {

            var data = CompanyModel.create();
            data.auditStatus = 'auditing';
            data.status = 'N';

            this.set('statusDisabled', true);
            this.set('companyData', data);
            this.set('editCompanyModalTitle', '新增營業人');
            Bootstrap.ModalManager.show('editCompanyModal');
        },

        // 編輯資料
        editCompany: function(id) {

            var that = this;

            var success = function(res) {
                that.set('companyData', res);
                that.set('editCompanyModalTitle', '編輯字軌');
                Bootstrap.ModalManager.show('editCompanyModal');
            };

            var error = function(res) {

            };

            CompanyModel.find(id).then(success, error);
            
        },

        // 上傳檔案
        upload: function(file) {

            var data = this.get('companyData');
            data.softwareCerf = file;
            this.set('companyData', data);
        },

        // 上傳檔案錯誤callback 
        uploadError: function(msg) {

            //alert(msg);
            routeProxy.send('showGrowlNotifications', '檔案上傳發生錯誤!', msg, 'danger');
        },


        // 清除表單valid的樣式
        clearCompanyValidStatus: function() {
            this.set('companyErrorMsg', false); // 清除alert
            $(this.get('companyValidateData.form')).validate().resetForm(); // 清除上次驗證錯誤資訊
            $('.form-group').removeClass('has-error'); // 清除欄位紅框樣式
        },

        // 是否要儲存確認視窗設定
        saveConfirmModalForCompany: function() {


            if (!$(this.get('companyValidateData.form')).valid()) {
                this.set('companyErrorMsg', true);
                return false;
            }

            // 清除validate相關樣式
            this.send('clearCompanyValidStatus');

            this.set('confirmMessage', '確認要儲存嗎?');
            this.set('confirmModalButton', [
                Ember.Object.create({
                    title: '確定',
                    clicked: 'submitEditCompanyModal'
                }),
                Ember.Object.create({
                    title: '取消',
                    clicked: 'reopenEditConfirmModal'
                })
            ]);

            Bootstrap.ModalManager.show('confirmModal');
            Bootstrap.ModalManager.hide('editCompanyModal');
        },
        // 是否要取消儲存的確認視窗設定
        cancelConfirmModalForCompany: function() {

            this.set('confirmMessage', '確認要取消儲存嗎?');
            this.set('confirmModalButton', [
                Ember.Object.create({
                    title: '確定',
                    clicked: 'cancelEditConfirmModal'
                }),
                Ember.Object.create({
                    title: '取消',
                    clicked: 'reopenEditConfirmModal'
                })
            ]);

            Bootstrap.ModalManager.show('confirmModal');
            Bootstrap.ModalManager.hide('editCompanyModal');
        },


        // 將表單內容送出
        submitEditCompanyModal: function() {

            // 清除validate相關樣式
            this.send('clearCompanyValidStatus');

            Bootstrap.ModalManager.hide('confirmModal');

            var that = this;
            var data = this.get('companyData');
            var actionMsg = '';

            var success = function(res) {

                console.log('上傳成功, 到controller了!')

                // 畫面reload
                that.transitionToRoute('companyList', CompanyModel.hash['currentPage']);

                // 顯示grow notifications
                routeProxy.send('showGrowlNotifications', 'SUCCESS!', '營業人' + actionMsg +'成功', 'success');
            };

            var error = function(res) {
                routeProxy.send('showGrowlNotifications', 'WARN!', '營業人' + actionMsg + '發生錯誤, 請再試一次', 'warning');
            };

            delete data.hasProject;
            delete data.hasSoftwareCerf;

            // 將資料送到server
            if (!data.companyId) { // 新增

                actionMsg = '新增';
                CompanyModel.insert(data).then(success, error);
            }
            else { // 刪除
                actionMsg = '編輯';
                CompanyModel.update(data).then(success, error);
            }

        },
        // 關閉modal
        cancelEditConfirmModal: function() {

             // 清除validate相關樣式
            this.send('clearCompanyValidStatus');

            Bootstrap.ModalManager.hide('confirmModal');
            Bootstrap.ModalManager.hide('editCompanyModal');
        },
        // 重新顯示Modal
        reopenEditConfirmModal: function() {
            Bootstrap.ModalManager.hide('confirmModal');
            Bootstrap.ModalManager.show('editCompanyModal');
        },


        // 刪除


        // 開啟刪除確認modal
        deleteConfirmModalForCompany: function(companyId) {

            // 儲存資料
            var data = CompanyModel.create();
            data.companyId = companyId;
            this.set('companyData', data);


            this.set('confirmTitle', '刪除營業人');
            this.set('confirmMessage', '確認要刪除營業人嗎?');
            this.set('confirmModalButton', [
                Ember.Object.create({
                    title: '確定',
                    clicked: 'deleteForComapny'
                }),
                Ember.Object.create({
                    title: '取消',
                    clicked: 'closeDeleteConfirmModalForCompany'
                })
            ]);
            Bootstrap.ModalManager.show('confirmModal');
        },

        // 關閉刪除確認modal
        closeDeleteConfirmModalForCompany: function() {
            Bootstrap.ModalManager.hide('confirmModal');
        },

        // 刪除資料
        deleteForComapny: function() {

            Bootstrap.ModalManager.hide('confirmModal');

            var that = this;
            var data = this.get('companyData');

            var success = function(res) {

                // 畫面reload
                that.transitionToRoute('companyList', CompanyModel.hash['currentPage']);

                // 顯示grow notifications
                routeProxy.send('showGrowlNotifications', 'SUCCESS!', '營業人刪除成功', 'success');
            };

            var error = function(res) {
                routeProxy.send('showGrowlNotifications', 'WARN!', '營業人刪除發生錯誤, 請再試一次', 'warning');
            };

             // 將資料送到server
            CompanyModel.delete(data).then(success, error);
        },





        // 點擊頁碼時
        changePage: function(page) {
            this.transitionToRoute('companyList', page);
        },

        // 根據搜尋條件拿取資料
        search: function() {

            var searchData = {
                search: this.get('search')
            };

            cookieProxy.setCookie('companyData', searchData);
            this.transitionToRoute('companyList', 1);

        },

        // 清除所有搜尋條件
        clear: function() {

            // ember很奇怪, 如果頁碼是''的話, 會帶入原本的頁碼並清除url上的頁碼
            this.transitionToRoute('companyList', ' ');
        }
     
    }


});

export default CompanyListController;