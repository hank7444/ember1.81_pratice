
// 如果有錯誤訊息, 就加上.has-error, 如果沒有就拿掉

var viewtest = Ember.View.extend({

    tagName: 'button',
    classNames: ['myclassName1'],
    classNameBindings: ['propertyA', 'propertyB', 'hovered', 
                        'awesome:so-very-cool', 'isUrgent', 'IsCamel',
                        'isEnabled:enabled:disabled', 'isSimpleEnabled::simpleDisabled'],
    attributeBindings: ['book-id', 'data-name', 'attr'], // 一定要在attrubuteBindings寫屬性名稱, 才能在hbs中下屬性
    propertyA: 'from-a',
  	propertyB: function() {
    	if (true) { 
    		return 'from-b'; 
    	}
  	}.property(),
    hovered: true, // 如果只有參數名, class名稱就會使用參數名
    awesome: true, // 在classNameBindings中用a:b形式簡寫property與class名稱對應
    isUrgent: true, // 如果是小駝峰寫法, class會自動換成is-urgent
    IsCamel: true, // 用大駝峰classname會自動換成is-camel
    isEnabled: false, // 如果希望true與false是兩個不同的class, 用a:b:c的形式來寫
    isSimpleEnabled: false, // 用a::b 代表在false時候會加上class simpleDisabled, true時不會加上任何class
    'book-id': 'hello', // 如果book-id沒在hbs輸入值, 就會塞入此default,
    click: function() {
        console.log(this.get('selection'));
        this.set('selection', true);

        // 取得所在controller的資料
        console.log(this.get('controller.validateData'));

        // 呼叫所在的controller的action
        this.get('controller').send('fromView', 'param1', 'param2');
    },
    attr: function() {
        var value = this.get('selection');
        console.log(value);

        /*
        if(value == 'bbb') {
            return false;
        }
        else {
            return true;
        }
        */
        if (value == 'aaa') {
            return 'itisaaala!';
        }
        else if (value == 'bbb') {
            return 'isisbbbla!';
        }
        else {
            return 'nonononono!!!!'; 
        }
        //return this.get('value') == this.get('selection');   
        
        // 如果不是html內建的屬性,回傳true或false不會有任何反應  
        // 內建屬性: disabled, selected, readonly...等
        // return value;

    }.property('selection'), // 當selection的值有變化時, 就觸發,然後重新render view
    isChangeSelection: function() {

        console.log('########isChange!!!');
        //return 'aaa'; // return東西也不會壞掉，但是沒有意義
    }.observes('selection'), // observes也是監聽物件或屬性的變化, 但是他沒有跟view綁定, 是更底層的操作


/*
    click: function() {
        console.log('click me!');
    },*/

    didInsertElement: function() {

        //console.log('didInsertElement!!!');
        //console.log($(this)); // 這樣寫是抓到ember view物件
        //console.log(this.$()); // 這樣寫是抓到DOM物件
/*
        $(this).on('click', function(e) {
            //e.preventDefault();
            console.log('####click!');
        });*/

        
        this.$().on('click', function(e) {
            console.log('####click!!!');
        });
    }
});

export default viewtest;