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
                vm.start_time = this.get_value("start_time");
                vm.end_time = this.get_value("end_time");
            }

            //没接口，到时候有接口反注释掉用这个
            $.get_data("get", "linkStatistics", { startTime: vm.start_time, endTime: vm.end_time, cid: vm.customerId }, function (data) {

                get_ok(data, start);

            }, function () {

                $.alert("拉取数据失败!")

            })

            function get_ok(data, start) {

                try {
                    vm.partiesNum = data.data.linkInfo.totalLinkCount;
                    vm.meetingSum = data.data.linkInfo.meetingCount;
                    vm.evaluate = data.data.linkInfo.avg;
                    if (data.data.maxLinkMeetingInfo.length == null) {//数据只有一条，不为数组

                        window.listData = []
                        var rd = data.data.maxLinkMeetingInfo;
                        rd["C_Name"] = data.data.clientName;
                        window.listData.push(rd);

                    } else {//数据多条，为数组

                        window.listData = data.data.maxLinkMeetingInfo;
                        for (var i = 0; i <= window.listData.length - 1; i++) {
                            window.listData["C_Name"] = data.data.clientName;
                        }

                    }

                } catch (error) {
                    window.listData = [];
                }

                //测试筛选是否有效，正式环境删除******************
                if (vm.start_time != '' || vm.end_time != '') {
                    window.listData = [];
                }
                //************************************************

                if (start != '1') {
                    $.table.reload("gw82f")
                } else {
                    $.table.startLoadData("gw82f");
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