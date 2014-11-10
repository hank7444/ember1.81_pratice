define("appkit/views/form-group", 
  ["exports"],
  function(__exports__) {
    "use strict";

    // 如果有錯誤訊息, 就加上.has-error, 如果沒有就拿掉

    var formGroup = Ember.View.extend({

        classNames: ['form-group'],
        classNameBindings: ['hasError:has-error'],

        hasError: function() {

            return (this.get('value')) ? true : false;

        }.property('this.value'),


        didInsertElement: function() {

        }
    });

    __exports__["default"] = formGroup;
  });