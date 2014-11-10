define("appkit/components/pages-map", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var PagesMapComponent = Ember.Component.extend({
        
        tagName: 'ul',
    
        defaultClassName: 'nav nav-stacked',
    
        classNameBindings: ['defaultClassName'],
    
    
    
        data: function() {
    
            console.log('%%%%%%%%%%%%%%trigger data!!!!!!');
    
            var data = this.get('pagemap');
    
            data = this.setIsOpenClass(data);
    
            return data;
    
        }.property('this.pagemap'),
    
        setIsOpenClass: function(pagemapAry) {
    
            var that = this;
    
            if ($.isArray(pagemapAry)) {
    
                pagemapAry.forEach(function(item) {
                    item.isOpen  = item.isOpen ? 'in' : '';
                    that.setIsOpenClass(item);
                });
            }
    
            return pagemapAry;
        },
    
        click : function(event) {
            this.send('clickDropdown', event);
        },
    
        didInsertElement: function() {
    
            //var pagemap = this.get('pagemap') || [];
    
            //this.set('pagemap', pagemap);
    
    
            $('a.dropdown-collapse.in').siblings('.nav.nav-stacked').addClass('in');
        },
        
        actions: {
    
            clickDropdown: function(event) {
    
                var link = null;
                var list = null;
    
                link = $(event.target);
    
                if (link[0].tagName == 'A') {
                    list = link.parent().find("> ul");
                }
                else {
                    list = link.closest('li').find('> ul');
                }
    
                if ($(list).hasClass('nav nav-stacked')) {
     
                    // 判斷點擊的元素, 如果是dropdown-collapse底下的元素就設為dropdown-collapse
                    if (!$(link).hasClass('dropdown-collapse')) {
                        link = $(link).closest('a');
                    }
    
                    var body = $('body');
    
                    if (list.hasClass('in')) { // 關閉
    
                        if (body.hasClass('main-nav-closed') && link.parents('li').length === 1) {
                            return false;
                        } 
                        else {
    
                            $(link).removeClass('in');
    
                            list.slideUp(300, function() {
                                 $(this).removeClass('in');
                            });
                        }
                    } 
                    else { // 打開
    
                        $(link).addClass('in');
    
                        list.slideDown(300, function() {
                             $(this).addClass('in');
                        });
                    }
                }
            }
        }
    });
    
    __exports__["default"] = PagesMapComponent;
  });