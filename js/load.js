/**
 * 加载页面的脚本文件
 * @author hq
 */

if (!DONT_USE_STATIC_FILE) {
    $LAB
    .queueScript("/static/lib.js")
    .queueWait()
}
else {
    $LAB
    .queueScript("/js/lib/es5-shim.js")
    .queueScript("/js/lib/localStorage/localStorage.min.js?swfURL=/js/lib/localStorage/localStorage.swf")
    .queueWait()
    .queueScript(function () {
        if (DEBUG_MODE) {
            // 引入测试库
            return [
                "/mock/lib/mock-min.js",
                "/mock/mock-data.js",
                "/mock/mock.js"
            ];
        };
    })
    .queueWait()
    .queueScript("/js/lib/jquery.min.js")
    .queueScript("/js/lib/avalon.js")
    .queueScript("/js/lib/template-web.min.js")
    .queueScript("/js/lib/crypto-js/crypto-js.js")
    .queueWait()
    .queueScript("/js/lib/bootstrap.min.js")
    // .queueScript("/js/lib/bootstrap-table/bootstrap-table.min.js")
    // .queueScript("/js/lib/bootstrap-table/bootstrap-table-locale-all.min.js")
    .queueScript("/js/lib/layer/layer.min.js")
    .queueScript("/js/lib/laydate/laydate.min.js")
    .queueScript("/js/lib/jquery.i18n.properties.js")
    .queueScript("/js/lib/js.cookie.js")
    .queueScript("/js/lib/mousetrap.min.js")
    .queueScript("/js/lib/moment.min.js")
    .queueScript("/js/lib/xml2json.js")
    .queueScript("/js/lib/keyboard/keyboard.js")
    .queueScript("/js/lib/jquery.nicescroll/jquery.nicescroll.min.js")
    .queueScript("/js/lib/countUp.withPolyfill.min.js")
    .queueScript("/js/library.js")
    .queueScript("/js/interface.js")
    .queueScript("/js/loadcss.js")
    .queueWait()
    .queueScript("/js/lang.js")
    .queueWait()
    .queueScript("/js/error-mapping.js")
    .queueScript("/js/plugins/plugin-loader.js")
    .queueWait()
    .queueScript("/js/plugins/ms-input/plugin.js")
    .queueScript("/js/plugins/ms-radio/plugin.js")
    .queueScript("/js/plugins/ms-checkbox/plugin.js")
    .queueScript("/js/plugins/ms-select/plugin.js")
    .queueScript("/js/plugins/ms-table/plugin.js")
    .queueScript("/js/plugins/ms-ipv4/plugin.js")
    .queueScript("/js/plugins/ms-table/plugin.js")
    .queueScript("/js/plugins/ms-header/plugin.js")
    .queueScript("/js/plugins/ms-table2/plugin.js")
    .queueScript("/js/plugins/ms-ipv4-range/plugin.js")
    .queueScript("/js/plugins/ms-input-range/plugin.js")
    .queueScript("/js/plugins/ms-sip-select/plugin.js")
    .queueScript("/js/plugins/ms-datetime/plugin.js")
    .queueScript("/js/plugins/ms-datetime-range/plugin.js")
    .queueScript("/js/plugins/ms-ext-group-select/plugin.js")
    .queueScript("/js/plugins/ms-ext-select/plugin.js")
    .queueScript("/js/plugins/ms-ext-call-select/plugin.js")
    .queueScript("/js/plugins/ms-ext-cellphone-select/plugin.js")
    .queueWait()
    .queueScript("/modules/table/js/table-render.js")
    .queueWait()
    .queueScript("/js/auth.js")
    .queueWait()
    .queueScript("/js/app-init.js");
}