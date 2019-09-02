/**
 * 单选组件
 * @author hq
 */
(function() {
    var pluginName = "ms-radio";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    name: "",
                    value: "",
    
                    // 选项
                    // { name: 'fruit', value: 'orange', text: '橙子', checked: true}
                    options: [],
    
                    onInit: function() {
                    },
    
                    getValue: function() {
                        return this.value;
                    }
                }
            });
        });
    });
})();