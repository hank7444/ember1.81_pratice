var listTool = {

    paginator: function(data, currentPage, pageSize) {

        var outputData = [];
        var limit = 0;
        var currentPage = +currentPage || 1;
        var pageSize = +pageSize || 1;
        var dataLength = data.length;
        var totalPage = Math.ceil(dataLength / pageSize);

        limit = currentPage == 1 ? pageSize : currentPage * pageSize;

        outputData = data.slice(pageSize * (currentPage - 1), limit);

        return {
            outputData: outputData,
            totalPage: totalPage
        };
    }

};


module.exports = listTool;
