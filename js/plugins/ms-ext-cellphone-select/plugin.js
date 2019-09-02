/**
 * IP分机选择控件
 * @author hq
 */
(function () {
    var pluginName = "ms-ext-cellphone-select";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function (pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    isLoading: false,
    
                    // 所有外线号码
                    data: [],
                    dataLoaded: false,
    
                    _id: "",
    
                    // 名称
                    name: "",
                    // 值
                    value: "",
    
                    initData: "",

                    // 是否单选
                    singleSelect: false,
    
                    onInit: function () {
                        var _this = this;
    
                        _this._id = "ms-ext-cellphone-select_" + $.getRandStr("an", 5);
    
                        if (_this.initData) {
                            _this.data.pushArray(_this.initData);
                            _this.dataLoaded = true;
                        }
                    },
    
                    currentMode: 0,
    
                    // 切换下拉列表
                    toggleButtonDropdown: function () {
                        var _this = this;

                        var tpl = '<div class="ms-input-select-button-dropdown">\
                            <ul class="button-dropdown">\
                                <li data-mode="0" ms-click="@changeMode(0)"><span class="icon iconfont icon-edit"></span><span data-lang="inputPhone">输入号码</span></li>\
                                <li data-mode="1" ms-click="@changeMode(1)"><span class="icon iconfont icon-search"></span><span data-lang="selectPhone">选择号码</span></li>\
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
                    openSelectDialog: function (selectedvalue) {
                        var _this = this;

                        $.plugins.common.openSelectDialog(
                        {
                            data: this.data, 
                            selectedData: selectedvalue,
                            singleSelect: this.singleSelect
                        }, function(value) {
                            _this.value = value;
                        });
                    },
    
                    changeMode: function (mode) {
                        var _this = this;
    
                        this.currentMode = mode;
    
                        if (mode == 1) {
                            if (!this.dataLoaded) {
                                this.isLoading = true;
    
                                $.om.api.getIPData(471, function (ipData) {
                                    _this.dataLoaded = true;
                                    _this.isLoading = false;

                                    var filteredData = $.grep(ipData, function(n) { return n.id471 != "" });
    
                                    _this.data.pushArray($.map(filteredData, function (n) {
                                        return n.id471;
                                    }));
    
                                    _this.openSelectDialog(_this.value);
                                });
                            }
                            else {
                                this.openSelectDialog(this.value);
                            }
                        }
                    },
    
                    onInput: function () {
                    },
    
                    onClickInput: function () {
                        if (this.currentMode == 1) {
                            this.openSelectDialog(this.value);
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