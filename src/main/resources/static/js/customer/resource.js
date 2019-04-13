$(function () {
    initTable();

});


function initTable(page) {
    $.get("/resource/findAllResources", {pageNum: page, pageSize: 10}, function (data) {
        console.info(data);
        var tmp = "";
        for (var i = 0; i < data.list.length; i++) {

            let rId = data.list[i].resourceId;
            var crTime = dateFormat(data.list[i].crTime);

            tmp += '<tr class="trColor" >' +
                '<td >' + crTime + '</td>' +
                '<td >' + data.list[i].author + '</td>' +
                '<td >' + data.list[i].resourceName + '</td>' +
                '<td >' + data.list[i].type + '</td>' +
                '<td >' + data.list[i].server + '</td>' +
                '<td >' + data.list[i].subject + '</td>' +
                '<td >' + data.list[i].path + '</td>' +
                '<td >' +
                '<button type="button" style="width: 40px;" class="btn btn-default" aria-label="Left Align" onclick="updateResource(this,\'' + rId + '\')">\n' +
                '                            <span style="width: 20px;" class="glyphicon glyphicon-pencil" aria-hidden="true">\n' +
                '                                \n' +
                '                            </span>\n' +
                '                </button>&nbsp;&nbsp;' +
                '<button type="button" style="width: 40px;" class="btn btn-default" aria-label="Left Align" onclick="delectResource(\'' + rId + '\')" >\n' +
                '                            <span style="width: 20px;" class="glyphicon glyphicon-trash" aria-hidden="true">\n' +
                '                                \n' +
                '                            </span>\n' +
                '                </button>' +
                '</tr>'
        }
        $("#resourceRecord").html(tmp);
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
            initTable(page);
        }
    };
    element.bootstrapPaginator(options);
}




function delectResource(rId){
    var msg = confirm("确定删除？");

    if (msg === true) {
        $.post("/resource/deleteResource", {resourceId: rId}, function (data) {
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

var resourceId = 0;


function updateResource(ele, rId) {

    $("#updateresource").modal('show');

    var creatTime = $(ele).parents("tr").children("td").eq(0).text();
    var author = $(ele).parents("tr").children("td").eq(1).text();
    var fileName = $(ele).parents("tr").children("td").eq(2).text();
    var type = $(ele).parents("tr").children("td").eq(3).text();
    var server = $(ele).parents("tr").children("td").eq(4).text();
    var subject = $(ele).parents("tr").children("td").eq(5).text();
    var fileBack = $(ele).parents("tr").children("td").eq(6).text();


    $("#cTime").children('input.form-control').val(creatTime);

    $("#author").val(author);
    $("#fName").val(fileName);
    $("#server").val(server);
    $("#type").val(type);
    $("#subject").val(subject);
    $("#path").val(fileBack);

    resourceId = rId;

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
function updateOneResource() {
    let author = $("#author").val();
    let fName = $("#fName").val();
    let server = $("#server").val();
    let type = $("#type").val();
    let subject = $("#subject").val();
    let path = $("#path").val();
    let cTime =   dateFormat($("#cTime").data("datetimepicker").getDate());

    let cT = cTime.match(reg);

    if (author !== "" && fName !== "" && server !== "" && subject !== "" && path !== "" && cTime !== "" && type!== "") {
        if (cT == null) {
            alert("时间格式输入不正确");
        } else {
            console.info(resourceId);
            $.post("/resource/updateOneResource",{resourceId:resourceId,author:author,fName:fName,server:server,
                subject: subject,path: path,updateTime:cTime,type:type},function(data){
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




function addResource() {
    $("#addresource").modal('show');
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


function addOneresource() {
    let authorName = $("#authorName").val();
    let fileName = $("#fileName").val();
    let serverName = $("#serverName option:selected").val();
    let subjectName = $("#subjectName option:selected").val();
    let typeName = $("#typeName option:selected").val();
    let pathV = $('#pathV').val();
    let creatTime =   dateFormat($("#creatTime").data("datetimepicker").getDate());
    let r = creatTime.match(reg);


    if (authorName !== "" && fileName !== "" && serverName !== "" && subjectName !== "" && pathV !== "" && typeName !== "") {
        if (r == null) {
            alert("时间格式输入不正确");
        } else {
            $.post("/resource/addOneResource", {
                authorName: authorName,
                fileName: fileName,
                serverName: serverName,
                subjectName: subjectName,
                typeName:typeName,
                pathV: pathV,
                creatTime: creatTime
            }, function (data) {
                $("#addresource").modal('hide');
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