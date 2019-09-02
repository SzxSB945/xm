
$(function () {

    initialize();

})

function initialize() {//初始化事件

    $(".two-menu a").click(function () {//

        var id = this.id;
        var url;
        switch (id) {

            case "1":
                url = "../modules/web/meeting_list.html";
                break
            case "2":
                url = "../modules/web/meeting_details.html";
                break
            case "3":
                url = "../modules/web/personnel_details.html";
                break
            case "4":
                url = "../modules/web/user_oi_detail.html";
                break
            case "5":
                url = "../modules/web/party_Number_Statistics.html";
                break
            case "6":
                url = "../modules/web/organizing_Meeting_List.html";
                break
            case "7":
                url = "../modules/web/individual_Participants_List.html";
                break
            case "8":
                url = "../modules/web/individual_Attendance_Statistics.html";
                break
            case "9":
                url = "../modules/web/organization_Structure.html";
                break
            case "10":
                url = "../modules/web/organizer_List.html";
                break

        }
        
        $(".two-menu ul").css("background", "none");
        $(".two-menu #" + id +" ul").css("background", "#424242");

        $("iframe").prop("src", url);
        

    });

    $(".one-menu").click(function () {
        
        var id = this.id;
        var obj = $("#" + id);
        var down = obj.data("down");

        switch (id) {

            case "one-1":
                switch (down) {
                    case true:
                        $("#two-1").slideUp(250);
                        obj.data("down", false);
                        $("#one-1 .direction img").prop("src", "img/top.png");
                        break;
                    case false:
                        $("#two-1").slideDown(250);
                        obj.data("down", true);
                        $("#one-1 .direction img").prop("src", "img/down.png");
                        break
                } break;
            
            case "one-2":
                switch (down) {
                    case true:
                        $("#two-2").slideUp(250);
                        obj.data("down", false);
                        $("#one-2 .direction img").prop("src", "img/top.png");
                        break;
                    case false:
                        $("#two-2").slideDown(250);
                        obj.data("down", true)
                        $("#one-2 .direction img").prop("src", "img/down.png");
                        break
                } break;

        }

    })


}