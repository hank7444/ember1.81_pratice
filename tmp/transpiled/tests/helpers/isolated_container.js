define("appkit/tests/helpers/isolated_container", 
  ["resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];

    function isolatedContainer(fullNames) {
      var container = new Ember.Container();

      container.optionsForType('component', { singleton: false });
      container.optionsForType('view', { singleton: false });
      container.optionsForType('template', { instantiate: false });
      container.optionsForType('helper', { instantiate: false });
      
      var resolver = Resolver['default'].create();

      resolver.namespace = {
        modulePrefix: 'appkit'
      };

      for (var i = fullNames.length; i > 0; i--) {
        var fullName = fullNames[i - 1];
        container.register(fullName, resolver.resolve(fullName));
      }

      return container;
    }

    __exports__["default"] = isolatedContainer;
  });