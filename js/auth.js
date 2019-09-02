/**
 * 权限控制类
 * @author hq
 */
(function () {
    // 检查用户权限
    var checkAuth = function () {
        // 检查cookies
        var lastPathname = location.pathname.substr(location.pathname.lastIndexOf("/") + 1);

        if (lastPathname.toLowerCase() != "login.html") {
            if (typeof ($.user.getUsername()) == "undefined" ||
              $.user.getUsername() == "" ||
              typeof ($.user.getLineId()) == "undefined" ||
              $.user.getLineId() == "") {
                // 清空当前保存的用户信息
                $.user.clear();

                $.getTopWindow().location.href = "/login.html";



                return;

            }

            $(function () {
                $.auth.scanPage();
            });
        }
    };

    checkAuth();
})();