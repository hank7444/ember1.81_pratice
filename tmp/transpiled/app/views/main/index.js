define("appkit/views/main/index", 
  ["appkit/views/fadeView","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fadeView = __dependency1__["default"];


    var index = fadeView.extend({

        didInsertElement: function() {
            this._super();
        }
    });

    __exports__["default"] = index;
  });