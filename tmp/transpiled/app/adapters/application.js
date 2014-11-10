define("appkit/adapters/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var adapter = DS.RESTAdapter.extend({
        // host: 'http://blog.speed1speed1.jit.su',
        host: 'http://127.0.0.1:3000',
        ajax: function(url, type, hash) {
            hash         = hash || {};
            hash.headers = hash.headers || {};
            return this._super(url, type, hash);
        },
        ajaxError: function(jqXHR) {

            //console.log('ajaxError:' + JSON.stringify(jqXHR));
            //console.log(jqXHR.responseText);

            var error = this._super(jqXHR);

            if (jqXHR && jqXHR.status === 401) {
              //#handle the 401 error
            }
            return error;
        },
        serializer: DS.RESTSerializer.extend({
            primaryKey: function(type){
                return '_id';
             }
        })
    });

    __exports__["default"] = adapter;
  });