$(function () {

    vm = avalon.define({
        $id: "app",

        //用户标识id
        user_id: "",
        //组织id
        meeting_id: "",
        //会议ID
        meetingId: "",
        //客户ID
        customerId:"",
        //企业ID
        businessId: "",
        //人员id
        peopleId:"",

        OI_num: "",
        OI_time:"",




        start: function (start) {

            //没接口，到时候有接口反注释掉用这个
            $.get_data("get", "accessDetail", { mid: vm.meetingId, cid: vm.customerId, uid: vm.user_id }, function (data) {

                get_ok(data, start);

            }, function () {

                $.alert("拉取数据失败!")

            })

            function get_ok(data, start) {

                try {

                    vm.OI_num = data.data.eventInfo.length;
                    vm.OI_time = "2";
                    if (data.data.eventInfo.length == null) {//数据只有一条，不为数组

                        window.listData = []
                        var rd = data.data.eventInfo;
                        window.listData.push(rd);

                    } else {//数据多条，为数组

                        window.listData = data.data.eventInfo;

                    }

                } catch (error) {
                    window.listData = [];
                }

                if (start == "1") {

                    $.table.startLoadData("dsxtr");

                } else {

                    $.table.reload("dsxtr")

                }

            }

        },

        get_value: function (id) {

            return $.plugins.getValue(id);

        },


    })

    vm.start("1");
    avalon.scan(document.body);

})