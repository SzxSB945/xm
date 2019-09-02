/**
 * 语言接口
 * @author hq
 */
$.extend({
    lang: {
        // 默认语言
        defaultLang: "zh",
        // 当前语言
        currentLang: null,

        // 是否已经初始化完成
        initialized: false,
        // ready后的回调
        readyCallbacks: [],

        /**
         * 初始化语言
         * @param {String} lang 语言
         * @param {Function} successCallback 初始化成功后的回调
         */
        init: function (lang, successCallback) {
            return;

            var _this = this;

            _this.currentLang = lang ? lang :
                (!$.isUndefined(Cookies.get("om.lang")) ?
                    Cookies.get("om.lang") : this.defaultLang);

            // 初始化多语言插件
            var renderLang = function (lang, langData) {
                jQuery.i18n.properties({
                    mode: "map",
                    language: lang,
                    useLocalLang: true,
                    langData: langData,

                    callback: function () {
                        Cookies.set("om.lang", _this.currentLang, true);

                        if(!$.isUndefined(successCallback)) {
                            successCallback();
                        }

                        $.each(_this.readyCallbacks, function(i, readyCallback) {
                            readyCallback();
                        });

                        _this.initialized = true;

                        _this.render();
                    }
                });
            };

            // 获取多语言版本号
            $.localCache.get("langVersion", function (version) {
                // 获取存储的多语言语种
                $.localCache.get("lang", function(lang) {
                    // 如果多语言版本号与配置文件中的不同（说明有更新）
                    // 则需要加载多语言内容
                    if ($.isUndefined(version) ||
                        $.isUndefined(lang) ||
                        version != WEB_VERSION_CODE ||
                        lang != _this.currentLang) {
                        $.get("/lang/lang_" + _this.currentLang + ".properties", function (langData) {
                            // 版本号
                            renderLang(_this.currentLang, langData);
                            
                            $.localCache.set("lang", _this.currentLang);
                            $.localCache.set("langData", langData);
                            $.localCache.set("langVersion", WEB_VERSION_CODE);
                        });
                    }
                    else {
                        $.localCache.get("langData", function (langData) {
                            renderLang(_this.currentLang, langData);
                        });
                    }
                });
            });
        },

        // 在多语言初始化完成后调用
        ready: function(callback) {
            if(this.initialized) {
                callback();
            }
            else {
                this.readyCallbacks.push(callback);
            }
        },

        /**
         * 重新加载语言
         * @param {String} lang 语言
         */
        reload: function (lang) {
            this.init(lang);
        },

        /**
         * 渲染语言
         * @param {Object} dom 渲染的父节点元素。可选，如果没有传这个参数，就渲染整个页面
         */
        render: function (dom) {
            return;

            // 渲染到页面元素
            var langDoms = typeof (dom) != "undefined" ? $(dom).find("[data-lang]") : $("[data-lang]");
            langDoms.each(function (i, n) {
                if (n.tagName == "INPUT") {
                    $(n).val($.getTopWindow().jQuery.i18n.prop($(n).data("lang")));
                }
                else {
                    $(n).html($.getTopWindow().jQuery.i18n.prop($(n).data("lang")));
                }
            });
            
            var langPlaceholderDoms = typeof (dom) != "undefined" ? $(dom).find("[data-placeholder-lang]") : $("[data-placeholder-lang]");
            langPlaceholderDoms.each(function(i, n) {
                $(n).attr("placeholder", $.getTopWindow().jQuery.i18n.prop($(n).data("placeholder-lang")));
            });
        },

        /*
         * 获取当前语言的键值
         */
        get: function () {
            if(arguments.length == 1) {
                return $.getTopWindow().jQuery.i18n.prop(arguments[0]);
            }
            else {
                return $.getTopWindow().jQuery.i18n.prop.apply(null, [].slice.call(arguments));
            }
        }
    }
});