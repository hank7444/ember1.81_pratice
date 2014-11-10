define("appkit/views/html-textarea", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # html-textarea(html編輯器)[view]

    ## 更新訊息 

    原始來源: http://ckeditor.com  

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/11/07  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.11.07 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件

    index.html請在<!-- build:js(tmp/public) assets/app.min.js -->後面加上  
    <script src="/assets/vendor/ckeditor/ckeditor.js"></script>    

    **第三方套件請務必放在public/assets/vendor/下,避免grunt作業時,導致部分檔案遺失或出錯**  
    public/assets/vendor/ckeditor/ 版本:v4.2.2  
    public/assets/vendor/kcfinder/ (需使用到圖片或flash檔案上傳或瀏覽才需要)


    #### 相依元件


    #### 相依外部檔案與目錄

    ## 相依後端I/O

    #### 後台設定部分

    請後端將kcfinder套件放在讓前端可以用http取得的位置,如下範例:
    http://brainsta.hiiir.com/js/kcfinder  
    後端需對kcfinder/config.php進行設定, 需修改重要屬性如下:

    ```
    $_CONFIG = array(
        'disabled' => false,
        'uploadURL' => "http://brainsta.hiiir.com/upload/kcimg", // url上資料夾位置
        'uploadDir' => "/var/www/html/brain.hiiir.com/trunk/public/upload/kcimg", // 實體資料夾位置
    );
    ```

    ## 參數說明與使用教學
    #### router:

    參數範例:

    ```
    model: function() {

        return {
            myText: 'Test htmlTextarea'
        };

    }
    ```


    #### controller:

    參數範例:


    ```   
    htmlTextareaData: function() {
        return {
            width: 700,
            height: 350, 
            uiColor: '#FAECD5',
            extraPlugins: ['youtube', 'flash'],
            toolbarGroups: [
                {name: 'clipboard', groups: ['clipboard', 'undo']},
                {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
                {name: 'links' },
                {name: 'insert' },
                {name: 'forms' },
                {name: 'tools' },
                {name: 'document', groups: ['mode', 'document', 'doctools']},
                {name: 'others'},
                '/',
                {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                {name: 'paragraph',   groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
                {name: 'styles'},
                {name: 'colors'},
            ],
            kcfinderHost: 'http://brainsta.hiiir.com/js/kcfinder',
            browserImage: true,
            uploadImage: true,
            browserFlash: true,
            uploadFlash: true
        }
    }.property(),
    ```

    使用範例:

    ```
    // 取得html資料
    console.log('myText: ' + this.get('model').myText);
    ```


    #### template:

    ```
    {{view "htmlTextarea" options="htmlTextareaData" valueBinding="myText"}}
    ```    


    @class html-textarea
    @since 1.0
    */


    /**
    ###### html編輯器寬度

    @property width
    @type Integer
    @default 700
    @optional
    **/

    /**
    ###### html編輯器高度

    @property height
    @type Integer
    @default 350
    @optional
    **/

    /**
    ###### html編輯器版面底色

    @property uiColor
    @type String
    @default '#FAECD5'
    @optional
    **/

    /**
    ###### html編輯器工具配置設定

    預設值:

    ```
    toolbarGroups : [
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
        {name: 'links' },
        {name: 'insert' },
        {name: 'forms' },
        {name: 'tools' },
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'others'},
        '/',
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph',   groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
        {name: 'styles'},
        {name: 'colors'},
    ]
    ```

    @property toolbarGroups
    @type Array
    @default 請參考上方預設值範例
    @optional
    **/


    /**
    ###### kcfinder使用的server位置(如需kcfinder,爲必須值)

    範例: 'http://brainsta.hiiir.com/js/kcfinder'

    @property kcfinderHost*
    @type String
    @required
    **/

    /**
    ###### html編輯器是否能瀏覽圖片(需kcfinder)

    @property isBrowserImage
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### html編輯器是否能瀏上傳圖片(需kcfinder)

    @property isUploadImage
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### html編輯器是否能瀏覽flash(需kcfinder)

    @property isBrowserFlash
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### html編輯器是否能上傳flash(需kcfinder)

    @property isUploadFlash
    @type Boolean
    @default false
    @optional
    **/




    var htmlTextArea = Ember.TextArea.extend({

        didInsertElement: function() {

            this._super();

            var optionsIndex = this.get('options');
            var options = this.get('targetObject.' + optionsIndex);
            var self = this;
            var elementId = self.get('elementId');
            var editor = null;


            // 初始化參數
            options = {
                skin: 'moono',
                width: options.width || 650,
                height: options.height || 300,
                uiColor: options.uiColor || '#FAECD5',
                extraPlugins: options.extraPlugins || ['youtube', 'flash'],
                toolbarGroups: options.toolbarGroups || [
                    {name: 'clipboard', groups: ['clipboard', 'undo']},
                    {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
                    {name: 'links' },
                    {name: 'insert' },
                    {name: 'forms' },
                    {name: 'tools' },
                    {name: 'document', groups: ['mode', 'document', 'doctools']},
                    {name: 'others'},
                    '/',
                    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                    {name: 'paragraph',   groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
                    {name: 'styles'},
                    {name: 'colors'},
                ],
                kcfinderHost: options.kcfinderHost,
                isBrowserImage: options.isBrowserImage || false,
                isUploadImage: options.isUploadImage || false,
                isBrowserFlash: options.isBrowserFlash || false,
                isUploadFlash: options.isUploadFlash || false,

                /*
                filebrowserBrowseUrl: 'http://brainsta.hiiir.com/js/kcfinder/browse.php?type=files',
                filebrowserImageBrowseUrl: 'http://brainsta.hiiir.com/js/kcfinder/browse.php?type=images',
                filebrowserFlashBrowseUrl: 'http://brainsta.hiiir.com/js/kcfinder/browse.php?type=flash',
                filebrowserUploadUrl: 'http://brainsta.hiiir.com/js/kcfinder/upload.php?type=files',
                filebrowserImageUploadUrl: 'http://brainsta.hiiir.com/js/kcfinder/upload.php?type=images',
                filebrowserFlashUploadUrl: 'http://brainsta.hiiir.com/js/kcfinder/upload.php?type=flash'
                */
            };


            if (options.isBrowserImage || options.isUploadImage || options.isBrowserFlash || options.isUploadFlash) {
                
                if (!options.kcfinderHost) {
                    throw new Error('view(htmlTextArea): kcfinderHost必須設定,才能上傳或瀏覽圖片');
                }
            }

            if (options.isBrowserImage) {
                options['filebrowserImageBrowseUrl'] = options.kcfinderHost + '/browse.php?type=images';
            }

            if (options.isUploadImage) {
                options['filebrowserImageUploadUrl'] = options.kcfinderHost + '/upload.php?type=images';
            }

            if (options.isBrowserFlash) {
                options['filebrowserFlashBrowseUrl'] = options.kcfinderHost + '/browse.php?type=flash';
            }

            if (options.isUploadFlash) {
                options['filebrowserFlashUploadUrl'] = options.kcfinderHost + '/upload.php?type=flash';
            }

            editor = CKEDITOR.replace(elementId, options);
            editor.on('change', function(e) {
                if (e.editor.checkDirty()) {
                    self.set('value', editor.getData());
                }
            });
        }
    });

    __exports__["default"] = htmlTextArea;
  });