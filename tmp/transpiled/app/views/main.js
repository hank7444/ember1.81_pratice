define("appkit/views/main", 
  ["appkit/views/fadeView","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fadeView = __dependency1__["default"];

    var main = fadeView.extend({

        didInsertElement: function() {

        	this._super();

        	var body = $('body');

    		if (body.hasClass('contrast-background')) {
    			body.removeClass('login contrast-background');
    		}
    		body.addClass('contrast-sea-blue');

        },
    });

    __exports__["default"] = main;
  });