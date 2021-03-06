define("appkit/controllers/main/company-list2/company-item", 
  ["appkit/models/company","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var CompanyModel = __dependency1__["default"];

    var CompanyItemController = Ember.ObjectController.extend({

        item: function() {

            var data = this.get('model');

            data['hasSoftwareCerfMsg'] = data.hasSoftwareCerf == 'Y' ? '已上傳' : '尚未上傳';
            data['hasSoftwareCerfLabelClass'] = data.hasSoftwareCerf == 'Y' ? 'badge-success' : 'badge-important';

            data['statusMsg'] = data.status == 'Y' ? '啟用' : '停用';
            data['statusLabelClass'] = data.status == 'Y' ? 'badge-success' : 'badge-important';
            data['auditStatusMsg'] = data.auditStatus == 'pass' ? '審核通過' : '審核中';
            data['auditStatusLabelClass'] = data.auditStatus == 'pass' ? 'badge-success' : 'badge-important';
            
            data['isDelete'] = false;

            if (data['status'] == 'N' && data['hasProject'] == 'N') {
                data['isDelete'] = true;
            }

            data['currentPage'] = CompanyModel.hash['currentPage'];
            return data;

        }.property('this.model'),

    });
    __exports__["default"] = CompanyItemController;
  });