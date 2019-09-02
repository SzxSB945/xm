/**
 * 范围输入组件
 * @author hq
 */
(function() {
    var pluginName = "ms-datetime-range";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    wrapperClass: pluginName,
                    
                    name: "",
    
                    // 类型
                    type: "",
                    // 值
                    value: "",
                    // 第1段值
                    date1: "",
                    date1VM: "",
                    // 第2段值
                    date2: "",
                    date2VM: "",
                    // 宽度
                    width: "",
    
                    onInit: function() {
                        if(this.value) {
                            var valueArr = this.value.split(",");
                            this.date1 = valueArr[0];
                            this.date2 = valueArr[1];
                        }
                    },
    
                    date1Init: function(vm) {
                        this.date1VM = vm.vmodel;
                    },
    
                    date2Init: function(vm) {
                        this.date2VM = vm.vmodel;
                    },
    
                    // 获取值
                    getValue: function(isArray) {
                        if(isArray) {
                            return [this.date1VM.getValue(), this.date2VM.getValue()];
                        }
                        else {
                            return this.date1VM.getValue() + "," + this.date2VM.getValue();
                        }
                    },
                }
            });
        });
    });
})();