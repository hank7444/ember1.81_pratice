define("appkit/views/main/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /*
    import fadeView from 'appkit/views/fadeView';


    var index = fadeView.extend({

        didInsertElement: function() {
            this._super();
        }
    });

    export default index;*/



    // 如果有建view, 就要指定tagName為何, 不然會ember惠預設為div 
    var index = Ember.View.extend({  
    	didInsertElement: function() {
    	    
    	},
    	willDestroyElement: function() {
    		
    	}
    });

    __exports__["default"] = index;
  });