import containerView from 'appkit/views/container';


var projectListView = containerView.extend({

    didInsertElement: function() {
        this._super(this);
    },
    willDestroyElement: function() {
        this._super(this);
    },
    click: function(event) {


        var target = $(event.target);
        var companyStatusCounter = null;


        if (!target.hasClass('box-content-f2e')) {
             companyStatusCounter = target.closest('.box-content-f2e');
        }
        else if (target.hasClass('box-content-f2e')) {
            companyStatusCounter = target;
        }

        if (companyStatusCounter.length > 0) {
            $('.box-content-f2e').removeClass('active');
            companyStatusCounter.addClass('active');
        }

    }
});

// export 這邊如果跟上面var 定義的不同, 就會沒畫面但是也沒跳出錯誤..
export default projectListView;