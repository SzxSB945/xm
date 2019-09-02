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
        customerId: "C0001",
        //企业ID
        businessId: "",
        //人员id
        peopleId: "",
        //参会种类
        meetingType: "0",

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
            $.get_data("get", "individualMeetingList", { startTime: vm.start_time, endTime: vm.end_time, cid: vm.customerId, uid: vm.user_id, type: vm.meetingType }, function (data) {

                get_ok(data, start);

            }, function () {

                $.alert("拉取数据失败!")

            })

            function get_ok(data, start) {

                try {

                    vm.time = vm.start_time + " - " + vm.end_time;
                    var mettingPeopleSum = "0";

                    if (data.data.meetingInfo.length == null) {//数据只有一条，不为数组
                        vm.meetingSum = 1;
                        window.listData = []
                        var rd = data.data.meetingInfo;
                        //rd["C_Name"] = data.Data.C_Name;
                        mettingPeopleSum = data.data.meetingInfo["totalAttendeeNumber"];
                        window.listData.push(rd);

                    } else {//数据多条，为数组

                        vm.meetingSum = data.data.meetingInfo.length;
                        for (var i = 0; i <= data.data.meetingInfo.length - 1 ; i++) {

                            mettingPeopleSum = parseInt(mettingPeopleSum) + parseInt(data.data.meetingInfo[i]["totalAttendeeNumber"]);

                        }
                        window.listData = data.data.meetingInfo;

                    }

                    vm.peopleNum = mettingPeopleSum

                } catch (error) {
                    window.listData = [];
                   console.log(error)
                }

                if (start != '1') {
                    $.table.reload("ckqnx")
                } else {
                    $.table.startLoadData("ckqnx");
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