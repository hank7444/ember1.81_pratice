define("appkit/components/header-togglebtn", 
  ["exports"],
  function(__exports__) {
    "use strict";
    
    
    
    
    var HeaderTogglebtnComponent = Ember.Component.extend({
        tagName: 'a',
    
        defaultClassName: 'toggle-nav btn pull-left',
    
        classNameBindings: ['defaultClassName'],
    
        attributeBindings: ['href'],
    
        href: "#",
    
        checkOpen: function(){
            return $("body").hasClass("main-nav-opened") || $("#main-nav").width() > 50;
        }.property('navOpen'),
    
        click: function(e) {
                
            var body = $("body");
            if(this.get('checkOpen')){
                body.removeClass("main-nav-opened").addClass("main-nav-closed");
                this.set('navOpen', false);
            } else {
                body.addClass("main-nav-opened").removeClass("main-nav-closed");
                this.set('navOpen', true);
            }
    
            //e.stopPropagation();
            return false;
        }
    });
    
    __exports__["default"] = HeaderTogglebtnComponent;
  });