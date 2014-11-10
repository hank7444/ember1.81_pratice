import fadeView from 'appkit/views/fadeView';

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

export default main;