var fadeView = Ember.View.extend({

    didInsertElement: function() {
    	this.$().hide().fadeIn(200);
    }
});

export default fadeView;