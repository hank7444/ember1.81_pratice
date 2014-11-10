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

export default StatisticListUIComponent;