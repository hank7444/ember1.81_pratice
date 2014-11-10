define("appkit/utils/routeProxy", 
  ["exports"],
  function(__exports__) {
    "use strict";

    var routeProxy = {

        transition: null,
        route: null,

        init: function(transition, route) {
            this.transition = transition;
            this.route = route;
        },
        getTransition: function() {
            return this.transition;
        },
        getRoute: function() {
            return this.route;
        },
        send: function() {

            var args = [].slice.call(arguments);
            var controller = this.route.controller;

            if (!args[0]) {
                throw 'routeProxy: send需要提供action, arguments[0]';
            }
            else if (controller) {
                controller.send.apply(controller, args);
            }
            else {
                return false;
            }
        }

    };

    __exports__["default"] = routeProxy;
  });