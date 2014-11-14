import CompanyModel from 'appkit/models/company';
import routeProxy from 'appkit/utils/routeProxy';
import cookieProxy from 'appkit/utils/cookieProxy';

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
export default CompanyList2Controller;