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