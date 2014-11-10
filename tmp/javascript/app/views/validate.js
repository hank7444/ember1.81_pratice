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
export default validate;