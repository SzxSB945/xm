/**
 * 接口返回错误映射
 * @author hq
 */
$.extend({
    initErrorMapping: function () {
        $.extend({
            ID_NAME_MAPPING: [
                // IP分机
                { kw: "id401", msg: $.lang.get("number", "号码") },
                { kw: "id432", msg: $.lang.get("pinCode", "授权码（PIN码）") },
                { kw: "id431", msg: $.lang.get("showName", "显示名称") },
                { kw: "id471", msg: $.lang.get("mobile", "手机号码") },
                { kw: "id367", msg: $.lang.get("transferToPhone", "转移至号码") },
                { kw: "id472", msg: $.lang.get("coOscillation", "同振号码") },
                { kw: "id473", msg: $.lang.get("refuseCallNum", "拒接来电号码") },
                { kw: "id675", msg: $.lang.get("secretaryNum", "秘书分机") },
                { kw: "id571", msg: $.lang.get("userIPAddress", "使用IP鉴权时的IP地址") },
                { kw: "id894", msg: $.lang.get("MAC", "IP话机MAC地址") },
                { kw: "id591", msg: $.lang.get("registerPwd", "注册密码") },
                { kw: "id758", msg: $.lang.get("department", "部门") },

                // SIP外线
                { kw: "id654", msg: $.lang.get("concurrentCall", "并发通话数") },
                { kw: "id432", msg: $.lang.get("password", "密码") },
                { kw: "id591", msg: $.lang.get("password", "密码") },
                { kw: "id571", msg: $.lang.get("sipServ", "SIP服务器") },
                { kw: "id573", msg: $.lang.get("clientDomain", "用户端域名") },
                { kw: "id583", msg: $.lang.get("startPort", "起始端口") },

                // 系统维护-系统时间
                { kw: "id22", msg: $.lang.get("firstTimeServ", "首选时间服务器") },
                { kw: "id23", msg: $.lang.get("spareTimeServ", "备用时间服务器") },
                { kw: "id25", msg: $.lang.get("syncInterva", "系统时间同步间隔") }


                // { kw: "", msg: $.lang.get("", "") }
            ],

            ERROR_MAPPING: [{
                keyword: "Unknown",
                message: $.lang.get("errorInfo1", "不知名错误")
            }, {
                keyword: "Temporary failure",
                message: $.lang.get("errorInfo2", "参数错误")
            }, {
                keyword: "Too many",
                message: $.lang.get("errorInfo3", "参数值数量过多")
            }, {
                keyword: "Out of range",
                message: $.lang.get("errorInfo4", "参数超出范围"),
                showIdPrefixInfo: true,
                showLinePrefixInfo: true
            }, {
                keyword: "Too long",
                message: $.lang.get("errorInfo5", "字符串参数超出最大长度")
            }, {
                keyword: "Too short",
                message: $.lang.get("errorInfo6", "字符串参数小于最小长度")
            }, {
                keyword: "Missing",
                message: $.lang.get("errorInfo7", "参数不能为空")
            }, {
                keyword: "Unknown Param",
                message: $.lang.get("errorInfo8", "参数不明")
            }, {
                keyword: "Not INT",
                message: $.lang.get("errorInfo9", "参数格式不对"),
                showIdPrefixInfo: true,
                showLinePrefixInfo: true
            }, {
                keyword: "Not HEX",
                message: $.lang.get("errorInfo10", "参数格式不对"),
                showIdPrefixInfo: true,
                showLinePrefixInfo: true
            }, {
                keyword: "Array Index out of range",
                message: $.lang.get("errorInfo11", "访问越界")
            }, {
                keyword: "No right to change password",
                message: $.lang.get("errorInfo12", "无权限修改密码")
            }, {
                keyword: "Not match",
                message: $.lang.get("errorInfo13", "输入不匹配")
            }, {
                keyword: "No Permission",
                message: $.lang.get("errorInfo14", "没有权限")
            }, {
                keyword: "Wrong format",
                message: $.lang.get("errorInfo15", "数据格式不对"),
                showIdPrefixInfo: true,
                showLinePrefixInfo: true
            }, {
                keyword: "Not digit",
                message: $.lang.get("errorInfo16", "数据格式，非数字")
            }, {
                keyword: "Invalid Password",
                message: $.lang.get("errorInfo17", "密码错误")
            }, {
                keyword: "Duplicate",
                message: $.lang.get("errorInfo18", "配置冲突"),
                showIdPrefixInfo: true,
                showLinePrefixInfo: true
            }, {
                keyword: "InUse, Can't delete",
                message: $.lang.get("errorInfo19", "在使用中，不可删除")
            }, {
                keyword: "No Resrouce",
                message: $.lang.get("errorInfo20", "没有资源")
            }, {
                keyword: ["InUse, Can't delete", "id758"],
                message: $.lang.get("errorInfo21", "部门已分配，禁止删除"),
                showLinePrefixInfo: true
            }]
        });
    }
});