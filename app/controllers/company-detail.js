import CompanyModel from 'appkit/models/company';
import routeProxy from 'appkit/utils/routeProxy';
import cookieProxy from 'appkit/utils/cookieProxy';

var companyDetailController = Ember.ObjectController.extend({


    actions: {

        // 新增資料
        back: function() {

            //window.history.back();
            this.transitionToRoute('companyList', ' ');
        }

    }


});

export default companyDetailController;