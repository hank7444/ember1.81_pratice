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