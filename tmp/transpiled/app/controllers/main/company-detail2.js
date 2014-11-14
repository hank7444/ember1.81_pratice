define("appkit/controllers/main/company-detail2", 
  ["appkit/models/company","appkit/utils/routeProxy","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var CompanyModel = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];
    var cookieProxy = __dependency3__["default"];

    var companyDetail2Controller = Ember.ObjectController.extend({


        actions: {

            // 新增資料
            back: function() {

                //window.history.back();
                this.transitionToRoute('main.companyList2', ' ');
            }

        }


    });

    __exports__["default"] = companyDetail2Controller;
  });