/**
 * 系统初始化
 * @author hq
 */
$(function() {
    // 初始化多语言系统
    //$.lang.init(null, function() {
    //    // 初始化错误映射
    //    $.initErrorMapping();
    //});

    // 初始化表格系统
    $.table.init();

    // 初始化插件系统
    $.plugins.init();

    // ajax默认设置
    if(typeof(Mock) == "undefined") {
        var ajaxConfig = {
            cache: !PREVENT_AJAX_CACHE
        };
        $.ajaxSetup(ajaxConfig);
    }
    
    // 配置layer
    if(layer) {
        layer.config({
            success: function(layero) {
                // layer多语言支持
                $.lang.render(layero);
            }
        })
    }
});