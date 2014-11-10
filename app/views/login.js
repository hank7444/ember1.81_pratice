import fadeView from 'appkit/views/fadeView';

var login = fadeView.extend({

    didInsertElement: function() {

    	this._super();

    	$('body').addClass('contrast-sea-blue login contrast-background');
    },
  
});

export default login;