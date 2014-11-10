define("appkit/controllers/company", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var CompanyController = Ember.ObjectController.extend({

      hasSoftwareCerfMsg: function() {
        return this.get('hasSoftwareCerf') == 'Y' ? '已上傳' : '尚未上傳';
      }.property(),

      hasSoftwareCerfLabelClass: function() {
      	return this.get('hasSoftwareCerf') == 'Y' ? 'badge-success' : 'badge-important';
      }.property(),

      statusMsg: function() {
      	return this.get('status') == 'Y' ? '啟用' : '停用';
      }.property(),

      statusLabelClass: function() {
      	return this.get('status') == 'Y' ? 'badge-success' : 'badge-important';
      }.property(),

      auditStatusMsg: function() {
      	return this.get('auditStatus') == 'pass' ? '審核通過' : '審核中';
      }.property(),

      auditStatusLabelClass: function() {
      	return this.get('auditStatus') == 'pass' ? 'badge-success' : 'badge-important';
      }.property(),

      isDelete: function() {

      		var isDelete = false;

      		if (this.get('status') == 'N' && this.get('hasProject') == 'N') {
            	isDelete = true;
            }
            return isDelete;
      }.property()

    });

    __exports__["default"] = CompanyController;
  });