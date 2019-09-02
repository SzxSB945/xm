$(function () {

    vm = avalon.define({
        $id: "app",

        //用户标识id
        user_id: "",
        //组织id
        meeting_id: "",


        start: function (start) {

            //没接口，到时候有接口反注释掉用这个
            $.get_data("get", "meetingDetail", { mid: vm.meeting_id, cid: vm.user_id }, function (data) {

                get_ok(data, start);

            }, function () {

                $.alert("拉取数据失败!")

            })

            function get_ok(data, start) {

                try {

                    if (data.data.meetingInfo.length == null) {//数据只有一条，不为数组

                        window.listData = []
                        var rd = data.data.meetingInfo;
                        window.listData.push(rd);

                    } else {//数据多条，为数组

                        window.listData = data.data.meetingInfo;

                    }

                } catch (error) {
                    window.listData = [];
                }


                if (start != '1') {
                    $.table.reload("991cq")
                } else {
                    $.table.startLoadData("991cq");
                }

            }

        },

        get_value: function (id) {

            return $.plugins.getValue(id);

        }


    })

    vm.start("1");
    avalon.scan(document.body);

})