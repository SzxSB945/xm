$(function () {

    vm = avalon.define({
        $id: "app",

        //用户标识id
        user_id: "",
        //组织id
        meeting_id: "",
        //企业ID
        businessId: "",
        //种类
        kind:"",

        peopleNumber: "",
        peopleNumberThis: "",
        audit: "",
        auditThis: "",




        start: function (start) {

            //没接口，到时候有接口反注释掉用这个
            $.get_data("get", "attendeeDetail", { mid: vm.meeting_id, cid: vm.user_id }, function (data) {

                get_ok(data, start);

            }, function () {

                $.alert("拉取数据失败!")

            })

            function get_ok(data, start) {

                try {
                    window.listData = data.data.userInfo;
                    vm.peopleNumber = data.data.userInfo.length;
                    vm.audit = vm.getAudit(data.data.userInfo);
                    if (data.data.userInfo.length == null) {//数据只有一条，不为数组

                        window.listData = []
                        var rd = data.data.userInfo;
                        window.listData.push(rd);

                    } else {//数据多条，为数组

                        window.listData = data.data.userInfo;

                    }

                } catch (error) {
                    window.listData = [];
                }

                if (start != '1') {
                    $.table.reload("6nnml")
                } else {
                    $.table.startLoadData("6nnml");
                }

            }

        },

        get_value: function (id) {

            return $.plugins.getValue(id);

        },

        //计算旁听应到人数
        getAudit: function(data){
            var num = 0;
            for (var i = 0; i <= data.length - 1 ; i++) {
                if (data[i].isVistor == "1") {
                    num = num + 1;
                }
            }
            return num;
        }


    })

    vm.start("1");
    avalon.scan(document.body);

})