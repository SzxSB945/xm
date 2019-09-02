/**
 * om接口层
 * @author hq
 */
$.extend({
    om: {
        // 请求的基础地址
        baseUrl: DEFAULT_SERVER,

        // 请求的数据类型
        dataType: DEFAULT_DATA_TYPE,

        // 默认加入到请求url中的参数
        extraUrlParam: EXTRA_URL_PARAM,

        // 最长的请求url长度阈值，如果超出此长度，会使用post请求
        maxUrlLength: MAX_URL_LENGTH,
        // post请求的body长度的阈值
        maxPostBodyLength: MAX_POST_BODY_LENGTH,
        // post请求的数据条目
        maxPostRecordCount: MAX_POST_RECORD_COUNT,
        // 调用set接口时，post请求体中最大的id数
        maxPostIdCount: MAX_POST_ID_COUNT,

        // 解析服务端返回的数据
        /**
         * 
         * @param {String} data 
         * @param {String} dataType 
         * @param {Boolean} dontCheckLogin 是否不检查返回值中登录状态（检查返回值时，如果返回未登录错误码会弹窗，有些接口不需要这个弹窗）
         */
        _parseData: function (data, dataType, dontCheckLogin) {
            // 解析xml数据
            if ($.trim(data).indexOf('<') == 0) {
                var jdata = $.xml2Json(data);
                var result = {};

                // 这个函数获取接口返回的item
                var getItem = function (item) {
                    // 有些接口返回的item可能会额外包一层<item>
                    // 例如<item id="xx"><item id="xx" value="yy"/></item>
                    // 获取它的值需要使用内部的item
                    return item.item ? item.item : item;
                }

                // 这个函数获取接口返回的item的数据
                var getItemValue = function (item) {
                    var _item = getItem(item);
                    // 接口返回的数据可能是<item id="xx" value="yy">或<item id="xx"><value>yy</value></item>
                    return !$.isUndefined(_item._value) ? _item._value : _item.value;
                }

                if (jdata && jdata.rsp) {
                    if (jdata.rsp._stat == "ok") {
                        result.success = true;
                        // 数据
                        result.data = {};

                        if (jdata.rsp.config &&
                            jdata.rsp.config.item) {
                            // 返回数组数据
                            if ($.isArray(jdata.rsp.config.item)) {
                                $.each(jdata.rsp.config.item, function (index, item) {
                                    var actualItem = getItem(item);
                                    var actualItemValue = getItemValue(actualItem);

                                    // if(!actualItemValue ||
                                    //     actualItemValue == "Not Defined") {
                                    //     return;
                                    // }

                                    // 如果config有line_id参数
                                    if (jdata.rsp.config._line_id) {
                                        if ($.isUndefined(result.data["line_id" + jdata.rsp.config._line_id])) {
                                            result.data["line_id" + jdata.rsp.config._line_id] = {};
                                        }

                                        result.data["line_id" + jdata.rsp.config._line_id]["id" + actualItem._id] = actualItemValue;
                                    }
                                    // 如果item有line_id参数
                                    else if (actualItem._line_id) {
                                        if ($.isUndefined(result.data["line_id" + actualItem._line_id])) {
                                            result.data["line_id" + actualItem._line_id] = {};
                                        }

                                        result.data["line_id" + actualItem._line_id]["id" + actualItem._id] = actualItemValue;
                                    }
                                    // 都没有line_id参数
                                    else {
                                        result.data["id" + actualItem._id] = actualItemValue;
                                    }
                                });
                            }
                            // 返回单条数据
                            else {
                                var actualItem = getItem(jdata.rsp.config.item);
                                var actualItemValue = getItemValue(actualItem);

                                // 如果config有line_id参数
                                if (jdata.rsp.config._line_id) {
                                    result.data["line_id" + jdata.rsp.config._line_id] = {};
                                    result.data["line_id" + jdata.rsp.config._line_id]
                                    ["id" + actualItem._id] = actualItemValue;
                                }
                                // 如果item有line_id参数
                                else if (actualItem._line_id) {
                                    result.data["line_id" + actualItem._line_id] = {};
                                    result.data["line_id" + actualItem._line_id]
                                    ["id" + actualItem._id] = actualItemValue;
                                }
                                // 都没有line_id参数
                                else {
                                    result.data["id" + actualItem._id] = actualItemValue;
                                }
                            }
                        }

                        // 拼装数组形式的数据（方便于应对返回line_id不固定的情况，例如获取部门的接口）
                        result.dataArray = [];

                        for (var key in result.data) {
                            if (key.indexOf("id") == 0) {
                                var d = {};
                                d[key] = result.data[key];
                                result.dataArray.push(d);
                            }
                            else if (key.indexOf("line_id") == 0) {
                                var d = {};
                                d.line_id = key.replace("line_id", "");
                                for (var key2 in result.data[key]) {
                                    d[key2] = result.data[key][key2];
                                }

                                result.dataArray.push(d);
                            }
                        }
                    }
                    else if (jdata.rsp._stat == "reboot") {
                        result.success = false;
                        var errors = [];
                        errors.push({ code: "reboot", msg: "reboot" });
                        result.error = errors;
                    }
                    else if (jdata.rsp._stat == "restart") {
                        result.success = false;
                        var errors = [];
                        errors.push({ code: "restart", msg: "restart" });
                        result.error = errors;
                    }
                    // 空数据，不作为错误返回
                    else if (jdata.rsp._stat == "empty") {
                        result.success = true;

                        if (dataType == "json") {
                            result.data = [];
                        }
                        else {
                            result.data = {};
                            result.dataArray = [];
                        }
                    }
                    else {
                        result.success = false;

                        // 返回的错误
                        var errors = [];

                        if (jdata.rsp.Error) {
                            if ($.isArray(jdata.rsp.Error)) {
                                $.each(jdata.rsp.Error, function (i, err) {
                                    var errObj = {
                                        code: err._code,
                                        msg: err._msg
                                    }

                                    // 登录接口的重试次数
                                    if(err._Retry) {
                                        errObj.retry = err._Retry;
                                    }

                                    errors.push(errObj);
                                });
                            }
                            else {
                                var errObj = {
                                    code: jdata.rsp.Error._code,
                                    msg: jdata.rsp.Error._msg
                                }

                                // 登录接口的重试次数
                                if(jdata.rsp.Error._Retry) {
                                    errObj.retry = jdata.rsp.Error._Retry;
                                }
                                
                                errors.push(errObj);
                            }
                        }

                        result.error = errors;

                        if(!dontCheckLogin) {
                            /* 在接口层这里统一做登录检查 */
                            // 检查是否需要重新登录
                            var checkLogin = function (errors) {
                                var needLogin = false;
    
                                $.each(errors, function (i, err) {
                                    if (err.code == "105" ||
                                        err.code == "5") {
                                        needLogin = true;
                                    }
                                });
    
                                return needLogin;
                            };
    
                            // 是否需要重新登录
                            if (checkLogin(errors)) {
                                if ($.isUndefined($.getTopWindow().loginExpiredDialogShow)) {
                                    $.getTopWindow().$.alert($.lang.get('loginExpired'), "alert", function () {
                                        // 清空当前保存的用户信息
                                        $.user.clear();
                                        $.getTopWindow().location.href = "/login.html";
                                    });
    
                                    $.getTopWindow().loginExpiredDialogShow = true;
                                }
    
                                return;
                            }
                        }
                    }
                }
                else {
                    result.success = false;
                }

                result.rawData = data;

                return result;
            }
            // 返回数据为空时，判定为返回成功（网络配置里修改IP后，可能返回空值）
            else if(data == "") {
                return {
                    success: true
                }
            }
            // 解析json数据
            else {
                return {
                    success: true,
                    data: data ? $.parseJSON(data) : null
                };
            }
        },

        // 获取OM8000数据
        _getData: function (method, reqParams, dataType) {
            var reqUrl = $.om.baseUrl + (dataType ? dataType : this.dataType) + "?method=" + method;

            // 解析请求参数
            var parseReqParam = function (reqParam) {
                var reqParamStr = "";

                for (var key in reqParam) {
                    if ($.isArray(reqParam[key])) {
                        $.each(reqParam[key], function (i, d) {
                            reqParamStr += "&" + key + "=" + d;
                        });
                    }
                    else {
                        reqParamStr += "&" + key + "=" + reqParam[key];
                    }
                }

                return reqParamStr.substr(1);
            }

            var reqParamStr = "&";

            if ($.isArray(reqParams)) {
                for (var i = 0; i < reqParams.length; i++) {
                    reqParamStr += parseReqParam(reqParams[i]) + "&";
                }

                reqParamStr = reqParamStr.substr(0, reqParamStr.length - 1);
            }
            else {
                reqParamStr += parseReqParam(reqParams);
            }

            // 参数长度超出了阈值，使用post形式提交
            if (reqParamStr.length > this.maxUrlLength) {
                $.console.log("请求url的长度超出了阈值，使用post方式进行提交(getData)");

                reqUrl += this.extraUrlParam;

                // 发起请求
                return $.ajax({
                    method: 'post',
                    url: reqUrl,
                    data: reqParamStr.substr(1),
                    dataType: 'text'
                });
            }
            else {
                reqUrl += (reqParamStr == "&" ? "" : reqParamStr) + this.extraUrlParam;

                // 发起请求
                return $.ajax({
                    method: 'get',
                    url: reqUrl,
                    dataType: 'text'
                });
            }
        },

        // 修复om8000接口返回数据的bug
        _fixOMInterfaceDataBug: function (respData) {
            if (OM_INTERFACE_BUG_FIX) {
                // 修复om8000接口返回json格式错误的问题
                return respData.replace(/,}/g, "}");
            }

            return respData;
        },

        /**
         * 获取OM8000的数据
         * @function
         * @param {String} method 请求的函数名
         * @param {Object} reqParams 请求参数。json对象或数组。
         * @callback successCallback 成功回调
         * @callback failCallback 失败回调
         * @param {String} dataType
         * @returns
         */
        // reqParams示例：单个id参数{ line_id: 1, id: 100 }
        //              多个id参数[{ line_id: 1, id: [100, 101, 102] }， { line_id: 2, id: 101 }]
        getData: function (method, reqParams, successCallback, failCallback, dataType) {
            var _this = this;

            $.when(this._getData(method, reqParams, dataType))
                .done(function (data) {
                    if (!$.isUndefined(successCallback)) {
                        successCallback(_this._parseData(_this._fixOMInterfaceDataBug(data), dataType));
                    }
                })
                .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    if (!$.isUndefined(failCallback)) {
                        failCallback(XMLHttpRequest, textStatus, errorThrown);
                    }
                });;
        },
        
        /**
         * 批量获取OM8000的数据
         * @function
         * @param {Object} data 请求的参数。格式：[{method: "gw.status.get", param: {line_id: 3, id: 100}},{method: "gw.status.get", param: {line_id: 3, id: 101}}]
         * @param {Function} successCallback 成功回调。接收一个参数，数组形式的数据
         * @param {Function} failCallback 失败回调
         * @returns 返回数组形式的数据
         */
        getDataParallel: function (data, successCallback, failCallback) {
            var _this = this;
            var deferrs = [];
            $.each(data, function (i, d) {
                deferrs.push(_this._getData(d.method, d.param, d.dataType));
            });

            $.when.apply($, deferrs)
                .done(function () {
                    var respData = [];

                    if (data.length == 1) {
                        respData.push(_this._parseData(_this._fixOMInterfaceDataBug(arguments[0])));
                    }
                    else {
                        for (var i = 0; i < arguments.length; i++) {
                            respData.push(_this._parseData(_this._fixOMInterfaceDataBug(arguments[i][0])));
                        }
                    }

                    if (!$.isUndefined(successCallback)) {
                        successCallback(respData);
                    }
                })
                .fail(function () {
                    if (!$.isUndefined(failCallback)) {
                        failCallback();
                    }
                });
        },

        // 设置OM8000数据
        _setData: function (method, reqParams, extraReqParam) {
            var _this = this;

            var reqParamStrs = [];
            var reqParamStr = "";

            // 单条数据添加
            if (!$.isArray(reqParams)) {
                var postRecordCount = 0;
                var postIdCount = 0;

                for (var pn in reqParams) {
                    reqParamStr += "&" + pn + "=" + reqParams[pn];

                    if (pn == "line_id" ||
                        (extraReqParam &&
                            (extraReqParam.indexOf("import=ext") != -1 || extraReqParam.indexOf("import=trk") != -1) &&
                            pn == "id401")
                    ) {
                        postRecordCount++;
                    }

                    if (pn.indexOf("id") == 0) {
                        postIdCount++;
                    }

                    // 请求参数长度或数据条数超过了阈值
                    // 一般情况下，单条数据的set不会触及到这里的条件
                    if (reqParamStr.length >= _this.maxPostBodyLength ||
                        postRecordCount >= _this.maxPostRecordCount ||
                        postIdCount >= _this.maxPostIdCount) {
                        reqParamStrs.push(reqParamStr.substr(1));

                        reqParamStr = "";
                        postRecordCount = 0;
                        postIdCount = 0;
                    }
                }
            }
            // 多条数据添加
            else {
                var postRecordCount = 0;
                var postIdCount = 0;

                for (var i = 0; i < reqParams.length; i++) {
                    for (var pn in reqParams[i]) {
                        reqParamStr += "&" + pn + "=" + reqParams[i][pn];

                        if (pn == "line_id" ||
                            (extraReqParam &&
                                (extraReqParam.indexOf("import=ext") != -1 || extraReqParam.indexOf("import=trk") != -1) &&
                                pn == "id401")
                        ) {
                            postRecordCount++;
                        }

                        if (pn.indexOf("id") == 0) {
                            postIdCount++;
                        }
                    }

                    if (reqParamStr.length >= _this.maxPostBodyLength ||
                        postRecordCount >= _this.maxPostRecordCount ||
                        postIdCount >= _this.maxPostIdCount) {
                        reqParamStrs.push(reqParamStr.substr(1));

                        reqParamStr = "";
                        postRecordCount = 0;
                        postIdCount = 0;
                    }
                }
            }

            // 这个if语句防止多次push最后一个reqParamStr
            if (reqParamStr &&
                reqParamStr.length < _this.maxPostBodyLength) {
                reqParamStrs.push(reqParamStr.substr(1));
            }

            // 20190315 method需要放到请求体里面
            //var reqUrl = $.om.baseUrl + $.om.dataType + "?method=" + method;
            var reqUrl = $.om.baseUrl + $.om.dataType;

            var deferrs = [];
            for (var i = 0; i < reqParamStrs.length; i++) {
                var extraUrlPart = _this.extraUrlParam;
                if (extraUrlPart.indexOf("&") == 0) {
                    extraUrlPart = "?" + extraUrlPart.substr(1);
                }

                // 20190315 method需要放到请求体里面
                var reqData = "method=" + method + "&";
                reqData += extraReqParam ? extraReqParam + "&" + reqParamStrs[i] : reqParamStrs[i];

                $.console.log("[_setData] 请求url:", reqUrl + extraUrlPart, ",请求数据:", reqData);

                deferrs.push(
                    $.ajax({
                        method: 'post',
                        url: reqUrl + extraUrlPart,
                        data: reqData,
                        dataType: 'text'
                    })
                );
            }

            return deferrs;
        },

        /**
         * 设置OM8000数据
         * @function
         * @param {String} method 请求的函数名
         * @param {Object} reqParams 请求参数。json对象或数组。
         * @callback successCallback 成功回调
         * @callback failCallback 失败回调
         * @param {String} extraReqParam 在每个请求中加入的额外请求参数。默认加在method的后面
         * @returns
         */
        // reqParams示例：单个参数队列{ line_id: 1, id1: 1, id2: 2, id3: 3 }
        //              多个参数队列[{ line_id: 2, id1: 1, id2: 2, id3: 3 }, { line_id: 2, id4: 4, id5: 5, id6: 6 }]
        setData: function (method, reqParams, successCallback, failCallback, extraReqParam) {
            var _this = this;

            $.when.apply($, this._setData(method, reqParams, extraReqParam))
                .done(function () {
                    var respData = {};

                    if (!$.isArray(arguments[0])) {
                        respData = _this._parseData(arguments[0]);
                    }
                    else {
                        var respDataArr = [];
                        for (var i = 0; i < arguments.length; i++) {
                            respDataArr.push(_this._parseData(arguments[i][0]));
                        }

                        var failedRespData = $.grep(respDataArr, function (n) { return !n.success; });
                        if (!failedRespData.length) {
                            respData.success = true;
                        }
                        else {
                            respData.success = false;
                            respData.error = [];
                            for (var i = 0; i < failedRespData.length; i++) {
                                respData.error = respData.error.concat(failedRespData[i].error);
                            }
                        }
                    }

                    if (!$.isUndefined(successCallback)) {
                        successCallback(respData);
                    }
                })
                .fail(function () {
                    if (!$.isUndefined(failCallback)) {
                        failCallback();
                    }
                });
        },

        /**
         * 批量设置OM8000数据
         * @param {Object} data 设置的数据。格式：[{method: "gw.status.get", param: {id1: "1", id2: 2}},{method: "gw.status.get", param: [{id1: "1", id2: 2}, {id2: "2", id2: 2}]}]
         * @param {Function} successCallback 成功回调
         * @param {Function} failCallback 失败回调
         * @param {String} extraReqParam 加入到请求中的额外参数
         * @param {Boolean} dontCheckLogin 是否不检查返回值中登录状态（检查返回值时，如果返回未登录错误码会弹窗，有些接口不需要这个弹窗）
         */
        setDataParallel: function (data, successCallback, failCallback, extraReqParam, dontCheckLogin) {
            var _this = this;
            var deferrs = [];
            $.each(data, function (i, d) {
                deferrs = deferrs.concat(_this._setData(d.method, d.param, extraReqParam));
            });

            $.when.apply($, deferrs)
                .done(function () {
                    var respData = [];

                    if (data.length == 1) {
                        respData.push(_this._parseData(arguments[0], null, dontCheckLogin));
                    }
                    else {
                        for (var i = 0; i < arguments.length; i++) {
                            respData.push(_this._parseData(arguments[i][0], null, dontCheckLogin));
                        }
                    }

                    if (!$.isUndefined(successCallback)) {
                        successCallback(respData);
                    }
                })
                .fail(function () {
                    if (!$.isUndefined(failCallback)) {
                        failCallback();
                    }
                });
        },

        /**
         * 判断接口层返回数据是否有错误信息
         * @param {Object} resp 接口层返回的数据
         */
        hasError: function (resp) {
            var hasError = false;

            if ($.isArray(resp)) {
                $.each(resp, function (i, d) {
                    if (!d.success) {
                        hasError = true;
                    }
                });
            }
            else {
                if (!resp.success) {
                    hasError = true;
                }
            }

            return hasError;
        },

        /**
         * 组建接口层返回数据的错误信息
         * @param {Object} resp 接口层返回的数据
         */
        buildError: function (resp) {
            var errors = [];
            var errorCount = 0;

            if ($.isArray(resp)) {
                $.each(resp, function (i, d) {
                    if (!d.success) {
                        errors = errors.concat(d.error);
                        errorCount += d.error.length;
                    }
                });
            }
            else {
                if (!resp.success) {
                    errors = errors.concat(resp.error);
                    errorCount += resp.error.length;
                }
            }

            // 组建错误信息
            var buildErrorInfo = function(err) {
                var errorInfo = "";

                // 匹配到的映射的最大关键字数量
                var maxMatchedKeyword = 0;

                // 根据前缀规则组建前缀信息
                var buildPrefixInfo = function(errMapping, errMsg) {
                    var prefixMsgArr = [];
                    var linePrefixMsg = "";

                    if(errMapping.showIdPrefixInfo) {
                        $.each($.ID_NAME_MAPPING, function(i, inm) {
                            if(errMsg.indexOf(inm.kw) != -1) {
                                prefixMsgArr.push(inm.msg);
                            }
                        });
                    }

                    if(errMapping.showLinePrefixInfo) {
                        var lineIdMatch = errMsg.match(/line_id=(\d+)/);
                        if(lineIdMatch) {
                            linePrefixMsg += $.lang.get("line", "线路") + lineIdMatch[1] + " ";
                        }
                    }

                    return linePrefixMsg + prefixMsgArr.join(",");
                };

                $.each($.ERROR_MAPPING, function(i, errMapping) {
                    if($.isArray(errMapping.keyword)) {
                        // 未匹配的关键字数量
                        var notMatchedKwCount = $.grep(errMapping.keyword, 
                            function(kw) { return err.msg.indexOf(kw) == -1}).length;

                        // 与映射的关键字全部匹配，并且是最大匹配时
                        if(notMatchedKwCount == 0 && 
                            maxMatchedKeyword <= errMapping.keyword.length) {
                            errorInfo = buildPrefixInfo(errMapping, err.msg) + " " + errMapping.message;
                            maxMatchedKeyword = errMapping.keyword.length;
                        }
                    }
                    else {
                        if(err.msg.indexOf(errMapping.keyword) != -1 &&
                            maxMatchedKeyword <= 1) {
                            errorInfo = buildPrefixInfo(errMapping, err.msg) + " " + errMapping.message;
                            maxMatchedKeyword = 1;
                        }
                    }
                });

                // 如果没有在映射中匹配到时，使用默认格式
                if(!errorInfo.length) {
                    errorInfo = "code:" + err.code + ", msg:" + err.msg;
                }

                return errorInfo;
            }

            // 组建错误信息
            var errorInfo = '<div class="error-info">';
            // 是否是重启错误
            var isRebootError = true;
            $.each(errors, function (i, err) {
                errorInfo += "<div>" + (i + 1) + ") " + buildErrorInfo(err) + "</div>";

                if (err.code != "reboot" && err.code != "restart") {
                    isRebootError = false;
                }
            });

            errorInfo += "</div>";

            return {
                errors: errors,
                errorInfo: errorInfo,
                errorCount: errorCount,
                isRebootError: isRebootError
            }
        },

        api: {
            // 获取彩铃
            getRing: function (callback) {
                $.om.getData("gw.config.get", { id: 771 }, function (data) {
                    if (data.success) {
                        var files = data.data.id771.split("|");

                        callback(files);
                    }
                });
            },

            // 获取部门
            getDepartments: function (successCallback) {
                var orgParam = [];

                for (var i = 1; i <= 300; i++) {
                    orgParam.push({
                        line_id: i,
                        id: 758
                    });
                }

                $.om.getData("gw.config.get", orgParam, function (respData) {
                    var departments = [];

                    if (respData.success) {
                        $.each(respData.dataArray, function (i, data) {
                            if (!data.id758 ||
                                data.id758 == "Not Defined") {
                                return;
                            }

                            departments.push({
                                line_id: data.line_id,
                                id758: data.id758
                            });
                        });
                    }

                    successCallback(departments);
                });
            },

            // 获取IP分机数据
            getIPData: function (ids, callback, searchCondition) {
                var range = 10000;

                var reqParam = {
                    ext_idx: 1,
                    range: range
                };

                if (ids) {
                    reqParam.id = ids;
                }

                if (searchCondition) {
                    $.extend(true, reqParam, searchCondition);
                }

                var ipData = [];

                // 递归获取数据
                var getData = function (startIdx) {
                    reqParam.ext_idx = startIdx;

                    $.om.getData("gw.config.get", reqParam, function (resp) {
                        if (resp.data.length) {
                            ipData = ipData.concat(resp.data);

                            getData(parseInt(resp.data[resp.data.length - 1].ext_idx) + 1);
                        }
                        else {
                            callback(ipData);
                        }
                    }, null, "json");
                }

                getData(1);
            },

            // 获取SIP外线数据
            getSIPData: function (ids, callback) {
                var range = 10000;

                var reqParam = {
                    trk_idx: 1,
                    range: range
                };

                if (ids) {
                    reqParam.id = ids;
                }

                var sipData = [];

                // 递归获取数据
                var getData = function (startIdx) {
                    reqParam.trk_idx = startIdx;

                    $.om.getData("gw.config.get", reqParam, function (resp) {
                        if (resp.data.length) {
                            sipData = sipData.concat(resp.data);

                            getData(parseInt(resp.data[resp.data.length - 1].trk_idx) + 1);
                        }
                        else {
                            callback(sipData);
                        }
                    }, null, "json");
                }

                getData(1);
            },

            // 重启设备
            rebootSystem: function (callback) {
                var cardReqParams = [];

                for (var i = 1; i <= 10; i++) {
                    cardReqParams.push({
                        method: "gw.status.get",
                        param: { line_id: i, id: 100 }
                    });
                }

                $.om.getDataParallel(cardReqParams, function (resp) {
                    var lastReqParams = [];
                    var reqParams = [];

                    // 判断卡1是否是当前卡
                    var card1IsMainCard = $.getBit(resp[0].data.line_id1.id100, 3);

                    // 主卡
                    var mainCardId = card1IsMainCard ? 1 : 2;

                    for (var cardId = 1; cardId <= 10; cardId++) {
                        // 判断卡是否存在
                        if ($.getBit(resp[cardId - 1].data["line_id" + cardId].id100, 0) == 1) {
                            if (cardId == mainCardId) {
                                lastReqParams.push({
                                    method: "gw.system.reboot"
                                });
                            }
                            else {
                                reqParams.push({
                                    method: "gw.system.reboot",
                                    param: { card_id: cardId }
                                });
                            }
                        }
                    }

                    $.om.getDataParallel(reqParams, function (resp2) {
                        if ($.om.hasError(resp2)) {
                            var err = $.om.buildError(resp2);

                            $.alert($.lang.get("deviceRestartFail") +
                                "<div>" + $.lang.get('errorMessage', "错误信息:") + "</div>" +
                                err.errorInfo, "error");
                        }
                        else {
                            $.om.getDataParallel(lastReqParams, function (resp3) {
                                if ($.om.hasError(resp3)) {
                                    var err = $.om.buildError(resp3);

                                    $.alert($.lang.get("deviceRestartFail") +
                                        "<div>" + $.lang.get('errorMessage', "错误信息:") + "</div>" +
                                        err.errorInfo, "error");
                                }
                                else {
                                    if (callback) {
                                        callback();
                                    }
                                }
                            });
                        }
                    });
                });
            },

            /**
             * 获取prefix
             * @param {Function} callback 回调函数
             * @param {Number} prefixType prefix类型。可选值。0表示默认外呼方式（999*）、1表示前缀、2表示分机组，不带此参数表示获取所有的prefix
             */
            getPrefix: function (callback, prefixType) {
                // 解析prefix规则
                var parsePrefix = function (prefix) {
                    var prefixArr = prefix.split("/");

                    if (prefixArr.length < 2) {
                        return null;
                    }

                    // prefix的类型，0表示默认外呼方式（999*）
                    // 1表示前缀、2表示分机组
                    var prefixType;

                    if (prefixArr[0].indexOf("999*") == 0) {
                        prefixType = 0;
                    }
                    else if (prefixArr[1].indexOf("FXS") == 0) {
                        prefixType = 2;
                    }
                    else {
                        prefixType = 1;
                    }

                    var data = {
                        prefixType: prefixType,
                        // 号码
                        d1: prefixArr[0],
                        // 出局方式
                        d2: null,
                        // 线路offset集合
                        d3: null,
                        // 二次拨号语音提示
                        d4: null,
                        // 选线方式
                        d5: null
                    };

                    if (prefixArr[1].indexOf(",") != -1) {
                        // 出局方式
                        var m = /([A-Z]+)([^A-Z]+)/g.exec(prefixArr[1]);
                        data.d2 = m[1];
                        // 线路Offset集合
                        data.d3 = m[2];
                    }
                    else {
                        data.d2 = prefixArr[1];
                    }

                    if (prefixArr.length > 2) {
                        for (var i = 2; i < prefixArr.length; i++) {
                            // 二次拨号语音提示
                            if (prefixArr[i].indexOf("D") == 0) {
                                data.d4 = prefixArr[i];
                            }
                            // 其他情况为选线方式
                            else {
                                data.d5 = prefixArr[i];
                            }
                        }
                    }

                    return data;
                };

                // 初始化数据
                var reqParam = [];
                for (var i = 3; i <= 300; i++) {
                    reqParam.push({
                        line_id: i,
                        id: 750
                    });
                }

                $.om.getData("gw.config.get", reqParam, function (resp) {
                    var parsedPrefixData = [];
                    $.each(resp.dataArray, function (i, data) {
                        var p = parsePrefix(data.id750);

                        if (p != null) {
                            parsedPrefixData.push(p);
                        }
                    });

                    callback(!$.isUndefined(prefixType) ? $.grep(parsedPrefixData, function (p) { return p.prefixType == prefixType; }) :
                        parsedPrefixData);
                });
            },

            // 获取ivr数据
            getIvrList: function (callback) {
                // 获取ivr数据
                $.om.getData("gw.config.get", { id: 985 }, function (ivrResp) {
                    callback(
                        $.grep(ivrResp.data.id985.replace(/\|\|/g, "\|").split("|"), function (ivr) { return ivr != ""; })
                    );
                });
            },

            /**
             * 删除ivr
             * @param {String} ivr 要删除的ivr
             * @param {Object} allIvrs 所有的ivr，用于查找父IVR用
             * @param {Function} callback 删除的回调函数，接收两个参数。
             *  第一个参数为Boolean型，表示删除是否成功。
             *  第二个参数为删除失败时的错误码，0表示该IVR正在被SIP占用，1表示该IVR的父级转IVR信息清除失败，2表示删除IVR时遇到了错误。
             */
            deleteIVR: function (ivr, allIvrs, callback) {
                // 检查sip外线是否使用了此ivr
                var checkSipIvrUsage = function (ivr, callback) {
                    var result = true;
                    // 获取所有sip外线的ivr使用数据
                    $.om.api.getSIPData(996, function (sipResp) {
                        // 获取使用了该ivr的sip外线
                        var usedSip = $.grep(sipResp, function (sip) {
                            return sip.id996 == ivr;
                        });

                        if (usedSip.length) {
                            result = false;
                        }

                        callback(result);
                    });
                }

                // 获取ivr的所有父级ivr
                var getParentIvr = function (ivr) {
                    var noLangIvr = ivr.toString().indexOf("/") != -1 ? 
                        ivr.toString().split("/")[1] : ivr.toString();

                    var parentIvrs = [];
                    
                    var index;

                    while ((index = noLangIvr.lastIndexOf("-")) != -1) {
                        noLangIvr = noLangIvr.substr(0, index);

                        var _parentIvrs = $.grep(allIvrs, function(_ivr) {
                            return (_ivr.indexOf("/") != -1 ?
                            _ivr.split("/")[1] : _ivr) == noLangIvr;
                        });

                        $.each(_parentIvrs, function(i, pivr) {
                            parentIvrs.push(pivr);
                        });
                    }

                    return parentIvrs;
                }

                // 解析ivr数据
                var parseIvrData = function (ivrData) {
                    var result = {};

                    $.each(ivrData, function (j, data) {
                        var splitedData = data.split(":");
                        if (splitedData.length == 2) {
                            result[splitedData[0]] = splitedData[1];
                        }
                    });

                    return result;
                }

                // 清空指定ivr的父级ivr中的转ivr信息
                var clearParentIvrTransfer = function (ivr, callback) {
                    // 如果该ivr有父级ivr，则需要先检查它的父级ivr中的转ivr信息
                    var parentIvr = getParentIvr(ivr);

                    if (parentIvr.length) {
                        var parentIvrReqParam = $.map(parentIvr, function (pivr) {
                            return {
                                method: "gw.ivr.get",
                                param: { ivr: pivr }
                            }
                        });

                        // 获取所有父级ivr数据
                        $.om.getDataParallel(parentIvrReqParam, function (resp) {
                            // 存储需要清空转ivr信息的父级ivr请求参数
                            var clearParentIvrReqParam = [];

                            $.each(resp, function (i, r) {
                                var jdata = $.xml2Json(r.rawData);

                                var ivrData = parseIvrData(jdata.rsp.config.value);

                                var tranIvrKeys = [];

                                // 获取父级ivr的转ivr信息
                                for (var key in ivrData) {
                                    if (key.indexOf("key") == 0 &&
                                        ivrData[key]) {
                                        // 转IVR的信息
                                        var tranIvr = /IVR\((.+)\)/.exec(ivrData[key]);

                                        // 与父级ivr的转ivr与当前ivr相同
                                        if (tranIvr &&
                                            tranIvr[1] == ivr) {
                                            var obj = {};
                                            obj[key] = "";
                                            tranIvrKeys.push(obj);
                                        }
                                    }
                                }

                                if (tranIvrKeys.length) {
                                    var rp = {
                                        method: "gw.ivr.set",
                                        ivr: ivrData.entry_name
                                    };

                                    $.extend(rp, tranIvrKeys);

                                    clearParentIvrReqParam.push(rp);
                                }
                            });

                            if (clearParentIvrReqParam.length) {
                                $.om.setData(clearParentIvrReqParam, function (resp) {
                                    if ($.om.hasError(resp)) {
                                        callback(false);
                                    }
                                    else {
                                        callback(true);
                                    }
                                });
                            }
                            else {
                                callback(true);
                            }
                        });
                    }
                    else {
                        callback(true);
                    }
                };

                checkSipIvrUsage(ivr, function (sipCheckResult) {
                    if (!sipCheckResult) {
                        callback(false, 0);
                        return;
                    }

                    clearParentIvrTransfer(ivr, function (clearParentResult) {
                        if (!clearParentResult) {
                            callback(false, 1);
                        }

                        $.om.setData("gw.ivr.remove", { ivr: ivr }, function (resp) {
                            if ($.om.hasError(resp)) {
                                callback(false, 2, resp);
                            }
                            else {
                                callback(true);
                            }
                        });
                    });
                });
            },

            // 配置同步
            syncSetting: function (successCallback) {
                $.om.setData("gw.config.set", { id1238: 1 }, function () {
                    if (!$.isUndefined(successCallback)) {
                        successCallback();
                    }
                });
            },

            /**
            * 获得安全中心磁铁栏状态
            */
            getSecurityCenterMagnetBar: function (callback) {

                $.om.getData("gw.config.get", { id: [2401, 476] }, function (data) {

                    var pass = $.user.getPassword();
                    var rd = {};
                    rd["id2401"] = data.data.id2401;
                    rd["id476"] = data.data.id476;
                    if (pass == 'admin') {
                        rd["password"] = true
                    } else {
                        rd["password"] = false
                    }
                    $.om.getData("gw.config.get", { id: 1382, line_id: 2 }, function (data) {

                        line_id2 = data.data.line_id2.id1382.split("|");
                        if (line_id2[1] == "0" || line_id2[1] == "") {
                            rd["id1382"] = true;
                        } else {
                            rd["id1382"] = false;
                        }

                        callback(rd);

                    })


                })

            },

            /**
            * 获得告警信息磁铁栏状态
            */
            getSecurityAlarm: function (callback) {

                $.om.getData("gw.log.download", { id: 5 }, function (data) {
                    if (data.success) {
                        var url = DEFAULT_SERVER + data.data.id5
                        //var url = "../system_maintenance/warning.html"
                        $.ajax({
                            method: 'get',
                            url: url,
                            dataType: "text",
                            success: function (data) {

                                listDataAssemble(data);

                            },
                            error: function () {

                            }
                        });
                    }

                });
                function listDataAssemble(data) {

                    data = data.split("\n");


                    var sipAttack = [];
                    var LongDistanceLimit = [];
                    var sshError = [];
                    var adminLogin = [];
                    var ipModified = [];
                    var adminPassModified = [];
                    var loginPassError = [];
                    var userSIP = [];
                    var sshLogin = [];
                    var modifiedSSHPort = [];

                    var idGo = ["17", "61", "", "26", "", "", "15", "19", "14", "16"];
                    var gatherName = ["sipAttack", "LongDistanceLimit", "userSIP", "sshError", "sshLogin", "modifiedSSHPort", "adminLogin", "ipModified", "adminPassModified", "loginPassError"];
                    var gather = [sipAttack, LongDistanceLimit, userSIP, sshError, sshLogin, modifiedSSHPort, adminLogin, ipModified, adminPassModified, loginPassError];
                    var listData = [];
                    var reg;
                    for (var i = data.length - 1; i >= 1; i--) {
                        if (data[i] != '') {

                            reg = /\[(.+?)\]\s*\((\d*)\)\s*-\s*event-(.+?)\((\d*)\),\s*(.+)?/g
                            var rowData = reg.exec(data[i])

                            if (rowData != null) {

                                //rd:
                                //alarmOk = 是否确认  0为未确认,1为已确认
                                //time = 初始时间数据,"MM/DD HH:MM:SS" 去除毫秒格式,可以用于做确认,删除
                                //timeFormatting = 格式化后时间数据,显示在页面上
                                //typeFormatting = 报警级别,一般,重要,紧急
                                //alarmType = 报警类型
                                //alarmDetails = 详细报警信息
                                //alarmId = 报警编号
                                //info  =  info信息
                                //confirmed = 告警确认
                                var rd = {};
                                var parameter = getParameter(rowData[5]);//解析参数

                                var id = parameter.id;
                                var alarmId = rowData[4];
                                //id
                                //17：sip攻击
                                //61：国际长途时长超限
                                //null:非法用户sip请求
                                //26:SSH登录密码错误
                                //null:SSH登录
                                //null:修改sip端口
                                //15:管理员登录(1)
                                //19：IP地址变更
                                //14：修改管理员密码 (1)
                                //16:登录密码错误(2)
                                if (alarmId != 17 && alarmId != 61 && alarmId != 26 && alarmId != 15 && alarmId != 19 && alarmId != 14 && alarmId != 16) {//筛选相关

                                    continue

                                } else {

                                    if (alarmId == 15 && id != 1) {

                                        continue
                                    }
                                    if (alarmId == 14 && id != 1) {

                                        continue
                                    }
                                    if (alarmId == 16 && id != 2) {

                                        continue
                                    }
                                    var ii = idGo.indexOf(alarmId);




                                    rd["id"] = id;

                                    rd["alarmOk"] = getConfirmed(rowData[5]);


                                    //处理时间相关
                                    var time = rowData[1].split(".");

                                    time = time[0];//此时time为 "MM/DD HH:MM:SS" 去除毫秒格式

                                    rd["time"] = time;//拿取初始数据的时间,"MM/DD HH:MM:SS" 去除毫秒格式

                                    rd["timeFormatting"] = time;

                                    //***

                                    rd["alarmId"] = rowData[4];//拿取报警编号

                                    rd["info"] = parameter["info"];//info信息

                                    rd["del"] = "0|" + alarmId + "|" + id + "|" + time;

                                    gather[ii].push(rd);

                                }



                            }
                        } else {
                            continue
                        }

                    }
                    callback(gather);

                }

                function getConfirmed(data) {
                    if (data.indexOf("state=confirmed") != -1) {
                        return 1
                    } else {
                        return 0
                    }
                }
                function getParameter(data) {
                    data = data.split(", ");
                    var rd = {};
                    var confirmed = 0;
                    for (var i = 0; i <= data.length - 1; i++) {
                        if (data[i].indexOf("id") != -1) {
                            var aData = data[i].split("=");
                            rd["id"] = aData[1];
                            if (confirmed == 0) {
                                if (data[i].indexOf("state=confirmed") != -1) {
                                    rd["state"] = "confirmed";
                                    confirmed = 1;
                                } else {
                                    continue
                                }
                            } else {
                                continue
                            }
                        }
                        if (data[i].indexOf("info") != -1) {
                            var aData = data[i].split("=");
                            rd["info"] = aData[1];
                            if (confirmed == 0) {
                                if (data[i].indexOf("state=confirmed") != -1) {
                                    rd["state"] = "confirmed";
                                    confirmed = 1;
                                } else {
                                    continue
                                }
                            } else {
                                continue
                            }
                        }
                        if (data[i].indexOf("card") != -1) {
                            var aData = data[i].split("=");
                            rd["card"] = aData[1];
                            if (confirmed == 0) {
                                if (data[i].indexOf("state=confirmed") != -1) {
                                    rd["state"] = "confirmed";
                                    confirmed = 1;
                                } else {
                                    continue
                                }
                            } else {
                                continue
                            }
                        }
                        if (data[i].indexOf("count") != -1) {
                            var aData = data[i].split("=");
                            rd["count"] = aData[1];
                            if (confirmed == 0) {
                                if (data[i].indexOf("state=confirmed") != -1) {
                                    rd["state"] = "confirmed";
                                    confirmed = 1;
                                } else {
                                    continue
                                }
                            } else {
                                continue
                            }
                        }
                        if (data[i].indexOf("index") != -1) {
                            var aData = data[i].split("=");
                            rd["index"] = aData[1];
                            if (confirmed == 0) {
                                if (data[i].indexOf("state=confirmed") != -1) {
                                    rd["state"] = "confirmed";
                                    confirmed = 1;
                                } else {
                                    continue
                                }
                            } else {
                                continue
                            }
                        }
                    }

                    return rd;
                }

            },

            //删除磁铁栏告警信息，data为传入需要删除的信息数组
            delSecurityAlarm: function (data) {

                var listData = [];
                for (var i = 0; i <= data.length - 1; i++) {

                    var rd = { id940: data[i] };
                    listData.push(rd);

                }

                $.om.setData("gw.config.set", listData, function (data) {
                    $.setOk(data);
                });

            }


        }
    }
});