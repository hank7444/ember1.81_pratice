import CompanyModel from 'appkit/models/company';
import routeProxy from 'appkit/utils/routeProxy';
import cookieProxy from 'appkit/utils/cookieProxy';

var companyDetail2Controller = Ember.ObjectController.extend({


    actions: {

        // 新增資料
        back: function() {

            //window.history.back();
            this.transitionToRoute('main.companyList2', ' ');
        }

    }


});

export default companyDetail2Controller;