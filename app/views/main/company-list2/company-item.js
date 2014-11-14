// 如果有建view, 就要指定tagName為何, 不然會ember惠預設為div 
var companyItemView = Ember.View.extend({  
	tagName: 'tr',
	didInsertElement: function() {
	    
	},
	willDestroyElement: function() {
		
	}
});

export default companyItemView;