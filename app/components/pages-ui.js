var PagesUIComponent = Ember.Component.extend({

    currentPage: 0,
    totalPage: 0,
    pageSize: 0,
    
    actions: {
        changePage: function(page) {
            this.sendAction('action', page);
        }
    },
    
    pages: function() {
        var pages = [];
        var current = this.get('currentPage');
        var total = this.get('totalPage');
        
        if (total < 5) {
            for (var i = 1; i < total + 1; i++) {
                pages.push({num:i, class: i == current ? 'active' : ''});
            }
        }
        else {
            var bCount = current > 2 ? 2 : current - 1; //前面要補的數量
            var eCount = current < total - 1 ? 2 : total - current; //後面要補的數量
            if (bCount < 2) {
                eCount += 2 - bCount;
            }
            else if (2 - eCount > 0) {
                bCount += 2 - eCount;
            }
            
            for (var i = current - bCount; i < current + eCount + 1; i++) {
                pages.push({num:i, class: i == current ? 'active' : ''});
            }
        }
        return pages;
    }.property('currentPage', 'totalPage', 'pageSize'),
    
    hasPrev: function() {
        return this.get('currentPage') > 1 ? true : false;
    }.property('currentPage', 'totalPage', 'pageSize'),
    
    hasNext: function() {
        return this.get('currentPage') < this.get('totalPage') ? true : false;
    }.property('currentPage', 'totalPage', 'pageSize'),
    
    prevPage: function() {
        return this.get('currentPage') - 1;
    }.property('currentPage', 'totalPage', 'pageSize'),
    
    nextPage: function() {
        return this.get('currentPage') + 1;
    }.property('currentPage', 'totalPage', 'pageSize')
})


export default PagesUIComponent;