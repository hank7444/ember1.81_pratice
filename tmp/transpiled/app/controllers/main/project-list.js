define("appkit/controllers/main/project-list", 
  ["appkit/models/project","appkit/utils/routeProxy","appkit/utils/cookieProxy","appkit/utils/globalObjFunc","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var ProjectModel = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];
    var cookieProxy = __dependency3__["default"];
    var globalObjFunc = __dependency4__["default"];

    var ProjectListController = Ember.ArrayController.extend({

        search: function() {

            return ProjectModel.hash['search'];

        }.property(),


        tableData: function() {

            var data = this.get('model');

            data.forEach(function(item) {

                item['statusMsg'] = item.status == 'Y' ? '啟用' : '停用';
                item['statusLabelClass'] = item.status == 'Y' ? 'badge-success' : 'badge-important';
                item['consoleStatusMsg'] = item.consoleStatus == 'enable' ? '開啟' : item.consoleStatus == 'disable' ? '關閉' : '刪除';
                item['consoleStatusLabelClass'] = item.consoleStatus == 'enable' ? 'badge-success' : item.consoleStatus == 'disable' ? 'badge-warning' : 'badge-important';
                item['editBtnMsg'] = item['companyId'] == -1 ? '設定營業人' : '編輯';
       
            });
            return data;

        }.property('this.model'),

        pageData: function() {

            return {
                currentPage: ProjectModel.hash['currentPage'],
                totalPage: ProjectModel.hash['totalPage'],
                pageSize: ProjectModel.hash['pageSize']
            };

        }.property('this.model'),

        projectData: function() {

            var data = ProjectModel.create();
            data.status = 'N';

            return data;

        }.property(),

        statisticListData: function() {

            var companyStatusCount = ProjectModel.hash['companyStatusCount'];
            var searchCompanyStatus = ProjectModel.hash['searchCompanyStatus'];
            var options = {
                titleIcon: 'icon-group',
                titleIconType: '',
                title:  '已設定專案營業人統計',
                titleType: '',
                width: 4,
                canClick:  true,
                hoverColor: '#00ACEC',
                selectedColor: '#F5F5F5',
                listData: [
                    {
                        icon: 'icon-home',
                        iconType: '',
                        title: companyStatusCount.all,
                        titleType: '',
                        content: '全部',
                        value: 'all',
                    },
                    {
                        icon: 'icon-ok',
                        iconType: 'primary',
                        title: companyStatusCount.hasCompany,
                        titleType: 'primary',
                        content: '已設定',
                        value: '1',
                    },
                    {
                        icon: 'icon-warning-sign',
                        iconType: 'warning',
                        title: companyStatusCount.noCompany,
                        titleType: 'warning',
                        content: '尚未設定',
                        value: '0',
                    }
                ]
            };

            return options;   

        }.property(),

        statisticListSelectedItem: function() {

            var searchCompanyStatus = ProjectModel.hash['searchCompanyStatus'] || 'all';

            return searchCompanyStatus;

        }.property(),

        editSelectData: function() {

            var globalObj = globalObjFunc();

            var data = {
                projectCompanyData: globalObj.projectCompanyAry,
            };

            return data;

        }.property(),

        projectValidateData: function() {

            return {

                // 欲使用自定的驗證方法
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
                        'companyId': {
                            required: true,
                        }
                    },
                    messages: {
                        'companyId': {
                            required: '必填',
                        }
                    },
                }
            };

        }.property(),



        // 設定跳窗按鈕
        editProjectModalButtons: [
            Ember.Object.create({
                title: '儲存',
                clicked: 'saveConfirmModalForProject'
            }),
            Ember.Object.create({
                title: '取消',
                clicked: 'cancelConfirmModalForProject'
            })
        ],


        actions: {


            // 開啟編輯頁面
            editProject: function(id) {

                var that = this;

                var success = function(res) {

                    that.set('canSelectCompany', true);

                    if (res.companyId == '-1') {
                        that.set('canSelectCompany', false);
                    }

                    that.set('projectData', res);
                    that.set('editProjectModalTitle', '專案營業人設定');
                    Bootstrap.ModalManager.show('editProjectModal');
                };

                var error = function(res) {

                };

                ProjectModel.find(id).then(success, error);
            },



            // 清除表單valid的樣式
            clearCompanyValidStatus: function() {
                this.set('projectErrorMsg', false); // 清除alert
                $(this.get('projectValidateData.form')).validate().resetForm(); // 清除上次驗證錯誤資訊
                $('.form-group').removeClass('has-error'); // 清除欄位紅框樣式
            },


            // 是否要儲存確認視窗設定
            saveConfirmModalForProject: function() {


                if (!$(this.get('projectValidateData.form')).valid()) {
                    this.set('projectErrorMsg', true);
                    return false;
                }

                // 清除validate相關樣式
                this.send('clearCompanyValidStatus');

                var data = this.get('projectData');
                var editSelectData = this.get('editSelectData');
                var companyHash = {};

                // 建立companyHash
                editSelectData.projectCompanyData.forEach(function(item) {
                    companyHash[item['companyId']] = item['companyName'];
                });
                this.set('companyHash', companyHash);



                this.set('confirmMessage', '確定要儲存嗎?');

                if (!this.get('canSelectCompany')) {
                    this.set('confirmMessage', '確定要設定 ' + data.projectName + ' 所屬營業人為 ' + companyHash[data.companyId] + ' 嗎?\n(設定後不可變更)');
                }

                this.set('confirmModalButton', [
                    Ember.Object.create({
                        title: '確定',
                        clicked: 'submitEditProjectModal'
                    }),
                    Ember.Object.create({
                        title: '取消',
                        clicked: 'reopenEditConfirmModal'
                    })
                ]);

                Bootstrap.ModalManager.show('confirmModal');
                Bootstrap.ModalManager.hide('editProjectModal');
            },
            // 是否要取消儲存的確認視窗設定
            cancelConfirmModalForProject: function() {

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
                Bootstrap.ModalManager.hide('editProjectModal');
            },

                    // 將表單內容送出
            submitEditProjectModal: function() {

                // 清除validate相關樣式
                this.send('clearCompanyValidStatus');

                Bootstrap.ModalManager.hide('confirmModal');

                var that = this;
                var data = this.get('projectData');
      
                var success = function(res) {

                    console.log('上傳成功, 到controller了!')

                    // 畫面reload
                    that.transitionToRoute('main.projectList', ProjectModel.hash['currentPage']);

                    // 顯示grow notifications
                    routeProxy.send('showGrowlNotifications', 'SUCCESS!', '專案營業人設定成功', 'success');
                };

                var error = function(res) {
                    routeProxy.send('showGrowlNotifications', 'WARN!', '專案營業人設定發生錯誤, 請再試一次', 'warning');
                };


                delete data.projectName;
                delete data.ownerAccount;
                delete data.companyName;
                delete data.consoleStatus;
                
                ProjectModel.update(data).then(success, error);
                
            },

            // 關閉modal
            cancelEditConfirmModal: function() {

                 // 清除validate相關樣式
                //this.send('clearCompanyValidStatus');

                Bootstrap.ModalManager.hide('confirmModal');
                Bootstrap.ModalManager.hide('editProjectModal');
            },

            // 重新顯示Modal
            reopenEditConfirmModal: function() {
                Bootstrap.ModalManager.hide('confirmModal');
                Bootstrap.ModalManager.show('editProjectModal');
            },

            // 點擊頁碼時
            changePage: function(page) {
                this.transitionToRoute('main.projectList', page);
            },

            // 根據搜尋條件拿取資料
            search: function(searchCompanyStatus) {


                console.log('controller search trigger!');
                var projectDataCookie = cookieProxy.getCookie('projectData');


                projectDataCookie.search = this.get('search');

                if (searchCompanyStatus) {
                    projectDataCookie.searchCompanyStatus = searchCompanyStatus;
                }

                cookieProxy.setCookie('projectData', projectDataCookie);
                this.transitionToRoute('main.projectList', 1);

            },

            // 清除所有搜尋條件
            clear: function() {

                // ember很奇怪, 如果頁碼是''的話, 會帶入原本的頁碼並清除url上的頁碼
                this.transitionToRoute('main.projectList', ' ');
            }
         
        }

    });

    __exports__["default"] = ProjectListController;
  });