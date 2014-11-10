define("appkit/views/upload-file-basic", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # upload-file-basic (簡單檔案上傳)[view]

    ## 更新訊息 

    原始來源: 

    最後編輯者: Hank Kuo  

    最後修改日期: 2014/12/06  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.12.06 | 1.0  | 1. 增加檔案類型與檔案大小的判斷<br> 2. 當發生錯誤時,會將上傳檔案名稱清除  | Hank Kuo
    2013.12.06 | 1.0  | 建立元件 | Mars Peng


    ## 相依套件與檔案


    #### 相依第三方套件


    #### 相依元件


    #### 相依外部檔案與目錄

    ## 相依後端I/O


    #### controller:

    ```
    // 上傳檔案
    upload: function(file) {

        var data = this.get('companyData');
        data.softwareCerf = file;
        this.set('companyData', data);
    },

    // 上傳檔案錯誤callback 
    uploadError: function(msg) {

        //alert(msg);
        routeProxy.send('showGrowlNotifications', '檔案上傳發生錯誤!', msg, 'danger');
    }
    ```

    #### template:

    ```
    {{view "uploadFile" acceptFile="jpg pdf" acceptSize="10" action="upload" errorAction="uploadError" class="upload-f2e"}}
    ```    

    @class upload-file-basic
    @since 1.0
    */

    /**
    ###### 可上傳的檔案類型(檔案副檔名)

    若沒設定預設為所有檔案類型皆可上傳,
    要設定多個檔案類型,請用一格空白字元隔開

    @property acceptFile
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 可上傳的檔案大小(單位:MB)

    若沒設定則預設為無限大

    @property acceptSize
    @type Integer
    @default ''
    @optional
    **/

    /**
    ###### 接收上傳檔案的action(二進位檔案base64編碼)

    @property action
    @type String
    @default ''
    @optional
    **/

    /**
    ###### 接收錯誤訊息的action

    @property uploadError
    @type String
    @default ''
    @optional
    **/



    var uploadFileBasicView = Ember.TextField.extend({
    	type: 'file',
      attributeBindings: ['acceptFile', 'acceptSize'],

      change: function(evt) {
      
      	var input = evt.target;
        var cloned = $(input).clone(true);


      	if (input.files && input.files[0]) {
        	
          var reader = new FileReader();
        	var that = this;
          var file = input.files[0];
          var extension = file.name.substr((~-file.name.lastIndexOf(".") >>> 0) + 2);
          var acceptFile = this.get('acceptFile') ? this.get('acceptFile').split(' ') : '';
          var acceptSize = this.get('acceptSize');
          var i = 0;
          var len = acceptFile.length;
          var isCurrentType = true;
          var isCurrentSize = true;
          var errorMsg = '';


          // REMOVE: 發現file.type根本就是跟副檔名走, 所以我亂改檔案副檔名也會造成file.type改變,
          // 所以這邊改成直接判斷副檔名即可
          /*
          var fileHash = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'html': 'text/html',
            'htm': 'text/html',
            'css': 'text/css',
            'js': 'text/javascript',
            'zip': 'application/zip',
            'pdf': 'application/pdf',
            'png': 'image/png',
            'csv': 'text/csv ',
            'swf': 'application/x-shockwave-flash',
            'mp3': 'audio/mp3',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': '.xls', // 很奇怪2003的excel檔案格式, type會抓不到
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'txt': 'text/plain',
            'pfx': 'application/x-pkcs12'
          };
          */

          if (acceptFile) {

            for (;i < len; i += 1) {

              if (acceptFile[i] == extension) {
                isCurrentType = true;
                break;
              }
              else {
                isCurrentType = false;
              }
            }
          }


          if (acceptSize && acceptSize * 1024 * 1024 < file.size) {
              isCurrentSize = false;
          }


          if (!isCurrentType) {

            errorMsg += '上傳檔案類型錯誤, 可上傳檔案類型為: ' + this.get('acceptFile');
          } 

          if (!isCurrentSize) {
            errorMsg += '\n上傳檔案大小錯誤, 可上傳檔案大小為: ' + acceptSize + ' MB';
          }

          if (errorMsg) {
            that.sendAction('errorAction', errorMsg);

            // 將file的檔案名稱清除
            $(input).replaceWith(cloned.val(null));

          }
          else {
          	reader.onload = function(e) {
            		var fileToUpload = e.target.result;
            		that.sendAction('action', fileToUpload);
          	}
          	reader.readAsDataURL(file);
          }
       	}

      }
      
    });

    __exports__["default"] = uploadFileBasicView;
  });