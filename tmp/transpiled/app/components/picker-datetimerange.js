define("appkit/components/picker-datetimerange", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**

    # picker-datetimerange(日期時間區間選擇器)[component]

    ## 更新訊息 

    原始來源: https://github.com/dangrossman/bootstrap-daterangepicker  

    最後編輯者: Hank Kuo  

    最後修改日期: 2013/11/11  

    更新資訊:  

    時間    | 版本 |           說明         | 編輯人
    ---------- | ---- | --------------------- | ---- 
    2013.11.11 | 1.0  | 建立元件 | Hank Kuo


    ## 相依套件與檔案


    #### 相依第三方套件
    vendor/bootsrap/ 版本:v3(flatty樣板版本)
    vendor/moment.min.js



    #### 相依元件


    #### 相依外部檔案與目錄
    vendor/flatty/javascripts/plugins/bootstrap_daterangepicker/bootstrap-datetimepicker.js  
    vendor/flatty/stylesheets/plugins/bootstrap_daterangepicker/bootstrap-datetimepicker.min.css  

    ## 相依後端I/O

    ## 參數說明與使用教學
    #### controller:

    參數範例:

    ```   
    dateRangeData: function() {

        return {
            width: 230, 
            ranges: {
                Yesterday: [moment().subtract('days', 1), moment().subtract('days', 1)],
                'Last 30 Days': [moment().subtract('days', 29), new Date()],
                'This Month': [moment().startOf('month'), moment().endOf('month')]
            },
            opens: 'right',
            format: 'MM/DD/YYYY',
            formatOutput: 'YYYY-MM-DD',
            separator: ' to ',
            startDate: moment(),
            endDate: moment().add('days', 1),
            minDate: '01/01/2012',
            maxDate: '12/31/2013',
            timePicker: true,
            timePickerIncrement: 1,
            timePicker12Hour: false,
            locale: {
                cancelLabel: '取消',
                applyLabel: '確定',
                fromLabel: 'FROM',
                toLabel: 'To',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ['日', 'ㄧ', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 1,
            },
            showWeekNumbers: true,
            buttonClasses: ['btn-danger'],
            dateLimit: {
                'days': 5
            }

        };
    }.property(),
    ```

    使用範例:

    ```
    // 取得日期時間
    this.get('model').myDateRange;
    ```

    #### template:

    ```
    {{picker-datetimerange options=dateRangeData value=myDateRange}}
    ```    

    @class picker-datetimerange
    @since 1.0
    */


    /**
    ###### 輸入框寬度

    @property width
    @type Integer
    @default 230
    @optional
    **/


    /**
    ###### 定義時間範圍標簽

    範例:

    ```
    ranges: {
        Yesterday: [moment().subtract("days", 1), moment().subtract("days", 1)],
        "Last 30 Days": [moment().subtract("days", 29), new Date()],
        "This Month": [moment().startOf("month"), moment().endOf("month")]
    },
    ```

    @property ranges
    @type Object
    @default null
    @optional
    **/

    /**
    ###### 開啓日曆位置

    選項:  
    1. 'right'(右邊)  
    2. 'left'(左邊)  

    @property opens
    @type String
    @default 'right'
    @optional
    **/

    /**
    ###### 日期選擇器顯示日期格式

    @property format
    @type String
    @default 'MM/DD/YYYY'
    @optional
    **/

    /**
    ###### 輸出日期格式

    備註: 請參考memont的format參數說明  

    @property formatOutput
    @type String
    @default 'YYYY-MM-DD',若timePicker = true,會自動加上'HH:mm:ss'
    @optional
    **/

    /**
    ###### 開始日期

    格式參考:  

    ```
    minDate: '01/01/2012' // String
    minDate:  moment().subtract('days', 1) // Moment Object
    ```

    @property startDate
    @type String or Moment Object
    @default moment()
    @optional
    **/


    /**
    ###### 結束日期

    格式參考:  

    ```
    minDate: '01/01/2012' // String
    minDate:  moment().subtract('days', 1) // Moment Object
    ```

    @property endDate
    @type String or Moment Object
    @default moment().add('days', 1)
    @optional
    **/


    /**
    ###### 最早可選擇日期

    格式參考:  

    ```
    minDate: '01/01/2012' // String
    minDate:  moment().subtract('days', 1) // Moment Object
    ```

    @property minDate
    @type String or Moment Object
    @default ''
    @optional
    **/

    /**
    ###### 最晚可選擇日期

    格式參考:  

    ```
    maxDate: '12/31/2013' // String
    maxDate:  moment().add('days', 1) // Moment Object

    ```

    @property maxDate
    @type String or Moment Object
    @default ''
    @optional
    **/


    /**
    ###### 是否要選擇時間

    @property timePicker
    @type Boolean
    @default false
    @optional
    **/

    /**
    ###### 選擇時間分鍾最小單位

    @property timePickerIncrement
    @type Integer
    @default 1
    @optional
    **/


    /**
    ###### 是否要使用12小時制格式(AM/PM)

    @property timePicker12Hour
    @type Boolean
    @default false
    @optional
    **/


    /**
    ###### 是否要使用12小時制格式(AM/PM)

    預設值:

    ```
    locale: {
        cancelLabel: "取消", // 取消按鈕顯示文字
        applyLabel: "確定",  // 確定按鈕顯示文字
        fromLabel: "FROM",  // 開始日期input欄位上方顯示文字
        toLabel: "To",      // 結束日期input欄位上方顯示文字
        customRangeLabel: "Custom Range",   
        daysOfWeek: ["日", "ㄧ", "二", "三", "四", "五", "六"],
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        firstDay: 1,    // 以哪一天為星期的第一天
    },
    ```

    @property locale
    @type Object
    @default 請參考上方預設值範例
    @optional
    **/


    /**
    ###### 開始與結束日期最大區間

    設定範例:

    ```
        dateLimit: {
            'days': 5 // 開始與結束日期間距不得超過5天
        }

        dateLimit: {
            'months': 1 // 開始與結束日期間距不得超過1個月
        }
    ```

    @property dateLimit
    @type Object
    @default null
    @optional
    **/

    var PickerDatetimerangeComponent = Ember.Component.extend({

        classNames: ['component-picker-datetimerange'],

        didInsertElement: function() {

            var that = this;
            var self = '#' + $(this.get('element')).attr('id');
            var options = this.get('options');
            var value = this.get('value');
            var width = options.width || 230;
            var defaultFormatOutput = 'YYYY-MM-DD';
            var optionsRanges = options.ranges;
            var optionsDateLimit = options.dateLimit;

            if (options.timePicker) {
                defaultFormatOutput += ' HH:mm:ss';
            }   

            options = {
                format: options.format || 'MM/DD/YYYY',
                formatOutput: options.formatOutput || defaultFormatOutput,
                opens: options.opens || 'right',
                separator: 'to',
                startDate: options.startDate || moment(),
                endDate: options.endDate || moment().add('days', 1),
                minDate: options.minDate || '',
                maxDate: options.maxDate || '',
                timePicker: options.timePicker || false,
                timePickerIncrement: options.timePickerIncrement || 1,
                timePicker12Hour: options.timePicker12Hour || false,
                locale: options.locale || {
                    cancelLabel: "取消",
                    applyLabel: "確定",
                    fromLabel: "FROM",
                    toLabel: "To",
                    //customRangeLabel: "Custom Range",
                    daysOfWeek: ["日", "ㄧ", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    firstDay: 1,
                },
                showWeekNumbers: true,
                buttonClasses: ["btn-danger"],
            };

            if (optionsRanges && Object.keys(optionsRanges).length !== 0) {
                options['ranges'] = optionsRanges;
            }

            if (optionsDateLimit && Object.keys(optionsDateLimit).length !== 0) {
                options['dateLimit'] = optionsDateLimit;
            }

            $(self + ' span').first().daterangepicker(options, function(start, end) {
               var value = start.format(options.formatOutput) + ' - ' + end.format(options.formatOutput);
               that.set('value', value);
               $(self + ' input').val(value);
            });

            $(self + ' .daterange').parent().first().css('width', width + 'px');
            $(self + ' input').val(value);
            
        }
    });

    __exports__["default"] = PickerDatetimerangeComponent;
  });