/**
 * ipv4范围组件
 * @author hq
 */
(function() {
    var pluginName = "ms-ipv4-range";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    wrapperClass: pluginName,
                    
                    name: "",
    
                    // ipv4的地址
                    value: "",
                    // ipv4的第1段地址
                    ip1: "",
                    ip1VM: "",
                    // ipv4的第2段地址
                    ip2: "",
                    ip2VM: "",

                    renderValue: function(value) {
                        var ipArr = value.split("-");
                        this.ip1 = ipArr[0];
                        this.ip2 = ipArr[1];
                    },
    
                    onInit: function() {
                        if(this.value) {
                            this.renderValue(this.value);
                        }

                        var _this = this;

                        this.$watch("value", function() {
                            _this.renderValue(_this.value);
                        });
                    },
    
                    ip1Init: function(vm) {
                        this.ip1VM = vm.vmodel;
                    },
    
                    ip2Init: function(vm) {
                        this.ip2VM = vm.vmodel;
                    },
    
                    // 获取ip地址
                    getValue: function() {
                        if(!this.ip1VM.getValue() &&
                            !this.ip2VM.getValue()) {
                            return "";
                        }
    
                        return this.ip1VM.getValue() + "-" + this.ip2VM.getValue();
                    }
                }
            });
        });
    });
})();