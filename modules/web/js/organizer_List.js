$(function () {

    vm = avalon.define({
        $id: "app",

        //用户标识id
        user_id: "",
        //组织id
        meeting_id: "",


        start: function (start) {

            //没接口，到时候有接口反注释掉用这个
            $.get_data("get", "allNextLevel", { oid: vm.meeting_id, option: 2 }, function (data) {

                get_ok(data,start);

            }, function () {

                $.alert("拉取数据失败!")

            })

            function get_ok(data, start) {

                try {
                    
                    if (data.data.users.length == null) {//数据只有一条，不为数组

                        window.listData = []
                        var rd = data.data.users;
                        window.listData.push(rd);

                    } else {//数据多条，为数组

                            window.listData = data.data.users;

                    }

                } catch (error) {
                    window.listData = [];
                }


                if (start != '1') {
                    $.table.reload("ejz99")
                } else {
                    $.table.startLoadData("ejz99");
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