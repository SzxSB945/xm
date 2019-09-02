/**
 * 来电接听组和分机号码选择控件
 * @author hq
 */
(function () {
    var pluginName = "ms-ext-call-select";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function (pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    isLoading: false,
    
                    // 所有分机号码
                    data: [],
                    dataLoaded: false,
    
                    // 来电接听组号码
                    data2: [],
                    data2Loaded: false,
    
                    _id: "",
    
                    // 名称
                    name: "",
                    // 值
                    value: "",
    
                    initData: "",
    
                    initData2: "",
    
                    onInit: function () {
                        var _this = this;
    
                        _this._id = "ms-ext-call-select_" + $.getRandStr("an", 5);
    
                        if (_this.initData) {
                            _this.data.pushArray(_this.initData);
                            _this.dataLoaded = true;
                        }
                        if (_this.initData2) {
                            _this.data2.pushArray(_this.initData2);
                            _this.data2Loaded = true;
                        }
                    },
    
                    currentMode: 0,
    
                    // 切换下拉列表
                    toggleButtonDropdown: function () {
                        var _this = this;

                        var tpl = '<div class="ms-input-select-button-dropdown">\
                            <ul class="button-dropdown">\
                                <li data-mode="0"><span class="icon iconfont icon-edit"></span><span data-lang="inputPhone">输入号码</span></li>\
                                <li data-mode="1"><span class="icon iconfont icon-search"></span><span data-lang="extensionNumber">分机号码</span></li>\
                                <li data-mode="2"><span class="icon iconfont icon-search"></span><span data-lang="callerAnsweringGroup">来电接听组</span></li>\
                            </ul>\
                            </div>';

                        var thisEl = $("#" + this._id);

                        var el = $(tpl);

                        el.find(".button-dropdown").css({
                            positon: "absolute",
                            width: thisEl.width() + "px",
                            left: thisEl.offset().left + "px",
                            top: thisEl.offset().top + thisEl.height() + "px"
                        });

                        el.find("li").click(function(event) {
                            _this.changeMode($(this).data("mode"));

                            mask.remove();
                            el.remove();
                            event.stopPropagation();
                        });

                        el.click(function(event) {
                            event.stopPropagation();

                            el.remove();
                        });

                        var mask = $('<div class="ms-input-select-button-dropdown-mask"></div>');
                        mask.click(function(event) {
                            event.stopPropagation();

                            mask.remove();
                            el.remove();
                        });

                        $("body").append(mask);
                        $("body").append(el);
                    },
    
                    // 打开选择窗口
                    openSelectDialog: function (selectedvalue, data) {
                        var _this = this;

                        $.plugins.common.openSelectDialog({
                            data: data, 
                            selectedData: selectedvalue
                        }, function(value) {
                            _this.value = value;
                        });
                    },
    
                    changeMode: function (mode) {
                        var _this = this;
    
                        this.currentMode = mode;
    
                        if (mode == 1) {
                            if (!this.dataLoaded) {
                                _this.isLoading = true;
    
                                $.om.api.getIPData(401, function (ipData) {
                                    _this.isLoading = false;
                                    _this.dataLoaded = true;
    
                                    _this.data.pushArray($.map(ipData, function (n) {
                                        return n.id401;
                                    }));
    
                                    _this.openSelectDialog(_this.value, _this.data);
                                });
                            }
                            else {
                                this.openSelectDialog(this.value, this.data);
                            }
                        }
                        else if (mode == 2) {
                            if(!this.data2Loaded) {
                                _this.isLoading = true;
    
                                $.om.api.getPrefix(function(resp) {
                                    _this.isLoading = false;
                                    _this.data2Loaded = true;
    
                                    _this.data2.pushArray($.map(resp, function(n) {
                                        return n.d1;
                                    }));
    
                                    _this.openSelectDialog(_this.value, _this.data2);
                                }, 2);
                            }
                            else {
                                this.openSelectDialog(this.value, this.data2);
                            }
                        }
                    },
    
                    onInput: function () {
                    },
    
                    onClickInput: function () {
                        if (this.currentMode == 1) {
                            this.openSelectDialog(this.value, this.data);
                        }
                        else if (this.currentMode == 2) {
                            this.openSelectDialog(this.value, this.data2);
                        }
                    },
    
                    getValue: function () {
                        return this.value;
                    }
                }
            });
        });
    });
})();