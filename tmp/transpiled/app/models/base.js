define("appkit/models/base", 
  ["appkit/utils/cookieProxy","appkit/utils/routeProxy","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var cookieProxy = __dependency1__["default"];
    var routeProxy = __dependency2__["default"];

    var config = {
        host: {
            default: window.ENV.default,

        }
    };

    // local storage
    var store = {};

    // private方法
    var privateFunc = {
       
        /*
         * 初始化local storage, 如果key為modelName的local storage
         * $param (string) modelName 資料名稱
         */
        initStore: function(modelName) {
            if (!store[modelName]) {
                store[modelName] = Em.A();
            }
        },
        /*
         * 正規化資料,把ember object特有的資料去除, 轉變成一般的object
         * $param (array) pdata 欲處理的資料
         */
        serialize: function(pdata) {
            var result = {};

            if (pdata !== null && typeof pdata === 'object') {

                for (var key in $.extend(true, {}, pdata)) {

                    // Skip these
                    if (key === 'isInstance' || key === 'isDestroyed' ||
                        key === 'isDestroying' || key === 'concatenatedProperties' ||
                        typeof pdata[key] === 'function' || key === 'validationErrors') {
                        continue;
                    }
                    result[key] = pdata[key];
                }
            }
            return result;
        }
    };


    var BaseModel = Ember.Object.extend({

        init: function() {

            if (Em.isNone(this.constructor.storageKey)) {
                throw new Error(Ember.String.fmt("%@ has to implement storageKey property or method", [this]));
            }
            this._super();
        }
    });

    BaseModel.reopenClass({

        // 繼承的子類別都要定義, 不然會出錯
        storageKey: null,

        getHost: function(hostKey) {
            return config.host[hostKey];
        },



        /*
         * 同jquery $.getJSON()
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        /*
        getJSON: function(purl, pdata, phost) {

            var host = phost || config.host;
            var data = this.serialize(pdata);
            return $.getJSON(host + purl, data);
        },
        */

         /*
         * 同jquery $.get()
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) pDataType 回傳資料格式設定 ex: 'json', 預設為'json'
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        get: function(purl, pdata, pDataType, phost) {

            console.log('into get');

            return this.ajax({
                dataType: pDataType,
                type: 'GET',
                url: purl,
                host: phost,
                data: pdata
            });

        },
        /*
         * 同jquery $.post()
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) pDataType 回傳資料格式設定 ex: 'json', 預設為'json'
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        post: function(purl, pdata, pDataType, phost) {

            console.log('into post');

            return this.ajax({
                dataType: pDataType,
                type: 'POST',
                url: purl,
                host: phost,
                data: pdata
            });
        },
        /*
         * 送出http request PUT
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) pDataType 回傳資料格式設定 ex: 'json', 預設為'json'
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        put: function(purl, pdata, pDataType, phost) {

            console.log('into post');

            return this.ajax({
                dataType: pDataType,
                type: 'PUT',
                url: purl,
                host: phost,
                data: pdata
            });
        },
        /*
         * 送出http request DELETE
         * $param (string) purl 網址 ex: /getPost
         * $param (array) pdata 欲傳遞參數
         * $param (string) pDataType 回傳資料格式設定 ex: 'json', 預設為'json'
         * $param (string) phost 網域 ex: http://www.yahoo.com
         */
        delete: function(purl, pdata, pDataType, phost) {

            console.log('into post');

            return this.ajax({
                dataType: pDataType,
                type: 'DELETE',
                url: purl,
                host: phost,
                data: pdata
            });
        },
        /*
         * 同jquery $.ajax()
         * params (object)
         *  $param (string) url 網址 ex: /getPost
         *  $param (array)  data 欲傳遞參數
         *  $param (string) dataType 回傳資料格式設定 ex: 'json', 預設為'json'
         *  $param (string) host 網域 ex: http://www.yahoo.com
         *  $param (string) type 欲送出之協定, 一般為GET, POST, PUT, DELETE, 預設為POST
         */
        ajax: function(params) {

            //throw 'token';

            var msg = '';

            switch (params.type) {

                case 'GET':
               
                    if (params.url == '/login') {   
                        msg = '登入中，請稍後...';
                    }
                    else {
                        msg = '取得資料中，請稍後...';
                    }
                    break;

                case 'POST':
                    msg = '儲存資料中，請稍後...';
                    break;

                case 'PUT':
                    msg = '儲存資料中，請稍後...';
                    break;

                case 'DELETE':
                    msg = '刪除資料中，請稍後...';
                    break;
            }



            // 檢查cookie有無memberId或是AUTHORIZATION
            if (cookieProxy.isLogin() === false) {

                if (params.url != '/login') {
                    throw 'token';
                }
            }
            else {
                routeProxy.send('showLoading', msg);
            }


            var url = params.url;
            var host = params.host || config.host.default;
            var dataType = params.dataType || 'json';
            var type = params.type || 'POST';
            var data = privateFunc.serialize(params.data);
            var headers = params.headers || {
                    AUTHORIZATION: cookieProxy.getCookie('token')
                };
            var that = this;
            var ajaxData = {};

            var parseResponseText = function(res) {

                if (res.responseText) {

                    try {
                        res.responseText = JSON.parse(res.responseText);
                    }
                    catch(e) {
                         throw new Error(Ember.String.fmt("JSON.parse發生錯誤!"));
                    }
                }
                return res;
            };



            // 統一帶入參數
            data.memberId = cookieProxy.getCookie('memberId');


            ajaxData = {
                dataType: dataType,
                type: type,
                url: host + url,
                data: data,
                headers: headers
            };

            // backend要求要這樣, 非GET要多帶processData跟contentType, 然後data要變成字串
            if (type != 'GET') {
                ajaxData.processData = false;
                ajaxData.contentType = 'application/json; charset=UTF-8';
                ajaxData.data = JSON.stringify(ajaxData.data);
            }

            console.log(ajaxData);
         
            /*
            不在base做error callback, 讓error bubble上去到要使用的controller或route中,
            如果在這邊return 任何值, 在往上會被當作success callback處理
            因此改用Ember.RSVP.Promise, 可將success or error的response一路往上拋到呼叫的進入點

            新版已經沒有這個問題，所以RSVP.Promise跟ic.ajax就拿掉了
            */

            var success = function(res) {

                routeProxy.send('hideLoading');
                console.log('into success1');

                res = parseResponseText(res);
                return res;
            };

            var error = function(res) {

                routeProxy.send('hideLoading');
                console.log('into error1');

                /*
                // 如果有錯誤, 需要共同的onerror來接, 可以用RSVP來達成
                // reject全部都會被RSVP.onerror來接
                var deferred = Ember.RSVP.defer();
                deferred.reject("End of the world");
                */

                res = parseResponseText(res);
                return res;
            };
            return Ember.$.ajax(ajaxData).then(success, error);
        },
        /*
         * 取得local storage資料
         * $param (string) modelName 資料名稱
         * $param (array) returnType: Ember Array
         */
        getter: function(modelName) {

            var modelName = modelName || this.storageKey;

            privateFunc.initStore(modelName);

            return store[modelName];
        },
        /*
         * 儲存local storage資料
         * $param (array) data 欲儲存資料
         * $param (string) key 欲儲存資料比對用id
         * $param (string) modelName 資料名稱
         */
        setter: function(data, key, modelName) {

            var modelName = modelName || this.storageKey;
            var key = key || '_id';
            var that = this;
           
            privateFunc.initStore(modelName);

            data.forEach(function(child) {

                var removeData = that.getter(modelName).findBy(key, child[key]);

                //console.log('removeData: ' + removeData);
                //console.log('modelName: ' + modelName);

                if (removeData) {
                    that.getter(modelName).removeObject(removeData);
                    that.getter(modelName).pushObject(child);
                }
                else {
                    console.log('pushObject');
                    that.getter(modelName).pushObject(child);
                }

            });
        },
        /*
         * 更新local storage一筆特定資料
         * $param (ember object) data 欲儲存資料
         * $param (string) key 欲儲存資料比對用id
         * $param (string) value 欲儲存資料比對用value
         * $param (string) modelName 資料名稱
         */
        setterBy: function(data, key, value, modelName) {

            var modelName = modelName || this.storageKey;
            var key = key || '_id';
            var removeData = this.getter(modelName).findBy(key, value);

            if (Em.isNone(value)) {
                throw new Error(Ember.String.fmt('setterBy: value is required'));
            }
            else if (Em.isNone(data)) {
                throw new Error(Ember.String.fmt('setterBy: data is required'));
            }

            if (removeData) {
                this.getter().removeObject(removeData);
                this.getter().pushObject(data);
            }
        }

    });

    __exports__["default"] = BaseModel;
  });