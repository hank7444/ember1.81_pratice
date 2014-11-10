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

export default PickerDatetimeComponent;