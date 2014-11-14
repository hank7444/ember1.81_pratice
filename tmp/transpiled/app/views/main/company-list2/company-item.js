define("appkit/views/main/company-list2/company-item", 
  ["exports"],
  function(__exports__) {
    "use strict";
    // 如果有建view, 就要指定tagName為何, 不然會ember惠預設為div 
    var companyItemView = Ember.View.extend({  
    	tagName: 'tr',
    	didInsertElement: function() {
    	    
    	},
    	willDestroyElement: function() {
    		
    	}
    });

    __exports__["default"] = companyItemView;
  });