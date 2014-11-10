define("appkit/utils/globalObjFunc", 
  ["appkit/models/member-company","appkit/models/project-company","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var MemberCompanyModel = __dependency1__["default"];
    var ProjectCompanyModel = __dependency2__["default"];


    // 整個系統共用的物件或參數都會放在這裡
    var globalObj = function(type) { 

    	'use strict';


    	var addSearchSelection = function(ary) {

    		if (type == 'search') {
    			ary.unshift({
    				id: 'all',
    				name: '全部'
    			});
    		}
    		return ary;
    	};

    	return  {

    		projectCompanyAry: (function() {

    			return ProjectCompanyModel.findAll(type);

    		})(),

    		memberCompanyAry: (function() {

    			return MemberCompanyModel.findAll(type);

    		})(),

    		invoiceTypeAry: (function() {

    			var ary = [

    				{
    					id: '01',
    					name: '三聯式'
    				},
    				{
    					id: '02',
    					name: '二聯式'
    				}
    			];

    			return addSearchSelection(ary);

    		})(),

    		thisYear: (function() {

    			var date = new Date();
    			return date.getFullYear();
    		})(),

    		thisMonth: (function() {

    			var date = new Date();
    			return date.getMonth() + 1;
    		})(),

    		yearAry: function(range) {


    			var range = range || 5;
    			var date = new Date();
    			var thisYear = date.getFullYear();
    			var beginYear = thisYear - range;
    			var endYear = thisYear + range
    			var ary = [];


    			var i = beginYear;

    			while (beginYear <= endYear) {

    				ary.push({
    					id: beginYear,
    					name: beginYear
    				});

    				beginYear += 1;
    			}

    			return addSearchSelection(ary);
    		},

    		monthAry: (function() {

    			var ary = [

    				{
    					id: 1,
    					name: '01-02'
    				},
    				{
    					id: 2,
    					name: '03-04'
    				},
    				{
    					id: 3,
    					name: '05-06'
    				},
    				{
    					id: 4,
    					name: '07-08'
    				},
    				{
    					id: 5,
    					name: '09-10'
    				},
    				{
    					id: 6,
    					name: '11-12'
    				}
    			];

    			return addSearchSelection(ary);

    		})()
    	};
    };


    __exports__["default"] = globalObj;
  });