/**
 * 动态加载js
 * @author hq
 */
var JS_PATH = ["/js/lib/jquery.min.js", "/js/lib/bootstrap.min.js",
    "/js/lib/jquery.i18n.properties.js", "/js/lib/js.cookie.js",
    "/js/lib/moment.min.js", "/js/global.js"];

var loadJS = function (src) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;

    document.write('<script type="text/javascript" src="' + src +'"></script>')
    //var body = document.getElementsByTagName("body")[0];
    //body.appendChild(script);
}

for (var i = 0; i < JS_PATH.length; i++) {
    loadJS(JS_PATH[i]);
}