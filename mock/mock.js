/**
 * 数据mock
 * @author hq
 */
Mock.mock(/\/(xml|json).*/, function(options) {
    var urlParams = $.getUrlParams(options.url);

    var mockDataParams = [];
    var method = urlParams[0]["value"];
    var line_id = "";
    
    for(var i = 1; i < urlParams.length; i++) {
        if(urlParams[i]["key"] == "line_id") {
            line_id = urlParams[i]["value"];
        }
        else {
            var mockDataParam = { };

            mockDataParam["method"] = method;
            if(line_id) {
                mockDataParam["line_id"] = line_id;
            }
            
            mockDataParam[urlParams[i]["key"]] = urlParams[i]["value"];

            mockDataParams.push(mockDataParam);
        }
    }

    // 处理返回数据
    var respData = {};
    for(var i = 0; i < mockDataParams.length; i++) {
        var mockDataParam = mockDataParams[i];

        for(var j = 0; j < mockData.length; j++) {
            // 键数
            var keyCount = 0;
            // 匹配数
            var matchCount = 0;
            for(var mockDataParamKey in mockDataParam) {
                keyCount++;

                if(typeof(mockData[j][mockDataParamKey]) != "undefined" &&
                    mockData[j][mockDataParamKey] == mockDataParam[mockDataParamKey])  {
                    matchCount++;
                }
            }

            if(keyCount == matchCount) {
                if(mockData[j]["rawResp"]) {
                    respData = mockData[j].resp;
                }
                else {
                    $.extend(true, respData, mockData[j].resp);
                }
            }
        }
    }

    $.console.log("[Mock] 拦截请求。请求url：", options.url, "返回数据：", respData);

    return respData;
});