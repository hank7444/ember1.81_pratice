define("appkit/serializers/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var RESTSerializer = DS.RESTSerializer.extend({


        normalize: function(type, hash, property) {
            // property will be "post" for the post and "comments" for the
            // comments (the name in the payload)
            // normalize the `_id`
            var json = {
                id: hash._id
            };
            delete hash._id;

            // normalize the underscored properties
            for (var prop in hash) {
                json[prop.camelize()] = hash[prop];
            }
            // delegate to any type-specific normalizations
            return this._super(type, json, property);
        }

    });
    __exports__["default"] = RESTSerializer;
  });