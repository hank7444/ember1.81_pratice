define("appkit/components/upload-file", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # upload-file(單筆檔案上傳)

    ## 更新訊息 

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/12/20  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.12.20 | 1.01 | 1. 修改傳入server參數tmpFiles爲tmpName<br>2. 取得圖片部分由$.get改為$.ajax已方便控制error callback<br>| Hank Kuo
    2013.10.30 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3.0.0
    vendor/jquery/fileupload/jquery.fileupload.js  
    vendor/jquery/fileupload/jquery.iframe-transport.js (for IE8 and lower)  


    #### 相依元件
    progress-bar


    #### 相依外部檔案與目錄
    app/styles/components/upload-file.css  
    public/assets/components/upload-file/  


    ## 相依後端I/O

    ##### 上傳原始檔案給後端:
    前端傳入值:

    ```
    {
        tmpName, // 檔案暫存名稱(String)
        fileSize // 檔案大小限制(Integer), 單位:byte
    }
    ```


    後端傳出值:

    ```
    {
        status // true為成功, false為失敗
    }
    ```


    ##### 從後端取得預覽圖片資訊:

    前端傳入值:

    ```
    {
        tmpName // 檔案暫存名稱(String)
    }

    ```


    後端傳出值:

    ```
    {
        url // 檔案路徑(String), 如果沒有帶host, 將會採用options.host
    }
    ```


    ## 參數說明與使用教學
    #### controller:

    參數設定:

    ```   
    uploadFileData: function() {

            return  {
                options: {
                    tmpName: 'filetest',
                    host: this.store.getHost('img'),
                    service: {
                        send: '/admin/admin/uploadfile',
                        get: '/admin/admin/getfile'
                    },
                    fileUrl: '',
                    dsrp: '說明文件, 可上傳pdf或doc, 檔案限制2MB',
                    imgWidth: 250,
                    statusMsg: true,
                    progressbar: true,
                    fileSizeLimit: 1024 * 1024 * 5,
                    fileTypes: 'pdf|doc',
                },
                progressbar: {
                    width: 260,
                    height: 10,
                    persentage: 0,
                    type: 'danger',
                    striped: true,
                    animated: true
                }         
            }
        }.property()
    ```

    #### template:

    ```
    {{upload-file options=uploadFileData.options progressbar=uploadFileData.progressbar}}
    ```    

    @class upload-file
    @since 1.0
    @require progress-bar
    */



    /**
    ###### 暫存檔案名稱

    @property tmpName*
    @type String
    @required
    **/


    /**
    ###### server host

    ex: http://www.hiiir.com

    @property host*
    @type String
    @required
    **/



    /**
    ###### 送出檔案與取得檔案的api位置

    預設:


    ```
    service: {
        send: '/admin/admin/uploadfile',
        get: '/admin/admin/getfile'
    }
    ```

    @property service
    @type Object
    @default 請參考上方物件結構
    @required
    **/


    /**
    ###### 檔案說明

    @property dsrp
    @type String
    @default '檔案上傳 可上傳pdf或doc, 檔案限制5MB(預設說明訊息)'
    @optional
    **/


    /**
    ###### 預覽圖片寬度

    @property imgWidth
    @type Integer
    @default 250
    @optional
    **/


    /**
    ###### 是否要顯示檔案上傳狀態

    @property statusMsg
    @type Boolean
    @default true
    @optional
    **/


    /**
    ###### 是否要顯示progressbar

    @property progressbar
    @type Boolean
    @default false
    @optional
    **/


    /**
    ###### 檔案大小限制(驗證用)

    @property fileSizeLimit
    @type Boolean
    @default 1024 * 1024 * 2
    @optional
    **/


    /**
    ###### 檔案副檔名(驗證用)

    @property fileTypes
    @type String
    @default 'pdf|doc'
    @optional
    **/


    var UploadFileComponent = Ember.Component.extend({

        tag: 'div',
        classNames: ['component-upload-file'],

        fileUrlShow: function() {

            var fileUrl = 'javascript:void(0)';

            if (this.get('options').fileUrl) {
                fileUrl = this.get('options').fileUrl;
            }
            return fileUrl;

        }.property('this.options.fileUrl'),

        fileImgShow: function() {

            var fileImg = 'assets/components/upload-file/tmpNoFile.png';
            var fileUrl = this.get('options').fileUrl;

            if (fileUrl) {

                var ext = fileUrl.substring(fileUrl.lastIndexOf('.'), fileUrl.length).replace('.', '');

                // 過濾副檔名之後的任何參數
                ext = ext.substr(0, ext.indexOf('?'));

                switch (ext) {
                    case 'doc':
                    case 'docx':
                        fileImg = 'assets/components/upload-file/icon_word.jpg';
                        break;

                    case 'ppt':
                    case 'pptx':
                        fileImg = 'assets/components/upload-file/icon_ppt.jpg';
                        break;

                    case 'xls':
                    case 'xlsx':
                        fileImg = 'assets/components/upload-file/icon_excel.jpg';
                        break;

                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                    case 'png':
                    case 'tif':
                        fileImg = 'assets/components/upload-file/icon_img.jpg';
                        break;

                    case 'pdf':
                        fileImg = 'assets/components/upload-file/icon_pdf.jpg';
                        break;

                    case 'zip':
                        fileImg = 'assets/components/upload-file/icon_zip.jpg';
                        break;

                    case 'rar':
                        fileImg = 'assets/components/upload-file/icon_rar.jpg';
                        break;

                    case 'avi':
                    case 'wmv':
                    case 'rmvb':
                    case 'mkv':
                    case 'mp4':
                    case 'mov':
                        fileImg = 'assets/components/upload-file/icon_video.jpg';
                        break;

                    case 'swf':
                        fileImg = 'assets/components/upload-file/icon_flash.jpg';
                        break;
                }
            }

            return fileImg;

        }.property('this.options.fileUrl'),


        didInsertElement: function() {


            var options = {};
            var that = this;
            var self = '#' + $(this.get('element')).attr('id');
            var errorMsg = '';


            // 確認必須屬性
            if (!this.get('options').tmpName) {
                throw new Error('component(upload-img): tmpName為必要屬性');
            }

            if (!this.get('options').host) {
                throw new Error('component(upload-img): host為必要屬性');
            }

            // 判斷progress資料是否存在
            if (this.get('options').progressbar && !this.get('progressbar')) {
                throw new Error('component(upload-img): 無progressbar資料');
            }

            // init options
            options = {
                host: this.get('options').host,
                service: {
                    send: this.get('options').service.send || '/admin/admin/uploadfile', // 預設上傳預覽圖路徑
                    get: this.get('options').service.get || '/admin/admin/getfile' // 預設取得預覽圖路徑
                },
                tmpName: this.get('options').tmpName,
                fileUrl: this.get('options').fileUrl || '',
                dsrp: this.get('options').dsrp || '檔案上傳 可上傳pdf或doc, 檔案限制5MB(預設說明訊息)',
                imgWidth: this.get('options').imgWidth || 150,
                imgSrc: this.get('options').imgSrc || 'assets/components/upload-file/tmpNoFile.png',
                statusMsg: this.get('options').statusMsg || true,
                progressbar: this.get('options').progressbar || false,
                fileSizeLimit: this.get('options').fileSizeLimit || 1024 * 1024 * 5,
                fileTypes: this.get('options').fileTypes || 'pdf|doc',
            }
            this.set('options', options);


            var privateFuncs = {
                setPersentage: function(persentage) {

                    if (options.progressbar) {
                        that.set('progressbar.persentage', persentage);
                    }
                },
                setStatusMsg: function(msg) {

                    if (options.statusMsg) {
                        $(self + ' .uploadStatus').html(msg);
                    }
                }
            };

            // 設定圖片寬度
            $(self + ' img').attr('width', options.imgWidth);



            // 上傳按鈕與input欄位綁定
            $(self + ' a[name=btnUpload]').click(function() {

                // 上傳按鈕與input欄位綁定
                $(self + ' input[name=file]').click();
            });


            $(self + ' input[name=file]').fileupload({
                url: options.host + options.service.send,
                dataType: 'json',
                formData: {
                    tmpName: options.tmpName,
                    fileSize: options.file_size_limit
                },
                autoUpload: true,
                start: function(e, data) {

                },
                add: function(e, data) {


                    var isError = false;
                    var formatRegExp = new RegExp("\.(" + options.fileTypes + ")$", "g");
                    var formatCheck = formatRegExp.test(data.originalFiles[0]['name']);

                    if (!formatCheck) {
            
                        privateFuncs.setStatusMsg('檔案格式錯誤,請上傳格式為 ' + options.fileTypes.replace('|', ', ') + ' 的檔案');
                        isError = true;
                    }

                    if (data.originalFiles[0]['size'] > options.fileSizeLimit) {
                        privateFuncs.setStatusMsg('檔案大小不得超過' + (options.fileSizeLimit / 1024 / 1024).toFixed(2) + 'MB');
                        isError = true;
                    }

                    if (isError === false) {
                        data.submit();
                    }
                },
                progress: function(e, data) {
                    var persent = parseInt(data.loaded / data.total * 100, 10);

                    privateFuncs.setPersentage(persent);
                    privateFuncs.setStatusMsg('上傳進度: ' + persent + '%');

                    //Ember.set(that.get('progressbar'), 'persentage', persent);
                },
                done: function(e, data) {

                    privateFuncs.setPersentage(100);
                    privateFuncs.setStatusMsg('上傳完成');

                    var result = data.result;

                    switch (result.status) {

                        case true:

                            var data = {
                                tmpName: options.tmpName,
                            };

                            var success = function(res) {

                                if (res) {
                                    var url = res.url;

                                    if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
                                        url = options.host + url;
                                    }
                                    that.set('options.fileUrl', url);
                                } 
                                else {
                                    privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                                }
                            };

                            var error = function(res) {
                                privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                            }
                           
                            $.ajax({
                                dataType: 'json',
                                type: 'GET',
                                url: options.host + options.service.get,
                                data: data
                            }).then(success, error);

                            break;

                        case false:
                            privateFuncs.setStatusMsg('上傳失敗, 請再試一次');
                            break;
                    }


                    Ember.run.later(null, function() {
                        privateFuncs.setPersentage(0);
                        privateFuncs.setStatusMsg('準備上傳');
                    }, 1500);

                },
                fail: function(e, error) {}
            });
        }
    });

    __exports__["default"] = UploadFileComponent;
  });