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