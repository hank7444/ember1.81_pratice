define("appkit/tests/unit/routes/index_test", 
  ["appkit/routes/index"],
  function(__dependency1__) {
    "use strict";
    var Index = __dependency1__["default"];

    var route;
    module("Unit - IndexRoute", {
      setup: function(){
        var container = isolatedContainer([
          'route:index'
        ]);

        route = container.lookup('route:index');
      }
    });

    test("it exists", function(){
      ok(route);
      ok(route instanceof Index);
    });

    test("#model", function(){
      deepEqual(route.model(), ['red', 'yellow', 'blue']);
    });
  });