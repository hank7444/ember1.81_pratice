define("appkit/models/project-company", 
  ["appkit/models/base","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];


    var ProjectCompanyModel = BaseModel.extend({

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

    ProjectCompanyModel.reopenClass({

        // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
        storageKey: 'projectCompany',

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


            var success = function(res) {

                res.company.forEach(function(child) {

                    // 只要是Id類一律轉成字串, 不然select對'1' 跟 1會當做不同的數值, 導致valueBinding失敗
                    child.companyId = child.companyId.toString();
                    

                    data.pushObject(ProjectCompanyModel.create(child));
                });

                that.setter(data, 'comapnyId');
            };

            var error = function(res) {

            };

            this.get('/projectCompany', null, null, null).then(success, error);

            return  data;
        }
    });

    __exports__["default"] = ProjectCompanyModel;
  });