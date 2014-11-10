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

    Ember.RSVP.configure('onerror', function(e) {
        console.log('######app RSVP onerror');
        console.log(e.message); 
        console.log(e.stack);
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
define("appkit/components/header-togglebtn", 
  ["exports"],
  function(__exports__) {
    "use strict";
    
    
    
    
    var HeaderTogglebtnComponent = Ember.Component.extend({
        tagName: 'a',
    
        defaultClassName: 'toggle-nav btn pull-left',
    
        classNameBindings: ['defaultClassName'],
    
        attributeBindings: ['href'],
    
        href: "#",
    
        checkOpen: function(){
            return $("body").hasClass("main-nav-opened") || $("#main-nav").width() > 50;
        }.property('navOpen'),
    
        click: function(e) {
                
            var body = $("body");
            if(this.get('checkOpen')){
                body.removeClass("main-nav-opened").addClass("main-nav-closed");
                this.set('navOpen', false);
            } else {
                body.addClass("main-nav-opened").removeClass("main-nav-closed");
                this.set('navOpen', true);
            }
    
            //e.stopPropagation();
            return false;
        }
    });
    
    __exports__["default"] = HeaderTogglebtnComponent;
  });
define("appkit/components/header-ui", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # header-ui(header模組)[component]

    ## 更新訊息 

    原始來源: 無  

    最後編輯者: Hank Kuo  

    最後修改日期: 2014/01/16  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2014.01.16 | 1.1  | 將toggle-btn合併進來  | Hank Kuo 
    2013.09.15 | 1.0  | 建立元件 | Sony Lin


    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3.0.0  
    vendor/flatty/ 版本: bootstrap v3.0.0  


    #### 相依元件 


    #### 相依外部檔案與目錄 


    ## 相依後端I/O 

    ## 參數說明與使用教學 

    #### route: 



    #### controller: 

    參數範例:


    ```
    menuData: function() {

        var member = cookieProxy.getCookie('member');

        return {

            title: '發票系統-管理者後台',
            titleLink: 'main.index',
            userName: member.name,
            userPhoto: 'assets/images/avatar.jpg',
            hasToggleBtn: true,
            hasUserMenu: true,
            userMenu: [
                {
                    actionName: 'profile',
                    icon: 'icon-user',
                    title: 'Profile',
                    hasDivider: true
                },
                {
                    actionName: 'logout',
                    icon: 'icon-signout',
                    title: '登出'
                }
            ]
        };

    }.property(),
    ```

    ```
    actions: {

        headerMenu: function(param) {

            switch (param) {

                case 'profile':
                    this.transitionToRoute('main.profile');
                    break;

                case 'logout':
                    auth.redirectForLogout();
                    break;
            }

            console.log(param);
        }
    }
    ```



    #### template:

    ```
    {{header-ui options=menuData action="headerMenu"}}
    ```    


    @class header-ui
    @since 1.0
    */


    /**
    ###### 標題

    @property title
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 標題連結

    選項:  

    @property titleLink
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 用戶名稱

    @property userName
    @type String
    @default ''
    @optional
    **/


    /**
    ###### 用戶照片(大小需大於23x23 pixels, 若無資料則不顯示)

    @property userPhoto
    @type String
    @default ''
    @optional
    **/



    /**
    ###### 是否擁有開啟/收起左側目錄的控制按鈕

    @property hasToggleBtn
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 是否擁有使用者目錄

    @property hasUserMenu
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 使用者目錄

    格式與參數參考:

    ```
    userMenu: [
        {
            actionName: 'profile',  // 要觸發的action名稱
            icon: 'icon-user',  // icon圖示, 請參考flatty
            title: 'Profile',  // 目錄項目標題    
            hasDivider: true  // 是否要有分隔線
        },
        {
            actionName: 'logout',
            icon: 'icon-signout',
            title: '登出'
        }
    ]
    ```

    @property userMenu
    @type Array
    @default []
    @optional
    **/


    var HeaderUIComponent = Ember.Component.extend({
        
        tagName: 'header',

        title: function() {

        	return this.get('options').title;

    	}.property(),

    	titleLink: function() {

    		return this.get('options').titleLink;

    	}.property(),

    	userName: function() {

    		return this.get('options').userName;

    	}.property(),

    	userPhoto: function() {

    		return this.get('options').userPhoto;

    	}.property(),

    	hasToggleBtn: function() {

    		return this.get('options').hasToggleBtn;

    	}.property(),


    	hasUserMenu: function() {

    		return this.get('options').hasUserMenu;

    	}.property(),

    	userMenu: function() {

    		var data = this.get('options').userMenu;

    		data.forEach(function(item) {

    			item.url = item.url || '';
    			item.icon = item.icon || 'icon-user';
    			item.title = item.title || '';
    			item.hasDivider = item.hasDivider || false;
    		});

    		return data;


    	}.property(),


        didInsertElement: function() {

        	var options = {
                self: '#' + $(this.get('element')).attr('id'),
                title: this.get('options').title || '',
                titleLink: this.get('options').titleLink || '',
                userName: this.get('options').userName || '',
                userPhoto: this.get('options').userPhoto,
                hasToggleBtn: this.get('options').hasToggleBtn || false,
                hasUserMenu: this.get('options').hasUserMenu || false,
          		userMenu:  this.get('options').userMenu || []
            };

            this.set('options', options);
        },
        actions: {

        	toggleBtnClick: function() {

        		var body = $('body');

        		if (body.hasClass('main-nav-opened')) {
        			body.removeClass("main-nav-opened").addClass("main-nav-closed");
        		}
        		else {
        			body.addClass("main-nav-opened").removeClass("main-nav-closed");
        		}
        	},
        	menuClick: function(param) {
        		this.sendAction('action', param);
        	}

        }
    });

    __exports__["default"] = HeaderUIComponent;
  });
define("appkit/components/header-usermenu", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var HeaderUsermenuComponent = Ember.Component.extend({
        tagName: 'li',
    
        defaultClassName: 'dropdown dark user-menu',
    
        //isOpen: false,
    
        classNameBindings:['defaultClassName', 'isOpen:open'],
    
        click: function(e) {
    
            if (e.target.id) {
                this.sendAction('action', e.target.id);
            }
        }
    });
    
    __exports__["default"] = HeaderUsermenuComponent;
  });
define("appkit/components/lightbox-loading", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # lightbox-loading(顯示儲存中狀態的lightbox)[component]

    ## 更新訊息 

    原始來源: 無  

    最後編輯者: Hank Kuo  

    最後修改日期: 2014/01/03  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ----
    2014.01.03 | 1.02 |  1. 修正fadeInTime, fadeOutTime, delayTime設為0仍然為預設值的問題 | Hank Kuo
    2013.12.20 | 1.01 |  1. 參數speed改為fadeInTime跟fadeOutTime<br>2. 增加機制防止連續重複開啟<br> 3. 增加delayTime參數, 如果有設定, 超過delay時間才會顯示<br> 4. 修正位置未置中, z-index會被其他物件遮蔽的問題 | Hank Kuo
    2013.11.01 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件


    #### 相依元件


    #### 相依外部檔案與目錄
    app/styles/components/lightbox-loading.css  
    public/assets/components/lightbox-loading/

    ## 相依後端I/O

    ## 參數說明與使用教學
    #### controller:

    參數範例:

    ```   
    lightboxLoadingData: function() {

        return {
            msg: '儲存中',
            isMask: false,
            isShow: false,
            fadeInTime: 500,
            fadeOutTime: 500
        }

    }.property();
    ```

    使用範例:

    ```
    // 顯示loading lightbox:
    this.set('lightboxLoadingData.isShow', true);  

    ```

    ```
    // 隱藏loading lightbox:
    this.set('lightboxLoadingData.isShow', false);

    ```

    #### template:

    ```
    {{lightbox-loading options=lightboxLoadingData}}
    ```    



    @class lightbox-loading
    @since 1.0
    */


    /**
    ###### 顯示文字

    @property msg
    @type String
    @default 'loading...'
    @optional
    **/

    /**
    ###### 是否要顯示遮罩

    如果為true畫面背景會被黑色半透明遮罩所遮住

    @property isMask
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 是否要顯示

    @property isShow
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 顯示速度(單位:ms)

    @property fadeInTime
    @type Integer
    @default 500
    @optional
    **/

    /**
    ###### 隱藏速度(單位:ms)

    @property fadeOutTime
    @type Integer
    @default 500
    @optional
    **/

    /**
    ###### 延遲顯示時間(單位:ms)

    @property delayTime
    @type Integer
    @default 500
    @optional
    **/

    var LightboxLoadingComponent = Ember.Component.extend({

        classNames: ['component-lightbox-loading'],

        // binding property
        isShowTag: function() {

            this.showSwitch();

        }.property('this.options.isShow'),
        
        loadingImg: function() {
            return 'assets/components/lightbox-loading/loading.gif'
        }.property(), // 設定綁定this.persentage, 這樣外面傳入參數改變就會動態改變數值

        message: function() {
            return this.get('options').msg;
        }.property('this.options.msg'),


        showSwitch: function() {

            if (this.get('options').isShow) {
                this.show();
            }
            else {
                this.hide();
            }
        },
        // method
        show: function() {

            if (this.get('options').self) {

                var self = '#' + $(this.get('element')).attr('id');
                var fadeInTime = +this.get('options').fadeInTime;
                var delayTime = +this.get('options').delayTime;
                var isMask = this.get('options').isMask;
                var showLater = this.get('showLater');

                console.log('delayTime: ' + delayTime);

                if (!$(self).is(':visible') && !showLater) {

                    showLater = Ember.run.later(null, function() {

                        if (isMask) {

                            if (fadeInTime == -1) {
                                $(self + ' .mask').show();
                            }
                            else {
                                $(self + ' .mask').fadeIn(fadeInTime)
                            }
                        }

                        if (fadeInTime == -1) {
                            $(self).show();
                        }
                        else {
                            $(self).fadeIn(fadeInTime)
                        }

                    }, delayTime);

                    this.set('showLater', showLater);
                }
            }
        },
        hide: function() {

            if (this.get('options').self) {

                var self = '#' + $(this.get('element')).attr('id');
                var fadeOutTime = this.get('options').fadeOutTime 
                var isMask = this.get('options').isMask;
                var showLater = this.get('showLater');

                if (showLater) {
                    Ember.run.cancel(showLater);
                    this.set('showLater', null);
                }


                if ($(self).is(':visible')) {

                    if (fadeOutTime == -1) {
                        $(self).hide();
                        $(self + ' .mask').hide();
                    }
                    else {
                        $(self).fadeOut(fadeOutTime)
                        $(self + ' .mask').fadeOut(fadeOutTime)
                    }
                }
            }
        },
        didInsertElement: function() {

            //Ember.set(this.get('options'), 'self', self);

            var options = {
                self: '#' + $(this.get('element')).attr('id'),
                isShow: this.get('options').isShow || false,
                isMask: this.get('options').isMask || false,
                msg: this.get('options').msg || 'loading...',
                fadeInTime: typeof this.get('options').fadeInTime !== 'undefined' ? this.get('options').fadeInTime : 500,
                fadeOutTime: typeof this.get('options').fadeOutTime !== 'undefined' ? this.get('options').fadeOutTime : 500,
                delayTime: typeof this.get('options').delayTime !== 'undefined' ? this.get('options').delayTime : 500
            }
            this.set('options', options);
            this.showSwitch();
        }
    });

    __exports__["default"] = LightboxLoadingComponent;
  });
define("appkit/components/lightbox-msg", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # lightbox-msg(顯示訊息後,自動消失的lightbox)[component]

    ## 更新訊息 

    原始來源: 無  

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/11/01  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.11.01 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件


    #### 相依元件


    #### 相依外部檔案與目錄
    app/styles/components/lightbox-msg.css  

    ## 相依後端I/O

    ## 參數說明與使用教學
    #### controller:

    參數範例:

    ```   
    lightboxMsgData: function() {

        return {
            msg: '預設訊息',
            isShow: false,
            speed: 700,
            waitTime: 2000
        }

    }.property();
    ```

    使用範例:

    ```
    // 顯示loading lightbox:
    this.set('lightboxMsgData.isShow', true);  

    ```


    #### template:

    ```
    {{lightbox-msg options=lightboxMsgData}}
    ```    



    @class lightbox-msg
    @since 1.0
    */


    /**
    ###### 顯示文字

    @property msg
    @type String
    @default '預設訊息'
    @optional
    **/

    /**
    ###### 是否要顯示

    @property isShow
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 顯示與隱藏速度(單位:ms)

    @property speed
    @type Integer
    @default 500
    @optional
    **/

    /**
    ###### 顯示停留時間(單位:ms)

    @property waitTime
    @type Integer
    @default 2000
    @optional
    **/

    var LightboxMsgComponent = Ember.Component.extend({

        classNames: ['component-lightbox-msg'],

        // binding property
        isShowTag: function() {

            this.show();

        }.property('this.options.isShow'),

        message: function() {
            return this.get('options').msg;
        }.property('this.options.msg'),

        // method
        show: function() {

            if (this.get('options').self && this.get('options').isShow == true) {

                var that = this;
                var self = this.get('options').self;
                var speed = this.get('options').speed;
                var waitTime = this.get('options').waitTime;

                $(self).fadeIn(speed);

                Ember.run.later(null, function() {
                    $(self).fadeOut(speed);
                }, waitTime);

                Ember.run.later(null, function() {
                    that.set('options.isShow', false);
                }, waitTime + speed);
            }
        },
        didInsertElement: function() {

            //Ember.set(this.get('options'), 'self', self);

            var options = {
                self: '#' + $(this.get('element')).attr('id'),
                isShow: this.get('options').isShow || false,
                msg: this.get('options').msg || '預設訊息',
                speed: this.get('options').speed || 700,
                waitTime: this.get('options').waitTime || 2000
            }
            this.set('options', options);
            this.show();
        }
    });

    __exports__["default"] = LightboxMsgComponent;
  });
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
define("appkit/components/pages-ui", 
  ["exports"],
  function(__exports__) {
    "use strict";
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
                var bCount = current > 2 ? 2 : current - 1; //�e���n�ɪ��ƶq
                var eCount = current < total - 1 ? 2 : total - current; //�᭱�n�ɪ��ƶq
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


    __exports__["default"] = PagesUIComponent;
  });
define("appkit/components/picker-datetime", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # picker-datetime(日期時間選擇器)[component]

    ## 更新訊息 

    原始來源: http://tarruda.github.io/bootstrap-datetimepicker  

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/11/11  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.11.11 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3(flatty樣板版本)



    #### 相依元件


    #### 相依外部檔案與目錄
    vendor/flatty/javascripts/plugins/bootstrap_datetimepicker/bootstrap-datetimepicker.js  
    vendor/flatty/stylesheets/plugins/bootstrap_datetimepicker/bootstrap-datetimepicker.min.css  

    ## 相依後端I/O

    ## 參數說明與使用教學
    #### controller:

    參數範例:

    ```   
    dateData: function() {

        return  {
            width: 200,
            maskInput: false,
            pickDate: true,
            pick12HourFormat: true,
            pickTime: true,
            pickSeconds: true,
            format: 'yyyy-MM-dd',
            startDate: '2013-11-10',
            endDate: Infinity,
            language: 'tw'
        };
    }.property(),
    ```

    使用範例:

    ```
    // 取得日期時間
    this.get('model').myDateTime;
    ```

    #### template:

    ```
    {{picker-datetime options=dateData value=myDateTime}}
    ```    

    @class picker-datetime
    @since 1.0
    */


    /**
    ###### 輸入框寬度

    @property width
    @type Integer
    @default 200
    @optional
    **/

    /**
    ###### 是否要防止使用者可以對input欄位直接輸入資料

    @property maskInput
    @type Integer
    @default false
    @optional
    **/

    /**
    ###### 是否要選擇日期

    @property pickDate
    @type Boolean
    @default true
    @optional
    **/

    /**
    ###### 是否要使用12小時制格式(AM/PM)

    @property pick12HourFormat
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 是否要選擇時間

    @property pickTime
    @type Boolean
    @default false
    @optional
    **/


    /**
    ###### 是否要選擇時間的秒數

    @property pickSeconds
    @type Boolean
    @default false
    @optional
    **/


    /**
    ###### 日期時間輸出格式

    @property format
    @type 'String'
    @default 'yyyy-MM-dd'
    @optional
    **/

    /**
    ###### 最早可選擇日期

    格式參考:  

    ```
    startDate: '2013-11-10'
    ```

    @property startDate
    @type String
    @default -Infinity
    @optional
    **/

    /**
    ###### 最晚可選選擇日期

    格式參考:  

    ```
    endDate: '2013-11-10'
    ```


    @property endDate
    @type String
    @default Infinity
    @optional
    **/

    /**
    ###### 日期月份顯示語言

    選項:  
    1. 'tw'(繁體中文)  
    2. 'en'(英文)  

    @property language
    @type String
    @default 'tw'
    @optional
    **/

    var PickerDatetimeComponent = Ember.Component.extend({

        classNames: ['component-picker-datetime'],

        didInsertElement: function() {

            var that = this;
            var self = '#' + $(this.get('element')).attr('id');
            var options = this.get('options');
            var value = this.get('value');
      
            // 如果pickTime爲ture但是format沒設定時間時, 自動加上時間的格式
            if (options.pickTime && options.format.indexOf('hh') == -1) {
                options.format += ' hh:mm:ss';
            }

            var width = options.width || 200;

            options = {
                maskInput: options.maskInput || false,
                pickDate: options.pickDate !== false,
                pick12HourFormat: options.pick12HourFormat || false,
                pickTime: options.pickTime || false,
                pickSeconds: options.pickSeconds || false,
                format: options.format || 'yyyy-MM-dd',
                startDate: options.startDate || -Infinity,
                endDate: options.endDate || Infinity,
                language: options.language || 'tw'
            };

            $(self + ' .datepicker').datetimepicker(options).on('changeDate', function(event) {
                that.set('value', $(self + ' input').val());
            });
            $(self + ' .datepicker').css('width', width + 'px');
            $(self + ' input').val(value);
            
        }
    });

    __exports__["default"] = PickerDatetimeComponent;
  });
define("appkit/components/picker-datetimerange", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # picker-datetimerange(日期時間區間選擇器)[component]

    ## 更新訊息 

    原始來源: https://github.com/dangrossman/bootstrap-daterangepicker  

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/11/11  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.11.11 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3(flatty樣板版本)
    vendor/moment.min.js



    #### 相依元件


    #### 相依外部檔案與目錄
    vendor/flatty/javascripts/plugins/bootstrap_daterangepicker/bootstrap-datetimepicker.js  
    vendor/flatty/stylesheets/plugins/bootstrap_daterangepicker/bootstrap-datetimepicker.min.css  

    ## 相依後端I/O

    ## 參數說明與使用教學
    #### controller:

    參數範例:

    ```   
    dateRangeData: function() {

        return {
            width: 230, 
            ranges: {
                Yesterday: [moment().subtract('days', 1), moment().subtract('days', 1)],
                'Last 30 Days': [moment().subtract('days', 29), new Date()],
                'This Month': [moment().startOf('month'), moment().endOf('month')]
            },
            opens: 'right',
            format: 'MM/DD/YYYY',
            formatOutput: 'YYYY-MM-DD',
            separator: ' to ',
            startDate: moment(),
            endDate: moment().add('days', 1),
            minDate: '01/01/2012',
            maxDate: '12/31/2013',
            timePicker: true,
            timePickerIncrement: 1,
            timePicker12Hour: false,
            locale: {
                cancelLabel: '取消',
                applyLabel: '確定',
                fromLabel: 'FROM',
                toLabel: 'To',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ['日', 'ㄧ', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 1,
            },
            showWeekNumbers: true,
            buttonClasses: ['btn-danger'],
            dateLimit: {
                'days': 5
            }

        };
    }.property(),
    ```

    使用範例:

    ```
    // 取得日期時間
    this.get('model').myDateRange;
    ```

    #### template:

    ```
    {{picker-datetimerange options=dateRangeData value=myDateRange}}
    ```    

    @class picker-datetimerange
    @since 1.0
    */


    /**
    ###### 輸入框寬度

    @property width
    @type Integer
    @default 230
    @optional
    **/


    /**
    ###### 定義時間範圍標簽

    範例:

    ```
    ranges: {
        Yesterday: [moment().subtract("days", 1), moment().subtract("days", 1)],
        "Last 30 Days": [moment().subtract("days", 29), new Date()],
        "This Month": [moment().startOf("month"), moment().endOf("month")]
    },
    ```

    @property ranges
    @type Object
    @default null
    @optional
    **/

    /**
    ###### 開啓日曆位置

    選項:  
    1. 'right'(右邊)  
    2. 'left'(左邊)  

    @property opens
    @type String
    @default 'right'
    @optional
    **/

    /**
    ###### 日期選擇器顯示日期格式

    @property format
    @type String
    @default 'MM/DD/YYYY'
    @optional
    **/

    /**
    ###### 輸出日期格式

    備註: 請參考memont的format參數說明  

    @property formatOutput
    @type String
    @default 'YYYY-MM-DD',若timePicker = true,會自動加上'HH:mm:ss'
    @optional
    **/

    /**
    ###### 開始日期

    格式參考:  

    ```
    minDate: '01/01/2012' // String
    minDate:  moment().subtract('days', 1) // Moment Object
    ```

    @property startDate
    @type String or Moment Object
    @default moment()
    @optional
    **/


    /**
    ###### 結束日期

    格式參考:  

    ```
    minDate: '01/01/2012' // String
    minDate:  moment().subtract('days', 1) // Moment Object
    ```

    @property endDate
    @type String or Moment Object
    @default moment().add('days', 1)
    @optional
    **/


    /**
    ###### 最早可選擇日期

    格式參考:  

    ```
    minDate: '01/01/2012' // String
    minDate:  moment().subtract('days', 1) // Moment Object
    ```

    @property minDate
    @type String or Moment Object
    @default ''
    @optional
    **/

    /**
    ###### 最晚可選擇日期

    格式參考:  

    ```
    maxDate: '12/31/2013' // String
    maxDate:  moment().add('days', 1) // Moment Object

    ```

    @property maxDate
    @type String or Moment Object
    @default ''
    @optional
    **/


    /**
    ###### 是否要選擇時間

    @property timePicker
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 選擇時間分鍾最小單位

    @property timePickerIncrement
    @type Integer
    @default 1
    @optional
    **/


    /**
    ###### 是否要使用12小時制格式(AM/PM)

    @property timePicker12Hour
    @type Boolean
    @default false
    @optional
    **/


    /**
    ###### 是否要使用12小時制格式(AM/PM)

    預設值:

    ```
    locale: {
        cancelLabel: "取消", // 取消按鈕顯示文字
        applyLabel: "確定",  // 確定按鈕顯示文字
        fromLabel: "FROM",  // 開始日期input欄位上方顯示文字
        toLabel: "To",      // 結束日期input欄位上方顯示文字
        customRangeLabel: "Custom Range",   
        daysOfWeek: ["日", "ㄧ", "二", "三", "四", "五", "六"],
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        firstDay: 1,    // 以哪一天為星期的第一天
    },
    ```

    @property locale
    @type Object
    @default 請參考上方預設值範例
    @optional
    **/


    /**
    ###### 開始與結束日期最大區間

    設定範例:

    ```
        dateLimit: {
            'days': 5 // 開始與結束日期間距不得超過5天
        }

        dateLimit: {
            'months': 1 // 開始與結束日期間距不得超過1個月
        }
    ```

    @property dateLimit
    @type Object
    @default null
    @optional
    **/

    var PickerDatetimerangeComponent = Ember.Component.extend({

        classNames: ['component-picker-datetimerange'],

        didInsertElement: function() {

            var that = this;
            var self = '#' + $(this.get('element')).attr('id');
            var options = this.get('options');
            var value = this.get('value');
            var width = options.width || 230;
            var defaultFormatOutput = 'YYYY-MM-DD';
            var optionsRanges = options.ranges;
            var optionsDateLimit = options.dateLimit;

            if (options.timePicker) {
                defaultFormatOutput += ' HH:mm:ss';
            }   

            options = {
                format: options.format || 'MM/DD/YYYY',
                formatOutput: options.formatOutput || defaultFormatOutput,
                opens: options.opens || 'right',
                separator: 'to',
                startDate: options.startDate || moment(),
                endDate: options.endDate || moment().add('days', 1),
                minDate: options.minDate || '',
                maxDate: options.maxDate || '',
                timePicker: options.timePicker || false,
                timePickerIncrement: options.timePickerIncrement || 1,
                timePicker12Hour: options.timePicker12Hour || false,
                locale: options.locale || {
                    cancelLabel: "取消",
                    applyLabel: "確定",
                    fromLabel: "FROM",
                    toLabel: "To",
                    //customRangeLabel: "Custom Range",
                    daysOfWeek: ["日", "ㄧ", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    firstDay: 1,
                },
                showWeekNumbers: true,
                buttonClasses: ["btn-danger"],
            };

            if (optionsRanges && Object.keys(optionsRanges).length !== 0) {
                options['ranges'] = optionsRanges;
            }

            if (optionsDateLimit && Object.keys(optionsDateLimit).length !== 0) {
                options['dateLimit'] = optionsDateLimit;
            }

            $(self + ' span').first().daterangepicker(options, function(start, end) {
               var value = start.format(options.formatOutput) + ' - ' + end.format(options.formatOutput);
               that.set('value', value);
               $(self + ' input').val(value);
            });

            $(self + ' .daterange').parent().first().css('width', width + 'px');
            $(self + ' input').val(value);
            
        }
    });

    __exports__["default"] = PickerDatetimerangeComponent;
  });
define("appkit/components/progress-bar", 
  ["exports"],
  function(__exports__) {
    "use strict";

    /**

    # progress-bar(百分比進度條)[component]

    ## 更新訊息 

    原始來源: 無  

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/10/30  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.10.30 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3(flatty樣板版本)



    #### 相依元件


    #### 相依外部檔案與目錄

    ## 相依後端I/O

    ## 參數說明與使用教學
    #### controller:

    參數範例:

    ```   
    progressbarData: function() {

        return {
            width: 300,
            height: 20,
            persentage: 50,
            type: 'success'
        }

    }.property();
    ```

    使用範例:

    ```
    // 改變進度條百分比
    this.set('progressbarData.persentage', 30);
    ```

    #### template:

    ```
    {{progress-bar options=progressbarData}}
    ```    



    @class progress-bar
    @since 1.0
    */


    /**
    ###### 進度條寬度

    @property width
    @type Integer
    @default 260
    @optional
    **/

    /**
    ###### 進度條寬度

    @property height
    @type Integer
    @default 10
    @optional
    **/

    /**
    ###### 進度條類型

    選項:  
    1. 'info'(藍)  
    2. 'success'(綠)  
    3. 'warning'(黃)  
    4. 'danger'(紅)  

    @property type
    @type String
    @default 'info'
    @optional
    **/

    /**
    ###### 進度條百分比

    @property persentage
    @type Integer
    @default 0
    @optional
    **/





    var ProgressBarComponent = Ember.Component.extend({

        //tagName: 'div',
        //classNames: ['progress'],
        /*
        classNameBindings: ['progressStriped', 'active', 'progress-info', 
                            'progress-success', 'progress-warning', 'progress-danger'], // 設定哪些class要連動控制
        progressStripedBindings: ['progressStriped'], // 連接外面傳進來給component的參數progressStriped
        activeBindings: ['active'],
        progressInfoBindings: ['progress-info'],
        progressSuccessBindings: ['progress-success'],
        progressWaringBindings: ['progress-waring'],
        progressDangerBindings: ['progress-danger'],
    */

        classNames: ['component-progress-bar'],

        persentageWidth: function() {
            return 'width: ' + this.get('options').persentage + '%';
        }.property('this.options.persentage'), // 設定綁定this.persentage, 這樣外面傳入參數改變就會動態改變數值
        progressbarStyle: function() {


            if (!this.get('options')) {
                throw new Error('component(progressbar): 無progressbar資料');
            }


            var typeSelector = function(type) {
                
                var outputType = 'progress-bar-info';

                switch (type) {
                    case 'success':
                        outputType = 'progress-bar-success';
                        break;
               
                    case 'warning':
                        outputType = 'progress-bar-warning';
                        break;
                    
                    case 'danger':
                        outputType = 'progress-bar-danger';
                        break;
                }
                return outputType;
            };

            var output = 'progress-bar ' + typeSelector(this.get('options').type);

            /*
            if (this.get('options').striped) {
                output += ' progress-striped';
            }

            if (this.get('options').animated) {
                output += ' active';
            }
            */

            return output;

        }.property(),

        didInsertElement: function() {


            var options = {
                width: this.get('options').width || 260,
                height: this.get('options').height || 10,
                //persentage: this.get('options').persentage || 0
            };
            var self = '#' + $(this.get('element')).attr('id');

            // 設定寬度
            $(self + ' .progress').css('width', options.width);
            

            // 設定高度
            $(self + ' .progress').css('height', options.height);
        }
    });

    __exports__["default"] = ProgressBarComponent;
  });
define("appkit/components/sidemenu-ui", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # sidemenu-ui(左側目錄模組)[component]

    ## 更新訊息 

    原始來源: 無  

    最後編輯者: Hank Kuo  

    最後修改日期: 2014/01/16  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2014.01.16 | 1.1  | 修正bug與建立說明文件 | Hank Kuo
    2013.09.15 | 1.0  | 建立元件 | Sony Lin



    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3.0.0  
    vendor/flatty/ 版本: bootstrap v3.0.0  


    #### 相依元件 


    #### 相依外部檔案與目錄 


    ## 相依後端I/O 

    ## 參數說明與使用教學 

    #### route: 

    動態修改目錄內容範例: 

    ```
    // models/company-detail.js

    // sidemenu插入新項目, 要用Ember.copy()
    var menuItem = {
        isPage: true,
        isHidden: false,
        icon: 'icon-group',
        name: '新的menu物件',
        page: {
            href: 'companyList',
            params: ' '
        }
    };

    var sidemenuData = that.controllerFor('main').get('sidemenuDataOrigin');
    sidemenuData = Ember.copy(sidemenuData, true);
    sidemenuData[0].page.push(menuItem);
    that.controllerFor('main').set('sidemenuData', sidemenuData);
    ```


    ```
    // models/company-list.js

    // 還原原始狀態, 不要用Ember.copy()
    var sidemenuData = this.controllerFor('main').get('sidemenuDataOrigin');
    this.controllerFor('main').set('sidemenuData', sidemenuData);

    ```


    #### controller: 

    參數範例:

    ```   
    // 用來還原到原始目錄, 參數內容如sidemenuData
    sidemenuDataOrigin: function() {

        return sidemenuData;

    }.property(),  
    ```

    ```
    sidemenuData: function() {

        var sidemenuData = [

            {
                isOpen: true,
                isHidden: false,
                isPage: false,
                icon: 'icon-cogs',
                name: '營業人管理',
                page: [
                    {
                        isPage: true,
                        isHidden: false,
                        icon: 'icon-table',
                        name: '營業人資料列表',
                        page: {
                            href: 'companyList',
                            params: ' '
                        } 
                    },
                    {
                        isPage: true,
                        icon: 'icon-table',
                        name: '專案營業人設定',
                        page: {
                            href: 'projectList',
                            params: ' '
                        } 
                    }
                ]
            },
            {
                isOpen: true,
                isPage: false,
                icon: 'icon-cogs',
                name: '測試menu layer1',
                page: [
                    
                    {
                        isOpen: true,
                        isPage: false,
                        icon: 'icon-table',
                        name: '測試menu layer2',
                        page: [

                            {
                                isPage: true,
                                isHidden: true,
                                icon: 'icon-table',
                                name: '測試menu layer3-1',
                                page: {
                                    href: 'companyList',
                                    params: ' '
                                } 
                            },
                            {
                                isOpen: true,
                                isPage: false,
                                icon: 'icon-table',
                                name: '測試menu layer3-2',
                                page: [
                                    {
                                        isPage: true,
                                        icon: 'icon-table',
                                        name: '測試menu layer4-1',
                                        page: {
                                            href: 'companyList',
                                            params: ' '
                                        } 
                                    },
                                    {
                                        isPage: true,
                                        icon: 'icon-table',
                                        name: '測試menu layer4-2',
                                        page: [
                                            {
                                                isPage: true,
                                                icon: 'icon-table',
                                                name: '測試menu layer4-1',
                                                page: {
                                                    href: 'companyList',
                                                    params: ' '
                                                } 
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        return sidemenuData;   

    }.property('this.sidemenuData'),
    ```

    #### template:

    ```
    <div id="main-nav-bg"></div>
        <nav id="main-nav">
            <div class="navigation">
                {{sidemenu-ui menuData=sidemenuData}}
            </div>
        </nav>
    </div>
    ```    


    @class sidemenu-ui
    @since 1.0
    */


    /**
    ###### 是否要顯示目錄項目與其所屬子目錄

    @property isOpen
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 是否要隱藏目錄

    選項:  

    @property isHidden
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 是否有子目錄

    備註: 

    若為true,則page參數需為Object  
    若為false, 則page參數需為Array

    @property isPage
    @type Boolean
    @default false
    @optional
    **/


    /**
    ###### 目錄項目圖示

    @property icon
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 目錄項目標題

    @property title
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 目錄子目錄或連結

    格式與參數參考:

    ```
    // 為Object時
    page: {
        href: 'companyList', // 點擊後要連結的route位置
        params: ' ' // 要帶的參數
    } 

    // 為Array時
    page: [
                    
        {
            isOpen: true,
            isPage: false,
            icon: 'icon-table',
            name: '測試項目1',
            page: {
                href: 'companyList',
                params: ' '
            }
        },
        {
            isOpen: true,
            isPage: false,
            icon: 'icon-table',
            name: '測試項目2',
            page: [ 
                ......
            ]
        }

    ]
    ```

    @property page
    @type Array or Object
    @default []
    @optional
    **/



    var SidemenuUIComponent = Ember.Component.extend({
        
        tagName: 'ul',

        defaultClassName: 'nav nav-stacked',

        classNameBindings: ['defaultClassName'],

        data: function() {

            var data = this.get('menuData');

            data = this.setIsOpenClass(data);

            return data;

        }.property('this.menuData'),

        setIsOpenClass: function(menuDataAry) {

            var that = this;

            if ($.isArray(menuDataAry)) {

                menuDataAry.forEach(function(item) {
                    item.isOpen  = item.isOpen ? 'in' : '';
                    that.setIsOpenClass(item);
                });
            }

            return menuDataAry;
        },

        click : function(event) {
            this.send('clickDropdown', event);
        },

        didInsertElement: function() {

            //var menuData = this.get('menuData') || [];
            //this.set('menuData', menuData);

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

    __exports__["default"] = SidemenuUIComponent;
  });
define("appkit/components/statistic-list-ui", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # statistic-list-ui(統計列表模組)[component]

    ## 更新訊息 

    原始來源: 無  

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/12/09  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.12.09 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3.0.0  
    vendor/flatty/ 版本: bootstrap v3.0.0  
    vendor/jquery/jquery.color.js(顯示邊框動畫用, 如果沒引入將無動畫)  


    #### 相依元件 


    #### 相依外部檔案與目錄 
    app/styles/components/statistic-list-ui.css  


    ## 相依後端I/O 

    ## 參數說明與使用教學 

    #### route: 

    使用範例: 

    ```
    model: function(params) {

        // 如果要回到原始狀況, 就要把statisticListSelectedItem設回你想要的列表的值, 當作預設值
        if (params.page_id == ' ') {

            cookieProxy.removeCookie('projectData');
            params.page_id = 1;

            this.controllerFor('project.page').set('search', '');
            this.controllerFor('project.page').set('statisticListSelectedItem', 'all');

        }
        var searchData = {
            currentPage: params.page_id,
        };

        return ProjectModel.findByPage(searchData).then(function(data) {
            return data;
        });
    },
    ```


    #### controller: 

    參數範例:

    ```   
    statisticListData: function() {

        var companyStatusCount = ProjectModel.hash['companyStatusCount'];
        var searchCompanyStatus = ProjectModel.hash['searchCompanyStatus'];
        var options = {
            titleIcon: 'icon-group',
            titleIconType: '',
            title:  '已設定專案營業人統計',
            titleType: '',
            width: 4,
            canClick:  true,
            hoverColor: '#00ACEC',
            selectedColor: '#F5F5F5',
            listData: [
                {
                    icon: 'icon-home',
                    iconType: '',
                    title: companyStatusCount.all,
                    titleType: '',
                    content: '全部',
                    value: 'all',
                },
                {
                    icon: 'icon-ok',
                    iconType: 'primary',
                    title: companyStatusCount.hasCompany,
                    titleType: 'primary',
                    content: '已設定',
                    value: '1',
                },
                {
                    icon: 'icon-warning-sign',
                    iconType: 'warning',
                    title: companyStatusCount.noCompany,
                    titleType: 'warning',
                    content: '尚未設定',
                    value: '0',
                }
            ]
        };

        return options;   

    }.property(),
    ```

    ```
    statisticListSelectedItem: function() {

        var searchCompanyStatus = ProjectModel.hash['searchCompanyStatus'] || 'all';

        return searchCompanyStatus;

    }.property(),
    ```

    #### template:

    ```
    <!--用statistic-list-ui必須要的row-->
    <div class="row">

    {{statistic-list-ui options=statisticListData selectedItemValue=statisticListSelectedItem action="search"}}

    </div>
    ```    



    @class statistic-list-ui
    @since 1.0
    */


    /**
    ###### 標題圖示(請參照flatty icon代號)

    @property titleIcon
    @type String
    @default 'icon-group'
    @optional
    **/

    /**
    ###### 標題圖示類型(顏色)

    選項:  
    1. '' or 'default'(黑色)  
    2. 'primary'(藍色)
    3. 'warning'(黃色)
    4. 'info'(紫色)
    5. 'danger'(紅色)  
    6. 'success'(綠色)

    @property titleIconType
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 顯示與隱藏速度(單位:ms)

    @property speed
    @type Integer
    @default 500
    @optional
    **/

    /**
    ###### 標題文字內容

    @property title
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 標題文字內容類型(顏色)

    選項:  
    1. '' or 'default'(黑色)  
    2. 'primary'(藍色)
    3. 'warning'(黃色)
    4. 'info'(紫色)
    5. 'danger'(紅色)  
    6. 'success'(綠色)

    @property titleType
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 統計列表寬度

    說明:
    長度可選擇2~10, 低於2會自動設為2, 高於10會自動設為10

    @property width
    @type Integer
    @default 3
    @optional
    **/

    /**
    ###### 是否可點擊

    說明:  
    如果為true, 請務必設定action, 不然會沒有作用

    @property canClick
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### mouseover到列表項目時, 邊框的顏色

    說明:  
    請用16進位色碼, 例: #FFFFFF

    @property hoverColor
    @type String
    @default '#00ACEC'
    @optional
    **/

    /**
    ###### 點擊項目時, 項目要更換的背景顏色

    說明:  
    請用16進位色碼, 例: #FFFFFF

    @property selectedColor
    @type String
    @default '#F5F5F5'
    @optional
    **/

    /**
    ###### 項目陣列, 項目要更換的背景顏色

    格式與參數參考:  

    ```
    listData: [
        {
            icon: 'icon-home', // 項目圖示, 設定比照titleIcon
            iconType: '',   // 項目圖示類型(顏色), 設定比照titleIconType
            title: '標題1',   // 項目標題, 格式為字串
            titleType: '',  // 項目標題類型(顏色), 設定比照titleIconType
            content: '全部',  // 項目內容(在標題下方字型較小的說明文字)
            value: 'all',   // 項目數值(必填), 當點擊send action時所送出的數值, 也是代表此項目的唯一值
        },
        {
            icon: 'icon-ok',
            iconType: 'primary',
            title: '標題2',
            titleType: 'primary',
            content: '已設定',
            value: '1',
        },
        {
            icon: 'icon-warning-sign',
            iconType: 'warning',
            title: '標題3',
            titleType: 'warning',
            content: '尚未設定',
            value: '0',
        }
    ]
    ```

    @property listData
    @type Array
    @default []
    @optional
    **/



    var StatisticListUIComponent = Ember.Component.extend({

        classNames: ['component-static-list-ui'],

        convertType: function(type) {

            var typeAry = ['primary', 'warning', 'info', 'danger', 'default', 'success'];
            var output = '';

            if (typeAry.indexOf(type) == -1) {  
                return output;
            }

            if (type == 'danger') {
                output = 'text-error';
            }
            else {
                output = 'text-' + type;
            }

            return output;
        },

        titleIcon: function() {

            return this.get('options').titleIcon;

        }.property(),

        titleIconType: function() {

            return this.convertType(this.get('options').titleIconType);

        }.property(),

        title: function() {

            return this.get('options').title;

        }.property(),

        titleType: function() {

            return this.convertType(this.get('options').titleType);
            
        }.property(),

        width: function() {

            var width = this.get('options').width;

            // 判斷是否為整數
            if (typeof width !== 'number' && (width % 1) !== 0) {
               width = '3';
            }

            // 數字範圍為2~10
            if (width > 10) {
                width = 10;
            }
            else if (width < 2) {
                width = 2;
            }

            return 'col-md-' + width;

        }.property(),


        listData: function() {

            var that = this;
            var listData = this.get('options').listData;
            var outputData = [];
            var selectedColor = this.get('options').selectedColor;
            var isItemActive = false;

            // forEach回傳的也是參考...所以改動就會改到原本的資料
            listData.forEach(function(item) {

                // 複製物件
                var itemOutput = $.extend({}, item);

                if (!itemOutput.titleType) {
                    itemOutput.titleType = itemOutput.iconType;
                }

                itemOutput.iconType = that.convertType(itemOutput.iconType);
                itemOutput.titleType = that.convertType(itemOutput.titleType);


                if (!itemOutput.icon) {
                    itemOutput.icon = 'icon-home';
                }

                if (!itemOutput.title) {
                    itemOutput.title = '無內容';
                }

                outputData.push(itemOutput);

            });

            return outputData;

        }.property(),

        changeSelectedItem: function() {

            this.send('changeSelectedItemBackgroundColor');

        }.property('this.selectedItemValue'),

        didInsertElement: function() {

            var options = {
                self: '#' + $(this.get('element')).attr('id'),
                titleIcon: this.get('options').titleIcon || 'icon-group',
                titleIconType: this.get('options').titleIconType || '',
                title: this.get('options').title || '',
                titleType: this.get('options').titleType || '',
                width: this.get('options').width !== 'undefined' ? +this.get('options').width : 3,
                canClick: this.get('options').canClick || false,
                selectedColor: this.get('options').selectedColor || '#F5F5F5',
                hoverColor: this.get('options').hoverColor || '#00ACEC',
                listData: this.get('options').listData || []
            };
            this.set('options', options);

            // 如果設定為可以點擊, 就增加hover, active會轉換顏色的效果
            if (options.canClick) {

                var hasJqueryColor = jQuery.Color ? true : false;
                var items = $(options.self + '.component-static-list .box .box-content');

                // 設定hover行為
                items.hover(function() {
                    items.css('border-color', '#DDDDDD');

                    if (hasJqueryColor) {
                        $(this).animate({'border-color': options.hoverColor}, 150);
                    }
                    else {
                        $(this).css('border-color', options.hoverColor);
                    }

                    $(this).css('cursor', 'pointer');

                }, function() {

                    if (hasJqueryColor) {
                        $(this).animate({'border-color': '#DDDDDD'}, 150);
                    }
                    else {
                        $(this).css('border-color', '#DDDDDD');
                    }
                });

                this.send('changeSelectedItemBackgroundColor', false);

                // 當點擊時,將選取項目背景改變顏色
                /*
                $(options.self + '.component-static-list .box .row').click(function(event) {

                    items.animate({'background-color': '#FFFFFF'}, 150);
                    $(event.target).closest('.box-content-f2e').animate({'background-color': options.selectedColor}, 150);

                });
                */
            }
        },
        actions: {

            changeSelectedItemBackgroundColor: function(isAnimation) {

                var isAnimation = (isAnimation === false) ? false : true;
                var options = this.get('options');
                var listData = options.listData;
                var selectedItemValue = this.get('selectedItemValue');
                var i = 0;
                var len = listData.length;
                var items = $(options.self + '.component-static-list-ui .box .box-content');

                // 找到列表被點擊的項目
                for (;i < len; i += 1) {

                    if (listData[i].value == selectedItemValue) {
                        break;
                    }
                }

                // 使用動畫
                if (isAnimation && jQuery.Color) {
                    
                    // 將所有項目背景色設為預設
                    items.animate({'background-color': '#FFFFFF'}, 150);
                    
                    // 將點擊項目背景色改變
                    $(items[i]).animate({'background-color': options.selectedColor}, 150);
                }
                else {

                    // 將所有項目背景色設為預設
                    items.css('background-color', '#FFFFFF');
                    
                    // 將點擊項目背景色改變
                    $(items[i]).css('background-color', options.selectedColor);
                }

            },
            clickListItem: function(param) {

                this.set('this.selectedItemValue', param);

                if (this.get('options').canClick) {
                    this.sendAction('action', param);
                }
            }

        }
    });

    __exports__["default"] = StatisticListUIComponent;
  });
define("appkit/components/upload-file", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # upload-file(單筆檔案上傳)

    ## 更新訊息 

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/12/20  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.12.20 | 1.01 | 1. 修改傳入server參數tmpFiles爲tmpName<br>2. 取得圖片部分由$.get改為$.ajax已方便控制error callback<br>| Hank Kuo
    2013.10.30 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3.0.0
    vendor/jquery/fileupload/jquery.fileupload.js  
    vendor/jquery/fileupload/jquery.iframe-transport.js (for IE8 and lower)  


    #### 相依元件
    progress-bar


    #### 相依外部檔案與目錄
    app/styles/components/upload-file.css  
    public/assets/components/upload-file/  


    ## 相依後端I/O

    ##### 上傳原始檔案給後端:
    前端傳入值:

    ```
    {
        tmpName, // 檔案暫存名稱(String)
        fileSize // 檔案大小限制(Integer), 單位:byte
    }
    ```


    後端傳出值:

    ```
    {
        status // true為成功, false為失敗
    }
    ```


    ##### 從後端取得預覽圖片資訊:

    前端傳入值:

    ```
    {
        tmpName // 檔案暫存名稱(String)
    }

    ```


    後端傳出值:

    ```
    {
        url // 檔案路徑(String), 如果沒有帶host, 將會採用options.host
    }
    ```


    ## 參數說明與使用教學
    #### controller:

    參數設定:

    ```   
    uploadFileData: function() {

            return  {
                options: {
                    tmpName: 'filetest',
                    host: this.store.getHost('img'),
                    service: {
                        send: '/admin/admin/uploadfile',
                        get: '/admin/admin/getfile'
                    },
                    fileUrl: '',
                    dsrp: '說明文件, 可上傳pdf或doc, 檔案限制2MB',
                    imgWidth: 250,
                    statusMsg: true,
                    progressbar: true,
                    fileSizeLimit: 1024 * 1024 * 5,
                    fileTypes: 'pdf|doc',
                },
                progressbar: {
                    width: 260,
                    height: 10,
                    persentage: 0,
                    type: 'danger',
                    striped: true,
                    animated: true
                }         
            }
        }.property()
    ```

    #### template:

    ```
    {{upload-file options=uploadFileData.options progressbar=uploadFileData.progressbar}}
    ```    

    @class upload-file
    @since 1.0
    @require progress-bar
    */



    /**
    ###### 暫存檔案名稱

    @property tmpName*
    @type String
    @required
    **/


    /**
    ###### server host

    ex: http://www.hiiir.com

    @property host*
    @type String
    @required
    **/



    /**
    ###### 送出檔案與取得檔案的api位置

    預設:


    ```
    service: {
        send: '/admin/admin/uploadfile',
        get: '/admin/admin/getfile'
    }
    ```

    @property service
    @type Object
    @default 請參考上方物件結構
    @required
    **/


    /**
    ###### 檔案說明

    @property dsrp
    @type String
    @default '檔案上傳 可上傳pdf或doc, 檔案限制5MB(預設說明訊息)'
    @optional
    **/


    /**
    ###### 預覽圖片寬度

    @property imgWidth
    @type Integer
    @default 250
    @optional
    **/


    /**
    ###### 是否要顯示檔案上傳狀態

    @property statusMsg
    @type Boolean
    @default true
    @optional
    **/


    /**
    ###### 是否要顯示progressbar

    @property progressbar
    @type Boolean
    @default false
    @optional
    **/


    /**
    ###### 檔案大小限制(驗證用)

    @property fileSizeLimit
    @type Boolean
    @default 1024 * 1024 * 2
    @optional
    **/


    /**
    ###### 檔案副檔名(驗證用)

    @property fileTypes
    @type String
    @default 'pdf|doc'
    @optional
    **/


    var UploadFileComponent = Ember.Component.extend({

        tag: 'div',
        classNames: ['component-upload-file'],

        fileUrlShow: function() {

            var fileUrl = 'javascript:void(0)';

            if (this.get('options').fileUrl) {
                fileUrl = this.get('options').fileUrl;
            }
            return fileUrl;

        }.property('this.options.fileUrl'),

        fileImgShow: function() {

            var fileImg = 'assets/components/upload-file/tmpNoFile.png';
            var fileUrl = this.get('options').fileUrl;

            if (fileUrl) {

                var ext = fileUrl.substring(fileUrl.lastIndexOf('.'), fileUrl.length).replace('.', '');

                // 過濾副檔名之後的任何參數
                ext = ext.substr(0, ext.indexOf('?'));

                switch (ext) {
                    case 'doc':
                    case 'docx':
                        fileImg = 'assets/components/upload-file/icon_word.jpg';
                        break;

                    case 'ppt':
                    case 'pptx':
                        fileImg = 'assets/components/upload-file/icon_ppt.jpg';
                        break;

                    case 'xls':
                    case 'xlsx':
                        fileImg = 'assets/components/upload-file/icon_excel.jpg';
                        break;

                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'png':
                    case 'tif':
                        fileImg = 'assets/components/upload-file/icon_img.jpg';
                        break;

                    case 'pdf':
                        fileImg = 'assets/components/upload-file/icon_pdf.jpg';
                        break;

                    case 'zip':
                        fileImg = 'assets/components/upload-file/icon_zip.jpg';
                        break;

                    case 'rar':
                        fileImg = 'assets/components/upload-file/icon_rar.jpg';
                        break;

                    case 'avi':
                    case 'wmv':
                    case 'rmvb':
                    case 'mkv':
                    case 'mp4':
                    case 'mov':
                        fileImg = 'assets/components/upload-file/icon_video.jpg';
                        break;

                    case 'swf':
                        fileImg = 'assets/components/upload-file/icon_flash.jpg';
                        break;
                }
            }

            return fileImg;

        }.property('this.options.fileUrl'),


        didInsertElement: function() {


            var options = {};
            var that = this;
            var self = '#' + $(this.get('element')).attr('id');
            var errorMsg = '';


            // 確認必須屬性
            if (!this.get('options').tmpName) {
                throw new Error('component(upload-img): tmpName為必要屬性');
            }

            if (!this.get('options').host) {
                throw new Error('component(upload-img): host為必要屬性');
            }

            // 判斷progress資料是否存在
            if (this.get('options').progressbar && !this.get('progressbar')) {
                throw new Error('component(upload-img): 無progressbar資料');
            }

            // init options
            options = {
                host: this.get('options').host,
                service: {
                    send: this.get('options').service.send || '/admin/admin/uploadfile', // 預設上傳預覽圖路徑
                    get: this.get('options').service.get || '/admin/admin/getfile' // 預設取得預覽圖路徑
                },
                tmpName: this.get('options').tmpName,
                fileUrl: this.get('options').fileUrl || '',
                dsrp: this.get('options').dsrp || '檔案上傳 可上傳pdf或doc, 檔案限制5MB(預設說明訊息)',
                imgWidth: this.get('options').imgWidth || 150,
                imgSrc: this.get('options').imgSrc || 'assets/components/upload-file/tmpNoFile.png',
                statusMsg: this.get('options').statusMsg || true,
                progressbar: this.get('options').progressbar || false,
                fileSizeLimit: this.get('options').fileSizeLimit || 1024 * 1024 * 5,
                fileTypes: this.get('options').fileTypes || 'pdf|doc',
            }
            this.set('options', options);


            var privateFuncs = {
                setPersentage: function(persentage) {

                    if (options.progressbar) {
                        that.set('progressbar.persentage', persentage);
                    }
                },
                setStatusMsg: function(msg) {

                    if (options.statusMsg) {
                        $(self + ' .uploadStatus').html(msg);
                    }
                }
            };

            // 設定圖片寬度
            $(self + ' img').attr('width', options.imgWidth);



            // 上傳按鈕與input欄位綁定
            $(self + ' a[name=btnUpload]').click(function() {

                // 上傳按鈕與input欄位綁定
                $(self + ' input[name=file]').click();
            });


            $(self + ' input[name=file]').fileupload({
                url: options.host + options.service.send,
                dataType: 'json',
                formData: {
                    tmpName: options.tmpName,
                    fileSize: options.file_size_limit
                },
                autoUpload: true,
                start: function(e, data) {

                },
                add: function(e, data) {


                    var isError = false;
                    var formatRegExp = new RegExp("\.(" + options.fileTypes + ")$", "g");
                    var formatCheck = formatRegExp.test(data.originalFiles[0]['name']);

                    if (!formatCheck) {
            
                        privateFuncs.setStatusMsg('檔案格式錯誤,請上傳格式為 ' + options.fileTypes.replace('|', ', ') + ' 的檔案');
                        isError = true;
                    }

                    if (data.originalFiles[0]['size'] > options.fileSizeLimit) {
                        privateFuncs.setStatusMsg('檔案大小不得超過' + (options.fileSizeLimit / 1024 / 1024).toFixed(2) + 'MB');
                        isError = true;
                    }

                    if (isError === false) {
                        data.submit();
                    }
                },
                progress: function(e, data) {
                    var persent = parseInt(data.loaded / data.total * 100, 10);

                    privateFuncs.setPersentage(persent);
                    privateFuncs.setStatusMsg('上傳進度: ' + persent + '%');

                    //Ember.set(that.get('progressbar'), 'persentage', persent);
                },
                done: function(e, data) {

                    privateFuncs.setPersentage(100);
                    privateFuncs.setStatusMsg('上傳完成');

                    var result = data.result;

                    switch (result.status) {

                        case true:

                            var data = {
                                tmpName: options.tmpName,
                            };

                            var success = function(res) {

                                if (res) {
                                    var url = res.url;

                                    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
                                        url = options.host + url;
                                    }
                                    that.set('options.fileUrl', url);
                                } 
                                else {
                                    privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                                }
                            };

                            var error = function(res) {
                                privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                            }
                           
                            $.ajax({
                                dataType: 'json',
                                type: 'GET',
                                url: options.host + options.service.get,
                                data: data
                            }).then(success, error);

                            break;

                        case false:
                            privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                            break;
                    }


                    Ember.run.later(null, function() {
                        privateFuncs.setPersentage(0);
                        privateFuncs.setStatusMsg('準備上傳');
                    }, 1500);

                },
                fail: function(e, error) {}
            });
        }
    });

    __exports__["default"] = UploadFileComponent;
  });
define("appkit/components/upload-img", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # upload-img(單張圖片上傳)

    ## 更新訊息 

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/12/20  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.12.20 | 1.01 | 1. 修改傳入server參數tmpFiles爲tmpName<br>2. 取得圖片部分由$.get改為$.ajax已方便控制error callback<br>| Hank Kuo
    2013.10.30 | 1.0  | 建立元件 | Hank Kuo

    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3.0.0
    vendor/jquery/fileupload/jquery.fileupload.js  
    vendor/jquery/fileupload/jquery.iframe-transport.js (for IE8 and lower)  


    #### 相依元件
    progress-bar


    #### 相依外部檔案與目錄
    app/styles/components/upload-img.css  
    public/assets/components/upload-img/  


    ## 相依後端I/O

    ##### 上傳原始圖片給後端:
    前端傳入值:

    ```
    {
        tmpName, // 圖片暫存名稱(String)
        imgSize, // 圖片尺寸(Array)
        fileSize // 圖片檔案大小限制(Integer), 單位:byte
    }
    ```


    後端傳出值:

    ```
    {
        status // true為成功, false為失敗
    }
    ```


    ##### 從後端取得預覽圖片資訊:

    前端傳入值:

    ```
    {
        tmpName, // 圖片暫存名稱(String)
        imgGetSize // 圖片取得尺寸代碼(String), ex:"s"
    }

    ```


    後端傳出值:

    ```
    {
        width,  // 圖片寬度(Integer)
        height, // 圖片高度(Integer)
        src     // 圖片路徑(String), 如果沒有帶host, 將會採用options.host
    }
    ```


    ## 參數說明與使用教學
    #### controller:

    參數設定:

    ```   
    uploadImgData: function() {

            return  {
                one: {

                    options: {
                        tmpName: 'testimg2',
                        host: this.store.getHost('img'),
                        service: {
                            send: '/admin/admin/uploadimg',
                            get: '/admin/admin/getimg'
                        },
                        dsrp: 'logo上傳 尺寸: 150x150, 可上傳png或jpg, 檔案限制2MB',
                        imgWidth: 250,
                        //imgSrc: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
                        statusMsg: true,
                        progressbar: true,
                        fileSizeLimit: 1024 * 1024 * 2,
                        fileTypes: 'png|jpg|jpeg',
                        imgSize: {
                            s: 300,
                            l: 600
                        },
                        imgGetSize: 's',
                        isUploadImgSize: false
                    },
                    progressbar: {
                        width: 260,
                        height: 10,
                        persentage: 0,
                        type: 'danger',
                        striped: true,
                        animated: true
                    }
                }
            }
        }.property()
    ```

    #### template:

    ```
    {{upload-img options=uploadImgData.one.options progressbar=uploadImgData.one.progressbar}}
    ```    



    @class upload-img
    @since 1.0
    @require progress-bar
    */


    /**
    ###### 圖片暫存檔案名稱

    @property tmpName*
    @type String
    @required
    **/


    /**
    ###### server host

    ex: http://www.hiiir.com

    @property host*
    @type String
    @required
    **/



    /**
    ###### 送出圖片與取得圖片的api位置

    預設:


    ```
    service: {
        send: '/admin/admin/uploadimg',
        get: '/admin/admin/getimg'
    }
    ```

    @property service
    @type Object
    @default 請參考上方物件結構
    @required
    **/


    /**
    ###### 圖片說明

    @property dsrp
    @type String
    @default '圖片上傳 尺寸: 150x150, 可上傳png或jpg, 檔案限制2MB(預設說明訊息)'
    @optional
    **/


    /**
    ###### 預覽圖片寬度

    @property imgWidth
    @type Integer
    @default 250
    @optional
    **/


    /**
    ###### 是否要顯示圖片上傳狀態

    @property statusMsg
    @type Boolean
    @default true
    @optional
    **/


    /**
    ###### 是否要顯示progressbar

    @property progressbar
    @type Boolean
    @default false
    @optional
    **/


    /**
    ###### 圖片檔案大小限制(驗證用)

    @property fileSizeLimit
    @type Boolean
    @default 1024 * 1024 * 2
    @optional
    **/


    /**
    ###### 圖片副檔名(驗證用)

    @property fileTypes
    @type String
    @default 'png|jpg|jpeg'
    @optional
    **/


    /**
    ###### 取得server圖片尺寸代號

    預設:  

    ```
    imgSize: {
        s: 300, // 寬300, 高等比例縮放
        l: 600  // 寬600, 高等比例縮放
    }
    ```

    參數說明:  

    ```
    imgSize: {
        s: x100, // 高100, 寬等比例縮放
        l: 300x600 // 寬300, 高600
    }
    ```

    @property imgGetSize
    @type String
    @default 抓取options:imgSize第一個參數
    @optional
    **/


    /**
    ###### 是否要依照上傳圖片大小顯示預覽圖

    上傳圖片後, 是否依照取得圖片大小顯示照片, 
    若為false則會依照imgWidth等比例縮放, 若為true則直接指定取得圖片的寬高, 預設為false

    @property isUploadImgSize
    @type Boolean
    @default false
    @optional
    **/




    var UploadImgComponent = Ember.Component.extend({

        tag: 'div',
        classNames: ['component-upload-img'],

        /*
        imgStyle: function() {
            return 'width: ' + this.get('options').imgWidth + 'px';
        }.property('this.options.imgWidth'), // 設定綁定this.progress, 這樣外面傳入參數改變就會動態改變數值
        */


        didInsertElement: function() {

            var options = {};
            var that = this;
            var self = '#' + $(this.get('element')).attr('id');
            var errorMsg = '';


            // 確認必須屬性
            if (!this.get('options').tmpName) {
                throw new Error('component(upload-img): tmpName為必要屬性');
            }

            if (!this.get('options').host) {
                throw new Error('component(upload-img): host為必要屬性');
            }

            // 判斷progress資料是否存在
            if (this.get('options').progressbar && !this.get('progressbar')) {
                throw new Error('component(upload-img): 無progressbar資料');
            }

            // init options
            options = {
                host: this.get('options').host,
                service: {
                    send: this.get('options').service.send || '/admin/admin/uploadimg', // 預設上傳預覽圖路徑
                    get: this.get('options').service.get || '/admin/admin/getimg'   // 預設取得預覽圖路徑
                },
                tmpName: this.get('options').tmpName,
                dsrp: this.get('options').dsrp || '圖片上傳 尺寸: 150x150, 可上傳png或jpg, 檔案限制2MB(預設說明訊息)',
                imgWidth: this.get('options').imgWidth  || 150,
                imgSrc:  this.get('options').imgSrc || 'assets/components/upload-img/tmpNoImage.png',
                statusMsg: this.get('options').statusMsg || true,
                progressbar: this.get('options').progressbar || false,
                fileSizeLimit: this.get('options').fileSizeLimit || 1024 * 1024 * 2,
                fileTypes: this.get('options').fileTypes || 'png|jpg|jpeg',
                imgSize: JSON.stringify(this.get('options').imgSize) || JSON.stringify({
                    s: 300,
                    l: 600
                }),
                imgGetSize: this.get('options').imgGetSize || Object.keys(this.get('options').imgSize)[0],
                isUploadImgSize: this.get('options').isUploadImgSize || false
            }
            this.set('options', options);


            var privateFuncs = {
                setPersentage: function(persentage) {

                    if (options.progressbar) {
                        that.set('progressbar.persentage', persentage);
                    }
                },
                setStatusMsg: function(msg) {

                    if (options.statusMsg) {
                        $(self + ' .uploadStatus').html(msg);
                    }
                }
            };

            // 設定圖片寬度
            $(self + ' img').attr('width', options.imgWidth);



            // 上傳按鈕與input欄位綁定
            $(self + ' a[name=btnUpload]').click(function() {

                //options.tmpName = options.tmpName || options.imgName + '_' + new Date().getTime();

                //console.log('options.tmpName:' + options.imgGetSize);

                //這樣可以控制圖片的寬度喔
                //Ember.set(that.get('options'), 'imgWidth', 500);

                // 要修改object的property要用這樣的方式, 不能用this.get('progressbar').set('persentage', 10);
                //Ember.set(that.get('progressbar'), 'persentage', that.get('progressbar').persentage + 10);

                // 上傳按鈕與input欄位綁定
                $(self + ' input[name=file]').click();
            });


            $(self + ' input[name=file]').fileupload({
                url: options.host + options.service.send,
                dataType: 'json',
                formData: {
                    tmpName: options.tmpName,
                    imgSize: options.imgSize,
                    fileSize: options.file_size_limit
                },
                autoUpload: true,
                start: function(e, data) {

                },
                add: function(e, data) {


                    var isError = false;
                    var formatRegExp = new RegExp("\.(" + options.fileTypes + ")$", "g");
                    var formatCheck = formatRegExp.test(data.originalFiles[0]['name']);
                    
                    if (!formatCheck) {
                        //alert('圖片格式錯誤');


                        privateFuncs.setStatusMsg('圖片格式錯誤,請上傳格式為 ' + options.fileTypes.replace('|', ', ') + ' 的圖片');
                        isError = true;
                    }

                    if (data.originalFiles[0]['size'] > options.fileSizeLimit) {
                        //parent.showMessageBox('圖片檔案大小不得超過' + options.file_size_limit/1000/1000 + 'MB');
                        //alert('圖片檔案大小不得超過' + (options.fileSizeLimit / 1024 / 1024).toFixed(2) + 'MB')
                        privateFuncs.setStatusMsg('圖片檔案大小不得超過' + (options.fileSizeLimit / 1024 / 1024).toFixed(2) + 'MB');
                        isError = true;
                    }

                    if (isError === false) {
                        data.submit();
                    }
                },
                progress: function(e, data) {
                    var persent = parseInt(data.loaded / data.total * 100, 10);

                    privateFuncs.setPersentage(persent);
                    privateFuncs.setStatusMsg('上傳進度: ' + persent + '%');

                    //Ember.set(that.get('progressbar'), 'persentage', persent);
                },
                done: function(e, data) {

                    privateFuncs.setPersentage(100);
                    privateFuncs.setStatusMsg('上傳完成');

                    var result = data.result;

                    switch (result.status) {
                        
                        case true:

                            var data = {
                                tmpName: options.tmpName,
                                imgGetSize: options.imgGetSize
                            };

                            var success = function(res) {

                                if (res) {

                                    var url = res.src;

                                    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
                                        url = options.host + url;
                                    }

                                    if (options.isUploadImgSize) {
                                        $(self + ' img').attr('width', res.width)
                                                        .attr('height', res.height)
                                                        .attr('src', url);
                                    }
                                    else {
                                        $(self + ' img').attr('src', url);
                                    }
                                }
                                else {
                                    privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                                }
                            };

                            var error = function(res) {
                                privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                            }
                           
                            $.ajax({
                                dataType: 'json',
                                type: 'GET',
                                url: options.host + options.service.get,
                                data: data
                            }).then(success, error);

                            break;

                        case false:
                            privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                            //parent.showMessageBox(result.msg);
                            break;
                    }

             
                    Ember.run.later(null, function() {
                        privateFuncs.setPersentage(0);
                        privateFuncs.setStatusMsg('準備上傳');
                    }, 1500);
                    
                },
                fail: function(e, error) {
                }
            });
        }
    });
    __exports__["default"] = UploadImgComponent;
  });
define("appkit/controllers/application", 
  ["appkit/utils/cookieProxy","appkit/utils/auth","appkit/utils/routeProxy","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var cookieProxy = __dependency1__["default"];
    var auth = __dependency2__["default"];
    var routeProxy = __dependency3__["default"];



    var ApplicationController = Ember.ObjectController.extend({

    	currentPathDidChange: function() {

    		Ember.currentPath = this.get('currentPath');
        	this.set('currentPath', this.get('currentPath'));

        	console.log('app.currentPath: ' + this.get('currentPath'));
      	}.observes('currentPath'),


        loginModalMessage: function() {

            return '您尚未登入，即將跳轉登入頁';

        }.property(),


      	// 設定invoiceInterval跳窗按鈕
        loginModalButton: [
            Ember.Object.create({title: '確定', clicked: 'transitionToLogin'})
        ],

        loadingData: function() {

            return {
                msg: '儲存中',
                isMask: true,
                isShow: false,
                fadeInTime: 500,
                fadeOutTime: 500,
                delayTime: 0
            };

        }.property(),


    	didInsertElement: function() {

      	},


        actions: {

        	// 導頁到login頁面
            transitionToLogin: function() {

                // 清除目前$.cookie並導頁到login頁面
                auth.redirectForLogout();
                this.send('hideLoginModal');
            },
            showGrowlNotifications: function(title, msg, type) {

                var title = title || '';
                var msg = msg || '';
                var type = type || 'success';

                console.log(type);

                if (msg) {
                    Bootstrap.GNM.push(title, msg, type);
                }
            },
            // 顯示Notification
            showNotification: function(msg) {
                console.log('showNotification');
                var msg = msg || '欄位未通過驗證,無法送出';
                Bootstrap.NM.push(msg, 'danger');
            },
            // 顯示未登入提示Modal
            showLoginModal: function() {

                console.log('into showLoginModal');
                Bootstrap.ModalManager.show('loginModal');
            },
            // 隱藏未登入提示Modal
            hideLoginModal: function() {
            	Bootstrap.ModalManager.hide('loginModal');
            },
            // 顯示login
            showLoading: function(msg) {
                this.set('loadingData.msg', msg);
                this.set('loadingData.isShow', true);
            },
            // 隱藏login
            hideLoading: function() {
                this.set('loadingData.isShow', false);
            }
        }
    	
    });

    __exports__["default"] = ApplicationController;
  });
define("appkit/controllers/company", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var CompanyController = Ember.ObjectController.extend({

      hasSoftwareCerfMsg: function() {
        return this.get('hasSoftwareCerf') == 'Y' ? '已上傳' : '尚未上傳';
      }.property(),

      hasSoftwareCerfLabelClass: function() {
      	return this.get('hasSoftwareCerf') == 'Y' ? 'badge-success' : 'badge-important';
      }.property(),

      statusMsg: function() {
      	return this.get('status') == 'Y' ? '啟用' : '停用';
      }.property(),

      statusLabelClass: function() {
      	return this.get('status') == 'Y' ? 'badge-success' : 'badge-important';
      }.property(),

      auditStatusMsg: function() {
      	return this.get('auditStatus') == 'pass' ? '審核通過' : '審核中';
      }.property(),

      auditStatusLabelClass: function() {
      	return this.get('auditStatus') == 'pass' ? 'badge-success' : 'badge-important';
      }.property(),

      isDelete: function() {

      		var isDelete = false;

      		if (this.get('status') == 'N' && this.get('hasProject') == 'N') {
            	isDelete = true;
            }
            return isDelete;
      }.property()

    });

    __exports__["default"] = CompanyController;
  });
define("appkit/controllers/error", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var ErrorController = Ember.ObjectController.extend({



    });

    __exports__["default"] = ErrorController;
  });
define("appkit/controllers/login", 
  ["appkit/models/login","appkit/utils/cookieProxy","appkit/utils/routeProxy","appkit/utils/auth","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Login = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var routeProxy = __dependency3__["default"];
    var auth = __dependency4__["default"];

    var LoginController = Ember.ObjectController.extend({

    	validateData: function() {

    		return {

    			options: {

    				success:'valid',
    		        errorElement:'span',
    		        errorClass:'has-error',
    		        validClass: '',

    		   		highlight:function(element, errorClass, validClass) {

    			        $(element).parents('.form-group').addClass('has-error');   
    			    },
    			    unhighlight:function(element, errorClass, validClass) {

    			        $(element).parents('.form-group').removeClass('has-error');
    			    },
    		        errorPlacement: function(error, element) {

    		            error.appendTo($(element.parent()).siblings('span'));
    		        },
    		        rules: {
    		            'account': {
    		                required: true,
    		                //email: true
    		            },
    		            'password': {
    		            	required: true,
    		            	maxlength: 12,
    		            	minlength: 6,
    		            }
    		        },
    		        messages: {
    		            'account': {
    		                required: 'SSO帳號為必填',
    		                //email: 'email格式錯誤'
    		            },
    		            'password': {
    		            	required: '密碼為必填',
    		            	maxlength: '密碼字數不可超過12字',
    		            	minlength: '密碼字數不可少於6字',
    		            }
    		        }
    		    }
    		};
    	}.property(),

    	actions: {

    		login: function() {

    			console.log('trigger login!');

    			var that = this;

    			if ($(this.get('validateData.form')).valid()) {

    				var success = function(res) {

    					console.log('into success3');

    					Em.run(function() {

    						var minutes = 30;
    						var expires = new Date();
    						var member = {
    							memberId: res.memberId,
    							memberType: res.memberType,
    							account: res.account,
    							name: res.name
    						};

    						that.set('errorMsg', '');

    						if (that.get('isRemember')) {
    							minutes = 259200;
    						} 
    		
    						expires.setTime(expires.getTime() + (minutes * 60 * 1000));


    						// 設定cookie
    						cookieProxy.setCookie('token', res.token, {expires: expires}, null, true);
    						cookieProxy.setCookie('memberId', res.memberId, {expires: expires}, null, true);
    						cookieProxy.setCookie('member', member, {expires: expires}, null, true);


    						// 導頁到首頁
    			            Ember.run.later(null, function() {
    			            	auth.redirectForLogin();
    		                }, 100);

    		        	});
    				};

    				var error = function(res) {

    					console.log('into error3');

    					console.log(res);

    					// sso壞掉, 寫死登入資訊
    					/*
    					var minutes = 259200;
    					var expires = new Date();
    					var member = {
    						"memberId": "1",
    					    "memberType": "0",
    					    "account": "hank_kuo@hiiir.com",
    					    "name": "hank",
    					};

    					expires.setTime(expires.getTime() + (minutes * 60 * 1000));

    					$.cookie('token', 'R4hTnAug7ssT2GTrkyK36jY6OWhZ9ZmOkYn1xdFuua2s1pkiU-iUjkvXFYwjusXZw8C2nVNNZwbui9mbS-HGr6AaJSAgujfrb', {expires: expires});
    			        $.cookie('member', JSON.stringify(member), {expires: expires});


    			        that.transitionToRoute('main');

    					*/

    					// 如果ajax回來要做的事情要被測試, 就要用Em.run, 不然測試時會發生錯誤!
    					Em.run(function() {
    						console.log('login error');
    						that.set('errorMsg', res.responseText.message); // 將錯誤訊息塞入, 不過不用就註解掉吧
    					});
    					
    				};

    				Login.login(that.get('account'), that.get('password')).then(success, error);
    				

    				//console.log('aaa: ' + aaa);
    				//console.log(this.get('account'));
    				//console.log(this.get('password'));
    			}
    			else {
    				routeProxy.send('showNotification', '');
    			}
    		},
    	}
    });


    __exports__["default"] = LoginController;
  });
define("appkit/controllers/main", 
  ["appkit/utils/cookieProxy","appkit/utils/auth","appkit/utils/sidemenuData","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var cookieProxy = __dependency1__["default"];
    var auth = __dependency2__["default"];
    var sidemenuData = __dependency3__["default"];

    var MainController = Ember.ObjectController.extend({


    	menuData: function() {

    		var member = cookieProxy.getCookie('member');

    		return {

    			title: '發票系統-管理者後台',
    			titleLink: 'main.index',
    			userName: member.name,
    			userPhoto: 'assets/images/avatar.jpg',
    			hasToggleBtn: true,
    			hasUserMenu: true,
    			userMenu: [
                    {
                        actionName: 'profile',
                        icon: 'icon-user',
                        title: 'Profile',
                        hasDivider: true
                    },
    	            {
    	                actionName: 'logout',
    	                icon: 'icon-signout',
    	                title: '登出'
    	            }
    			]
    		};

    	}.property(),


    	sidemenuDataOrigin: function() {

    		return sidemenuData;

    	}.property(),

    	sidemenuData: function() {

            return sidemenuData;

    	}.property('this.sidemenuData'),


    	actions: {

    		headerMenu: function(param) {

    			switch (param) {

    				case 'profile':
    					this.transitionToRoute('main.profile');
    					break;

    				case 'logout':
    					auth.redirectForLogout();
    					break;
    			}

    			console.log(param);
    		}
    	}
    });

    __exports__["default"] = MainController;
  });
define("appkit/controllers/main/company-list", 
  ["appkit/models/company","appkit/utils/routeProxy","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var CompanyModel = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];
    var cookieProxy = __dependency3__["default"];

    var CompanyListController = Ember.ArrayController.extend({

        itemController: 'company', // itemController的檔案要放在controlls/裡面, 放在controlls/的sub-folder都讀不到

        search: function() {

            return CompanyModel.hash['search'];

        }.property(),

    /*
        tableData: function() {

            var data = this.get('model');

            data.forEach(function(item) {

                item['hasSoftwareCerfMsg'] = item.hasSoftwareCerf == 'Y' ? '已上傳' : '尚未上傳';
                item['hasSoftwareCerfLabelClass'] = item.hasSoftwareCerf == 'Y' ? 'badge-success' : 'badge-important';

                item['statusMsg'] = item.status == 'Y' ? '啟用' : '停用';
                item['statusLabelClass'] = item.status == 'Y' ? 'badge-success' : 'badge-important';
                item['auditStatusMsg'] = item.auditStatus == 'pass' ? '審核通過' : '審核中';
                item['auditStatusLabelClass'] = item.auditStatus == 'pass' ? 'badge-success' : 'badge-important';
                
                item['isDelete'] = false;

                if (item['status'] == 'N' && item['hasProject'] == 'N') {
                    item['isDelete'] = true;
                }
                 
            });
            return data;

        }.property('this.model'),*/


        pageData: function() {

            return {
                currentPage: CompanyModel.hash['currentPage'],
                totalPage: CompanyModel.hash['totalPage'],
                pageSize: CompanyModel.hash['pageSize']
            };

        }.property('this.model'),


        companyValidateData: function() {

            return {

                // 欲使用自定的驗證方法
                addMethods: {

                    alphabet: {
                        method: function(value, element) {
                            return this.optional(element) || /^[A-Z]+$/.test(value);
                        },
                        msg: '只能包括大寫英文字母'
                    }
                },
                options: {

                    success: 'valid',
                    errorElement: 'p',
                    errorClass: 'has-error',
                    validClass: '',
                    errorPlacement: function(error, element) {

                        var helpBlock = $(element).siblings('.help-block');

                        if (helpBlock.length == 0) {
                            helpBlock = $(element.parent()).siblings('.help-block');
                        }
                    
                        error.appendTo(helpBlock);
                        
                    },
                    highlight: function(element, errorClass, validClass) {

                        $(element).parents('.form-group').addClass(errorClass);
                        
                    },
                    unhighlight: function(element, errorClass, validClass) {

                        $(element).parents('.form-group').removeClass(errorClass);
                        
                    },
                    rules: {
                        'companyName': {
                            required: true,
                            maxlength: 30,
                            minlength: 2
                        },
                        'registrationNo': {
                            required: true,
                            digits: true,
                            maxlength: 9,
                            minlength: 9
                        },
                        'permitWord': {
                            required: true,
                            maxlength: 50,
                            minlength: 10
                        },
                        'contactPersonEmail': {
                            required: true,
                            email: true
                        }
                    },
                    messages: {
                        'companyName': {
                            required: '必填',
                            maxlength: '最多30個字',
                            minlength: '最少2個字'
                        },
                        'registrationNo': {
                            required: '必填',
                            digits: '必須為0~9整數',
                            maxlength: '必須為9位數字',
                            minlength: '必須為9位數字'
                        },
                        'permitWord': {
                            required: '必填',
                            maxlength: '最多50個字',
                            minlength: '最少10個字'
                        },
                        'contactPersonEmail': {
                            required: '必填',
                            email: 'email格式錯誤'
                        }
                    },
                }
            };

        }.property(),


        // 設定跳窗按鈕
        editCompanyModalButtons: [
            Ember.Object.create({
                title: '儲存',
                clicked: 'saveConfirmModalForCompany'
            }),
            Ember.Object.create({
                title: '取消',
                clicked: 'cancelConfirmModalForCompany'
            })
        ],
        // 空資料並設定初始值
        companyData: function() {

            var data = CompanyModel.create();
            data.auditStatus = 'auditing';
            data.status = 'N';

            return data;

        }.property(),

        actions: {

            // 新增資料
            newCompany: function() {

                var data = CompanyModel.create();
                data.auditStatus = 'auditing';
                data.status = 'N';

                this.set('statusDisabled', true);
                this.set('companyData', data);
                this.set('editCompanyModalTitle', '新增營業人');
                Bootstrap.ModalManager.show('editCompanyModal');
            },

            // 編輯資料
            editCompany: function(id) {

                var that = this;

                var success = function(res) {
                    that.set('companyData', res);
                    that.set('editCompanyModalTitle', '編輯字軌');
                    Bootstrap.ModalManager.show('editCompanyModal');
                };

                var error = function(res) {

                };

                CompanyModel.find(id).then(success, error);
                
            },

            // 上傳檔案
            upload: function(file) {

                var data = this.get('companyData');
                data.softwareCerf = file;
                this.set('companyData', data);
            },

            // 上傳檔案錯誤callback 
            uploadError: function(msg) {

                //alert(msg);
                routeProxy.send('showGrowlNotifications', '檔案上傳發生錯誤!', msg, 'danger');
            },


            // 清除表單valid的樣式
            clearCompanyValidStatus: function() {
                this.set('companyErrorMsg', false); // 清除alert
                $(this.get('companyValidateData.form')).validate().resetForm(); // 清除上次驗證錯誤資訊
                $('.form-group').removeClass('has-error'); // 清除欄位紅框樣式
            },

            // 是否要儲存確認視窗設定
            saveConfirmModalForCompany: function() {


                if (!$(this.get('companyValidateData.form')).valid()) {
                    this.set('companyErrorMsg', true);
                    return false;
                }

                // 清除validate相關樣式
                this.send('clearCompanyValidStatus');

                this.set('confirmMessage', '確認要儲存嗎?');
                this.set('confirmModalButton', [
                    Ember.Object.create({
                        title: '確定',
                        clicked: 'submitEditCompanyModal'
                    }),
                    Ember.Object.create({
                        title: '取消',
                        clicked: 'reopenEditConfirmModal'
                    })
                ]);

                Bootstrap.ModalManager.show('confirmModal');
                Bootstrap.ModalManager.hide('editCompanyModal');
            },
            // 是否要取消儲存的確認視窗設定
            cancelConfirmModalForCompany: function() {

                this.set('confirmMessage', '確認要取消儲存嗎?');
                this.set('confirmModalButton', [
                    Ember.Object.create({
                        title: '確定',
                        clicked: 'cancelEditConfirmModal'
                    }),
                    Ember.Object.create({
                        title: '取消',
                        clicked: 'reopenEditConfirmModal'
                    })
                ]);

                Bootstrap.ModalManager.show('confirmModal');
                Bootstrap.ModalManager.hide('editCompanyModal');
            },


            // 將表單內容送出
            submitEditCompanyModal: function() {

                // 清除validate相關樣式
                this.send('clearCompanyValidStatus');

                Bootstrap.ModalManager.hide('confirmModal');

                var that = this;
                var data = this.get('companyData');
                var actionMsg = '';

                var success = function(res) {

                    console.log('上傳成功, 到controller了!')

                    // 畫面reload
                    that.transitionToRoute('main.companyList', CompanyModel.hash['currentPage']);

                    // 顯示grow notifications
                    routeProxy.send('showGrowlNotifications', 'SUCCESS!', '營業人' + actionMsg +'成功', 'success');
                };

                var error = function(res) {
                    routeProxy.send('showGrowlNotifications', 'WARN!', '營業人' + actionMsg + '發生錯誤, 請再試一次', 'warning');
                };

                delete data.hasProject;
                delete data.hasSoftwareCerf;

                // 將資料送到server
                if (!data.companyId) { // 新增

                    actionMsg = '新增';
                    CompanyModel.insert(data).then(success, error);
                }
                else { // 刪除
                    actionMsg = '編輯';
                    CompanyModel.update(data).then(success, error);
                }

            },
            // 關閉modal
            cancelEditConfirmModal: function() {

                 // 清除validate相關樣式
                this.send('clearCompanyValidStatus');

                Bootstrap.ModalManager.hide('confirmModal');
                Bootstrap.ModalManager.hide('editCompanyModal');
            },
            // 重新顯示Modal
            reopenEditConfirmModal: function() {
                Bootstrap.ModalManager.hide('confirmModal');
                Bootstrap.ModalManager.show('editCompanyModal');
            },


            // 刪除


            // 開啟刪除確認modal
            deleteConfirmModalForCompany: function(companyId) {

                // 儲存資料
                var data = CompanyModel.create();
                data.companyId = companyId;
                this.set('companyData', data);


                this.set('confirmTitle', '刪除營業人');
                this.set('confirmMessage', '確認要刪除營業人嗎?');
                this.set('confirmModalButton', [
                    Ember.Object.create({
                        title: '確定',
                        clicked: 'deleteForComapny'
                    }),
                    Ember.Object.create({
                        title: '取消',
                        clicked: 'closeDeleteConfirmModalForCompany'
                    })
                ]);
                Bootstrap.ModalManager.show('confirmModal');
            },

            // 關閉刪除確認modal
            closeDeleteConfirmModalForCompany: function() {
                Bootstrap.ModalManager.hide('confirmModal');
            },

            // 刪除資料
            deleteForComapny: function() {

                Bootstrap.ModalManager.hide('confirmModal');

                var that = this;
                var data = this.get('companyData');

                var success = function(res) {

                    // 畫面reload
                    that.transitionToRoute('main.companyList', CompanyModel.hash['currentPage']);

                    // 顯示grow notifications
                    routeProxy.send('showGrowlNotifications', 'SUCCESS!', '營業人刪除成功', 'success');
                };

                var error = function(res) {
                    routeProxy.send('showGrowlNotifications', 'WARN!', '營業人刪除發生錯誤, 請再試一次', 'warning');
                };

                 // 將資料送到server
                CompanyModel.delete(data).then(success, error);
            },





            // 點擊頁碼時
            changePage: function(page) {
                this.transitionToRoute('main.companyList', page);
            },

            // 根據搜尋條件拿取資料
            search: function() {

                var searchData = {
                    search: this.get('search')
                };

                cookieProxy.setCookie('companyData', searchData);
                this.transitionToRoute('main.companyList', 1);

            },

            // 清除所有搜尋條件
            clear: function() {

                // ember很奇怪, 如果頁碼是''的話, 會帶入原本的頁碼並清除url上的頁碼
                this.transitionToRoute('main.companyList', ' ');
            }
         
        }


    });

    __exports__["default"] = CompanyListController;
  });
define("appkit/controllers/main/company-list/company-detail", 
  ["appkit/models/company","appkit/utils/routeProxy","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var CompanyModel = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];
    var cookieProxy = __dependency3__["default"];

    var companyDetailController = Ember.ObjectController.extend({


        actions: {

            // 新增資料
            back: function() {

                //window.history.back();
                this.transitionToRoute('main.companyList', ' ');
            }

        }


    });

    __exports__["default"] = companyDetailController;
  });
define("appkit/controllers/main/index", 
  ["exports"],
  function(__exports__) {
    "use strict";


    var MainController = Ember.ObjectController.extend({



    });

    __exports__["default"] = MainController;
  });
define("appkit/controllers/main/project-list", 
  ["appkit/models/project","appkit/utils/routeProxy","appkit/utils/cookieProxy","appkit/utils/globalObjFunc","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var ProjectModel = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];
    var cookieProxy = __dependency3__["default"];
    var globalObjFunc = __dependency4__["default"];

    var ProjectListController = Ember.ArrayController.extend({

        search: function() {

            return ProjectModel.hash['search'];

        }.property(),


        tableData: function() {

            var data = this.get('model');

            data.forEach(function(item) {

                item['statusMsg'] = item.status == 'Y' ? '啟用' : '停用';
                item['statusLabelClass'] = item.status == 'Y' ? 'badge-success' : 'badge-important';
                item['consoleStatusMsg'] = item.consoleStatus == 'enable' ? '開啟' : item.consoleStatus == 'disable' ? '關閉' : '刪除';
                item['consoleStatusLabelClass'] = item.consoleStatus == 'enable' ? 'badge-success' : item.consoleStatus == 'disable' ? 'badge-warning' : 'badge-important';
                item['editBtnMsg'] = item['companyId'] == -1 ? '設定營業人' : '編輯';
       
            });
            return data;

        }.property('this.model'),

        pageData: function() {

            return {
                currentPage: ProjectModel.hash['currentPage'],
                totalPage: ProjectModel.hash['totalPage'],
                pageSize: ProjectModel.hash['pageSize']
            };

        }.property('this.model'),

        projectData: function() {

            var data = ProjectModel.create();
            data.status = 'N';

            return data;

        }.property(),

        statisticListData: function() {

            var companyStatusCount = ProjectModel.hash['companyStatusCount'];
            var searchCompanyStatus = ProjectModel.hash['searchCompanyStatus'];
            var options = {
                titleIcon: 'icon-group',
                titleIconType: '',
                title:  '已設定專案營業人統計',
                titleType: '',
                width: 4,
                canClick:  true,
                hoverColor: '#00ACEC',
                selectedColor: '#F5F5F5',
                listData: [
                    {
                        icon: 'icon-home',
                        iconType: '',
                        title: companyStatusCount.all,
                        titleType: '',
                        content: '全部',
                        value: 'all',
                    },
                    {
                        icon: 'icon-ok',
                        iconType: 'primary',
                        title: companyStatusCount.hasCompany,
                        titleType: 'primary',
                        content: '已設定',
                        value: '1',
                    },
                    {
                        icon: 'icon-warning-sign',
                        iconType: 'warning',
                        title: companyStatusCount.noCompany,
                        titleType: 'warning',
                        content: '尚未設定',
                        value: '0',
                    }
                ]
            };

            return options;   

        }.property(),

        statisticListSelectedItem: function() {

            var searchCompanyStatus = ProjectModel.hash['searchCompanyStatus'] || 'all';

            return searchCompanyStatus;

        }.property(),

        editSelectData: function() {

            var globalObj = globalObjFunc();

            var data = {
                projectCompanyData: globalObj.projectCompanyAry,
            };

            return data;

        }.property(),

        projectValidateData: function() {

            return {

                // 欲使用自定的驗證方法
                options: {

                    success: 'valid',
                    errorElement: 'p',
                    errorClass: 'has-error',
                    validClass: '',
                    errorPlacement: function(error, element) {

                        var helpBlock = $(element).siblings('.help-block');

                        if (helpBlock.length == 0) {
                            helpBlock = $(element.parent()).siblings('.help-block');
                        }
                    
                        error.appendTo(helpBlock);
                        
                    },
                    highlight: function(element, errorClass, validClass) {

                        $(element).parents('.form-group').addClass(errorClass);
                        
                    },
                    unhighlight: function(element, errorClass, validClass) {

                        $(element).parents('.form-group').removeClass(errorClass);
                        
                    },
                    rules: {
                        'companyId': {
                            required: true,
                        }
                    },
                    messages: {
                        'companyId': {
                            required: '必填',
                        }
                    },
                }
            };

        }.property(),



        // 設定跳窗按鈕
        editProjectModalButtons: [
            Ember.Object.create({
                title: '儲存',
                clicked: 'saveConfirmModalForProject'
            }),
            Ember.Object.create({
                title: '取消',
                clicked: 'cancelConfirmModalForProject'
            })
        ],


        actions: {


            // 開啟編輯頁面
            editProject: function(id) {

                var that = this;

                var success = function(res) {

                    that.set('canSelectCompany', true);

                    if (res.companyId == '-1') {
                        that.set('canSelectCompany', false);
                    }

                    that.set('projectData', res);
                    that.set('editProjectModalTitle', '專案營業人設定');
                    Bootstrap.ModalManager.show('editProjectModal');
                };

                var error = function(res) {

                };

                ProjectModel.find(id).then(success, error);
            },



            // 清除表單valid的樣式
            clearCompanyValidStatus: function() {
                this.set('projectErrorMsg', false); // 清除alert
                $(this.get('projectValidateData.form')).validate().resetForm(); // 清除上次驗證錯誤資訊
                $('.form-group').removeClass('has-error'); // 清除欄位紅框樣式
            },


            // 是否要儲存確認視窗設定
            saveConfirmModalForProject: function() {


                if (!$(this.get('projectValidateData.form')).valid()) {
                    this.set('projectErrorMsg', true);
                    return false;
                }

                // 清除validate相關樣式
                this.send('clearCompanyValidStatus');

                var data = this.get('projectData');
                var editSelectData = this.get('editSelectData');
                var companyHash = {};

                // 建立companyHash
                editSelectData.projectCompanyData.forEach(function(item) {
                    companyHash[item['companyId']] = item['companyName'];
                });
                this.set('companyHash', companyHash);



                this.set('confirmMessage', '確定要儲存嗎?');

                if (!this.get('canSelectCompany')) {
                    this.set('confirmMessage', '確定要設定 ' + data.projectName + ' 所屬營業人為 ' + companyHash[data.companyId] + ' 嗎?\n(設定後不可變更)');
                }

                this.set('confirmModalButton', [
                    Ember.Object.create({
                        title: '確定',
                        clicked: 'submitEditProjectModal'
                    }),
                    Ember.Object.create({
                        title: '取消',
                        clicked: 'reopenEditConfirmModal'
                    })
                ]);

                Bootstrap.ModalManager.show('confirmModal');
                Bootstrap.ModalManager.hide('editProjectModal');
            },
            // 是否要取消儲存的確認視窗設定
            cancelConfirmModalForProject: function() {

                this.set('confirmMessage', '確認要取消儲存嗎?');
                this.set('confirmModalButton', [
                    Ember.Object.create({
                        title: '確定',
                        clicked: 'cancelEditConfirmModal'
                    }),
                    Ember.Object.create({
                        title: '取消',
                        clicked: 'reopenEditConfirmModal'
                    })
                ]);

                Bootstrap.ModalManager.show('confirmModal');
                Bootstrap.ModalManager.hide('editProjectModal');
            },

                    // 將表單內容送出
            submitEditProjectModal: function() {

                // 清除validate相關樣式
                this.send('clearCompanyValidStatus');

                Bootstrap.ModalManager.hide('confirmModal');

                var that = this;
                var data = this.get('projectData');
      
                var success = function(res) {

                    console.log('上傳成功, 到controller了!')

                    // 畫面reload
                    that.transitionToRoute('main.projectList', ProjectModel.hash['currentPage']);

                    // 顯示grow notifications
                    routeProxy.send('showGrowlNotifications', 'SUCCESS!', '專案營業人設定成功', 'success');
                };

                var error = function(res) {
                    routeProxy.send('showGrowlNotifications', 'WARN!', '專案營業人設定發生錯誤, 請再試一次', 'warning');
                };


                delete data.projectName;
                delete data.ownerAccount;
                delete data.companyName;
                delete data.consoleStatus;
                
                ProjectModel.update(data).then(success, error);
                
            },

            // 關閉modal
            cancelEditConfirmModal: function() {

                 // 清除validate相關樣式
                //this.send('clearCompanyValidStatus');

                Bootstrap.ModalManager.hide('confirmModal');
                Bootstrap.ModalManager.hide('editProjectModal');
            },

            // 重新顯示Modal
            reopenEditConfirmModal: function() {
                Bootstrap.ModalManager.hide('confirmModal');
                Bootstrap.ModalManager.show('editProjectModal');
            },

            // 點擊頁碼時
            changePage: function(page) {
                this.transitionToRoute('main.projectList', page);
            },

            // 根據搜尋條件拿取資料
            search: function(searchCompanyStatus) {


                console.log('controller search trigger!');
                var projectDataCookie = cookieProxy.getCookie('projectData');


                projectDataCookie.search = this.get('search');

                if (searchCompanyStatus) {
                    projectDataCookie.searchCompanyStatus = searchCompanyStatus;
                }

                cookieProxy.setCookie('projectData', projectDataCookie);
                this.transitionToRoute('main.projectList', 1);

            },

            // 清除所有搜尋條件
            clear: function() {

                // ember很奇怪, 如果頁碼是''的話, 會帶入原本的頁碼並清除url上的頁碼
                this.transitionToRoute('main.projectList', ' ');
            }
         
        }

    });

    __exports__["default"] = ProjectListController;
  });
define("appkit/models/base", 
  ["appkit/utils/cookieProxy","appkit/utils/routeProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var cookieProxy = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];

    var config = {
        host: {
            default: window.ENV.default,

        }
    };

    // local storage
    var store = {};

    // private方法
    var privateFunc = {
       
        /*
         * 初始化local storage, 如果key為modelName的local storage
         * $param (string) modelName 資料名稱
         */
        initStore: function(modelName) {
            if (!store[modelName]) {
                store[modelName] = Em.A();
            }
        },
        /*
         * 正規化資料,把ember object特有的資料去除, 轉變成一般的object
         * $param (array) pdata 欲處理的資料
         */
        serialize: function(pdata) {
            var result = {};

            if (pdata !== null && typeof pdata === 'object') {

                for (var key in $.extend(true, {}, pdata)) {

                    // Skip these
                    if (key === 'isInstance' || key === 'isDestroyed' ||
                        key === 'isDestroying' || key === 'concatenatedProperties' ||
                        typeof pdata[key] === 'function' || key === 'validationErrors') {
                        continue;
                    }
                    result[key] = pdata[key];
                }
            }
            return result;
        }
    };


    var BaseModel = Ember.Object.extend({

        init: function() {

            if (Em.isNone(this.constructor.storageKey)) {
                throw new Error(Ember.String.fmt("%@ has to implement storageKey property or method", [this]));
            }
            this._super();
        }
    });

    BaseModel.reopenClass({

        // 繼承的子類別都要定義, 不然會出錯
        storageKey: null,

        getHost: function(hostKey) {
            return config.host[hostKey];
        },



        /*
         * 同jquery $.getJSON()
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        /*
        getJSON: function(purl, pdata, phost) {

            var host = phost || config.host;
            var data = this.serialize(pdata);
            return $.getJSON(host + purl, data);
        },
        */

         /*
         * 同jquery $.get()
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) pDataType 回傳資料格式設定 ex: 'json', 預設為'json'
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        get: function(purl, pdata, pDataType, phost) {

            console.log('into get');

            return this.ajax({
                dataType: pDataType,
                type: 'GET',
                url: purl,
                host: phost,
                data: pdata
            });

        },
        /*
         * 同jquery $.post()
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) pDataType 回傳資料格式設定 ex: 'json', 預設為'json'
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        post: function(purl, pdata, pDataType, phost) {

            console.log('into post');

            return this.ajax({
                dataType: pDataType,
                type: 'POST',
                url: purl,
                host: phost,
                data: pdata
            });
        },
        /*
         * 送出http request PUT
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) pDataType 回傳資料格式設定 ex: 'json', 預設為'json'
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        put: function(purl, pdata, pDataType, phost) {

            console.log('into post');

            return this.ajax({
                dataType: pDataType,
                type: 'PUT',
                url: purl,
                host: phost,
                data: pdata
            });
        },
        /*
         * 送出http request DELETE
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) pDataType 回傳資料格式設定 ex: 'json', 預設為'json'
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        delete: function(purl, pdata, pDataType, phost) {

            console.log('into post');

            return this.ajax({
                dataType: pDataType,
                type: 'DELETE',
                url: purl,
                host: phost,
                data: pdata
            });
        },
        /*
         * 同jquery $.ajax()
         * params (object)
         *  $param (string) url 網址 ex: /getPost
         *  $param (array)  data 欲傳遞參數
         *  $param (string) dataType 回傳資料格式設定 ex: 'json', 預設為'json'
         *  $param (string) host 網域 ex: http://www.yahoo.com
         *  $param (string) type 欲送出之協定, 一般為GET, POST, PUT, DELETE, 預設為POST
         */
        ajax: function(params) {

            //throw 'token';

            var msg = '';

            switch (params.type) {

                case 'GET':
               
                    if (params.url == '/login') {   
                        msg = '登入中，請稍後...';
                    }
                    else {
                        msg = '取得資料中，請稍後...';
                    }
                    break;

                case 'POST':
                    msg = '儲存資料中，請稍後...';
                    break;

                case 'PUT':
                    msg = '儲存資料中，請稍後...';
                    break;

                case 'DELETE':
                    msg = '刪除資料中，請稍後...';
                    break;
            }



            // 檢查cookie有無memberId或是AUTHORIZATION
            if (cookieProxy.isLogin() === false) {

                if (params.url != '/login') {
                    throw 'token';
                }
            }
            else {
                routeProxy.send('showLoading', msg);
            }


            var url = params.url;
            var host = params.host || config.host.default;
            var dataType = params.dataType || 'json';
            var type = params.type || 'POST';
            var data = privateFunc.serialize(params.data);
            var headers = params.headers || {
                    AUTHORIZATION: cookieProxy.getCookie('token')
                };
            var that = this;
            var ajaxData = {};

            var parseResponseText = function(res) {

                if (res.responseText) {

                    try {
                        res.responseText = JSON.parse(res.responseText);
                    }
                    catch(e) {
                         throw new Error(Ember.String.fmt("JSON.parse發生錯誤!"));
                    }
                }
                return res;
            };



            // 統一帶入參數
            data.memberId = cookieProxy.getCookie('memberId');


            ajaxData = {
                dataType: dataType,
                type: type,
                url: host + url,
                data: data,
                headers: headers
            };

            // backend要求要這樣, 非GET要多帶processData跟contentType, 然後data要變成字串
            if (type != 'GET') {
                ajaxData.processData = false;
                ajaxData.contentType = 'application/json; charset=UTF-8';
                ajaxData.data = JSON.stringify(ajaxData.data);
            }

            console.log(ajaxData);
         
            /*
            不在base做error callback, 讓error bubble上去到要使用的controller或route中,
            如果在這邊return 任何值, 在往上會被當作success callback處理
            因此改用Ember.RSVP.Promise, 可將success or error的response一路往上拋到呼叫的進入點

            新版已經沒有這個問題，所以RSVP.Promise跟ic.ajax就拿掉了
            */

            var success = function(res) {

                routeProxy.send('hideLoading');
                console.log('into success1');

                res = parseResponseText(res);
                return res;
            };

            var error = function(res) {

                routeProxy.send('hideLoading');
                console.log('into error1');

                /*
                // 如果有錯誤, 需要共同的onerror來接, 可以用RSVP來達成
                // reject全部都會被RSVP.onerror來接
                var deferred = Ember.RSVP.defer();
                deferred.reject("End of the world");
                */

                res = parseResponseText(res);
                return res;
            };
            return Ember.$.ajax(ajaxData).then(success, error);
        },
        /*
         * 取得local storage資料
         * $param (string) modelName 資料名稱
         * $param (array) returnType: Ember Array
         */
        getter: function(modelName) {

            var modelName = modelName || this.storageKey;

            privateFunc.initStore(modelName);

            return store[modelName];
        },
        /*
         * 儲存local storage資料
         * $param (array) data 欲儲存資料
         * $param (string) key 欲儲存資料比對用id
         * $param (string) modelName 資料名稱
         */
        setter: function(data, key, modelName) {

            var modelName = modelName || this.storageKey;
            var key = key || '_id';
            var that = this;
           
            privateFunc.initStore(modelName);

            data.forEach(function(child) {

                var removeData = that.getter(modelName).findBy(key, child[key]);

                //console.log('removeData: ' + removeData);
                //console.log('modelName: ' + modelName);

                if (removeData) {
                    that.getter(modelName).removeObject(removeData);
                    that.getter(modelName).pushObject(child);
                }
                else {
                    console.log('pushObject');
                    that.getter(modelName).pushObject(child);
                }

            });
        },
        /*
         * 更新local storage一筆特定資料
         * $param (ember object) data 欲儲存資料
         * $param (string) key 欲儲存資料比對用id
         * $param (string) value 欲儲存資料比對用value
         * $param (string) modelName 資料名稱
         */
        setterBy: function(data, key, value, modelName) {

            var modelName = modelName || this.storageKey;
            var key = key || '_id';
            var removeData = this.getter(modelName).findBy(key, value);

            if (Em.isNone(value)) {
                throw new Error(Ember.String.fmt('setterBy: value is required'));
            }
            else if (Em.isNone(data)) {
                throw new Error(Ember.String.fmt('setterBy: data is required'));
            }

            if (removeData) {
                this.getter().removeObject(removeData);
                this.getter().pushObject(data);
            }
        }

    });

    __exports__["default"] = BaseModel;
  });
define("appkit/models/company", 
  ["appkit/models/base","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];


    var CompanyModel = BaseModel.extend({

        init: function() {
            this._super();
        },
        companyId: '',
        companyName: '',
        registrationNo: '',
        permitDate: '',
        permitWord: '',
        contactPersonEmail: '',
        auditStatus: '',
        status: '',
        hasProject: '',
        hasSoftwareCerf: '',

        serialize: function() {
            //return this.getProperties(['email', 'password']);
        }
    });

    CompanyModel.reopenClass({

        // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
        storageKey: 'company',

        hash: {},

        find: function(id) {


            var that = this;

            var success = function() {
                console.log('success2');
                console.log(res);
                return CompanyModel.create(res);  
            };

            var error = function() {
                console.log('error2');
                return res;
            };

            return that.get('/company/' + id, null, 'json', null).then(success, error);

        },


        findByPage: function(condi) {
     
            var that = this;
            var companyDataCookie = cookieProxy.getCookie('companyData');

            var inputCondi = {
                currentPage: condi.currentPage || companyDataCookie.currentPage || 1,
                search: condi.search || companyDataCookie.search || ''
            };

            that.hash['search'] = inputCondi.search;

            return that.get('/company', inputCondi, 'json', null).then(function(res) {

                console.log('res.currentPage: ' +res.currentPage);

                that.hash['currentPage'] = +res.currentPage;
                that.hash['totalPage'] = +res.totalPage;
                that.hash['pageSize'] = +res.pageSize;

                console.log(res);


                cookieProxy.setCookie('companyData', that.hash);


                var data = Em.A();

                res.company.forEach(function(child) {
                    data.pushObject(CompanyModel.create(child));
                });

                that.setter(data, 'companyId');
            
                return data;  

            }, function(data) {

                console.log('error3!!!!');
                return data;
            });
        },

        insert: function(data) {

            console.log('新增一筆營業人');

            var that = this;

            var success = function(res) {

                console.log('新增成功');

                data.companyId = res.companyId;

                return data;
            };

            var error = function(res) {

            };

            return that.post('/company', data, 'text').then(success, error);
        },

        update: function(data) {

            console.log('更新一筆營業人');

            var that = this;

            var success = function(res) {

                console.log('更新成功');

                data.companyId = res.companyId;

                return data;
            };

            var error = function(res) {

            };

            return that.put('/company/' + data.companyId, data, 'text').then(success, error);
        },

        delete: function(data) {

            console.log('刪除一筆營業人');

            console.log(data.companyId);


            var that = this;

            var success = function(res) {
                console.log('刪除成功');
                return true;
            };

            var error = function(res) {
                console.log('刪除失敗');
                return false;
            };

            // TODO: api-stub用delete會有問題, 所以先用get假裝一下
            return that.get('/company', data.companyId, 'text').then(success, error);
        }

    });

    __exports__["default"] = CompanyModel;
  });
define("appkit/models/invoice-interval", 
  ["appkit/models/base","appkit/utils/cookieProxy","appkit/utils/globalObjFunc","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var globalObjFunc = __dependency3__["default"];


    var InvoiceIntervalModel = BaseModel.extend({

        init: function() {
            this._super();
        },
        invoiceIntervalId: '',
        companyId: '',
        companyName: '',
        startYear: '',
        startMonth: '',
        alphabet: '',
        startInvoiceNo: '',
        endInvoiceNo: '',
        currentNo: '',
        invoiceType: '',

        // Tells the resistance layer what properties to save to localStorage
        // Ember Data does this for you.
        serialize: function() {
            //return this.getProperties(['email', 'password']);
        }
    });

    InvoiceIntervalModel.reopenClass({

        // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
        storageKey: 'invoiceInterval',

        hash: {},

        find: function(id) {

            var that = this;


            return that.get('/invoiceInterval/' + id, null, null, null).then(function(res) {

                return InvoiceIntervalModel.create(res);  

            });

        },


        findByPage: function(condi) {

            var globalObj = globalObjFunc();

            var that = this;
            var invoiceIntervalDataCookie = cookieProxy.getCookie('invoiceIntervalData');

            var inputCondi = {
                currentPage: condi.currentPage || invoiceIntervalDataCookie.currentPage || 1,
                searchCompanyId: condi.searchCompanyId || invoiceIntervalDataCookie.searchCompanyId || 'all',
                searchYear: condi.searchYear || invoiceIntervalDataCookie.searchYear || globalObj.thisYear,
                searchMonth: condi.searchMonth || invoiceIntervalDataCookie.searchMonth || 'all',
                searchInvoiceType: condi.searchInvoiceType || invoiceIntervalDataCookie.searchInvoiceType || 'all',
                search: condi.search || invoiceIntervalDataCookie.search || ''
            };

            //that.hash['memberId'] = defaultCondi.memberId;
            that.hash['searchCompanyId'] = inputCondi.searchCompanyId;
            that.hash['searchYear'] = inputCondi.searchYear;
            that.hash['searchMonth'] = inputCondi.searchMonth;
            that.hash['searchInvoiceType'] = inputCondi.searchInvoiceType;
            that.hash['search'] = inputCondi.search;

            console.log('show hash');
            console.log(that.hash);


            return that.get('/invoiceInterval', inputCondi, null, null).then(function(res) {

                console.log('res.currentPage: ' +res.currentPage);

                that.hash['currentPage'] = +res.currentPage;
                that.hash['totalPage'] = +res.totalPage;
                that.hash['pageSize'] = +res.pageSize;


                cookieProxy.setCookie('invoiceIntervalData', that.hash);


                var data = Em.A();

                res.invoiceInterval.forEach(function(child) {
                    data.pushObject(InvoiceIntervalModel.create(child));
                });

                that.setter(data, 'invoiceIntervalId');
            
                return data;  

            });
        },

        insert: function(data) {

            console.log('新增一筆發票字軌');

            var that = this;

            var success = function(res) {

                console.log('新增成功');

                data.invoiceIntervalId = res.invoiceIntervalId;

                return data;
            };

            var error = function(res) {

            };

            return that.post('/invoiceInterval', data).then(success, error);
        }


    });




    __exports__["default"] = InvoiceIntervalModel;
  });
define("appkit/models/login", 
  ["appkit/models/base","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];


    var LoginModel = BaseModel.extend({

        init: function() {
            this._super();
        },
        account: '',
        password: '',
        errorMsg: '',
        isRemember: false,
        // Tells the resistance layer what properties to save to localStorage
        // Ember Data does this for you.
        serialize: function() {
            //return this.getProperties(['email', 'password']);
        }
    })

    LoginModel.reopenClass({

        // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
        storageKey: 'login',

        login: function(account, password) {

            console.log('######## hello login!');

            var that = this;
            var data = {
                account: account,
                password: password
            };

            var success = function(res) {
                console.log('into success2');
                return res;
                
            };

            var error = function(res) {
                console.log('into error2');
                return res;
            };

            return that.get('/login', data).then(success, error);
        }

    });

    __exports__["default"] = LoginModel;
  });
define("appkit/models/member-company", 
  ["appkit/models/base","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];


    var MemberCompanyModel = BaseModel.extend({

        init: function() {
            this._super();
        },
        companyId: '',
        companyName: '',

        // Tells the resistance layer what properties to save to localStorage
        // Ember Data does this for you.
        serialize: function() {
            //return this.getProperties(['email', 'password']);
        }
    });

    MemberCompanyModel.reopenClass({

        // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
        storageKey: 'memberCompany',

        hash: {},
        
        findAll: function(type) {

            console.log('findAll');

            var data = [];

            if (type == 'search') {

                data.push({
                    companyId: 'all',
                    companyName: '全部'
                });
            }


            var memberId = cookieProxy.getCookie('memberId');

            var success = function(res) {

                res.company.forEach(function(child) {
                    data.pushObject(MemberCompanyModel.create(child));
                });

                that.setter(data, 'comapnyId');
            };

            var error = function(res) {

            };

            this.get('/memberCompany/' + memberId, null, null, null).then(success, error);

            return  data;
        }
    });

    __exports__["default"] = MemberCompanyModel;
  });
define("appkit/models/project-company", 
  ["appkit/models/base","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];


    var ProjectCompanyModel = BaseModel.extend({

        init: function() {
            this._super();
        },
        companyId: '',
        companyName: '',

        // Tells the resistance layer what properties to save to localStorage
        // Ember Data does this for you.
        serialize: function() {
            //return this.getProperties(['email', 'password']);
        }
    });

    ProjectCompanyModel.reopenClass({

        // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
        storageKey: 'projectCompany',

        hash: {},
        
        findAll: function(type) {

            console.log('findAll');

            var data = [];

            if (type == 'search') {

                data.push({
                    companyId: 'all',
                    companyName: '全部'
                });
            }


            var success = function(res) {

                res.company.forEach(function(child) {

                    // 只要是Id類一律轉成字串, 不然select對'1' 跟 1會當做不同的數值, 導致valueBinding失敗
                    child.companyId = child.companyId.toString();
                    

                    data.pushObject(ProjectCompanyModel.create(child));
                });

                that.setter(data, 'comapnyId');
            };

            var error = function(res) {

            };

            this.get('/projectCompany', null, null, null).then(success, error);

            return  data;
        }
    });

    __exports__["default"] = ProjectCompanyModel;
  });
define("appkit/models/project", 
  ["appkit/models/base","appkit/utils/cookieProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var BaseModel = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];


    var ProjectModel = BaseModel.extend({

        init: function() {
            this._super();
        },
        projectId: '',
        projectName: '',
        ownerAccount: '',
        companyId: '',
        companyName: '',
        consoleStatus: '',
        status: '',

        serialize: function() {
            //return this.getProperties(['email', 'password']);
        }
    });


    ProjectModel.reopenClass({

        // 必須定義, 不然會出錯, storageKey不能重複, 不然資料會互相覆蓋
        storageKey: 'project',

        hash: {},

        find: function(id) {

            var that = this;

            return that.get('/project/' + id, null, null, null).then(function(res) {

                res.projectId = res.projectId.toString();
                res.companyId = res.companyId.toString();

                return ProjectModel.create(res);  

            });
        },
        findByPage: function(condi) {
     
            var that = this;
            var projectDataCookie = cookieProxy.getCookie('projectData');

            var inputCondi = {
                currentPage: condi.currentPage || projectDataCookie.currentPage || 1,
                search: condi.search || projectDataCookie.search || '',
                searchCompanyStatus: condi.searchCompanyStatus || projectDataCookie.searchCompanyStatus || 'all'
            };

            that.hash['search'] = inputCondi.search;
            that.hash['searchCompanyStatus'] = inputCondi.searchCompanyStatus;


            console.log(inputCondi);

            return that.get('/project', inputCondi, 'json', null).then(function(res) {

                console.log('res.currentPage: ' +res.currentPage);

                that.hash['currentPage'] = +res.currentPage;
                that.hash['totalPage'] = +res.totalPage;
                that.hash['pageSize'] = +res.pageSize;


                cookieProxy.setCookie('projectData', that.hash);

                var data = Em.A();

                res.project.forEach(function(child) {

                    child.projectId = child.projectId.toString();
                    child.companyId = child.companyId.toString();

                    data.pushObject(ProjectModel.create(child));
                });


                // 儲存數量清單用數據
                that.hash['companyStatusCount'] = res.companyStatusCount;

                console.log(that.hash['companyStatusCount']);

                that.setter(data, 'projectId');
            
                return data;  

            });
        },
        /*
        insert: function(data) {

            console.log('新增一筆營業人');

            var that = this;

            var success = function(res) {

                console.log('新增成功');

                data.companyId = res.companyId;

                return data;
            };

            var error = function(res) {

            };

            return that.post('/company', data, 'text').then(success, error);
        },
        */

        update: function(data) {

            console.log('更新一筆專案營業人設定');

            var that = this;

            var success = function(res) {

                console.log('更新成功');

                data.projectId = res.projectId;

                return data;
            };

            var error = function(res) {

            };

            return that.put('/project/' + data.projectId, data, 'text').then(success, error);
        },
        /*
        delete: function(data) {

            console.log('刪除一筆營業人');

            console.log(data.companyId);


            var that = this;

            var success = function(res) {
                console.log('刪除成功');
                return true;
            };

            var error = function(res) {
                console.log('刪除失敗');
                return false;
            };

            // TODO: api-stub用delete會有問題, 所以先用get假裝一下
            return that.get('/company', data.companyId, 'text').then(success, error);
        }
        */

    });

    __exports__["default"] = ProjectModel;
  });
define("appkit/router", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var Router = Ember.Router.extend();

    Router.map(function() {

    	this.route('error'),
    	this.route('login', function() {

    	}),
    	this.route('main', function() {

    		this.route('index');

    		// 營業人管理
    		this.route('companyList', {path: '/company/:page_id'}, function() {


    			this.route('companyDetail', {path: '/detail/:company_id'}, function() {
    				
    			});

    		});

    		// 專案管理
    		
    		this.route('projectList', {path: '/project/:page_id'}, function() {

    		});
    		
    	})

    	// 所有不存在的url, 都會到這個route來處理(404 not found);
    	this.route('missing', { path: "/*path" });
        
    });

    // 控制URL上的顯示, history會用/posts/new的方式顯示, none, 會將url隱藏起來
    Router.reopen({
    	//location: 'history'
    });

    __exports__["default"] = Router;
  });
define("appkit/routes/application", 
  ["appkit/utils/auth","appkit/utils/routeProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];

    var ApplicationRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		routeProxy.init(transition, this);
    		auth.loginChecking(transition, this, false);
    	},
    	model: function() {

    	}
    });

    __exports__["default"] = ApplicationRoute;
  });
define("appkit/routes/error", 
  ["exports"],
  function(__exports__) {
    "use strict";

    var ErrorRoute = Ember.Route.extend({

    	init: function() {
    		console.log('ErrorRoute:' + error);
    		//alert(error);
    	},

    });

    __exports__["default"] = ErrorRoute;
  });
define("appkit/routes/index", 
  ["appkit/utils/auth","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];

    var IndexRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this, false);
    	},
    	model: function() {

    	}

    });

    __exports__["default"] = IndexRoute;
  });
define("appkit/routes/login", 
  ["appkit/utils/auth","appkit/models/login","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var Login = __dependency2__["default"];

    var LoginRoute = Ember.Route.extend({

    	beforeModel: function(transition) {

    		auth.loginChecking(transition, this, false);	
    	},
    	model: function() {

    		return Login.create();
    	}

    });

    __exports__["default"] = LoginRoute;
  });
define("appkit/routes/main", 
  ["appkit/utils/auth","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];

    var MainRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this, false);
    	},
    	model: function() {


    	},
    });

    __exports__["default"] = MainRoute;
  });
define("appkit/routes/main/company-list", 
  ["appkit/utils/auth","appkit/utils/cookieProxy","appkit/models/company","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var CompanyModel = __dependency3__["default"];

    var CompanyListRoute = Ember.Route.extend({
    	
    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this);
    	},
    	model: function(params) {


    		// 還原原始狀態, 不要用Ember.copy()
    		var sidemenuData = this.controllerFor('main').get('sidemenuDataOrigin');
    		this.controllerFor('main').set('sidemenuData', sidemenuData);
    		


    		if (params.page_id == ' ') {

    			cookieProxy.removeCookie('companyData');
    			params.page_id = 1;
    			this.controllerFor('main.companyList').set('search', '');
    			this.transitionTo('main.companyList', 1);
    		}

    		var searchData = {
    			currentPage: params.page_id,
    		};

    		var success = function(data) {
    			console.log('success3');
    			return data;
    		};
    /*
    		var error = function(data) {
    			console.log('error3');
    			console.log(data);
    			return data;
    		};*/

    		return CompanyModel.findByPage(searchData).then(success);
    	},

    });
    __exports__["default"] = CompanyListRoute;
  });
define("appkit/routes/main/company-list/company-detail", 
  ["appkit/utils/auth","appkit/utils/cookieProxy","appkit/models/company","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var CompanyModel = __dependency3__["default"];

    var companyDetailRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this);
    	},
    	model: function(params) {

    		console.log('#########');
    		console.log(params);

    		var that = this;

    		return CompanyModel.find(params.company_id).then(function(data) {

    			// sidemenu插入新項目, 要用Ember.copy()
    			/*
    			var menuItem = {
    	            isPage: true,
    	            isHidden: false,
    	            icon: 'icon-group',
    	            name: '新的menu物件',
    	            page: {
    	                href: 'main.companyList',
    	                params: ' '
    	            }
    	        };

    			var sidemenuData = that.controllerFor('main').get('sidemenuDataOrigin');
    			sidemenuData = Ember.copy(sidemenuData, true);
    			sidemenuData[0].page.push(menuItem);
    			that.controllerFor('main').set('sidemenuData', sidemenuData);
    			*/
    		
    		
    			return data;
    		});
    	},
    	actions: {

    	}

    });
    __exports__["default"] = companyDetailRoute;
  });
define("appkit/routes/main/index", 
  ["appkit/utils/auth","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];

    var MainIndexRoute = Ember.Route.extend({


    	// 一進網站就從 / redirect 到想要的初始位置
    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this, false);
    	},

    	model: function(params) {

    		return '';
    	}


    });

    __exports__["default"] = MainIndexRoute;
  });
define("appkit/routes/main/project-list", 
  ["appkit/utils/auth","appkit/utils/cookieProxy","appkit/models/project","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var ProjectModel = __dependency3__["default"];


    var ProjectListRoute = Ember.Route.extend({

    	beforeModel: function(transition) {
    		auth.loginChecking(transition, this);
    	},
    	model: function(params) {


    		// sidemenu插入新項目, 要用Ember.copy()
    		var menuItem = {
                isPage: true,
                isHidden: false,
                icon: 'icon-stop',
                name: '另一個新的menu物件',
                page: {
                    href: 'main.companyList',
                    params: ' '
                }
            };

    		var sidemenuData = this.controllerFor('main').get('sidemenuDataOrigin');
    		sidemenuData = Ember.copy(sidemenuData, true);
    		sidemenuData[0].page.push(menuItem);
    		this.controllerFor('main').set('sidemenuData', sidemenuData);
    		


    		if (params.page_id == ' ') {

    			cookieProxy.removeCookie('projectData');
    			params.page_id = 1;

    			this.controllerFor('main.projectList').set('search', '');
    			this.controllerFor('main.projectList').set('statisticListSelectedItem', 'all');
    			this.transitionTo('main.projectList', 1);
    		}

    		var searchData = {
    			currentPage: params.page_id,
    		};

    		return ProjectModel.findByPage(searchData).then(function(data) {
    			return data;
    		});
    	},
    	actions: {

    	}

    });
    __exports__["default"] = ProjectListRoute;
  });
define("appkit/routes/missing", 
  ["appkit/utils/auth","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var auth = __dependency1__["default"];

    var MissingRoute = Ember.Route.extend({

    	beforeModel: function(transition) {

    		console.log('into missing route, 404 page!');
    		auth.redirectForLogin();	
    	}

    });

    __exports__["default"] = MissingRoute;
  });
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
define("appkit/utils/auth", 
  ["appkit/utils/cookieProxy","appkit/utils/routeProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var cookieProxy = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];

    'use strict';

    var auth = { 

        loginPath: window.ENV.loginPath, // 登入頁位置
        indexPath: window.ENV.mainPath, // 首頁位置 
        /*
         *  導頁到login頁面
         *  $param (array)  cookieName cookie名稱
         *  $param (string or object) cookieValue cookie的值 
         *  $param (string) settingObj 設定的物件, ex: {expire: 5, path: '/'}
         *  $param (string) groupName cookie群組名稱
         *  $param (boolean) isLogin 是否為判斷login的參數 
         */
        redirectForLogin: function() {
            console.log('loginRedirect');
            routeProxy.getRoute().transitionTo(this.indexPath);
        },

        /*
         *  導頁到主頁面
         *  $param (array)  cookieName cookie名稱
         *  $param (string or object) cookieValue cookie的值 
         *  $param (string) settingObj 設定的物件, ex: {expire: 5, path: '/'}
         *  $param (string) groupName cookie群組名稱
         *  $param (boolean) isLogin 是否為判斷login的參數 
         */
        redirectForLogout: function() {
            cookieProxy.logout();
            routeProxy.getRoute().transitionTo(this.loginPath);
        },
        /*
         *  判斷使用者登入狀況, 如果沒登入則導頁或跳出警示modal, 有登入則導頁到目標頁面
         *  $param (object)  transition ember transition物件
         *  $param (route) route ember route物件 
         *  $param (boolean) isModal 是否要跳出警示modal
         *  $param (string) 登入頁url
         *  $param (string) 主頁面url
         */
        loginChecking: function(transition, route, isModal, loginPath, indexPath) {


            // TODO: 錯誤處理失效, 無法再app.js的Ember.Error裡面接到
            if (!transition) {
                throw 'auth.js, func:loginChecking, 請輸入transition';
            }

            if (!route) {
                throw 'auth.js, func:loginChecking, 請輸入route';
            }

            var isModal = (isModal === false) ? false : true;

            if (cookieProxy.isLogin() === false) {

                if (transition.targetName == 'index' || transition.targetName == this.loginPath) {
                    route.transitionTo(this.loginPath);
                }
                else if (isModal === false) {
                    route.transitionTo(this.loginPath);
                }
                else {
                    var feedback = routeProxy.send('showLoginModal');
                    
                    // 如果找不到controll(reload時, 直接導回login頁面)
                    if (feedback === false) {
                        route.transitionTo(this.loginPath);
                    }
                }
            }
            else if (transition.targetName == 'index' || transition.targetName == this.loginPath) {
                route.transitionTo(this.indexPath);
            }
        }
    };

    __exports__["default"] = auth;
  });
define("appkit/utils/cookieProxy", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var cookieProxy = (function() { 

        //'use strict';

        return {

        /*
         * 判斷是否有登入, 如果cookie logins裡面都沒有值, 那永遠返回true
         */
        isLogin: function() {

            var logins = null;
            var loginParamName = null;
            var isLogin = false;

            logins = $.cookie('logins');

            if (logins) {
                logins = JSON.parse(logins);
            }
            else {
                logins = {};
            }

            // 取得所有login參數名稱
            for (loginParamName in logins) {

                //console.log('loginParamName: ' + loginParamName);

                if (logins.hasOwnProperty(loginParamName) && this.getCookie(loginParamName)) {
                    isLogin = true;
                }
                else {
                    isLogin = false;
                    break;
                }
            }
            return isLogin;
        },
        /*
         * 清除所有login有關的cookie
         */
        logout: function() {

            var logins = null;
            var loginParamName = null;

            logins = $.cookie('logins');

            if (logins) {
                logins = JSON.parse(logins);

                 // 取得所有login參數名稱
                for (loginParamName in logins) {

                    if (logins.hasOwnProperty(loginParamName)) {
                        $.removeCookie(loginParamName);
                    }
                }
            }
            $.removeCookie('logins');
        },
        /*
         *  寫入cookie
         *  $param (array)  cookieName cookie名稱
         *  $param (string or object) cookieValue cookie的值 
         *  $param (string) settingObj 設定的物件, ex: {expire: 5, path: '/'}
         *  $param (string) groupName cookie群組名稱
         *  $param (boolean) isLogin 是否為判斷login的參數 
         */
        setCookie: function(cookieName, cookieValue, settingObj, groupName, isLogin) {

            var value = JSON.stringify(cookieValue);
            var groups = null;
            var logins = null;
            var group = null;

            if (settingObj) {
                $.cookie(cookieName, value, settingObj);
            }
            else {
                $.cookie(cookieName, value);
            }

            // 如果有群組, 將該cookie加入群組
            if (groupName) {

                groups = $.cookie('cookieGroup');

                if (groups) {
                    groups = JSON.parse(groups);
                }
                else {
                    groups = {};
                }

                group = groups[groupName];
                
                if (!group) {
                    group = {};
                }
                group[cookieName] = true;
                groups[groupName] = group;

                $.cookie('cookieGroup', JSON.stringify(groups));
            }

            // 如果此參數為login判斷物件, 就寫入cookie中以供之後判斷用
            if (isLogin) {
                logins = $.cookie('logins');

                if (logins) {
                    logins = JSON.parse(logins);
                }
                else {
                    logins = {};
                }

                logins[cookieName] = true;
                $.cookie('logins', JSON.stringify(logins));
            }
        },
        /*
         * 取得cookie
         * $param (string) cookieName cookie名稱
         */
        getCookie: function(cookieName) {

            var value = $.cookie(cookieName);

            if (value) {

                try {
                    value = JSON.parse(value);
                } 
                catch(e) {
                    console.log('cookieProxyError: ' + e);
                }
            }
            else {
                value = '';
            }

            return value
        },
        /*
         * 刪除cookie
         * $param (string) cookieName cookie名稱
         */
        removeCookie: function(cookieName) {
            $.removeCookie(cookieName);
        },
        /*
         * 刪除在群組內的所有cookie
         * $param (string) groupNmae cookie群組名稱
         */
        removeGroup: function(groupName) {

            var groups = null;
            var group = null;
            var cookieName = '';

            if (groupName) {

                groups = $.cookie('cookieGroup');

                if (groups) {
                    groups = JSON.parse(groups);
                }
                else {
                    groups = {};
                }

                group = groups[groupName];
                
                if (!group) {
                    return false;
                }

                // 取得group所有cookie名稱並刪除
                for (cookieName in group) {

                    if (group.hasOwnProperty(cookieName)) {
                        $.removeCookie(cookieName);
                    }
                }

                // 將該group自groups刪除
                delete groups[groupName];

                // 將groups重新塞回cookie中
                $.cookie('cookieGroup', JSON.stringify(groups));
            }
        }

    };
    })();


    __exports__["default"] = cookieProxy;
  });
define("appkit/utils/globalObjFunc", 
  ["appkit/models/member-company","appkit/models/project-company","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var MemberCompanyModel = __dependency1__["default"];
    var ProjectCompanyModel = __dependency2__["default"];


    // 整個系統共用的物件或參數都會放在這裡
    var globalObj = function(type) { 

    	'use strict';


    	var addSearchSelection = function(ary) {

    		if (type == 'search') {
    			ary.unshift({
    				id: 'all',
    				name: '全部'
    			});
    		}
    		return ary;
    	};

    	return  {

    		projectCompanyAry: (function() {

    			return ProjectCompanyModel.findAll(type);

    		})(),

    		memberCompanyAry: (function() {

    			return MemberCompanyModel.findAll(type);

    		})(),

    		invoiceTypeAry: (function() {

    			var ary = [

    				{
    					id: '01',
    					name: '三聯式'
    				},
    				{
    					id: '02',
    					name: '二聯式'
    				}
    			];

    			return addSearchSelection(ary);

    		})(),

    		thisYear: (function() {

    			var date = new Date();
    			return date.getFullYear();
    		})(),

    		thisMonth: (function() {

    			var date = new Date();
    			return date.getMonth() + 1;
    		})(),

    		yearAry: function(range) {


    			var range = range || 5;
    			var date = new Date();
    			var thisYear = date.getFullYear();
    			var beginYear = thisYear - range;
    			var endYear = thisYear + range
    			var ary = [];


    			var i = beginYear;

    			while (beginYear <= endYear) {

    				ary.push({
    					id: beginYear,
    					name: beginYear
    				});

    				beginYear += 1;
    			}

    			return addSearchSelection(ary);
    		},

    		monthAry: (function() {

    			var ary = [

    				{
    					id: 1,
    					name: '01-02'
    				},
    				{
    					id: 2,
    					name: '03-04'
    				},
    				{
    					id: 3,
    					name: '05-06'
    				},
    				{
    					id: 4,
    					name: '07-08'
    				},
    				{
    					id: 5,
    					name: '09-10'
    				},
    				{
    					id: 6,
    					name: '11-12'
    				}
    			];

    			return addSearchSelection(ary);

    		})()
    	};
    };


    __exports__["default"] = globalObj;
  });
define("appkit/utils/register_components", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* global requirejs */
    /* global require */

    function registerComponents(container) {
        var seen = requirejs._eak_seen;
        var templates = seen,
            match;
        if (!templates) {
            return;
        }

        for (var prop in templates) {
            if (match = prop.match(/templates\/components\/(.*)$/)) {
                require(prop, null, null, true);
                registerComponent(container, match[1]);
            }
        }
    }


    function registerComponent(container, name) {

        Ember.assert("You provided a template named 'components/" + name + "', but custom components must include a '-'", name.match(/-/));

        var fullName = 'component:' + name;
        var templateFullName = 'template:components/' + name;

        container.injection(fullName, 'layout', templateFullName);

        var Component = container.lookupFactory(fullName);

        if (!Component) {
            container.register(fullName, Ember.Component);
            Component = container.lookupFactory(fullName);
        }

        Ember.Handlebars.helper(name, Component);
    }

    __exports__["default"] = registerComponents;
  });
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
define("appkit/utils/sidemenuData", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var sidemenuData = [

    	{
    		isOpen: true,
    		isHidden: false,
            isPage: false,
            icon: 'icon-cogs',
            name: '營業人管理',
            page: [
                {
                    isPage: true,
                    isHidden: false,
                    icon: 'icon-table',
                    name: '營業人資料列表',
                    page: {
                        href: 'main.companyList',
                        params: ' '
                    } 
                },
                {
                    isPage: true,
                    icon: 'icon-table',
                    name: '專案營業人設定',
                    page: {
                        href: 'main.projectList',
                        params: ' '
                    } 
                }
            ]
    	},
    	
    	{
    		isOpen: true,
            isPage: false,
            icon: 'icon-cogs',
            name: '測試menu layer1',
            page: [
                
                {
                	isOpen: true,
                    isPage: false,
                    icon: 'icon-table',
                    name: '測試menu layer2',
                    page: [

                    	{
    		                isPage: true,
    		                isHidden: true,
    		                icon: 'icon-table',
    		                name: '測試menu layer3-1',
    		                page: {
    		                    href: '',
    		                    params: ' '
    		                } 
    		            },
    		            {
    		            	isOpen: true,
    		                isPage: false,
    		                icon: 'icon-table',
    		                name: '測試menu layer3-2',
    		                page: [
    		                	{
    				                isPage: true,
    				                icon: 'icon-table',
    				                name: '測試menu layer4-1',
    				                page: {
    				                    href: '',
    				                    params: ' '
    				                } 
    				            },
    				            {
    				                isPage: true,
    				                icon: 'icon-table',
    				                name: '測試menu layer4-2',
    				                page: [
    				                     	{
    				                isPage: true,
    				                icon: 'icon-table',
    				                name: '測試menu layer4-1',
    				                page: {
    				                    href: '',
    				                    params: ' '
    				                } 
    				            },
    				                ]
    				            }
    		                ]
    		            }
                    ]
                }
            ]
    	}
    ];

    __exports__["default"] = sidemenuData;
  });
define("appkit/views/container", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var pushViews = [];
    var fadeInTime = 200;
    var fadeOutTime = 200;
    var nowView = null;
    var lastView = null;



    // 過濾掉狀態為destroying的view
    var filterDestroying = function(viewsAry) {

    	viewsAry.forEach(function(value, key) {
    		
    		if (value.state == 'destroying') {
    			console.log('&&&&&: ' + key);
    			viewsAry.splice(key, 1);
    		}
    	});
    	return viewsAry;
    };


    var ContainerView = Ember.View.extend({

    	didInsertElement: function(e) {

    		nowView = null;
    		lastView = null;

    		console.log('didInsertElement');

    		pushViews.push(e);
    		pushViews = filterDestroying(pushViews);

    		pushViews.forEach(function(value, key) {

    			if (e.elementId == value.elementId) {

    				nowView = value;

    				if (key != 0) {
    					lastView = pushViews[key - 1];
    				}
    			}
    			value.$().hide();
    		});

    		if (lastView) {

    			Ember.run(function() {
    				lastView.$().show().fadeOut(fadeOutTime, function() {
    					Ember.run(function() {

    						lastView.get('controller').set('show', true);
    						lastView.$().show();
    			
    						nowView.$().hide().fadeIn(fadeInTime);
    						nowView.get('controller').set('show', false);
    						
    					});
    				});
    			});
    		}
    		else {
    			Ember.run(function() {
    				nowView.$().hide().fadeIn(fadeInTime);
    				nowView.get('controller').set('show', false);
    			});
    		}
    	},
    	willDestroyElement: function(e) {

    		console.log('willDestroyElement');

    		pushViews.forEach(function(value, key) {

    			if (e.elementId == value.elementId) {

    				Ember.run(function() {
    					pushViews.pop();

    					if (pushViews[key - 1]) {
    						pushViews[key - 1].get('controller').set('show', false);
    						pushViews[key - 1].$().hide().fadeIn(fadeInTime);
    					}

    				});
    			}
    		});
    	}
    });
    __exports__["default"] = ContainerView;
  });
define("appkit/views/fadeView", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var fadeView = Ember.View.extend({

        didInsertElement: function() {
        	this.$().hide().fadeIn(200);
        }
    });

    __exports__["default"] = fadeView;
  });
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
define("appkit/views/html-textarea", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # html-textarea(html編輯器)[view]

    ## 更新訊息 

    原始來源: http://ckeditor.com  

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/11/07  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.11.07 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件

    index.html請在<!-- build:js(tmp/public) assets/app.min.js -->後面加上  
    <script src="/assets/vendor/ckeditor/ckeditor.js"></script>    

    **第三方套件請務必放在public/assets/vendor/下,避免grunt作業時,導致部分檔案遺失或出錯**  
    public/assets/vendor/ckeditor/ 版本:v4.2.2  
    public/assets/vendor/kcfinder/ (需使用到圖片或flash檔案上傳或瀏覽才需要)


    #### 相依元件


    #### 相依外部檔案與目錄

    ## 相依後端I/O

    #### 後台設定部分

    請後端將kcfinder套件放在讓前端可以用http取得的位置,如下範例:
    http://brainsta.hiiir.com/js/kcfinder  
    後端需對kcfinder/config.php進行設定, 需修改重要屬性如下:

    ```
    $_CONFIG = array(
        'disabled' => false,
        'uploadURL' => "http://brainsta.hiiir.com/upload/kcimg", // url上資料夾位置
        'uploadDir' => "/var/www/html/brain.hiiir.com/trunk/public/upload/kcimg", // 實體資料夾位置
    );
    ```

    ## 參數說明與使用教學
    #### router:

    參數範例:

    ```
    model: function() {

        return {
            myText: 'Test htmlTextarea'
        };

    }
    ```


    #### controller:

    參數範例:


    ```   
    htmlTextareaData: function() {
        return {
            width: 700,
            height: 350, 
            uiColor: '#FAECD5',
            extraPlugins: ['youtube', 'flash'],
            toolbarGroups: [
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
                {name: 'links' },
                {name: 'insert' },
                {name: 'forms' },
                {name: 'tools' },
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'others'},
                '/',
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph',   groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
                {name: 'styles'},
                {name: 'colors'},
            ],
            kcfinderHost: 'http://brainsta.hiiir.com/js/kcfinder',
            browserImage: true,
            uploadImage: true,
            browserFlash: true,
            uploadFlash: true
        }
    }.property(),
    ```

    使用範例:

    ```
    // 取得html資料
    console.log('myText: ' + this.get('model').myText);
    ```


    #### template:

    ```
    {{view "htmlTextarea" options="htmlTextareaData" valueBinding="myText"}}
    ```    


    @class html-textarea
    @since 1.0
    */


    /**
    ###### html編輯器寬度

    @property width
    @type Integer
    @default 700
    @optional
    **/

    /**
    ###### html編輯器高度

    @property height
    @type Integer
    @default 350
    @optional
    **/

    /**
    ###### html編輯器版面底色

    @property uiColor
    @type String
    @default '#FAECD5'
    @optional
    **/

    /**
    ###### html編輯器工具配置設定

    預設值:

    ```
    toolbarGroups : [
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
        {name: 'links' },
        {name: 'insert' },
        {name: 'forms' },
        {name: 'tools' },
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'others'},
        '/',
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph',   groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
        {name: 'styles'},
        {name: 'colors'},
    ]
    ```

    @property toolbarGroups
    @type Array
    @default 請參考上方預設值範例
    @optional
    **/


    /**
    ###### kcfinder使用的server位置(如需kcfinder,爲必須值)

    範例: 'http://brainsta.hiiir.com/js/kcfinder'

    @property kcfinderHost*
    @type String
    @required
    **/

    /**
    ###### html編輯器是否能瀏覽圖片(需kcfinder)

    @property isBrowserImage
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### html編輯器是否能瀏上傳圖片(需kcfinder)

    @property isUploadImage
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### html編輯器是否能瀏覽flash(需kcfinder)

    @property isBrowserFlash
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### html編輯器是否能上傳flash(需kcfinder)

    @property isUploadFlash
    @type Boolean
    @default false
    @optional
    **/




    var htmlTextArea = Ember.TextArea.extend({

        didInsertElement: function() {

            this._super();

            var optionsIndex = this.get('options');
            var options = this.get('targetObject.' + optionsIndex);
            var self = this;
            var elementId = self.get('elementId');
            var editor = null;


            // 初始化參數
            options = {
                skin: 'moono',
                width: options.width || 650,
                height: options.height || 300,
                uiColor: options.uiColor || '#FAECD5',
                extraPlugins: options.extraPlugins || ['youtube', 'flash'],
                toolbarGroups: options.toolbarGroups || [
                    {name: 'clipboard', groups: ['clipboard', 'undo']},
                    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
                    {name: 'links' },
                    {name: 'insert' },
                    {name: 'forms' },
                    {name: 'tools' },
                    {name: 'document', groups: ['mode', 'document', 'doctools']},
                    {name: 'others'},
                    '/',
                    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                    {name: 'paragraph',   groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
                    {name: 'styles'},
                    {name: 'colors'},
                ],
                kcfinderHost: options.kcfinderHost,
                isBrowserImage: options.isBrowserImage || false,
                isUploadImage: options.isUploadImage || false,
                isBrowserFlash: options.isBrowserFlash || false,
                isUploadFlash: options.isUploadFlash || false,

                /*
                filebrowserBrowseUrl: 'http://brainsta.hiiir.com/js/kcfinder/browse.php?type=files',
                filebrowserImageBrowseUrl: 'http://brainsta.hiiir.com/js/kcfinder/browse.php?type=images',
                filebrowserFlashBrowseUrl: 'http://brainsta.hiiir.com/js/kcfinder/browse.php?type=flash',
                filebrowserUploadUrl: 'http://brainsta.hiiir.com/js/kcfinder/upload.php?type=files',
                filebrowserImageUploadUrl: 'http://brainsta.hiiir.com/js/kcfinder/upload.php?type=images',
                filebrowserFlashUploadUrl: 'http://brainsta.hiiir.com/js/kcfinder/upload.php?type=flash'
                */
            };


            if (options.isBrowserImage || options.isUploadImage || options.isBrowserFlash || options.isUploadFlash) {
                
                if (!options.kcfinderHost) {
                    throw new Error('view(htmlTextArea): kcfinderHost必須設定,才能上傳或瀏覽圖片');
                }
            }

            if (options.isBrowserImage) {
                options['filebrowserImageBrowseUrl'] = options.kcfinderHost + '/browse.php?type=images';
            }

            if (options.isUploadImage) {
                options['filebrowserImageUploadUrl'] = options.kcfinderHost + '/upload.php?type=images';
            }

            if (options.isBrowserFlash) {
                options['filebrowserFlashBrowseUrl'] = options.kcfinderHost + '/browse.php?type=flash';
            }

            if (options.isUploadFlash) {
                options['filebrowserFlashUploadUrl'] = options.kcfinderHost + '/upload.php?type=flash';
            }

            editor = CKEDITOR.replace(elementId, options);
            editor.on('change', function(e) {
                if (e.editor.checkDirty()) {
                    self.set('value', editor.getData());
                }
            });
        }
    });

    __exports__["default"] = htmlTextArea;
  });
define("appkit/views/login", 
  ["appkit/views/fadeView","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fadeView = __dependency1__["default"];

    var login = fadeView.extend({

        didInsertElement: function() {

        	this._super();

        	$('body').addClass('contrast-sea-blue login contrast-background');
        },
      
    });

    __exports__["default"] = login;
  });
define("appkit/views/main", 
  ["appkit/views/fadeView","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fadeView = __dependency1__["default"];

    var main = fadeView.extend({

        didInsertElement: function() {

        	this._super();

        	var body = $('body');

    		if (body.hasClass('contrast-background')) {
    			body.removeClass('login contrast-background');
    		}
    		body.addClass('contrast-sea-blue');

        },
    });

    __exports__["default"] = main;
  });
define("appkit/views/main/company-list", 
  ["appkit/views/container","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var containerView = __dependency1__["default"];

    var companyListView = containerView.extend({
        didInsertElement: function() {
    	    this._super(this);
    	},
    	willDestroyElement: function() {
    		this._super(this);
    	}
    });

    __exports__["default"] = companyListView;
  });
define("appkit/views/main/company-list/company-detail", 
  ["appkit/views/container","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var containerView = __dependency1__["default"];

    var companyDetailView = containerView.extend({
        didInsertElement: function() {
    	    this._super(this);
    	},
    	willDestroyElement: function() {
    		this._super(this);
    	}
    });

    __exports__["default"] = companyDetailView;
  });
define("appkit/views/main/index", 
  ["appkit/views/fadeView","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var fadeView = __dependency1__["default"];


    var index = fadeView.extend({

        didInsertElement: function() {
            this._super();
        }
    });

    __exports__["default"] = index;
  });
define("appkit/views/main/project.list", 
  ["appkit/views/container","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var containerView = __dependency1__["default"];


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
    __exports__["default"] = projectListView;
  });
define("appkit/views/radio-button", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # radio-button(radio button模組)[view]

    ## 更新訊息 

    原始來源: http://thoughts.z-dev.org/2013/07/04/radio-buttons-in-ember-js/

    最後編輯者: Hank Kuo  

    最後修改日期: 2014/12/06 

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.12.08 | 1.01 | 修正輸入目前參數radio button不會正常切換的問題 | Hank Kuo
    2013.12.06 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件


    #### 相依元件


    #### 相依外部檔案與目錄

    ## 相依後端I/O


    #### controller:

    參數範例:



    #### template:

    ```
    <div class="form-group">
    <label class="col-md-3 control-label">狀態:</label>
    <div class="col-md-6">
      <label class="radio radio-inline">
        {{view "radioButton" name="status" selectionBinding="companyData.status" value="N"}}停用
      </label>

      <label class="radio radio-inline">
        {{view "radioButton" name="status" selectionBinding="companyData.status" value="Y" disabled=statusDisabled}}啟用
      </label>
    </div>
    </div>
    ```    

    @class radio-button
    @since 1.0
    */



    var radioButton = Ember.View.extend({

     	tagName: 'input',

        type: 'radio',

        attributeBindings : ['name', 'type', 'value', 'checked:checked:', 'disabled'],

        click: function() {
            this.set('selection', this.$().val())
        },
        checked: function() {
            return this.get('value') == this.get('selection');   
        }.property('selection'),

    });

    __exports__["default"] = radioButton;
  });
define("appkit/views/upload-file-basic", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # upload-file-basic (簡單檔案上傳)[view]

    ## 更新訊息 

    原始來源: 

    最後編輯者: Hank Kuo  

    最後修改日期: 2014/12/06  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.12.06 | 1.0  | 1. 增加檔案類型與檔案大小的判斷<br> 2. 當發生錯誤時,會將上傳檔案名稱清除  | Hank Kuo
    2013.12.06 | 1.0  | 建立元件 | Mars Peng


    ## 相依套件與檔案


    #### 相依第三方套件


    #### 相依元件


    #### 相依外部檔案與目錄

    ## 相依後端I/O


    #### controller:

    ```
    // 上傳檔案
    upload: function(file) {

        var data = this.get('companyData');
        data.softwareCerf = file;
        this.set('companyData', data);
    },

    // 上傳檔案錯誤callback 
    uploadError: function(msg) {

        //alert(msg);
        routeProxy.send('showGrowlNotifications', '檔案上傳發生錯誤!', msg, 'danger');
    }
    ```

    #### template:

    ```
    {{view "uploadFile" acceptFile="jpg pdf" acceptSize="10" action="upload" errorAction="uploadError" class="upload-f2e"}}
    ```    

    @class upload-file-basic
    @since 1.0
    */

    /**
    ###### 可上傳的檔案類型(檔案副檔名)

    若沒設定預設為所有檔案類型皆可上傳,
    要設定多個檔案類型,請用一格空白字元隔開

    @property acceptFile
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 可上傳的檔案大小(單位:MB)

    若沒設定則預設為無限大

    @property acceptSize
    @type Integer
    @default ''
    @optional
    **/

    /**
    ###### 接收上傳檔案的action(二進位檔案base64編碼)

    @property action
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 接收錯誤訊息的action

    @property uploadError
    @type String
    @default ''
    @optional
    **/



    var uploadFileBasicView = Ember.TextField.extend({
    	type: 'file',
      attributeBindings: ['acceptFile', 'acceptSize'],

      change: function(evt) {
      
      	var input = evt.target;
        var cloned = $(input).clone(true);


      	if (input.files && input.files[0]) {
        	
          var reader = new FileReader();
        	var that = this;
          var file = input.files[0];
          var extension = file.name.substr((~-file.name.lastIndexOf(".") >>> 0) + 2);
          var acceptFile = this.get('acceptFile') ? this.get('acceptFile').split(' ') : '';
          var acceptSize = this.get('acceptSize');
          var i = 0;
          var len = acceptFile.length;
          var isCurrentType = true;
          var isCurrentSize = true;
          var errorMsg = '';


          // REMOVE: 發現file.type根本就是跟副檔名走, 所以我亂改檔案副檔名也會造成file.type改變,
          // 所以這邊改成直接判斷副檔名即可
          /*
          var fileHash = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'html': 'text/html',
            'htm': 'text/html',
            'css': 'text/css',
            'js': 'text/javascript',
            'zip': 'application/zip',
            'pdf': 'application/pdf',
            'png': 'image/png',
            'csv': 'text/csv ',
            'swf': 'application/x-shockwave-flash',
            'mp3': 'audio/mp3',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': '.xls', // 很奇怪2003的excel檔案格式, type會抓不到
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'txt': 'text/plain',
            'pfx': 'application/x-pkcs12'
          };
          */

          if (acceptFile) {

            for (;i < len; i += 1) {

              if (acceptFile[i] == extension) {
                isCurrentType = true;
                break;
              }
              else {
                isCurrentType = false;
              }
            }
          }


          if (acceptSize && acceptSize * 1024 * 1024 < file.size) {
              isCurrentSize = false;
          }


          if (!isCurrentType) {

            errorMsg += '上傳檔案類型錯誤, 可上傳檔案類型為: ' + this.get('acceptFile');
          } 

          if (!isCurrentSize) {
            errorMsg += '\n上傳檔案大小錯誤, 可上傳檔案大小為: ' + acceptSize + ' MB';
          }

          if (errorMsg) {
            that.sendAction('errorAction', errorMsg);

            // 將file的檔案名稱清除
            $(input).replaceWith(cloned.val(null));

          }
          else {
          	reader.onload = function(e) {
            		var fileToUpload = e.target.result;
            		that.sendAction('action', fileToUpload);
          	}
          	reader.readAsDataURL(file);
          }
       	}

      }
      
    });

    __exports__["default"] = uploadFileBasicView;
  });
define("appkit/views/validate", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # validate(表單欄位驗證模組)[view]

    ## 更新訊息 

    原始來源: http://jqueryvalidation.org/

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/11/12 

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.11.12 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件

    vendor/jquery/plugins/jquery.validate.min.js  


    #### 相依元件


    #### 相依外部檔案與目錄

    ## 相依後端I/O


    #### controller:

    參數範例:


    ```
    validateData: function() {

            return {

                // 欲使用自定的驗證方法
                addMethods: {
                    
                    alnum: {
                        method: function(value, element) {
                            return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
                        },
                        msg: '只能包括英文字母和数字'
                    },
                    domain: {
                        method: function(value, element) {
                            return this.optional(element) || /^http:\/\/mycorporatedomain.com/.test(value);
                        },
                        msg: 'domain錯誤'
                    } 
                },

                // validate設定, 同jquery validate設定
                options: {

                    success:'valid',
                    errorElement:'span',
                    errorClass:'has-error',
                    validClass: '',

                    highlight:function(element, errorClass, validClass) {

                        $(element).parents('.form-group').addClass('has-error');   
                    },
                    unhighlight:function(element, errorClass, validClass) {

                        $(element).parents('.form-group').removeClass('has-error');
                    },
                    errorPlacement: function(error, element) {

                        //error.insertAfter(element);
                        error.appendTo(element.siblings('.help-block'));
                    },
                    rules: {
                        'email': {
                            required: true,
                            email: true
                        },
                        'title': {
                            required: true,
                            maxlength: 20,
                            minlength: 10,
                            alnum: true,
                            domain: true
                        }
                    },
                    messages: {
                        'email': {
                            required: 'email為必填',
                            email: 'email格式錯誤'
                        },
                        'title': {
                            required: '標題為必填',
                            maxlength: '標題字數不可超過20字',
                            minlength: '標題字數不可少於10字',
                            alnum: '不可有英文與數字以外的事',
                            domain: '就是domain啦!!!!'
                        }
                    }
                }
            };
        }.property(),
    ```



    #### template:

    ```
    {{#view "validate" valueBinding=validateData }}
        <form>
            // 要驗證的欄位
        </form>
    {{/view}}
    ```    

    @class validate
    @since 1.0
    */


    var validate = Ember.View.extend({

        tagName: 'div',

        didInsertElement: function() {

            var that = this;
            var self = '#' + that.get('elementId');
            var validateData = this.get('value');


            that.set('value.form', $(self + ' form'));

            // 新增驗證method
            for (var key in validateData.addMethods) {
                var methodData = validateData.addMethods[key];
                jQuery.validator.addMethod(key, methodData.method, methodData.msg);
            }

            $(self + ' form').validate(validateData.options);
        }
    });
    __exports__["default"] = validate;
  });
define("appkit/views/watermark", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # watermark(表單欄位浮水印)[view]

    ## 更新訊息 

    原始來源: https://code.google.com/p/jquery-watermark

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/11/07  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.11.07 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件

    vendor/jquery/plugins/jquery.watermark.min.js  


    #### 相依元件


    #### 相依外部檔案與目錄

    ## 相依後端I/O


    #### controller:


    #### template:

    ```
    {{#view "watermark" watermark="this is watermark"}}
        {{input type="text" value=viewText}}
    {{/view}}
    ```    

    @class watermark
    @since 1.0
    */


    /**
    ###### 浮水印內容

    @property watermark
    @type String
    @default ''
    @optional
    **/

    var watermark = Ember.View.extend({

        didInsertElement: function() {

            var that = this;
            var self = '#' + that.get('elementId');
            var watermark = this.get('watermark') || '';
            var child = '#';
            var inputNumber = $(self + ' input').length;
            var textareaNumber = $(self + ' textarea').length;
            var childNumber = inputNumber + textareaNumber;

            if (childNumber == 0) {
                throw new Error('view(watermark): 必須要有input或textarea');
            }
            else if (childNumber > 1) {
                throw new Error('view(watermark): 只能有一個input或textarea');
            }

            if (inputNumber) {
                child = $(self + ' input');
            } 
            else {
                child = $(self + ' textarea');
            }

            $(child).watermark(watermark);
        }
    });

    __exports__["default"] = watermark;
  });
//@ sourceMappingURL=app.js.map