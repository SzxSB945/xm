/**
 * 日期时间控件
 * @author hq
 */
(function() {
    var pluginName = "ms-datetime";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    _id: "",
                    name: "",
                    value: "",
                    // 类型。可选值为：year、month、date、time、datetime
                    type: "",
                    width: "",
    
                    onReady: function() {
                        this._id = "datetime-" + $.getRandStr("an", 5);
    
                        laydate.render({
                            elem: "#" + this._id,
                            type: this.type ? this.type : "datetime"
                        });
                    },
    
                    getValue: function() {
                        return this.value;
                    },
    
                    open: function() {
                        var _this = this;
    
                        window.setTimeout(function(){
                            $("#" + _this._id).focus();
                        }, 1);
                    }
                }
            });
        });
    });
})();