/**
 * 输入组件。支持锁定、隐藏内容功能。
 * @author hq
 */
(function() {
    var pluginName = "ms-input";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    _id: "",
                    name: "",
                    value: "",
                    // 校验分组
                    vgroup: "",
                    // 校验定义
                    //validate: {},
                    validate: "",

                    validateFunction: "",
                    validateMsg: "",
    
                    // 输入类型
                    inputType: "text",
                    // 输入是否禁用
                    inputDisabled: false,
                    
                    // 是否使用内容显示隐藏控件
                    hideButton: false,
                    // 是否显示内容
                    hideText: false,
                    hideButtonClass: "",
    
                    keyboardButton: false,
    
                    handleChange: "",
    
                    // 是否可以锁定
                    lockButton: false,
                    lockButtonClass: "",
                    locked: false,

                    // 是否可清空
                    clearButton: false,
                    showClearButton: false,
    
                    // 获取dom元素
                    getDom: function() {
                        return $("#" + this._id)[0];
                    },
    
                    // 获取值
                    getValue: function() {
                        if(this.keyboardButton) {
                            return $("#" + this._id).val();
                        }
    
                        return this.value;
                    },

                    // 清空值
                    clearValue: function() {
                        this.value = "";
                    },
    
                    onInit: function(e) {
                        var _this = this;
    
                        this._id = "input" + $.getRandStr("an", 5);
    
                        if(this.lockButton) {
                            if(this.locked) {
                                this.inputDisabled = true;
                                this.lockButtonClass = "";
                            }
                            else {
                                this.inputDisabled = false;
                                this.lockButtonClass = "unlock";
                            }
                        }
    
                        if(this.hideButton) {
                            if(this.hideText) {
                                this.inputType = "password";
                                this.hideButtonClass = "hidden";
                            }
                        }

                        if(this.clearButton && this.value) {
                            this.showClearButton = true;
                        }
    
                        // 监听value
                        this.$watch("value", function() {
                            if(_this.handleChange) {
                                _this.handleChange(_this.name, _this.value);
                            }
                        });
    
                        if(this.vgroup) {
                            $.validator.addGroup(this.vgroup, e.vmodel);
                        }

                        // 监听值改变
                        this.$watch("value", function() {
                            // 如果启用了清空按钮
                            if(_this.clearButton) {
                                // 如果有值，显示清空按钮
                                _this.showClearButton = _this.value ? true : false;
                            }
                        });

                        if(this.keyboardButton) {
                            // 绑定点击页面其他地方关闭键盘事件
                            $(document).on("click", function (e) {
                                if (!$("#" + _this._id).has(e.target).length) {
                                    VKI_close(document.getElementById(this._id));
                                }
                              });
                        }
                    },

                    onDispose: function() {
                        this.closeValidateTip();
                    },
    
                    switchShowHide: function() {
                        if(this.hideText) {
                            this.hideText = false;
                            this.inputType = "text";
                            this.hideButtonClass = "";
                        }
                        else {
                            this.hideText = true;
                            this.inputType = "password";
                            this.hideButtonClass = "hidden";
                        }
                    },
    
                    switchLock: function() {
                        if(this.locked) {
                            this.locked = false;
                            this.inputDisabled = false;
                            this.lockButtonClass = "unlock";
                        }
                        else {
                            this.locked = true;
                            this.inputDisabled = true;
                            this.lockButtonClass = "";
                        }
                    },
    
                    switchKeyboard: function(event) {
                        var _this = this;

                        // firefox下会打不开键盘，临时解决方案
                        window.setTimeout(function() {
                            VKI_show(document.getElementById(_this._id));
                        }, 100);
                        
                        event.stopPropagation();
                    },
    
                    $tipIndex: null,
    
                    showTip: function(msg, opts) {
                        this.closeTip();
    
                        this.$tipIndex = $.tips(msg, "#" + this._id, opts);
                    },
    
                    closeTip: function() {
                        if(this.$tipIndex) {
                            $.close(this.$tipIndex);
                            this.$tipIndex = null;
                        }
                    },
    
                    handleInput: function(event) {
                        if(this.$tipIndex) {
                            $.close(this.$tipIndex);
                            this.$tipIndex = null;
                        }
                    },
                    
                    // 暴露出的方法及属性
                    isLocked: function() {
                        return this.locked;
                    },

                    tipIndex: "",

                    closeValidateTip: function() {
                        if (this.tipIndex) {
                            $.close(this.tipIndex);

                            this.tipIndex = "";
                        }
                    },

                    doValidate: function() {
                        var _this = this;
                        var vdom = $(this.getDom());

                        vdom.off("input");
                        // 绑定输入值时关闭tip事件
                        vdom.on("input", function () {
                            if (_this.tipIndex) {
                                $.close(_this.tipIndex);
                                _this.tipIndex = "";
                            }
                        });

                        if (_this.tipIndex) {
                            $.close(_this.tipIndex);
                            _this.tipIndex = "";
                        }

                        if (!this.validateFunction()) {
                            this.tipIndex = $.tips(this.validateMsg, vdom[0])

                            vdom.data("tipIndex", this.tipIndex);

                            return false;
                        }

                        return true;
                    },

                    clearValue: function() {
                        this.value = "";
                        this.showClearButton = false;
                        $("#" + this._id).focus();
                    }
                    
                    // // 校验值
                    // doValidate: function() {
                    //     if($.isEmptyObject(this.validate)) {
                    //         return true;
                    //     }
    
                    //     if(this.$tipIndex) {
                    //         $.close(this.$tipIndex);
                    //     }
    
                    //     if(this.validate.required && !this.value) {
                    //         this.$tipIndex = $.tips("该项为必填项，请输入值", "#" + this._id);
                    //         return false;
                    //     }
                        
                    //     if((this.validate.min || this.validate.max) &&
                    //         this.value) {
                    //         var content = "";
                            
                    //         if(!$.isInteger(this.value)) {
                    //             content = "该项取值范围为" + this.validate.min + "-" + this.validate.max;
                    //         }
                    //         else {
                    //             if(this.validate.min && this.validate.max && 
                    //                 (parseInt(this.value) < this.validate.min || 
                    //                     parseInt(this.value) > this.validate.max)) {
                    //                 content = "该项取值范围为" + this.validate.min + "-" + this.validate.max;
                    //             }
                    //             if(this.validate.min && parseInt(this.value) < this.validate.min) {
                    //                 content = "该项最小值为" + this.validate.min;
                    //             }
                    //             else if(this.validate.max && parseInt(this.value) > this.validate.max) {
                    //                 content = "该项最大值为" + this.validate.max;
                    //             }
                    //         }
    
                    //         if(content) {
                    //             this.$tipIndex = $.tips(content, "#" + this._id);
                    //             return false;
                    //         }
                    //     }
    
                    //     return true;
                    // },
                }
            });
        });
    });
})();