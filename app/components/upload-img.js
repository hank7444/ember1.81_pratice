/**

# upload-img(單張圖片上傳)

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
app/styles/components/upload-img.css  
public/assets/components/upload-img/  


## 相依後端I/O

##### 上傳原始圖片給後端:
前端傳入值:

```
{
    tmpName, // 圖片暫存名稱(String)
    imgSize, // 圖片尺寸(Array)
    fileSize // 圖片檔案大小限制(Integer), 單位:byte
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
    tmpName, // 圖片暫存名稱(String)
    imgGetSize // 圖片取得尺寸代碼(String), ex:"s"
}

```


後端傳出值:

```
{
    width,  // 圖片寬度(Integer)
    height, // 圖片高度(Integer)
    src     // 圖片路徑(String), 如果沒有帶host, 將會採用options.host
}
```


## 參數說明與使用教學
#### controller:

參數設定:

```   
uploadImgData: function() {

        return  {
            one: {

                options: {
                    tmpName: 'testimg2',
                    host: this.store.getHost('img'),
                    service: {
                        send: '/admin/admin/uploadimg',
                        get: '/admin/admin/getimg'
                    },
                    dsrp: 'logo上傳 尺寸: 150x150, 可上傳png或jpg, 檔案限制2MB',
                    imgWidth: 250,
                    //imgSrc: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
                    statusMsg: true,
                    progressbar: true,
                    fileSizeLimit: 1024 * 1024 * 2,
                    fileTypes: 'png|jpg|jpeg',
                    imgSize: {
                        s: 300,
                        l: 600
                    },
                    imgGetSize: 's',
                    isUploadImgSize: false
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
        }
    }.property()
```

#### template:

```
{{upload-img options=uploadImgData.one.options progressbar=uploadImgData.one.progressbar}}
```    



@class upload-img
@since 1.0
@require progress-bar
*/


/**
###### 圖片暫存檔案名稱

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
###### 送出圖片與取得圖片的api位置

預設:


```
service: {
    send: '/admin/admin/uploadimg',
    get: '/admin/admin/getimg'
}
```

@property service
@type Object
@default 請參考上方物件結構
@required
**/


/**
###### 圖片說明

@property dsrp
@type String
@default '圖片上傳 尺寸: 150x150, 可上傳png或jpg, 檔案限制2MB(預設說明訊息)'
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
###### 是否要顯示圖片上傳狀態

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
###### 圖片檔案大小限制(驗證用)

@property fileSizeLimit
@type Boolean
@default 1024 * 1024 * 2
@optional
**/


/**
###### 圖片副檔名(驗證用)

@property fileTypes
@type String
@default 'png|jpg|jpeg'
@optional
**/


/**
###### 取得server圖片尺寸代號

預設:  

```
imgSize: {
    s: 300, // 寬300, 高等比例縮放
    l: 600  // 寬600, 高等比例縮放
}
```

參數說明:  

```
imgSize: {
    s: x100, // 高100, 寬等比例縮放
    l: 300x600 // 寬300, 高600
}
```

@property imgGetSize
@type String
@default 抓取options:imgSize第一個參數
@optional
**/


/**
###### 是否要依照上傳圖片大小顯示預覽圖

上傳圖片後, 是否依照取得圖片大小顯示照片, 
若為false則會依照imgWidth等比例縮放, 若為true則直接指定取得圖片的寬高, 預設為false

@property isUploadImgSize
@type Boolean
@default false
@optional
**/




var UploadImgComponent = Ember.Component.extend({

    tag: 'div',
    classNames: ['component-upload-img'],

    /*
    imgStyle: function() {
        return 'width: ' + this.get('options').imgWidth + 'px';
    }.property('this.options.imgWidth'), // 設定綁定this.progress, 這樣外面傳入參數改變就會動態改變數值
    */


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
                send: this.get('options').service.send || '/admin/admin/uploadimg', // 預設上傳預覽圖路徑
                get: this.get('options').service.get || '/admin/admin/getimg'   // 預設取得預覽圖路徑
            },
            tmpName: this.get('options').tmpName,
            dsrp: this.get('options').dsrp || '圖片上傳 尺寸: 150x150, 可上傳png或jpg, 檔案限制2MB(預設說明訊息)',
            imgWidth: this.get('options').imgWidth  || 150,
            imgSrc:  this.get('options').imgSrc || 'assets/components/upload-img/tmpNoImage.png',
            statusMsg: this.get('options').statusMsg || true,
            progressbar: this.get('options').progressbar || false,
            fileSizeLimit: this.get('options').fileSizeLimit || 1024 * 1024 * 2,
            fileTypes: this.get('options').fileTypes || 'png|jpg|jpeg',
            imgSize: JSON.stringify(this.get('options').imgSize) || JSON.stringify({
                s: 300,
                l: 600
            }),
            imgGetSize: this.get('options').imgGetSize || Object.keys(this.get('options').imgSize)[0],
            isUploadImgSize: this.get('options').isUploadImgSize || false
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

            //options.tmpName = options.tmpName || options.imgName + '_' + new Date().getTime();

            //console.log('options.tmpName:' + options.imgGetSize);

            //這樣可以控制圖片的寬度喔
            //Ember.set(that.get('options'), 'imgWidth', 500);

            // 要修改object的property要用這樣的方式, 不能用this.get('progressbar').set('persentage', 10);
            //Ember.set(that.get('progressbar'), 'persentage', that.get('progressbar').persentage + 10);

            // 上傳按鈕與input欄位綁定
            $(self + ' input[name=file]').click();
        });


        $(self + ' input[name=file]').fileupload({
            url: options.host + options.service.send,
            dataType: 'json',
            formData: {
                tmpName: options.tmpName,
                imgSize: options.imgSize,
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
                    //alert('圖片格式錯誤');


                    privateFuncs.setStatusMsg('圖片格式錯誤,請上傳格式為 ' + options.fileTypes.replace('|', ', ') + ' 的圖片');
                    isError = true;
                }

                if (data.originalFiles[0]['size'] > options.fileSizeLimit) {
                    //parent.showMessageBox('圖片檔案大小不得超過' + options.file_size_limit/1000/1000 + 'MB');
                    //alert('圖片檔案大小不得超過' + (options.fileSizeLimit / 1024 / 1024).toFixed(2) + 'MB')
                    privateFuncs.setStatusMsg('圖片檔案大小不得超過' + (options.fileSizeLimit / 1024 / 1024).toFixed(2) + 'MB');
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
                            imgGetSize: options.imgGetSize
                        };

                        var success = function(res) {

                            if (res) {

                                var url = res.src;

                                if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
                                    url = options.host + url;
                                }

                                if (options.isUploadImgSize) {
                                    $(self + ' img').attr('width', res.width)
                                                    .attr('height', res.height)
                                                    .attr('src', url);
                                }
                                else {
                                    $(self + ' img').attr('src', url);
                                }
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
                        //parent.showMessageBox(result.msg);
                        break;
                }

         
                Ember.run.later(null, function() {
                    privateFuncs.setPersentage(0);
                    privateFuncs.setStatusMsg('準備上傳');
                }, 1500);
                
            },
            fail: function(e, error) {
            }
        });
    }
});
export default UploadImgComponent;