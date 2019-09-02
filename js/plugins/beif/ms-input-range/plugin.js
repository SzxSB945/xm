/**
 * 范围输入组件
 * @author hq
 */
(function() {
    var pluginName = "ms-input-range";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    wrapperClass: pluginName,
                    
                    name: "",
    
                    // 值
                    value: "",
                    // 第1段值
                    input1: "",
                    input1VM: "",
                    // 第2段值
                    input2: "",
                    input2VM: "",
    
                    onInit: function() {
                        if(this.value) {
                            var valueArr = this.value.split("-");
                            this.input1 = valueArr[0];
                            this.input2 = valueArr[1];
                        }
                        
                        this._id = "input" + $.getRandStr("an", 5);
                    },
    
                    input1Init: function(vm) {
                        this.input1VM = vm.vmodel;
                    },
    
                    input2Init: function(vm) {
                        this.input2VM = vm.vmodel;
                    },
    
                    $tipIndex: null,
    
                    // 显示tips
                    showTip: function(msg, opts) {
                        if(this.$tipIndex) {
                            $.close(this.$tipIndex);
                            this.$tipIndex = null;
                        }
    
                        this.$tipIndex = $.tips(msg, "#" + this._id, opts);
                    },
    
                    // 获取dom元素
                    getDom: function() {
                        return $("#" + this._id)[0];
                    },
    
                    // 获取值
                    getValue: function(isArray) {
                        if(isArray) {
                            return [this.input1VM.getValue(), this.input2VM.getValue()];
                        }
                        else {
                            return this.input1VM.getValue() + "-" + this.input2VM.getValue();
                        }
                    },
    
                    handleInput: function(event) {
                        if(this.$tipIndex) {
                            $.close(this.$tipIndex);
                            this.$tipIndex = null;
                        }
                    }
                }
            });
        });
    });
})();