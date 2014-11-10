import containerView from 'appkit/views/container';

var companyListView = containerView.extend({
    didInsertElement: function() {
	    this._super(this);
	},
	willDestroyElement: function() {
		this._super(this);
	}
});

export default companyListView;