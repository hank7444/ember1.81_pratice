define("appkit/views/container", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var pushViews = [];
    var fadeInTime = 200;
    var fadeOutTime = 200;
    var nowView = null;
    var lastView = null;



    // 過濾掉狀態為destroying的view
    var filterDestroying = function(viewsAry) {

    	viewsAry.forEach(function(value, key) {
    		
    		if (value._state == 'destroying') {
    			console.log('&&&&&: ' + key);
    			viewsAry.splice(key, 1);
    		}
    	});
    	return viewsAry;
    };


    var ContainerView = Ember.View.extend({

    	didInsertElement: function(e) {

    		nowView = null;
    		lastView = null;

    		console.log('didInsertElement');

    		pushViews.push(e);
    		pushViews = filterDestroying(pushViews);

    		pushViews.forEach(function(value, key) {

    			if (e.elementId == value.elementId) {

    				nowView = value;

    				if (key != 0) {
    					lastView = pushViews[key - 1];
    				}
    			}
    			value.$().hide();
    		});

    		if (lastView) {

    			Ember.run(function() {
    				lastView.$().show().fadeOut(fadeOutTime, function() {
    					Ember.run(function() {

    						lastView.get('controller').set('show', true);
    						lastView.$().show();
    			
    						nowView.$().hide().fadeIn(fadeInTime);
    						nowView.get('controller').set('show', false);
    						
    					});
    				});
    			});
    		}
    		else {
    			Ember.run(function() {
    				nowView.$().hide().fadeIn(fadeInTime);
    				nowView.get('controller').set('show', false);
    			});
    		}
    	},
    	willDestroyElement: function(e) {

    		console.log('willDestroyElement');

    		pushViews.forEach(function(value, key) {

    			if (e.elementId == value.elementId) {

    				Ember.run(function() {
    					pushViews.pop();

    					if (pushViews[key - 1]) {
    						pushViews[key - 1].get('controller').set('show', false);
    						pushViews[key - 1].$().hide().fadeIn(fadeInTime);
    					}

    				});
    			}
    		});
    	}
    });
    __exports__["default"] = ContainerView;
  });