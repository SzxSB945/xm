var vm;

$(function () {

    vm = avalon.define({
        $id: "app",

        userid: "",
        password: "",

        get_userData: function () {
            console.log(vm.userid);
            console.log(vm.password);
        },

        login: function () {
            
            var user = vm.userid;
            var pass = vm.password;
            if (user == '' || pass == '') {
                $.alert("账号密码不能为空");
                return
            }

            $.get_data("get", "login", { username: user, password: pass, appname: "platform" }, function (data) {

                vm.loginSuccess(data.data.sessionId);
                
            }, function (data) {

                $.alert("登录失败:" + data.msg);

            });

        },

        // 登录成功时调用
        loginSuccess: function (sessionId) {
            
            $.user.setUsername(vm.userid);
            $.user.setPassword(vm.password);
            $.user.setLineId(sessionId);
            //$.user.setLineId(line_id);
            //$.user.setView(view);
            //$.user.setAuth(auth);
            location.href = "/select.html?_=" + new Date().getTime();

        }


    })

    avalon.scan(document.body);

})