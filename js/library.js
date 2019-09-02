/**
 * 全局函数库
 * @author hq
 */
$.extend({
    /**
     * 本地数据缓存
     */
    localCache: {
        /**
         * 获取值
         * @param {String} key 
         * @param {Boolean} isGlobal 是否全局
         */
        get: function (key, callback) {
            var loadedCall = function () {
                callback(localStorage.getItem(key));
            };


            // 加入这个判断是因为使用了localStorage.js插件兼容低版本浏览器
            // 这个插件在低版本浏览器下，会异步加载一个flash文件实现本地存储的功能，
            // 并且在localStorage中加入isLoaded回调方法
            if (localStorage.isLoaded) {
                localStorage.isLoaded(function () {
                    loadedCall();
                });
            }
            else {
                loadedCall();
            }
        },

        /**
         * 设置值
         * @param {String} key 
         * @param {Object} value 
         */
        set: function (key, value) {
            var loadedCall = function () {
                localStorage.setItem(key, value);
            };

            if (localStorage.isLoaded) {
                localStorage.isLoaded(function () {
                    loadedCall();
                });
            }
            else {
                loadedCall();
            }
        },

        /**
         * 删除值
         * @param {String} key 
         */
        remove: function (key) {
            var loadedCall = function () {
                localStorage.removeItem(key);
            };

            if (localStorage.isLoaded) {
                localStorage.isLoaded(function () {
                    loadedCall();
                });
            }
            else {
                loadedCall();
            }
        },

        /**
         * 清空所有缓存
         */
        clear: function () {
            var loadedCall = function () {
                localStorage.clear();
            }

            if (localStorage.isLoaded) {
                localStorage.isLoaded(function () {
                    loadedCall();
                });
            }
            else {
                loadedCall();
            }
        }
    },

    // 标签页api
    tab: {
        // 打开标签页
        openTab: function () {
            // menuId
            if (arguments.length == 1) {
                $.getTopWindow().$._tab.openTab(arguments[0]);
            }
                // name, url
            else if (arguments.length == 2) {
                $.getTopWindow().$._tab.openTab(arguments[0], arguments[1]);
            }
        },
        // 关闭标签页
        closeTab: function (name) {
            $.getTopWindow().$._tab.closeTab(name);
        }
    },

    /**
     * 检查ie版本。如果返回false，则表示不是ie，否则返回ie版本
     */
    detectIE: function () {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    },

    /**
     * 下载文件
     * @param {*} url 
     */
    downloadFile: function (url) {
        window.open(url);
    },

    // 检查低版本浏览器，并显示提示信息
    detectLowerBrowser: function () {
        if (this.detectIE() != false &&
            this.detectIE() <= 9) {
            if ($.cookies.get("om.hide_lower_browser_hint") == "1") {
                return;
            }

            var lbhDom = $('<div class="lower-browser-hint"\
                style="background-color: #fdf2b5; height: 26px; line-height: 26px; text-align: center; position: absolute; left: 0; right: 0; top: 0; z-index: 9;">\
                ' + $.lang.get("lowerBrowserHint") + '\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"\
                style="margin-top: 2px; margin-right: 10px;">\
                <span aria-hidden="true">&times;</span>\
                </button>\
                </div>');

            lbhDom.find(".close").click(function () {
                lbhDom.remove();
                $("#fullscreen-content-container").css({ top: "0px" });

                $.cookies.set("om.hide_lower_browser_hint", "1");
            });

            $("#fullscreen-content-container").css({ top: "26px" });

            $("body").append(lbhDom);
        }
    },

    /**
     * 播放音频
     * 需要引用样式文件 /css/audio-player.css
     * 以及js文件 /js/lib/jplayer/jquery.jplayer.min.js
     * @param {String} audioUrl 音频地址
     */
    playAudio: function (audioUrl) {
        if (this.detectIE() != false) {
            this.downloadFile(audioUrl);

            return;
        }

        $.open({
            type: 1,
            title: false,
            closeBtn: true,
            btn: false,
            shadeClose: false,
            area: ["200px", "40px"],
            content:
                '<div class="jp-jplayer" style="display: none;"></div>' +
                '<div class="audio-player">' +
                '<div class="play-control">' +
                '<span class="play iconfont icon-zanting"></span>' +
                '<span class="pause iconfont icon-bofang"></span>' +
                '</div>' +
                '<div class="duration-container">' +
                '<span class="current-time">00:00</span>/<span class="duration">00:00</span>' +
                '</div>' +
                '</div>',

            success: function (layero) {
                layero.find(".jp-jplayer").jPlayer({
                    ready: function () {
                        $(this).jPlayer("setMedia", {
                            wav: audioUrl
                        }).jPlayer("play");
                    },
                    cssSelectorAncestor: "",
                    swfPath: "/js/lib/jplayer",
                    supplied: "m4a,oga,wav,mp3",
                    wmode: "window",
                    // wmode: "window",
                    // useStateClassSkin: true,
                    // autoBlur: false,
                    // smoothPlayBar: true,
                    // keyEnabled: true,
                    // remainingDuration: true,
                    // toggleDuration: true,
                    cssSelector: {
                        play: ".audio-player .play",
                        pause: ".audio-player .pause",
                        stop: ".audio-player .stop",

                        currentTime: ".audio-player .current-time",
                        duration: ".audio-player .duration"
                    },
                    size: {
                        width: "320px",
                        height: "180px"
                    }
                });
            },
            cancel: function (index, layero) {
                layero.find(".jp-player").jPlayer("destroy");
            }
        });
    },

    // 进度条插件
    progress: function (opts) {
        var countUp;

        var index = $.open({
            type: 1,
            title: false,
            closeBtn: false,
            btn: false,
            area: ["300px", "60px"],
            content: '<div class="progress-wrapper">\
                <div class="text">' + $.lang.get("isProcessing") + '</div>\
                <div class="progress-inside">\
                <div class="progress">\
                <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" style="width: 0%"></div>\
                </div>\
                <div class="number-wrapper"><span class="number">0</span>%</div>\
                </div>\
                </div>',

            success: function (layero, index) {
                if (!$.isUndefined(opts)) {
                    if (!$.isUndefined(opts.text)) {
                        layero.find(".text").html(opts.text);
                    }

                    layero.find(".progress-wrapper").attr("data-progress-index", index);

                    countUp = new CountUp(layero.find(".number")[0], 100);
                }
            }
        });

        return {
            // 修改进度条文本
            changeText: function (text) {
                $("[data-progress-index=" + index + "]").find(".text").html(text);
            },

            // 改变进度条进度
            changeProgress: function (progress) {
                $("[data-progress-index=" + index + "]").find(".progress-bar").css({
                    width: progress + "%"
                });

                // 更新进度
                countUp.update(progress);
            },

            // 关闭进度条
            close: function () {
                $.close(index);
            }
        }
    },

    /**
     * 
     * @param {Array} urls 
     * @param {Function} successCallback 
     * @param {Function} failCallback 
     * @param {Boolean} cache 是否禁用缓存。默认根据全局变量PREVENT_AJAX_CACHE进行配置。
     */
    getParallel: function (urls, successCallback, failCallback, preventCache) {
        var _this = this;
        var deferrs = [];
        $.each(urls, function (i, url) {
            deferrs.push($.ajax({
                method: 'get',
                url: url,
                dataType: 'text',
                cache: !$.isUndefined(preventCache) ? !preventCache : !PREVENT_AJAX_CACHE
            }));
        });

        $.when.apply($, deferrs)
            .done(function () {
                var respData = [];

                if (urls.length == 1) {
                    respData.push(arguments[0]);
                }
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        respData.push(arguments[i][0]);
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
     * 打包zip文件
     * 需要引用/js/lib/jszip.min.js和/js/lib/FileSaver.min.js文件 
     * */
    zip: {
        // 创建zip文件实例
        create: function () {
            var zip = new JSZip();

            return {
                // 创建文件夹
                folder: function (folderName) {
                    var folder = zip.folder(folderName);

                    return {
                        file: function (filename, content) {
                            folder.file(filename, content);
                        }
                    }
                },

                // 创建文件
                file: function (filename, content) {
                    zip.file(filename, content);
                },

                // 保存
                saveAs: function (filename) {
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, filename);
                    });
                }
            }
        }
    },

    // 权限
    auth: {
        // 根据权限过滤菜单项
        filterMenu: function (allMenu) {
            // 权限列表
            var authList = $.user.getAuth();

            $.console.log("authList", authList);

            // 获取菜单权限
            var getMenuAuth = function (menu) {
                for (var i = 0; i < authList.length; i++) {
                    if (menu.code == authList[i].code) {
                        return authList[i].auth;
                    }
                }

                return null;
            };

            // 处理菜单权限
            var processMenu = function (menu) {
                var mauth = getMenuAuth(menu);

                if (mauth == 0) {
                    return null;
                }

                var result = {};

                $.extend(true, result, menu);
                result.auth = mauth == null ? "" : mauth;
                result.code = result.code == null ? "" : result.code;
                result.submenu = [];

                if (menu.submenu &&
                    menu.submenu.length) {
                    $.each(menu.submenu, function (i, sm) {
                        var m = processMenu(sm);

                        if (m != null) {
                            result.submenu.push(m);
                        }
                    });
                }

                return result;
            };

            var filteredMenu = [];

            for (var i = 0; i < allMenu.length; i++) {
                var menu = processMenu(allMenu[i]);

                if (menu != null &&
                    // 过滤权限管理菜单
                    ($.user.getUsername() == "admin" ||
                        ($.user.getUsername() != "admin" && menu.id != "3a8dp"))) {
                    filteredMenu.push(menu);
                }
            }

            $.console.log("filteredMenu", filteredMenu);

            return filteredMenu;
        },

        /**
         * 获取指定功能码的权限
         * @param {String} funCode 
         */
        getAuth: function (authCode) {
            // 是否有权限控制
            if ($.user.isView()) {
                var authList = $.user.getAuth();

                if (!authList.length) {
                    return "0";
                }

                // 获取权限
                var auth = $.grep(authList, function (auth) {
                    return auth.code == authCode;
                });

                if (auth.length > 0) {
                    return auth[0].auth;
                }
                else {
                    return "2";
                }
            }
            else {
                return "2";
            }
        },

        // 根据权限扫描页面
        scanPage: function () {
            // 获取当前页面的权限代码
            //var pageCode = $.getUrlParam("code");
            //var authList = $.user.getAuth();
            //var view = $.user.isView();

            //// 是否有权限控制
            //if (view) {
            //    // 移除页面上没有配置data-auth-code的可编辑元素
            //    var removeNoAuthCodeWritable = function () {
            //        $("[data-auth-writable], .data-auth-writable")
            //            .not("[data-auth-code]").remove();
            //    }

            //    if (!authList.length) {
            //        removeNoAuthCodeWritable();
            //    }
            //    else {
            //        var au = this.getAuth(pageCode);

            //        switch (au) {
            //            // 无权限
            //            case "0":
            //                $("html").remove();
            //                break;
            //                // 只读
            //            case "1":
            //                removeNoAuthCodeWritable();
            //                break;
            //                // 可读写
            //            case "2":
            //                break;
            //        }

            //        // // 获取权限
            //        // var auth = $.grep(authList, function (auth) {
            //        //     return auth.code == pageCode;
            //        // });

            //        // if (auth.length > 0) {
            //        //     var au = auth[0].auth;

            //        //     switch (au) {
            //        //         // 无权限
            //        //         case "0":
            //        //             $("html").remove();
            //        //             break;
            //        //         // 只读
            //        //         case "1":
            //        //             removeNoAuthCodeWritable();
            //        //             break;
            //        //         // 可读写
            //        //         case "2":
            //        //             break;
            //        //     }
            //        // }
            //    }

            //    var _this = this;

            //    // 处理页面中配置了data-auth-code的元素
            //    $("[data-auth-code]").each(function () {
            //        if (_this.getAuth($(this).data("auth-code")) != "2") {
            //            $(this).remove();
            //        }
            //    });
            //}
        }
    },

    /**
     * 文件上传
     */
    uploader: {
        // 创建文件上传对象
        create: function (pms) {
            var uploader = WebUploader.create({
                // 关闭自动上传
                auto: pms.auto ? pms.auto : false,
                swf: "/js/lib/webuploader/Uploader.swf",
                // 上传的服务器地址
                server: DEFAULT_SERVER + (pms.path ? pms.path : "upload"),
                pick: pms.pick,
                // 允许上传重复文件
                duplicate: true,
                // 不对上传的图片进行压缩
                resize: false//,
                //runtimeOrder: "flash"
            });

            // 选择文件
            uploader.on("fileQueued", function (file) {
                if (pms.fileQueued) {
                    pms.fileQueued(file);
                }
            });

            // 开始文件
            uploader.on("uploadStart", function (file) {
                if (pms.uploadStart) {
                    pms.uploadStart(file);
                }
            });

            // 上传成功
            uploader.on("uploadSuccess", function (file, response) {
                if (pms.uploadSuccess) {
                    pms.uploadSuccess(file, response._raw);
                }
            });

            // 上传错误
            uploader.on("uploadError", function (file, reason) {
                if (pms.uploadError) {
                    pms.uploadError(file, reason);
                }
            });

            // 上传完成
            uploader.on("uploadComplete", function (file, reason) {
                if (pms.uploadComplete) {
                    pms.uploadComplete(file, reason);
                }
            });

            return {
                // 上传
                upload: function () {
                    uploader.upload();
                },
                // 重置
                reset: function () {
                    uploader.reset();
                },
                // 添加按钮
                addButton: function (opts) {
                    uploader.addButton(opts);
                }
            };
        }
    },

    // 校验
    validator: {
        _group: [],

        addGroup: function (group, vm) {
            var g = $.grep(this._group, function (g) { return g.name == group });

            if (g.length) {
                g[0].elem.push(vm);
            }
            else {
                this._group.push({
                    name: group,
                    elem: [vm]
                });
            }
        },

        // 普通校验校验：data-validate="required: true, min: 10, max: 300"
        // 自定义函数校验：data-validate="validateFunction: 'return true;', validateMsg: '错误'"
        validate: function (dom) {
            var vdoms = $(dom ? dom : document).find("[data-validate]");

            var validated = true;

            vdoms.each(function () {
                var vdom = $(this);
                var value = $.trim(vdom.val());
                var validateRule = new Function("return {" + $(this).data("validate") + "}")();

                if ($.isEmptyObject(validateRule)) {
                    return true;
                }

                vdom.off("input");
                // 绑定输入值时关闭tip事件
                vdom.on("input", function () {
                    if (vdom.data("tipIndex")) {
                        $.close(vdom.data("tipIndex"));
                    }
                });

                if (vdom.data("tipIndex")) {
                    $.close(vdom.data("tipIndex"));
                }

                if (validateRule.required && !value) {
                    vdom.data("tipIndex",
                        $.tips(this.nodeName == "SELECT" ? $.lang.get("validateMsg1") :
                            $.lang.get("validateMsg2"), vdom[0]));
                    validated = false;
                    return true;
                }

                // 大小值校验
                if ((!$.isUndefined(validateRule.min) || !$.isUndefined(validateRule.max)) &&
                    !$.isUndefined(value)) {
                    // 不是必填项
                    if (!validateRule.required && value == "") {
                        return true;
                    }

                    var content = "";

                    if (!$.isInteger(value)) {
                        content = $.lang.get("validateMsg3") + validateRule.min + "-" + validateRule.max;
                    }
                    else {
                        if (!$.isUndefined(validateRule.min) &&
                            !$.isUndefined(validateRule.max) &&
                            (parseInt(value) < validateRule.min ||
                                parseInt(value) > validateRule.max)) {
                            content = $.lang.get("validateMsg3") + validateRule.min + "-" + validateRule.max;
                        }
                        if (!$.isUndefined(validateRule.min) && parseInt(value) < validateRule.min) {
                            content = $.lang.get("validateMsg4") + validateRule.min;
                        }
                        else if (!$.isUndefined(validateRule.max) && parseInt(value) > validateRule.max) {
                            content = $.lang.get("validateMsg5") + validateRule.max;
                        }
                    }

                    if (content) {
                        vdom.data("tipIndex",
                            $.tips(content, vdom[0]));

                        validated = false;
                        return true;
                    }
                }

                // 自定义函数校验
                if (!$.isUndefined(validateRule.validateFunction &&
                    validateRule.validateFunction != "")) {
                    var v = new Function(validateRule.validateFunction)();

                    if (!v) {
                        vdom.data("tipIndex",
                            $.tips(new Function(validateRule.validateMsg)(), vdom[0]));


                        validated = false;
                        return true;
                    }
                }
            });

            return validated;
        },

        // 关闭所有校验提示
        closeTips: function () {
            layer.closeAll();
        },

        // 校验插件系统的校验项
        validate2: function (group) {
            var g = $.grep(this._group, function (g) { return g.name == group });

            var result = true;

            if (g.length) {
                $.each(g[0].elem, function (i, vm) {
                    if (!vm.doValidate()) {
                        result = false;
                    }
                });
            }

            return result;
        }
    },

    /**
     * 获取顶层的window
     */
    getTopWindow: function () {
        return window.top === window ? window : window.top;
    },

    /**
     * 判断是否是正整数
     * @param {Number/String} obj 
     */
    isInteger: function (obj) {
        return /^[0-9]+[0-9]*$/.test(obj);
    },

    /**
     * 判断一个对象是否未定义或为null
     * @param {*} obj 任意对象
     */
    isUndefined: function (obj) {
        return typeof (obj) == "undefined" || obj == null;
    },

    _xml2Json: new X2JS(),
    /**
     * 将xml转换为json对象
     * @param {String} xmlStr xml字符串
     */
    xml2Json: function (xmlStr) {
        return this._xml2Json.xml_str2json(xmlStr);
    },

    /**
     * 获取请求中的参数
     * @param {String} key 参数键值
     * @param {String} url url链接
     */
    getUrlParam: function (key, url) {
        var _url = url ? url.substr(url.indexOf('?') + 1) : location.search.substr(1);
        var urlParams = _url.split("&");

        for (var i = 0; i < urlParams.length; i++) {
            var pair = urlParams[i].split("=");
            if (pair.length == 2 &&
                pair[0] == key) {
                return pair[1];
            }
        }

        return null;
    },

    /**
     * 获取请求中的参数列表
     * @param {String} url url链接
     */
    getUrlParams: function (url) {
        var _url = url ? url.substr(url.indexOf('?') + 1) : location.search.substr(1);
        var urlParams = _url.split("&");

        var params = [];
        for (var i = 0; i < urlParams.length; i++) {
            var pair = urlParams[i].split("=");
            if (pair.length > 0) {
                params.push({
                    key: pair[0],
                    value: pair.length > 1 ? pair[1] : null
                });
            }
        }

        return params;
    },

    /**
     * 获取数字中指定二进制位的状态
     * @param {Number} num 数字
     * @param {Number} bit 位数
     */
    getBitFromNum: function (num, bit) {
        return this.getBit(num, bit);
    },

    /**
     * 获取数字中指定二进制位的状态
     * @param {Number} num 数字
     * @param {Number} bit 位数
     */
    getBit: function (num, bit) {
        return (num >> bit) & 1;
    },

    /**
     * 设置数字的指定位为1
     * @param {Number} num 数字
     * @param {Number} bit 位数
     */
    setBit: function (num, bit) {
        return num | (1 << bit);
    },

    /**
     * 设置数字的指定位为0
     * @param {Number} num 数字
     * @param {Number} bit 位数
     */
    clearBit: function (num, bit) {
        return num & ~(1 << bit);
    },

    /**
     * 提示弹窗
     * @param {String} content 提示内容
     * @param {Function} okCallback 点击确定后的回调
     * @param {Function} cancelCallback 点击取消后的回调
     * @param {String} title 标题
     */
    confirm: function (content, okCallback, cancelCallback, title) {
        title = typeof (title) != "undefined" ? title : "提示";

        var config = { title: title, area: ['450px', '200px'], btn: ["是", "否"] };

        //if (btn) {
        //    //config.btn = btn;
        //}

        layer.confirm(
            content,
            this.bindDialogKeyEvent(config),
            function (index) {
                if (!$.isUndefined(okCallback)) {
                    okCallback();
                }

                layer.close(index);
            },
            function (index) {
                if (!$.isUndefined(cancelCallback)) {
                    cancelCallback();
                }

                layer.close(index);
            }
        );
    },

    /**
     * 警告弹窗
     * @param {String} content 警告内容
     * @param {String} icon 对话框图标。可取值为 alert（警告）、success（成功）、error（错误）、question（问号）
     * @param {Function} okCallback 点击确定后的回调
     * @param {String} title 标题
     */
    alert: function (content, icon, okCallback, title) {
        var icons = { alert: 7, success: 1, error: 2, question: 3 };

        layer.alert(
            content,
            this.bindDialogKeyEvent({ title: title ? title : '提示', closeBtn: false }),
            function (index) {
                if (!$.isUndefined(okCallback)) {
                    okCallback();
                }

                layer.close(index);
            }
        );
    },

    tips: function (content, selector, opts) {
        var defaultOpts = {
            tips: [2, "#fd6409"],
            tipsMore: true,
            time: 0,
            anim: 5
        };

        _opts = defaultOpts;

        if (opts) {
            $.extend(_opts, opts);
        }

        return layer.tips(content, selector, _opts);
    },

    // 绑定打开窗口后的事件（按enter触发确定按钮，按esc关闭窗口）
    bindDialogKeyEvent: function (opts) {
        // successg事件回调
        var success = opts.success;

        // 重写success回调，引入多语言支持
        opts.success = function (layero, index) {
            if (typeof (success) == "function") {
                success(layero, index);
            }

            // layer多语言支持
            $.lang.render(layero);

            // 如果输入框绑定了回车事件进行弹窗，这种情况下在输入框中按回车后，输入框仍然会获得焦点，
            // 再点击回车还是会触发输入框的回车弹窗事件。所以需要将输入框的焦点转移到其他地方。
            layero.find(".layui-layer-btn0").attr("href", "javascript:;").focus();

            // 绑定按回车触发确定按钮
            Mousetrap.bind("enter", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (layero.find(".layui-layer-btn0").length) {
                    layero.find(".layui-layer-btn0")[0].click();
                }

                Mousetrap.unbind("enter");

                return false;
            });

            // 绑定按esc关闭窗口
            Mousetrap.bind("esc", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (opts.closeBtn != 0 && opts.closeBtn != false) {
                    layer.close(index);
                }
                else if (layero.find(".layui-layer-btn1").length) {
                    layero.find(".layui-layer-btn1")[0].click();
                }

                Mousetrap.unbind("esc");

                return false;
            });
        };

        // end事件回调
        var end = opts.end;

        opts.end = function () {
            if (typeof (end) == "function") {
                end();
            }

            Mousetrap.unbind("enter");
            Mousetrap.unbind("esc");
        };

        return opts;
    },

    // 打开窗口
    open: function (opts) {
        return layer.open(this.bindDialogKeyEvent(opts));
    },

    // 显示信息
    msgIndex: "",
    msg: function (content, opts) {
        if (this.msgIndex) {
            layer.close(this.msgIndex);
            this.msgIndex = "";
        }

        this.msgIndex = layer.msg(content, opts);
    },

    // 记录日志
    console: {
        log: function () {
            if (DEBUG_LOG) {
                window.console && window.console.log("[OM8000][Debug]");
                window.console && window.console.log.apply(null, arguments);
            }
        }
    },

    // 显示加载层
    load: function (content, skin) {
        return layer.msg('<span class="loading">' + (content ? content : $.lang.get("loadingMsg4")) + '</span>', {
            icon: 16,
            shade: 0.1,
            time: 0,
            skin: skin,
            success: function (layero, index) {
                layero.find(".loading").attr("data-load-index", index);

                // layer多语言支持
                $.lang.render(layero);
            }
        });
    },

    // 修改加载层的文本
    changeLoadText: function (index, content) {
        var load = $("[data-load-index=" + index + "]");

        if (load.length) {
            load.html(content);
        }
    },

    // 关闭层
    close: function (index) {
        layer.close(index);
    },

    /**
     * 生成随机字符串
     * @param {String} type 生成类型，可为 n（数字）、a（小写字母）、A（大写字母）的随机组合
     * @param {Number} length 生成长度
     */
    getRandStr: function (type, length) {
        var nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var alphas = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
            "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
            "u", "v", "w", "x", "y", "z"];
        var alphas2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
            "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
            "U", "V", "W", "X", "Y", "Z"];

        var types = type.split("");
        var sarr = [];

        for (var i = 0; i < types.length; i++) {
            switch (types[i]) {
                case "n":
                    sarr = sarr.concat(nums);
                    break;
                case "a":
                    sarr = sarr.concat(alphas);
                    break;
                case "A":
                    sarr = sarr.concat(alphas2);
                    break;
            }
        }

        var str = "";

        for (var i = 0; i < length; i++) {
            str += sarr[Math.floor(Math.random() * sarr.length)];
        }

        return str;
    },

    /**
     * 导出excel。需要引用/js/lib/FileSaver.min.js文件
     * @param {String} filename 导出的文件名
     * @param {Object} data 导出的数据。数据为键值对形式，例如{列名1:数据1，列名2:数据2}
     * @param {String} sheetName 
     */
    exportExcel: function (filename, data, sheetName) {
        var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };//这里的数据是用来定义导出的格式类型

        var s2ab = function (s) {
            if (typeof ArrayBuffer !== 'undefined') {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);

                for (var i = 0; i != s.length; ++i) {
                    view[i] = s.charCodeAt(i) & 0xFF;
                }

                return buf;
            } else {
                var buf = new Array(s.length);

                for (var i = 0; i != s.length; ++i) {
                    buf[i] = s.charCodeAt(i) & 0xFF;
                }

                return buf;
            }
        }

        var sn = sheetName ? sheetName : 'Sheet1';

        var wb = { SheetNames: [sn], Sheets: {}, Props: {} };

        wb.Sheets[sn] = XLSX.utils.json_to_sheet(data);

        saveAs(new Blob([s2ab(XLSX.write(wb, wopts))]),
            filename + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
    },

    /**
     * 导入excel
     * @param {Object} file 
     * @param {Function} callback 回调函数（{sheet:"", columns[], data: []}）
     */
    importExcel: function (file, callback) {
        var X = XLSX;
        var XW = {
            msg: 'xlsx',
            worker: '/js/lib/exceljs/xlsx_worker.js'
        };

        var process_wb = function (workbook) {
            var result = [];

            $.each(workbook.SheetNames, function (i, sheetName) {
                var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                if (roa.length) {
                    var columns = roa[0];
                    // 删除第一行头部
                    roa.splice(0, 1);

                    result.push({
                        sheet: sheetName,
                        columns: columns,
                        data: roa
                    });
                };
            });

            callback(result);
        };

        var do_file = function (file) {
            var rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString;
            var useWorker = typeof Worker !== 'undefined';

            var xw = function xw(data, cb) {
                var worker = new Worker(XW.worker);
                worker.onmessage = function (e) {
                    switch (e.data.t) {
                        case 'ready': break;
                        case 'e': console.error(e.data.d); break;
                        case XW.msg: cb(JSON.parse(e.data.d)); break;
                    }
                };
                worker.postMessage({ d: data, b: rABS ? 'binary' : 'array' });
            };

            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                if (!rABS) data = new Uint8Array(data);
                if (useWorker) xw(data, process_wb);
                else process_wb(X.read(data, { type: rABS ? 'binary' : 'array' }));
            };

            if (rABS) {
                reader.readAsBinaryString(file);
            }
            else {
                reader.readAsArrayBuffer(file);
            }
        }

        do_file(file);
    },

    //2 个 checkbox 只能选一个
    //checkbox1:第一个checkbox
    //checkbox2:第二个checkbox
    //**
    checkbox2To1: function (checkbox1, checkbox2) {
        $(checkbox1).click(function () {//勾选其一触发事件初始化
            if ($(checkbox1).is(':checked') == true) {
                $(checkbox2).attr('checked', false);
            }
        });
        $(checkbox2).click(function () {//只能勾选其一触发事件初始化
            if ($(checkbox2).is(':checked') == true) {
                $(checkbox1).attr('checked', false);
            }
        });
    },

    //获取input type=file 的文件名,不带后缀
    //**
    fileAllName: function (data) {
        var fileAllName = data.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");  //正则表达式获取文件名，不带后缀
        return fileAllName;
    },

    fileAllName2: function (data) {
        var a = data.lastIndexOf(".")
        return data.substring(0, a);
    },

    //获取input type=file 的文件名后缀
    //**
    fileExt: function (data) {
        var fileExt = data.replace(/.+\./, "");
        return fileExt;
    },

    logout: function (callback) {
        //$.load($.lang.get("logoutMsg1"));

        //$.om.getData("gw.account.logout", {}, function () {
            // 清空当前保存的用户信息
            $.user.clear();
            $.getTopWindow().location.href = "/login.html";
        //});
    },

    cookies: {
        _enc: function (data) {
            return CryptoJS.AES.encrypt(data.toString(), ENC_KEY).toString();
        },

        _dec: function (encryptedData) {
            return CryptoJS.enc.Utf8.stringify(
                CryptoJS.AES.decrypt(encryptedData, ENC_KEY));
        },

        set: function (name, value) {
            Cookies.set(name, this._enc(value));
        },

        get: function (name) {
            return Cookies.get(name) ? this._dec(Cookies.get(name)) : Cookies.get(name);
        },

        remove: function (name) {
            Cookies.remove(name);
        }
    },

    user: {
        // 当前用户
        _currentUser: {
            // 用户名
            username: "",
            // 是否只读/权限控制模式，如果为true，则根据用户权限控制。如果为false，则拥有所有权限
            view: true,
            // 用户line_id
            line_id: null,
            // 密码
            password: null,
            // 权限
            auth: []
        },

        // 清空当前用户信息
        clear: function () {
            Cookies.remove("om.username");
            Cookies.remove("om.password");
            Cookies.remove("om.view");
            Cookies.remove("om.sessionid");
            Cookies.remove("om.auth");
        },

        getPassword: function () {
            return $.cookies.get("om.password");
        },

        setPassword: function (password) {
            $.cookies.set("om.password", password);
        },

        getUsername: function () {
            return $.cookies.get("om.username");
        },

        setUsername: function (username) {
            $.cookies.set("om.username", username);
        },

        isView: function () {
            return $.cookies.get("om.view") === "false" ? false : true;
        },

        setView: function (view) {
            $.cookies.set("om.view", view);
        },

        getLineId: function () {
            return $.cookies.get("om.sessionid");
        },

        setLineId: function (lineId) {
            $.cookies.set("om.sessionid", lineId);
        },

        getAuth: function () {
            return !$.cookies.get("om.auth") ? null : JSON.parse($.cookies.get("om.auth"));
        },

        /**
         * 权限
         * @param {Array} auth 形式：[{ code: "1", auth: 2}]
         *  code：菜单或功能（预留，现在还没用到）编码
         *  auth：权限，0无权限、1只读权限、2可读写
         */
        setAuth: function (auth) {
            $.cookies.set("om.auth", JSON.stringify(auth));
        }
    },

    // // 获取当前用户的密码
    // getCurrentUserPassword: function () {
    //     return this.user.getPassword();
    // },

    // // 获取当前用户
    // getCurrentUser: function () {
    //     return this.user._currentUser;
    // },

    //检验SET数据时是否成功
    //data:set方法传过去后页面返回的值
    //**
    setOk: function (resp, successCallback, failCallback) {
        this.processResp(resp, successCallback, failCallback);
    },

    /**
     * 处理set接口的返回数据，自动弹出信息弹窗
     */
    processResp: function (resp, successCallback, failCallback) {
        // 检查是否需要重启
        var checkReboot = function (errors) {
            var reboot = false;

            $.each(errors, function (i, err) {
                if (err.code == "reboot" ||
                    err.code == "restart") {
                    reboot = true;
                }
            });

            return reboot;
        };

        if ($.om.hasError(resp)) {
            var err = $.om.buildError(resp);

            // 是否需要重启
            if (checkReboot(err.errors)) {
                var index = $.load($.lang.get("loadingMsg2"));

                $.om.api.syncSetting(function () {
                    $.close(index);

                    $.alert($.lang.get('saveSuccessfully') + "<div>" + $.lang.get("rebootMsg3") + "</div>",
                        "alert",
                        function () {
                            if (!$.isUndefined(successCallback)) {
                                successCallback();
                            }
                        }
                    );
                });
                return;
            }

            $.alert($.lang.get("dataSaveFailed") +
                //"<div>" + $.lang.get("errorMessage", "错误信息:") + "</div>" +
                err.errorInfo,
                "error",
                function () {
                    if (!$.isUndefined(failCallback)) {
                        failCallback();
                    }
                }
            );
        }
        else {
            var index = $.load(
                $.lang.get("saveSuccessfully") +
                "," +
                $.lang.get("loadingMsg2"));

            $.om.api.syncSetting(function () {
                $.close(index);
                $.alert($.lang.get("saveMsg3"), "success", function () {
                    if (!$.isUndefined(successCallback)) {
                        successCallback();
                    }
                });
            });

            // $.alert($.lang.get('saveSuccessfully') + "<div>" + $.lang.get("saveMsg4") + "</div>", "success", function () {
            //     var index = $.load($.lang.get("loadingMsg2"));

            //     $.om.setData("gw.config.set", { id1238: 1 }, function() {
            //         $.close(index);
            //         $.msg($.lang.get("saveMsg3"));

            //         if (!$.isUndefined(callback)) {
            //             callback();
            //         }
            //     });
            // });
        }
    },

    /**
     * 在页面中显示服务错误信息
     * @param {*} errorCode 
     */
    showServerError: function (errorCode, errMsg, errTips) {
        $("body").html(template.render('<div class="server-error" style="text-align: center; margin-top: 100px;"> \
        <div class="err-title"> \
        <span class="code" style="font-size: 100px; color: #CC4049;">{{errorCode}}</span> \
        <span class="msg" style="font-size: 30px;">{{errMsg}}</span> \
        </div> \
        <div class="err-tips">{{errTips}}</div> \
        </div>', {
            errorCode: errorCode,
            errMsg: errMsg,
            errTips: errTips
        }));
    },

    /**
     * 判断set接口返回的数据中是否有错误信息（重启信息不计入错误）
     * @param {Object} resp 
     */
    hasError: function (resp) {
        var result = $.om.hasError(resp);

        if (result) {
            var errs = $.om.buildError(resp);

            // 判断是否有不是重启的错误
            var b = false;
            $.each(errs.errors, function (i, err) {
                if (err.code != "reboot" && err.code != "restart") {
                    b = true;
                }
            });

            result = b;
        }

        return result;
    },

    /**
     * 显示错误信息
     * @param {Object} resp 
     */
    showError: function (resp) {
        var err = $.om.buildError(resp);

        $.alert($.lang.get("dataSaveFailed") +
            //"<div>" + $.lang.get("errorMessage", "错误信息:") + "</div>" +
            err.errorInfo, "error");
    },

    /**
     * 显示错误信息
     * @param {Object} resp 
     */
    showGetError: function (resp) {
        var err = $.om.buildError(resp);

        $.alert($.lang.get("getDataFailed") +
            //"<div>" + $.lang.get("errorMessage", "错误信息:") + "</div>" +
            err.errorInfo, "error");
    },

    // 处理om的get接口的返回值
    processGetResp: function (resp) {
        // 检查是否需要重新登录
        var checkLogin = function (errors) {
            var needLogin = false;

            $.each(errors, function (i, err) {
                if (err.code == "5" ||
                    err.code == "105") {
                    needLogin = true;
                }
            });

            return needLogin;
        };

        if ($.om.hasError(resp)) {
            var err = $.om.buildError(resp);

            // 是否需要重新登录
            if (checkLogin(err.errors)) {
                $.alert($.lang.get("loginExpired"), "alert", function () {
                    // 清空当前保存的用户信息
                    $.user.clear();
                    $.getTopWindow().location.href = "/login.html";
                });

                return;
            }

            $.alert($.lang.get("getDataFailed") +
                "<div>" + $.lang.get("errorMessage") + "</div>" +
                err.errorInfo, "error");
        }
    },

    //时间戳转时间
    //ns:时间戳
    //return：转时间戳后的时间
    //**
    getLocalTime: function (nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, '');
    },


    //查看jason  {}  是否为空 
    isJsonNull: function (obj) {
        for (var key in obj) {
            return false;//返回false，不为空对象
        }
        return true;//返回true，为空对象
    },

    slowLoadNotifyList: [],
    /**
     * 注册加载缓慢提示器
     */
    registSlowLoadNotify: function () {
        var _this = this;

        var nid = "notify" + $.getRandStr("an", 6);

        window.setTimeout(function () {
            if (_this.slowLoadNotifyList.indexOf(nid) != -1) {
                $.load($.lang.get("loadingMsg1"), nid);
            }
        }, 2000);

        _this.slowLoadNotifyList.push(nid);

        return nid;
    },

    /**
     * 反注册加载缓慢提示器
     */
    unregistSlowLoadNotify: function (notifyId) {
        if (!$.isUndefined(notifyId) &&
            this.slowLoadNotifyList.indexOf(notifyId) != -1) {
            $.close($("." + notifyId).find(".loading").attr("data-load-index"));

            this.slowLoadNotifyList.splice(
                this.slowLoadNotifyList.indexOf(notifyId), 1);
        }
    },


    //2进制（bit值）转16进制
    //str:二进制值 字符类型
    binToHex: function (str) {
        var hex_array = [{ key: 0, val: "0000" }, { key: 1, val: "0001" }, { key: 2, val: "0010" }, { key: 3, val: "0011" }, { key: 4, val: "0100" }, { key: 5, val: "0101" }, { key: 6, val: "0110" }, { key: 7, val: "0111" },
        { key: 8, val: "1000" }, { key: 9, val: "1001" }, { key: 'A', val: "1010" }, { key: 'B', val: "1011" }, { key: 'C', val: "1100" }, { key: 'D', val: "1101" }, { key: 'E', val: "1110" }, { key: 'F', val: "1111" }]
        var value = ''
        var list = []
        if (str.length % 4 !== 0) {
            var a = "0000"
            var b = a.substring(0, 4 - str.length % 4)
            str = b.concat(str)
        }

        while (str.length > 4) {
            list.push(str.substring(0, 4))
            str = str.substring(4);
        }
        list.push(str)
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < hex_array.length; j++) {
                if (list[i] == hex_array[j].val) {
                    value = value.concat(hex_array[j].key)
                    break
                }
            }
        }
        return value

    },

    //16进制转2进制（bit值）
    //str:16进制值 字符类型
    hexToBin: function (str) {
        var hex_array = [{ key: 0, val: "0000" }, { key: 1, val: "0001" }, { key: 2, val: "0010" }, { key: 3, val: "0011" }, { key: 4, val: "0100" }, { key: 5, val: "0101" }, { key: 6, val: "0110" }, { key: 7, val: "0111" },
        { key: 8, val: "1000" }, { key: 9, val: "1001" }, { key: 'a', val: "1010" }, { key: 'b', val: "1011" }, { key: 'c', val: "1100" }, { key: 'd', val: "1101" }, { key: 'e', val: "1110" }, { key: 'f', val: "1111" }, { key: 'A', val: "1010" }, { key: 'B', val: "1011" }, { key: 'C', val: "1100" }, { key: 'D', val: "1101" }, { key: 'E', val: "1110" }, { key: 'F', val: "1111" }];

        var value = ""
        for (var i = 0; i < str.length; i++) {
            for (var j = 0; j < hex_array.length; j++) {
                if (str.charAt(i) == hex_array[j].key) {
                    value = value.concat(hex_array[j].val)
                    break
                }
            }
        }
        return value
    },

    get_data: function (type, method, sum, okBak, errorBak) {

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

        if ($.isArray(sum)) {
            for (var i = 0; i < sum.length; i++) {
                reqParamStr += parseReqParam(sum[i]) + "&";
            }

            reqParamStr = reqParamStr.substr(0, reqParamStr.length - 1);
        }
        else {
            reqParamStr += parseReqParam(sum);
        }

        var url = DEFAULT_SERVER + method

        $.ajax({
            method: type,
            url: url,
            data: reqParamStr.substr(1),
            dataType: 'json',
            success: function (data) {
                if (data.code == "10000") {
                    okBak(data);
                } else {
                    errorBak(data);
                }
            },
            error: function (data) {
                errorBak(data)
            }
        });

    },

    timeSum: function (time1, time2) {
        
        var time1 = time1.split(":");
        var time2 = time2.split(":");
        var s = parseInt(time1[2]) + parseInt(time2[2]);
        var m = parseInt(time1[1]) + parseInt(time2[1]);
        var h = parseInt(time1[0]) + parseInt(time2[0]);
        if (s >= 60) {
            m = m + 1;
            s = s - 60;
        }
        if (m >= 60) {
            h = h + 1;
            m = m - 60;
        }
        return h + ":" + m + ":" + s;

    }

});