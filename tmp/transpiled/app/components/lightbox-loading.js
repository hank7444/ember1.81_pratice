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