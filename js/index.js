$(function () {

    vm = avalon.define({

        $id: "app",


        userName: $.user.getUsername(),
        systemTime: '',
        sessionId: $.user.getLineId(),

        //注销
        quitUser: function () {

            $.confirm("是否退出当前账号?", function () {

                $.get_data("get", "logout", { "sessionId": vm.sessionId}, function (data) {

                    $.logout();

                }, function (data) {

                    $.logout();

                });

            })

        },

        //格式化时间
        formatTime: function (time){

            time = time.format("YYYY/M/DD HH:mm:ss");
            return time;

        },

        //时间
        startTime: function(){

            var a = new moment();
            a = vm.formatTime(a);
            vm.systemTime = a;
            setTimeout(vm.startTime,1000);

        }

    })

    avalon.scan(document.body);

    vm.startTime();

})
