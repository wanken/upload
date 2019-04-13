$(function () {
    init();

});

function init(page) {
    $.get("/serverRecord/showServerLogDetails", {pageNum: page, pageSize: 10}, function (data) {
        console.info(data);
        var tmp = "";
        for (var i = 0; i < data.list.length; i++) {

            let sId = data.list[i].serverId;


            var creatTime = dateFormat(data.list[i].creatTime);


            tmp += '<tr class="trColor" >' +
                '<td >' + creatTime + '</td>' +
                '<td >' + data.list[i].userName + '</td>' +
                '<td >' + data.list[i].serverName + '</td>' +
                '<td >' + data.list[i].updateMessage + '</td>' +
                '<td >' + data.list[i].gitComit + '</td>' +
                '<td >' + data.list[i].backupPath + '</td>' +
                '<td >' +
                '<button type="button" style="width: 40px;" class="btn btn-default" aria-label="Left Align" onclick="updateLog(this,\'' + sId + '\')">\n' +
                '                            <span style="width: 20px;" class="glyphicon glyphicon-pencil" aria-hidden="true">\n' +
                '                                \n' +
                '                            </span>\n' +
                '                </button>&nbsp;&nbsp;' +
                '<button type="button" style="width: 40px;" class="btn btn-default" aria-label="Left Align" onclick="delectLog(\'' + sId + '\')" >\n' +
                '                            <span style="width: 20px;" class="glyphicon glyphicon-trash" aria-hidden="true">\n' +
                '                                \n' +
                '                            </span>\n' +
                '                </button>' +
                '</tr>'
        }
        $("#serverUpdateRecord").html(tmp);
        pagination(data.pageNum, data.pageSize, data.pages);
    });
}

function pagination(currentPage, numberOfPages, totalPages) {
    var element = $('#bp-element');
    var options = {
        bootstrapMajorVersion: 3,
        currentPage: currentPage,
        numberOfPages: 5,
        totalPages: totalPages,
        itemTexts: function (type, page, current) {
            switch (type) {
                case "first":
                    return "首页";
                case "prev":
                    return "<span class=\"glyphicon glyphicon-menu-left\" aria-hidden=\"true\"></span>";
                case "next":
                    return "<span class=\"glyphicon glyphicon-menu-right\" aria-hidden=\"true\"></span>";
                case "last":
                    return "末页";
                case "page":
                    return page;
            }
        },
        onPageClicked: function (event, originalEvent, type, page) {
            init(page);
        }
    };
    element.bootstrapPaginator(options);
}

function addLog() {
    $("#addlog").modal('show');
    $(".date").datetimepicker({
        format: "yyyy-MM-dd",
        autoclose: true,
        todayHighlight: true,
        todayBtn: true,
        startDate: new Date(),
        minuteStep: 10,
        Boolean: true
    });
}


var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;

function addOneLog() {
    let userName = $("#userName").val();
    let serverName = $("#serverName").val();
    let updateMessqge = $("#updateMessqge").val();
    let fileBack = $("#fileBack").val();
    let git = $("#git").val();
    let creatTime =   dateFormat($("#creatTime").data("datetimepicker").getDate());
    let r = creatTime.match(reg);

    if (userName !== "" && serverName !== "" && updateMessqge !== "" && fileBack !== "" && git !== "") {
        if (r == null) {
            alert("时间格式输入不正确");
        } else {
            $.post("/serverRecord/addOneLog", {
                userName: userName,
                serverName: serverName,
                updateMessqge: updateMessqge,
                fileBack: fileBack,
                git: git,
                creatTime: creatTime
            }, function (data) {
                $("#addlog").modal('hide');
                if (data.status === 200) {
                    alert("添加成功");
                    window.location.reload();

                } else {
                    alert("添加失败");
                    window.location.reload();
                }
            })
        }
    } else {
        alert("输入框不能为空");
    }
}


function delectLog(sId) {

    var msg = confirm("确定删除？");

    if (msg === true) {
        $.post("/serverRecord/deleteLog", {serverId: sId}, function (data) {
            if (data.status > 0) {
                alert("删除成功");
                window.location.reload();
            } else {
                alert("删除失败");
                window.location.reload();

            }
        })
    }
}

var sssId = "";

function updateLog(ele, sId) {

    $("#updatelog").modal('show');

    var creatTime = $(ele).parents("tr").children("td").eq(0).text();
    var userName = $(ele).parents("tr").children("td").eq(1).text();
    var serverName = $(ele).parents("tr").children("td").eq(2).text();
    var updateMessage = $(ele).parents("tr").children("td").eq(3).text();
    var git = $(ele).parents("tr").children("td").eq(4).text();
    var fileBack = $(ele).parents("tr").children("td").eq(5).text();


    $("#cTime").children('input.form-control').val(creatTime);

    $("#uName").val(userName);
    $("#sName").val(serverName);
    $("#uMessage").val(updateMessage);
    $("#gitC").val(git);
    $("#fBack").val(fileBack);

    sssId = sId;

    $(".date").datetimepicker({
        format: "yyyy-MM-dd",
        autoclose: true,
        todayHighlight: true,
        todayBtn: true,
        startDate: new Date(),
        minuteStep: 10,
        Boolean: true
    });

}

function updateOneLog() {

    let uName = $("#uName").val();
    let sName = $("#sName").val();
    let uMessage = $("#uMessage").val();
    let fBack = $("#fBack").val();
    let gitC = $("#gitC").val();
    let cTime =   dateFormat($("#cTime").data("datetimepicker").getDate());

    let cT = cTime.match(reg);

    if (uName !== "" && sName !== "" && uMessage !== "" && fBack !== "" && gitC !== "" && cTime !== "") {
        if (cT == null) {
            alert("时间格式输入不正确");
        } else {
            $.post("/serverRecord/updateOneLog",{serverId:sssId,serverName:sName,userName:uName,updateMessage:uMessage,
                backupPath: fBack,gitComit: gitC,creatTime:cTime},function(data){
                if(data.status === 200){
                    alert("修改成功");
                    window.location.reload();
                }else{
                    alert("修改失败");
                    window.location.reload();
                }
            });
            sssId = "";
        }
    } else {
        alert("输入框不能为空");
    }
}

function dateFormat(longTypeDate) {
    var dateType = "";
    var date = new Date();
    date.setTime(longTypeDate);
    dateType = date.getFullYear() + "-" + getMonth(date) + "-" + getDay(date);
    return dateType;
}

//返回 01-12 的月份值
function getMonth(date) {
    var month = "";
    month = date.getMonth() + 1; //getMonth()得到的月份是0-11
    if (month < 10) {
        month = "0" + month;
    }
    return month;
}

//返回01-30的日期
function getDay(date) {
    var day = "";
    day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return day;
}
