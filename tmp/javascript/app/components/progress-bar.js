
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

export default ProgressBarComponent;