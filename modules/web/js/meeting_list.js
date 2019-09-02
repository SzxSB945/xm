$(function () {

    vm = avalon.define({
        $id: "app",

        //统计时间段
        time: "",
        //总会议数
        meetingSum: "",
        //会议时长
        meetingTime: "",
        //总会议数
        mettingPeopleSum: "",
        //用户标识id
        user_id: "",
        //组织id
        organize_id: "",
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
            $.get_data("get", "meetingStatistics", { startTime: vm.start_time, endTime: vm.end_time, createID: '', oid: vm.organize_id, C_ID: vm.user_id }, function (data) {

                get_ok(data, start);

            }, function () {

                $.alert("拉取数据失败!")

            })

            function get_ok(data, start) {

                try {
                    vm.meetingSum = data.data.meetingInfo.length;
                    vm.time = data.data.startTime + "-" + data.data.endTime;
                    //会议时长
                    var meetingTime = "00:00:00";
                    //总参会人数
                    var mettingPeopleSum = "0";

                    if (data.data.meetingInfo.length == null) {//数据只有一条，不为数组

                        window.listData = []
                        var rd = data.data.meetingInfo;
                        window.listData.push(rd);
                        meetingTime = data.data.meetingInfo["duration"];
                        mettingPeopleSum = data.data.meetingInfo["totalAttendeeNumber"];

                    } else {//数据多条，为数组

                        for (var i = 0; i <= data.data.meetingInfo.length - 1 ; i++) {

                            meetingTime = $.timeSum(meetingTime, data.data.meetingInfo[i]["duration"]);
                            mettingPeopleSum = parseInt(mettingPeopleSum) + parseInt(data.data.meetingInfo[i]["totalAttendeeNumber"]);

                        }

                        window.listData = data.data.meetingInfo;

                    }

                    vm.meetingTime = meetingTime;
                    vm.mettingPeopleSum = mettingPeopleSum;

                } catch (error) {
                    console.log(error);
                    window.listData = [];
                }


                if (start != '1') {
                    $.table.reload("ku54n")
                } else {
                    $.table.startLoadData("ku54n");
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