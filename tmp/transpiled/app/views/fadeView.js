define("appkit/views/fadeView", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var fadeView = Ember.View.extend({

        didInsertElement: function() {
        	this.$().hide().fadeIn(200);
        }
    });

    __exports__["default"] = fadeView;
  });