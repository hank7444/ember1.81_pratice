define("appkit/views/main/company-list", 
  ["appkit/views/container","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var containerView = __dependency1__["default"];

    var companyListView = containerView.extend({
        didInsertElement: function() {
    	    this._super(this);
    	},
    	willDestroyElement: function() {
    		this._super(this);
    	}
    });

    __exports__["default"] = companyListView;
  });