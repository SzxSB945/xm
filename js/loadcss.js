/**
 * 动态加载css
 * @author hq
 */
$("link").each(function(i, link) {
    if($(link).attr("href") == "/static/lib.css") {
        $(link).remove();
    } 
});

var CSS_PATH = [
    "/js/plugins/plugin.css",
    "/css/global.css",
    "/fonts/iconfont.css",
    // ie下layer的样式加载不了，手动加载
    "/js/lib/layer/theme/default/layer.css",
    "/js/lib/laydate/theme/default/laydate.css",
    "/js/lib/keyboard/keyboard.css",
    "/css/bootstrap.min.css"];
var loadCSS = function (href) {
    var link = document.createElement("link");
    link.href = href;
    link.rel = "stylesheet";
    link.type = "text/css";

    var head = document.getElementsByTagName("head")[0];
    $(head).prepend(link);
}

for (var i = 0; i < CSS_PATH.length; i++) {
    loadCSS(CSS_PATH[i]);
}