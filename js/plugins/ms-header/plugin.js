/**
 * 标准头部栏
 * @author hq
 */
(function() {
    var pluginName = "ms-header";

    $.plugins.registPlugin(pluginName, function() {
        $.plugins.getPluginTpl(pluginName, function(pluginTpl) {
            avalon.component(pluginName, {
                template: pluginTpl,
                defaults: {
                    title: ""
                }
            });
        });
    });
})();