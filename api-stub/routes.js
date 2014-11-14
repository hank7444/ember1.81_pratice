var listTool = require('./lib/listTool');
var invoiceIntervalData = require('./data/invoiceInterval');
var companyData = require('./data/company');
var projectData = require('./data/project');
var projectCompanyData = require('./data/projectCompany');
var memberCompanyData = require('./data/memberCompany');

module.exports = function(server) {


    // Create an API namespace, so that the root does not 
    // have to be repeated for each end point.
    server.namespace('', function() {


        server.get('/login', function(req, res) {

            var resData = {
                'token': 'R4hTnAug7ssT2GTrkyK36jY6OWhZ9ZmOkYn1xdFuua2s1pkiU-iUjkvXFYwjusXZw8C2nVNNZwbui9mbS-HGr6AaJSAgujfrb',
                'memberId': 1,
                'memberType': 0,
                'account': 'hank_kuo@hiiir.com',
                'name': 'hank',
            };
            /*
            var resData = {
                message: '帳號密碼錯誤！'
            };*/

            res.send(resData);
            //res.status(500).send(resData);

        });



        // 營業人
        server.get('/company', function(req, res) {

            console.log('companyQuery');
            console.log(req.query);

            var pageSize = 2;
            var currentPage = req.query.currentPage;
            var dataLength = companyData.length;
            var totalPage = Math.ceil(dataLength / pageSize);
            var outputData = [];

            var paginatorOutput = listTool.paginator(companyData, currentPage, pageSize);

            var resData = {
                'currentPage': currentPage,
                'totalPage': paginatorOutput.totalPage,
                'pageSize': pageSize,
                'company': paginatorOutput.outputData
            };
            res.send(resData);
        });

        server.get('/company/1', function(req, res) {

            console.log('companyQuerySingle');
            console.log(req.query);

            var data = companyData[0];

            var resData = {
                companyId: data.companyId,
                companyName: data.companyName,
                registrationNo: data.registrationNo,
                permitDate: data.permitDate,
                permitWord: data.permitWord,
                contactPersonEmail: data.contactPersonEmail,
                auditStatus: data.auditStatus,
                status: data.status,
                hasProject: data.hasProject,
                hasSoftwareCerf: data.hasSoftwareCerf
            };

            res.send(resData);

        });

        server.get('/company/2', function(req, res) {

            console.log('companyQuerySingle');
            console.log(req.query);


            var data = companyData[1];

            var resData = {
                companyId: data.companyId,
                companyName: data.companyName,
                registrationNo: data.registrationNo,
                permitDate: data.permitDate,
                permitWord: data.permitWord,
                contactPersonEmail: data.contactPersonEmail,
                auditStatus: data.auditStatus,
                status: data.status,
                hasProject: data.hasProject,
                hasSoftwareCerf: data.hasSoftwareCerf
            };

            res.send(resData);
        });

        server.post('/company', function(req, res) {

            console.log('companyPost');
            console.log(req.body);


            var resData = {
                'companyId': 7,
            };

            res.send(resData);

        });

        server.put('/company/1', function(req, res) {

            console.log('companyPut');
            console.log(req.body);


            var resData = {
                'companyId': 1,
            };

            res.send(resData);

        });

        server.delete('/company', function(req, res) {

            console.log('companyDelete');
            console.log(req.body);


            var resData = {
                'companyId': 7,
            };

            res.send(resData);

        });














        // 專案
        server.get('/project', function(req, res) {

            console.log('projectQuery');
            console.log(req.query);


            var pageSize = 2;
            var currentPage = req.query.currentPage;
            var dataLength = projectData.length;
            var totalPage = Math.ceil(dataLength / pageSize);
            var outputData = [];

            var paginatorOutput = listTool.paginator(projectData, currentPage, pageSize);

            var resData = {
                'currentPage': currentPage,
                'totalPage': paginatorOutput.totalPage,
                'pageSize': pageSize,
                'companyStatusCount': {
                    'all': 7,
                    'hasCompany': 6,
                    'noCompany': 1
                },
                'project': paginatorOutput.outputData
            };

            res.send(resData);

        });


        server.get('/project/1', function(req, res) {

            console.log('projectQuerySingle:1');
            console.log(req.query);

            var data = projectData[0];

            var resData = {
                projectId: data.projectId,
                projectName: data.projectName,
                ownerAccount: data.ownerAccount,
                companyId: data.companyId,
                companyName: data.companyName,
                consoleStatus: data.consoleStatus,
                status: data.status
            };
            res.send(resData);

        });

        server.get('/project/4', function(req, res) {

            console.log('projectQuerySingle:4');
            console.log(req.query);

            var data = projectData[3];

            var resData = {
                projectId: data.projectId,
                projectName: data.projectName,
                ownerAccount: data.ownerAccount,
                companyId: data.companyId,
                companyName: data.companyName,
                consoleStatus: data.consoleStatus,
                status: data.status
            };
            res.send(resData);

        });

        server.get('/projectCompany', function(req, res) {

            console.log('projectCompanyQuery');
            console.log(req.query);

            var resData = {
                'company': projectCompanyData
            };

            res.send(resData);
        });


        server.put('/project/1', function(req, res) {

            console.log('projectPut:1');
            console.log(req.body);

            var resData = {
                'projectId': 1,
            };
            res.send(resData);
        });


        server.put('/project/4', function(req, res) {

            console.log('projectPut:4');
            console.log(req.body);

            var resData = {
                'projectId': 4,
            };
            res.send(resData);
        });











        server.get('/invoiceInterval', function(req, res) {

            console.log('invoiceIntervalQuery');
            console.log(req.query);

            var pageSize = 2;
            var currentPage = req.query.currentPage;
            var dataLength = invoiceIntervalData.length;
            var totalPage = Math.ceil(dataLength / pageSize);
            var outputData = [];

            var paginatorOutput = listTool.paginator(invoiceIntervalData, currentPage, pageSize);

            var resData = {
                'currentPage': currentPage,
                'totalPage': paginatorOutput.totalPage,
                'pageSize': pageSize,
                'invoiceInterval': paginatorOutput.outputData
            };

            res.send(resData);

        });


        server.get('/invoiceInterval/1', function(req, res) {

            console.log('invoiceIntervalQuerySingle');
            console.log(req.query);


            var data = invoiceIntervalData[0];

            var resData = {
                'invoiceIntervalId': data.invoiceIntervalId,
                'companyId': data.companyId,
                'companyName': data.companyName,
                'startYear': data.startYear,
                'startMonth': data.startMonth,
                'alphabet': data.alphabet,
                'startInvoiceNo': data.startInvoiceNo,
                'endInvoiceNo': data.endInvoiceNo,
                'currentNo': data.currentNo,
                'invoiceType': data.invoiceType
            };

            res.send(resData);

        });


        server.post('/invoiceInterval', function(req, res) {

            console.log('invoiceIntervalPost');
            console.log(req.body);


            var resData = {
                'invoiceIntervalId': 6,
            };

            res.send(resData);

        });

        server.get('/memberCompany/1', function(req, res) {

            console.log('memberComapnyQuery');
            console.log(req.query);

            var resData = {
                'company': memberCompanyData
            };

            res.send(resData);

        });

    });

};
