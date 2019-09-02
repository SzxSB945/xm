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
        customerId: "",
        //企业ID
        businessId: "",
        //人员id
        peopleId: "",
        //参会种类
        meetingType: "",

        //统计时间段
        time: "",
        //总参会人数
        peopleNum: "",

        //总方数
        partiesNum: "",
        //总会议数
        meetingSum: "",
        //会议时长
        meetingTime: "",
        //评价
        evaluate: "",
        //开始时间
        start_time: "",
        //结束时间
        end_time: "",

        start: function (start) {

            if (start != '1') {
                vm.start_time = vm.get_value("start_time");
                vm.end_time = vm.get_value("end_time");
            }

            //没接口，到时候有接口反注释掉用这个
            $.get_data("get", "attendeeStatistics", { cid: vm.customerId, uid: vm.user_id }, function (data) {

                get_ok(data,start);

            }, function () {

                $.alert("拉取数据失败!")

            })

            function get_ok(data, start) {

                try {

                    if (data.data.userInfo.length == null) {//数据只有一条，不为数组

                        window.listData = []
                        var rd = data.data.userInfo;
                        //rd["C_Name"] = data.Data.C_Name;
                        window.listData.push(rd);

                    } else {//数据多条，为数组

                        window.listData = data.data.userInfo;
                        //for (var i = 0; i <= window.listData.length - 1; i++) {
                        //    window.listData["C_Name"] = data.Data.C_Name;
                        //}

                    }

                } catch (error) {
                    window.listData = [];
                }

                //测试筛选是否有效，正式环境删除******************
                if (vm.start_time != '' || vm.end_time != '' || vm.peopleId != '') {
                    window.listData = [];
                }
                //************************************************

                if (start != '1') {
                    $.table.reload("5zk8l")
                } else {
                    $.table.startLoadData("5zk8l");
                }

            }

        },

        get_value: function (id) {

            return $.plugins.getValue(id);

        }


    });

    vm.start("1");
    avalon.scan(document.body);

})