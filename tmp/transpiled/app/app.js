define("appkit/app", 
  ["resolver","appkit/models/base","appkit/utils/routeProxy","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    //import registerComponents from 'appkit/utils/register_components';
    var Storage = __dependency2__["default"];
    var routeProxy = __dependency3__["default"];


    var App = Ember.Application.extend({
        LOG_ACTIVE_GENERATION: true,
        LOG_MODULE_RESOLVER: true,
        LOG_TRANSITIONS: true,
        LOG_TRANSITIONS_INTERNAL: true,
        LOG_VIEW_LOOKUPS: true,
        modulePrefix: 'appkit', // TODO: loaded via config
        Resolver: Resolver,
        currentPath: '',
    });


    // 當丟出錯誤時, 在這裡控制
    Ember.onerror = function(error) {

        console.log('發生錯誤: ' + error);

        
        // 如果ajax發生錯誤, 會導致loading關不起來, 這邊統一在發生錯誤時關閉loading lightbox
        routeProxy.send('hideLoading');


        switch (error) {

            case 'token':

                console.log('into token error!');
                // 開啓未登入modal
                routeProxy.send('showLoginModal');
                break;
        }
    };


    App.initializer({
        name: 'Register Components',
        initialize: function(container, application) {
            //registerComponents(container); // 沒這個自定義view跟component會壞掉

            // 設定helper
            Ember.Handlebars.helper('format-date', function(date) {
                return moment(date).fromNow();
                //return date;
            });
            Ember.Handlebars.helper('format-markdown', function(input) {
                var showdown = new Showdown.converter();
                return new Handlebars.SafeString(showdown.makeHtml(input));
            });

            Ember.Handlebars.helper('ifCond', function(v1, operator, v2, options) {

                switch (operator) {

                    case '==':
                        return (v1 == v2) ? options.fn(this) : options.inverse(this);
                        break;

                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                        break;

                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                        break;

                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                        break;

                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                        break;

                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                        break;

                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                        break;

                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                        break;

                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                        break;

                    default:
                        return eval("" + v1 + operator + v2) ? options.fn(this) : options.inverse(this);
                        break;
                }
            });
        },

    });


    App.initializer({
        name: 'registerDependancies',
        initialize: function(container, application) {
            application.register('store:main', Storage, {
                instantiate: false
            });
        }
    });

    App.initializer({
        name: 'injectDependancies',
        after: 'registerDependancies',
        initialize: function(container, application) {
            application.inject('route', 'store', 'store:main');
            application.inject('controller', 'store', 'store:main');
        }
    });


    __exports__["default"] = App;
  });