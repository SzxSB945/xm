/**
 * 多选组件
 * @author hq
 */
(function() {
    var pluginName = "ms-select";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    // 控件id
                    _id: "",
                    // 控件名
                    name: "",
                    // 当前选择的值
                    value: "",
                    // 校验
                    validate: {},
    
                    defaultSelectOption: true,
    
                    // 选项
                    // { value: 'orange', text: '橙子', lang: 'orange', checked: true}
                    options: [],
                    // 改变值时的回调
                    onChange: "",
                    // tips的index
                    $tipIndex: null,

                    // 清空值
                    clearValue: function() {
                        this.value = "";
                    },
    
                    processOptions: function() {
                        $.each(this.options, function(i, opt) {
                            // 处理多语言
                            if(opt.lang) {
                                opt.text = $.lang.get(opt.lang);
                            }
                        });
                        
                        // 如果value没有初始值
                        if(this.value == "") {
                            // 初始化值
                            var value;
        
                            avalon.each(this.options, function(i, opt) {
                                if(opt.selected == true || opt.selected == "true") {
                                    value = opt.value;
                                }
                            });
    
                            this.value = value ? value : (this.options.length ? this.options[0].value : null);
                        }
                    },
                    
                    onInit: function() {
                        var _this = this;
    
                        if(this.options.length) {
                            _this.processOptions();
                        }
    
                        this.$watch("options", function() {
                            _this.processOptions();
                        });
    
                        this._id = "select" + $.getRandStr("an", 5);
                    },
    
                    // 校验值
                    doValidate: function() {
                        if($.isEmptyObject(this.validate)) {
                            return true;
                        }
    
                        if(this.validate.required && !this.value) {
                            if(this.$tipIndex) {
                                $.close(this.$tipIndex);
                            }
                            
                            this.$tipIndex = $.tips($.lang.get("validateMsg1"), "#" + this._id);
    
                            return false;
                        }
    
                        return true;
                    },
    
                    onReady: function() {
                        // if(typeof(this.options) == "string") {
                        //     this.options = JSON.parse(this.options);
                        // }
                        
                        // 多语言
                        $.lang.render($("#" + this._id));
                    },
    
                    getValue: function() {
                        return this.value;
                    },
    
                    handleChange: function(event) {
                        if(this.$tipIndex) {
                            $.close(this.$tipIndex);
                            this.$tipIndex = null;
                        }
    
                        if(this.onChange) {
                            this.onChange(event.target.value, this.name);
                        }
                    }
                }
            });
        });
    });
})();