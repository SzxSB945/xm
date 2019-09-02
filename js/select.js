$(function () {

    vm = avalon.define({

        $id: "app",

        userName: $.user.getUsername(),
        systemTime: '',
        sessionId: $.user.getLineId(),
        html: '',

        //注销
        quitUser: function () {

            $.confirm("是否退出当前账号?", function () {

                $.get_data("get", "logout", { "sessionId": vm.sessionId }, function (data) {

                    $.logout();

                }, function (data) {

                    $.logout();

                });

            })

        },

        //格式化时间
        formatTime: function (time) {

            time = time.format("YYYY/M/DD HH:mm:ss");
            return time;

        },

        //时间
        startTime: function () {

            var a = new moment();
            a = vm.formatTime(a);
            vm.systemTime = a;
            setTimeout(vm.startTime, 1000);

        },

        startLoadSelect: function () {

            $.get_data("get", "flatform/modules", {}, function (data) {

                //拿到数据有多少条
                if (data.data.modules != null && data.data.modules != '') {

                    var mod = data.data.modules;
                    var modSum = mod.length;
                    if (modSum <= 3) {
                        var row = 1;
                        var yu = 0;
                    } else {
                        var row = modSum / 3;
                        var yu = modSum % 3;
                    }

                    var textArray = [];

                    //一行中的第几个
                    var rows = 1;

                    //已经循环到了mod里的第几个
                    var forNum = 0;

                    //处理代码生成
                    var html = ''

                    //生成几行
                    for (var i = 0; i < row; i++) {

                        var htmlfor = '<div class="body-row">\
                                         <div class="relative">';

                        var rowBox = '';
                        var dataRow = '';
                        
                        //以行为循环，一行最多三个，数据拿mod里的
                        for (var j = rows; j < 4; j++) {
                            

                            if (mod[forNum] != null) {

                                rowBox = rowBox + '<div class="row-box' + j + '"></div>';

                                dataRow = dataRow +

                                '<div class="data-row' + j + '" onclick="hrefs(\'' + mod[forNum]["url"] + '\')">' +
                                    '<div align="center"><img src="' + mod[forNum]["picurl"] + '" height="100" width="100" /></div>' +
                                    '<div>' + mod[forNum]["name"] + '</div>' +
                                '</div>'

                            } else {
                                break
                            }

                            forNum++;
                            rows++;

                        }

                        htmlfor = htmlfor + rowBox;
                        htmlfor = htmlfor + dataRow;
                        htmlfor = htmlfor + '</div>\
                                    </div>'

                        html = html + htmlfor;

                        rows = 1;
                        

                    }
                    
                    
                    vm.html = html;


                }

            }, function (data) {


            });

        }

    })

    vm.startTime();
    vm.startLoadSelect();
    avalon.scan(document.body);

    $(".body-data").niceScroll({
        touchbehavior: false,     //是否是触摸式滚动效果
        cursorcolor: "#d2d2d2",     //滚动条的颜色值
        cursoropacitymax: 0.6,   //滚动条的透明度值
        cursorwidth: 20,         //滚动条的宽度值
        cursorwidth: "2px",
        autohidemode: true,      //滚动条是否是自动隐藏，默认值为 true
    });

})

function hrefs(url) {
    
    window.location.href = url;

}