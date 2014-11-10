import containerView from 'appkit/views/container';

var companyDetailView = containerView.extend({
    didInsertElement: function() {
	    this._super(this);
	},
	willDestroyElement: function() {
		this._super(this);
	}
});

export default companyDetailView;