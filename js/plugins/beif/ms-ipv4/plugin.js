/**
 * ipv4组件
 * @author hq
 */
(function() {
    var pluginName = "ms-ipv4";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            // 处理ipv4地址
            var processIpv4 = function(value) {
                // 清除所有非数字
                value = value.replace(/[^\d]/g, '');
    
                if(!value.length) {
                    return "";
                }
    
                if(value > 255) {
                    return "255";
                }
                if(value < 0) {
                    return "0";
                }
    
                return value;
            }
    
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    wrapperClass: pluginName,

                    _id: "",
                    
                    name: "",
    
                    // ipv4的地址
                    value: "",
                    // ipv4的第1段地址
                    ip1: "",
                    // ipv4的第2段地址
                    ip2: "",
                    // ipv4的第3段地址
                    ip3: "",
                    // ipv4的第4段地址
                    ip4: "",

                    // 是否只读
                    readonly: false,

                    renderValue: function(value) {
                        if(!value.length) {
                            this.ip1 = "";
                            this.ip2 = "";
                            this.ip3 = "";
                            this.ip4 = "";
                            
                            return;
                        }

                        var ipArr = value.split(".");
                        this.ip1 = ipArr[0];
                        this.ip2 = ipArr[1];
                        this.ip3 = ipArr[2];
                        this.ip4 = ipArr[3];
                    },

                    // 值改变回调脚本
                    onValueChange: "",
    
                    onInit: function() {
                        var _this = this;

                        this._id = "ipv4" + $.getRandStr("an", 6);

                        var _this = this;

                        if(this.value) {
                            this.renderValue(this.value);
                        }

                        this.$watch("value", function() {
                            _this.renderValue(_this.value);
                        });

                        if(this.onValueChange) {
                            this.$watch("ip1", function() {
                                _this.onValueChange(_this.getValue());
                            });
                            this.$watch("ip2", function() {
                                _this.onValueChange(_this.getValue());
                            });
                            this.$watch("ip3", function() {
                                _this.onValueChange(_this.getValue());
                            });
                            this.$watch("ip4", function() {
                                _this.onValueChange(_this.getValue());
                            });
                        }
                    },
    
                    focusTo: function(cls) {
                        $("#" + this._id).find("." + cls).focus().select();
                    },
    
                    // 按下键时做数据校验
                    onKeyDown: function(event, ipField, focusToCls) {
                        // 按点（.）时，自动跳到下一IP段输入框（当前输入框有值时）
                        if(focusToCls && this[ipField].length) {
                            if(event.keyCode == 190 ||
                                event.keyCode == 110) {
                                this.focusTo(focusToCls);

                                return false;
                            }
                        }

                        // 如果按的不是键盘上方的数字、小键盘区域的数字、删除键，不响应按键事件
                        // 键盘上方的数字
                        if(!(event.keyCode >= 48 &&
                                event.keyCode <= 57) &&
                            // 小键盘区域的数字
                            !(event.keyCode >= 96 &&
                                event.keyCode <= 105) &&
                            // Delete
                            event.keyCode != 46 &&
                            // Backspace
                            event.keyCode != 8 &&
                            // Tab
                            event.keyCode != 9 &&
                            // 左
                            event.keyCode != 37 &&
                            // 右
                            event.keyCode != 39) {
                            return false;
                        }
                    },

                    // 弹起时自动跳转
                    onKeyUp: function(event, ipField, focusToCls) {
                        this[ipField] = processIpv4(this[ipField]);

                        // 在onKeyUp这里要跳过按点（.）的事件。
                        // 因为如果在onKeyDown时按下点，跳到第二个输入框时，第二个输入框会响应onKeyUp事件，
                        // 这种情况下，如果第二个输入框有3位数字，会再跳过这个输入框，跳到第三个输入框。
                        // 注：在onKeyDown中已经处理了按点的事件，所以这里也没有必要再处理一次。
                        if(event.keyCode != 190 && 
                            event.keyCode != 110 &&
                            event.keyCode != 9 &&
                            event.keyCode != 37 &&
                            event.keyCode != 39 &&
                            this[ipField].length == 3 &&
                            focusToCls) {
                            this.focusTo(focusToCls);
                        }
                    },
                    
                    // 获取ip地址
                    getValue: function() {
                        if(!this.ip1 &&
                            !this.ip2 &&
                            !this.ip3 &&
                            !this.ip4) {
                            return "";
                        }
                        
                        return this.ip1 + "." + this.ip2 + "." + this.ip3 + "." + this.ip4;
                    },

                    // 设置值
                    setValue: function(newValue) {
                        this.renderValue(newValue);
                    },

                    // 设置是否只读
                    setReadonly: function(readonly) {
                        this.readonly = readonly;
                    }
                }
            });
        });
    });
})();