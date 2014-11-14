define("appkit/controllers/main/company-list2", 
  ["appkit/models/company","appkit/utils/routeProxy","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var CompanyModel = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];
    var cookieProxy = __dependency3__["default"];

    var CompanyList2Controller = Ember.ArrayController.extend({

        pageData: function() {

            return {
                currentPage: CompanyModel.hash['currentPage'],
                totalPage: CompanyModel.hash['totalPage'],
                pageSize: CompanyModel.hash['pageSize']
            };

        }.property('this.model'),

        actions: {

            // 點擊頁碼時
            changePage: function(page) {
                this.transitionToRoute('main.companyList2', page);
            },
        }
    });
    __exports__["default"] = CompanyList2Controller;
  });