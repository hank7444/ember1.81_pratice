define("appkit/views/login", 
  ["appkit/views/fadeView","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fadeView = __dependency1__["default"];

    var login = fadeView.extend({

        didInsertElement: function() {

        	this._super();

        	$('body').addClass('contrast-sea-blue login contrast-background');
        },
      
    });

    __exports__["default"] = login;
  });