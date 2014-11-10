define("appkit/components/header-usermenu", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var HeaderUsermenuComponent = Ember.Component.extend({
        tagName: 'li',
    
        defaultClassName: 'dropdown dark user-menu',
    
        //isOpen: false,
    
        classNameBindings:['defaultClassName', 'isOpen:open'],
    
        click: function(e) {
    
            if (e.target.id) {
                this.sendAction('action', e.target.id);
            }
        }
    });
    
    __exports__["default"] = HeaderUsermenuComponent;
  });