/**
 * 多选组件
 * @author hq
 */
(function() {
    var pluginName = "ms-checkbox";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    name: "",
                    value: [],
    
                    onChange: "",
    
                    singleSelect: false,

                    // 选项
                    // { name: 'fruit', value: 'orange', text: '橙子', checked: true}
                    options: [],
    
                    onInit: function() {
                        var _this = this;

                        // 选中默认值
                        var checkValue = function() {
                            var value = [];
        
                            $.each(_this.options, function(i, option) {
                                if((option.checked == true || option.checked == "true") &&
                                    _this.value.indexOf(option.value) == -1) {
                                    value.push(option.value);
                                }
                            });
        
                            _this.value.pushArray(value);
                        };

                        checkValue();

                        // this.$watch("options", function() {
                        //     checkValue();
                        // });
                    },
    
                    getValue: function() {
                        return this.value.$model;
                    },
    
                    // 选中
                    check: function(option) {
                        if(this.value.indexOf(option.value) == -1) {
                            this.value.push(option.value);
                        }
                    },
    
                    // 取消选中
                    uncheck: function(option) {
                        if(this.value.indexOf(option.value) != -1) {
                            this.value.splice(this.value.indexOf(option.value), 1);
                        }
                    },
    
                    // 全选
                    checkAll: function() {
                        var _this = this;
    
                        this.value.clear();
    
                        var checkedValue = []
                        $.each(this.options, function(i, option) {
                            checkedValue.push(option.value);

                            option.checked = true;
                        });
                        
                        _this.value.clear();
                        _this.value.pushArray(checkedValue);
                    },
    
                    // 取消所有选择
                    uncheckAll: function() {
                        this.value.clear();

                        $.each(this.options, function(i, option) {
                            option.checked = false;
                        });
                    },

                    // 选中指定值，取消其他选择
                    uncheckOther: function(checkedValue) {
                        this.value.clear();
                        this.value.push(checkedValue);
                    },
    
                    // 监听改变事件
                    handleChange: function(changedOption, optionIndex, event) {
                        // 如果是单选
                        if(this.singleSelect) {
                            $.each(this.options, function(i, option) {
                                option.checked = false;
                            });

                            changedOption.checked = true;

                            this.value.clear();
                            this.value.push(changedOption.value);
                        }
                        else {
                            changedOption.checked = $(event.target).prop("checked");
                        }

                        if(this.onChange) {
                            this.onChange(this.value.$model, changedOption, optionIndex);
                        }
                    }
                }
            });
        });
    });
})();