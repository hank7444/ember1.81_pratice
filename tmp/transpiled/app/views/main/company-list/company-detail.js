define("appkit/views/main/company-list/company-detail", 
  ["appkit/views/container","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var containerView = __dependency1__["default"];

    var companyDetailView = containerView.extend({
        didInsertElement: function() {
    	    this._super(this);
    	},
    	willDestroyElement: function() {
    		this._super(this);
    	}
    });

    __exports__["default"] = companyDetailView;
  });