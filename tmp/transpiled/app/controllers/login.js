define("appkit/controllers/login", 
  ["appkit/models/login","appkit/utils/cookieProxy","appkit/utils/routeProxy","appkit/utils/auth","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Login = __dependency1__["default"];
    var cookieProxy = __dependency2__["default"];
    var routeProxy = __dependency3__["default"];
    var auth = __dependency4__["default"];

    var LoginController = Ember.ObjectController.extend({

    	validateData: function() {

    		return {

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

    		            error.appendTo($(element.parent()).siblings('span'));
    		        },
    		        rules: {
    		            'account': {
    		                required: true,
    		                //email: true
    		            },
    		            'password': {
    		            	required: true,
    		            	maxlength: 12,
    		            	minlength: 6,
    		            }
    		        },
    		        messages: {
    		            'account': {
    		                required: 'SSO帳號為必填',
    		                //email: 'email格式錯誤'
    		            },
    		            'password': {
    		            	required: '密碼為必填',
    		            	maxlength: '密碼字數不可超過12字',
    		            	minlength: '密碼字數不可少於6字',
    		            }
    		        }
    		    }
    		};
    	}.property(),

    	actions: {

    		login: function() {

    			console.log('trigger login!');

    			var that = this;

    			if ($(this.get('validateData.form')).valid()) {

    				var success = function(res) {

    					console.log('into success3');

    					Em.run(function() {

    						var minutes = 30;
    						var expires = new Date();
    						var member = {
    							memberId: res.memberId,
    							memberType: res.memberType,
    							account: res.account,
    							name: res.name
    						};

    						that.set('errorMsg', '');

    						if (that.get('isRemember')) {
    							minutes = 259200;
    						} 
    		
    						expires.setTime(expires.getTime() + (minutes * 60 * 1000));


    						// 設定cookie
    						cookieProxy.setCookie('token', res.token, {expires: expires}, null, true);
    						cookieProxy.setCookie('memberId', res.memberId, {expires: expires}, null, true);
    						cookieProxy.setCookie('member', member, {expires: expires}, null, true);


    						// 導頁到首頁
    			            Ember.run.later(null, function() {
    			            	auth.redirectForLogin();
    		                }, 100);

    		        	});
    				};

    				var error = function(res) {

    					console.log('into error3');

    					console.log(res);

    					// sso壞掉, 寫死登入資訊
    					/*
    					var minutes = 259200;
    					var expires = new Date();
    					var member = {
    						"memberId": "1",
    					    "memberType": "0",
    					    "account": "hank_kuo@hiiir.com",
    					    "name": "hank",
    					};

    					expires.setTime(expires.getTime() + (minutes * 60 * 1000));

    					$.cookie('token', 'R4hTnAug7ssT2GTrkyK36jY6OWhZ9ZmOkYn1xdFuua2s1pkiU-iUjkvXFYwjusXZw8C2nVNNZwbui9mbS-HGr6AaJSAgujfrb', {expires: expires});
    			        $.cookie('member', JSON.stringify(member), {expires: expires});


    			        that.transitionToRoute('main');

    					*/

    					// 如果ajax回來要做的事情要被測試, 就要用Em.run, 不然測試時會發生錯誤!
    					Em.run(function() {
    						console.log('login error');
    						that.set('errorMsg', res.responseText.message); // 將錯誤訊息塞入, 不過不用就註解掉吧
    					});
    					
    				};

    				Login.login(that.get('account'), that.get('password')).then(success, error);
    				

    				//console.log('aaa: ' + aaa);
    				//console.log(this.get('account'));
    				//console.log(this.get('password'));
    			}
    			else {
    				routeProxy.send('showNotification', '');
    			}
    		},
    	}
    });


    __exports__["default"] = LoginController;
  });