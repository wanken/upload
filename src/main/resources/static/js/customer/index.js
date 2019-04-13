let $grade = $('input[name="choose"]:checked');

$(function () {

});


$('input[name="choose"]').click(function () {
    let $grade = $('input[name="choose"]:checked');
    if ($grade.length <= 2 && ($grade[0].id === 'ge' || $grade[0].id === 'gs')) {
        $('#teacher-lz').show();
        $('#teacher-wz').show();
    } else {
        $('#teacher-lz').hide();
        $('#teacher-wz').hide();
    }
});

$('#startUpload').on('click', function () {
    let czUrl = "http://guanchu.tifenpai.com:9097";
    let gyUrl = "http://guangao.tifenpai.com:9094";
    let geUrl = "http://guangao.tifenpai.com:9091";
    let gsUrl = "http://guangao.tifenpai.com:9093";




    // let gyUrl = "http://192.168.1.6:8098";
    // let gsUrl = "http://192.168.1.6:8010";

    let baseUrl = "/courseResource/teacherUploadFileList.action";

    let $grade = $('input[name="choose"]:checked');
    let urlArr = [];
    let url = "";
    let grade = "";
    if ($grade.length === 0) {
        Swal.fire({
            position: 'top-start',
            type: 'warning',
            title: "请先选择需要上传的服务器!",
            showConfirmButton: false,
            timer: 1500
        });
    } else if ($("#uploadFile")[0].files[0] === undefined) {
        Swal.fire({
            position: 'top-start',
            type: 'warning',
            title: "请先选择需要上传的文件!",
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        for (let i = 0; i < $grade.length; i++) {
            switch ($grade[i].id) {
                case 'cz':
                    grade = "初中";

                    urlArr.push(czUrl + baseUrl);
                    break;
                case 'gy':
                    grade = "高一";
                    urlArr.push(gyUrl + baseUrl);
                    break;
                case 'ge':
                    grade = "高二";
                    urlArr.push(geUrl + baseUrl);
                    break;
                case 'gs':
                    grade = "高三";
                    urlArr.push(gsUrl + baseUrl);
                    break;
                default:
                    break;
            }
            grade += "服务器: ";

        }

    }
    for (let i = 0; i < urlArr.length; i++) {
        let flag = false;
        if (i === urlArr.length - 1) {
            flag = true;
        }


        upload(urlArr[i], grade, flag);
    }
    /*    setTimeout(function () {
            window.location.reload();
        }, 6000);*/

});

function upload(url, grade, file, flag) {
    let files = $("#uploadFile")[0].files;
    for (let i = 0; i < files.length; i++) {
        let formData = new FormData();
        let name = $("input").val();
        formData.append("file", files[i]);
        formData.append("name", name);
        formData.append("fileType", '课件');
        formData.append("uploadPushbyType", '0');
        formData.append("account", $('#teachers').val());
        formData.append("multi", "multi");





        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {

                // let path = "";
                // var subject =   $('#teachers option:selected').text();
                // var auther = '刘晓';
                // var server ='';
                // for (let i = 0; i < $grade.length; i++) {
                //     switch ($grade[i].id) {
                //         case 'cz':
                //             server = "初中";
                //             path = "";
                //             break;
                //         case 'gy':
                //             server = "高一";
                //             path ="";
                //             break;
                //         case 'ge':
                //             server = "高二";
                //             path="";
                //             break;
                //         case 'gs':
                //             server = "高三";
                //             path="";
                //             break;
                //         default:
                //             break;
                //     }
                //     server += ",";
                //     path += ",";
                // }

            // $.post("/resource/insertResourceRecord",{"subject":subject,"auther":auther,"server":server,"path":path,"fileName":name},function(data){
            //         if(data.status === 200){
            //
            //         }else{
            //
            //         }
            // });
                console.log(data);
                if (data.createTime.length > 0) {
                    Swal.fire({
                        position: 'top-start',
                        type: 'success',
                        title: grade + data.resName + "上传成功!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    if (flag) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }
                }
            },
            error: function () {
                Swal.fire({
                    position: 'top-start',
                    type: 'error',
                    title: grade + "上传失败!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }
}