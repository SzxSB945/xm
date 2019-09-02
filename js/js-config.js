/**
 * js库的全局默认配置
 * @author hq
 */

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