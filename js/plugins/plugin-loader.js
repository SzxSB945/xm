/**
 * 插件加载器
 * @author hq
 */
$.extend({
    plugins: {
        // 基路径
        basePath: "/js/plugins/",
        // pluginNames: ["ms-input", "ms-radio", "ms-checkbox", "ms-select",
        //     "ms-table", "ms-ipv4", "ms-table", "ms-header", "ms-table2",
        //     "ms-ipv4-range", "ms-input-range", "ms-sip-select",
        //     "ms-datetime", "ms-datetime-range", "ms-ext-group-select",
        //     "ms-ext-select", "ms-ext-call-select"],
        plugins: [],

        registPlugin: function (pluginName, initFunction) {
            this.plugins.push({
                name: pluginName,
                init: initFunction
            })
        },

        // 获取插件的模板
        getPluginTpl: function (pluginName, callback) {
            $.localCache.get("pluginTpls", function (value) {
                var pluginTpls = JSON.parse(value);

                var pluginTpl = $.grep(pluginTpls, function (pluginTpl) {
                    return pluginTpl.pluginName == pluginName;
                });

                if (!pluginTpl.length) {
                    $.console.log("模板定义不存在(" + pluginName + ")");
                    return;
                }

                callback(pluginTpl[0].pluginTpl);
            });
        },

        // 插件加载情况
        pluginInitialized: false,
        // 监听插件加载情况
        pluginInitializedObservers: [],

        // 已加载的插件ID列表
        loadedPluginIds: [],
        // 在插件加载后执行
        pluginLoadedObservers: [],

        // 注册插件初始化监听器
        registerPluginInitializedObserver: function (observer) {
            this.pluginInitializedObservers.push(observer);
        },

        // 初始化
        init: function () {
            var _this = this;

            // 获取模板内容
            var loadPluginTpls = function (callback) {
                var pluginTplUrls = [];
                $.each(_this.plugins, function (i, plugin) {
                    pluginTplUrls.push(_this.basePath + plugin.name + "/plugin-tpl.html");
                });

                $.getParallel(pluginTplUrls, function (resp) {
                    var pluginTpls = [];

                    $.each(resp, function (j, pluginTpl) {
                        pluginTpls.push({
                            // 插件名
                            pluginName: _this.plugins[j].name,
                            // 插件模板
                            pluginTpl: pluginTpl
                        })
                    });

                    // 插件内容
                    $.localCache.remove("pluginTpls");
                    $.localCache.set("pluginTpls", JSON.stringify(pluginTpls));

                    callback();
                });
            };

            // 加载插件脚本
            var loadPluginScript = function (callback) {
                for (var i = 0; i < _this.plugins.length; i++) {
                    $LAB.queueScript(_this.basePath + _this.plugins[i].name + "/plugin.js");
                }

                $LAB
                    .queueScript(function () {
                        callback();
                    })
                    .runQueue();
            };

            // 获取插件版本号
            $.localCache.get("pluginTplsVersion", function (version) {
                // 如果插件版本号与配置文件中的不同（说明有更新）
                // 则需要加载插件内容
                if ($.isUndefined(version) ||
                    version != WEB_VERSION_CODE) {
                    loadPluginTpls(function () {
                        // 版本号
                        $.localCache.set("pluginTplsVersion", WEB_VERSION_CODE);

                        if (!DONT_USE_STATIC_FILE) {
                            // 初始化插件
                            $.each(_this.plugins, function (i, plugin) {
                                plugin.init();
                            });

                            _this.renderPlugin();

                            $.each(_this.pluginInitializedObservers, function (i, observer) {
                                observer();
                            });

                            _this.pluginInitialized = true;
                        }
                        else {
                            // 构建过程中插件js文件已经打包到一个文件中的，不需要手工加载了
                            loadPluginScript(function () {
                                // 初始化插件
                                $.each(_this.plugins, function (i, plugin) {
                                    plugin.init();
                                });

                                _this.renderPlugin();

                                $.each(_this.pluginInitializedObservers, function (i, observer) {
                                    observer();
                                });

                                _this.pluginInitialized = true;
                            });
                        }
                    });
                }
                else {
                    if (!DONT_USE_STATIC_FILE) {
                        // 初始化插件
                        $.each(_this.plugins, function (i, plugin) {
                            plugin.init();
                        });

                        _this.renderPlugin();

                        $.each(_this.pluginInitializedObservers, function (i, observer) {
                            observer();
                        });

                        _this.pluginInitialized = true;
                    }
                    else {
                        // 构建过程中插件js文件已经打包到一个文件中的，不需要手工加载了
                        loadPluginScript(function () {
                            // 初始化插件
                            $.each(_this.plugins, function (i, plugin) {
                                plugin.init();
                            });

                            _this.renderPlugin();

                            $.each(_this.pluginInitializedObservers, function (i, observer) {
                                observer();
                            });

                            _this.pluginInitialized = true;
                        });
                    }
                }
            });
        },

        // 渲染页面上的插件
        renderPlugin: function () {
            var _this = this;

            $("[data-plugin]").each(function () {
                var pluginId = "plugin-" + $.getRandStr("an", 5);
                var pluginTpl = template.compile('<div class="plugin-wrapper" ms-controller="{{id}}"><xmp ms-widget="{{config}}"></xmp></div>');

                var pluginDefine = $.trim($(this).data("plugin"));

                var dom = $(pluginTpl({
                    id: pluginId,
                    config: pluginDefine.substring(0, pluginDefine.length - 1) + ",onReady: @widgetReady}"
                }));

                $(this).replaceWith(dom);

                avalon.define({
                    $id: pluginId,

                    widgetReady: function (e) {
                        _this.loadedPluginIds.push(e.vmodel.$id);

                        // 调用插件加载监听
                        $.each(_this.pluginLoadedObservers, function (i, observer) {
                            if (observer.pluginId == e.vmodel.$id) {
                                observer.execute();
                            }
                        });
                    }
                });

                //avalon.scan(dom[0]);
                // 如果页面中有ms-controller了，就不再进行扫描了，因为页面会进行扫描
                // 否则如果插件放在页面的ms-if条件的元素下，再进行扫描会出现错误
                if (!$('body[ms-controller]').length) {
                    avalon.scan(dom[0]);
                }
            });
        },

        // 重新加载
        reload: function () {
            this.init();
        },

        // 渲染页面上的插件
        // render: function () {
        //     $("[data-role]").each(function () {
        //         var controllerId = "plugin-" + Math.random().toString().substr(2);

        //         var dom = $("<span></span>");
        //         dom.attr("ms-important", controllerId);

        //         var plugin = $("<xmp></xmp>");
        //         var pluginConfig = {};
        //         pluginConfig.is = "ms-" + $(this).data("role");
        //         avalon.mix(true, pluginConfig, $(this).data("config"));
        //         plugin.attr("ms-widget", JSON.stringify(pluginConfig));

        //         dom.append(plugin);

        //         $(this).replaceWith(dom);

        //         avalon.define({
        //             $id: controllerId
        //         });

        //         avalon.scan(dom[0]);
        //     });
        // },

        // 获取值
        getValue: function (pluginId) {
            return avalon.vmodels[pluginId].getValue();
        },

        // 设置值
        setValue: function (pluginId, value) {
            // 如果插件是已加载
            if (this.loadedPluginIds.indexOf(pluginId) != -1) {
                avalon.vmodels[pluginId].value = value;
            }
            else {
                // 设置值的时候，如果插件还没有加载完，就要等加载完后再设值
                this.pluginLoadedObservers.push({
                    pluginId: pluginId,
                    execute: function () {
                        avalon.vmodels[pluginId].value = value;
                    }
                });
            }
        },

        getPlugin: function (pluginId) {
            return avalon.vmodels[pluginId].$model;
        },

        // 插件通用函数
        common: {
            // 分机、外线选择对话框
            openSelectDialog: function (opts, callback) {
                // 单选
                var singleSelect = opts.singleSelect;

                var defaultSelected = opts.selectedData ? opts.selectedData.toString().split(",") : [];

                // vm对象
                var vm;

                $.open({
                    type: 1,
                    id: "select-dialog",
                    title: $.lang.get("selectPhone"),
                    btn: [$.lang.get("addTo"), $.lang.get("cancel")],
                    area: ["800px", "430px"],
                    content: 
                    '<div class="select-dialog ms-input-select-dialog-style" ms-important="select-dialog-vm">\
                        <div class="ms-search-panel">\
                            <form class="form-inline" id="search-form">\
                                <div class="fields">\
                                    <div class="form-group">\
                                        <div class="pull-left lh-26">\
                                            <span data-lang="paragraphNumber">号段</span>：\
                                        </div>\
                                        <div class="pull-left" style="width: 220px;">\
                                            <wbr ms-widget="{is: \'ms-input-range\', onInit: rangeInit}" />\
                                        </div>\
                                        <div class="pull-left ml-10">\
                                            <div class="btn btn-ok" data-lang="search" ms-click="search">查询</div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </form>\
                        </div>\
                        \
                        <div class="table-container">\
                            <div class="l l1"></div>\
                            <div class="l l2"></div>\
                            <div class="l l3"></div>\
                            <div class="l l4"></div>\
                            <div class="inner-wrapper">\
                                <wbr ms-widget="{is: \'ms-checkbox\', options: @showOptions.$model, onInit: checkboxInit, onChange: @onCheckboxChange, singleSelect: @singleSelect }" />\
                            </div>\
                        </div>\
                    </div>',

                    yes: function (index, layero) {
                        var value = layero.phoneCheckboxVM.getValue();

                        // 勾选了全选
                        if (value.indexOf("all") != -1) {
                            //value.splice(value.indexOf("all"), 1);

                            value = [];

                            $.each(vm.$allOptions, function(i, option) {
                                if(option.value != "all") {
                                    value.push(option.value);
                                }
                            });
                        }
                        else {
                            // 将没有加载并且初始选中的数据加入到value中
                            $.each(defaultSelected, function(i, dsel) {
                                if($.grep(vm.showOptions, function(opt) { return opt.value == dsel }).length == 0) {
                                    value.push(dsel);
                                }
                            });
                        }

                        callback(value.join(","));

                        layer.close(index);
                    },

                    success: function (layero) {
                        vm = avalon.define({
                            $id: "select-dialog-vm",

                            phoneRangeVM: "",
                            phoneCheckboxVM: "",

                            singleSelect: singleSelect,

                            rangeInit: function (phoneRange) {
                                this.phoneRangeVM = phoneRange.vmodel;
                            },

                            checkboxInit: function (phoneCheckbox) {
                                this.phoneCheckboxVM = phoneCheckbox.vmodel;
                                layero.phoneCheckboxVM = phoneCheckbox.vmodel;
                            },

                            $allOptions: [],
                            showOptions: [],

                            // 查询
                            search: function () {
                                var phoneRange = this.phoneRangeVM.getValue(true);

                                var filtedphoneRange = $.grep(opts.data, function (phone) {
                                    var b = true;

                                    if (phoneRange[0]) {
                                        b = b && parseInt(phone) >= parseInt(phoneRange[0]);
                                    }
                                    if (phoneRange[1]) {
                                        b = b && parseInt(phone) <= parseInt(phoneRange[1]);
                                    }

                                    return b;
                                });

                                this.$allOptions = [];

                                $.merge(this.$allOptions, 
                                    $.map(filtedphoneRange, function (n) {
                                        return {
                                            text: n,
                                            value: n,
                                            checked: false
                                        };
                                    })
                                );

                                layero.find(".inner-wrapper").animate({ scrollTop: 0 }, 0);

                                this.showOptions.clear();

                                if(!singleSelect) {
                                    this.showOptions.push({
                                        text: $.lang.get("selectAll"), value: "all",
                                        checked: opts.data.length == defaultSelected.length
                                    });
                                }

                                this.showOptions.pushArray(this.$allOptions.slice(0, 100));
                            },

                            onCheckboxChange: function (value, changedOption) {
                                // 不是单选模式
                                if(!this.singleSelect) {
                                    // 点击全选
                                    if (changedOption.value == "all") {
                                        if (value.indexOf(changedOption.value) != -1) {
                                            this.phoneCheckboxVM.checkAll();
    
                                            // $.each(this.showOptions, function(i, opt) {
                                            //     opt.checked = true;
                                            // });
    
                                            $.each(this.$allOptions, function(i, opt) {
                                                opt.checked = true;
                                            });
                                        }
                                        else {
                                            this.phoneCheckboxVM.uncheckAll();
    
                                            // $.each(this.showOptions, function(i, opt) {
                                            //     opt.checked = false;
                                            // });
    
                                            $.each(this.$allOptions, function(i, opt) {
                                                opt.checked = false;
                                            });
                                        }
                                    }
                                    else {
                                        // 全选或取消全选
                                        if (value.length == vm.showOptions.length - 1 &&
                                            value.indexOf("all") == -1) {
                                            this.phoneCheckboxVM.check(vm.showOptions[0]);
                                        }
                                        else {
                                            this.phoneCheckboxVM.uncheck(vm.showOptions[0]);
                                        }
                                    }
                                }
                            }
                        });

                        vm.$watch("onReady", function () {
                            for (var i = 0; i < opts.data.length; i++) {
                                vm.$allOptions.push({
                                    text: opts.data[i],
                                    value: opts.data[i],
                                    checked: defaultSelected.indexOf(opts.data[i]) != -1 ? true : false
                                });
                            }

                            if(!singleSelect) {
                                vm.showOptions.push({
                                    text: $.lang.get("selectAll"), value: "all",
                                    checked: opts.data.length == defaultSelected.length
                                });
                            }

                            vm.showOptions.pushArray(vm.$allOptions.slice(0, 100));
                        });

                        avalon.scan(layero.find(".select-dialog")[0]);

                        // 滚动到底部时自动加载更多数据
                        layero.find(".inner-wrapper").on("scroll", function () {
                            if ((layero.find(".inner-wrapper")[0].scrollHeight -
                                layero.find(".inner-wrapper").scrollTop() -
                                layero.find(".inner-wrapper").height()) <= 100) {
                                var options = vm.$allOptions.slice(vm.showOptions.length, vm.showOptions.length + 100);

                                if (options.length) {
                                    vm.showOptions.pushArray(options);
                                }
                            }
                        });
                    },

                    end: function () {
                        // 销毁对象
                        delete avalon.vmodels["select-dialog-vm"];
                    }
                });
            }
        }
    }
});