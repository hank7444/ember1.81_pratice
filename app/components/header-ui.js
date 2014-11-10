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

export default HeaderUIComponent;