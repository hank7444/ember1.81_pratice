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