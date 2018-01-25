/**
* Created by T_T on 2018/1/18.
**/

/*school clicked*/
function school_clicked(a) {
    var obj= $(a);
    $(".a_school").text('[  '+obj.attr('name') +'  ]');
    $(".show_school").hide(100);
}

$(document).ready(function () {
    window.JSONPATH="../dist/res/json/";
    /*define the json for area_university*/
    $.getJSON(window.JSONPATH+"area_university.json",function (content) {
        window.area_university=content;
        $.each(window.area_university,function (info,data) {
            if(data.city === "北京") {//select the selected city
                $.each(data.university , function (index,content) {
                    $(".show_school_body_3").append("<p class='fl'><a href='javascript:void(0);' onclick='school_clicked(this)' name='"+content.name+"'>"+content.name+"</a></p>")
                });
            }
        });
    });
    $(".a_school").click(function () {
        $(".show_school").show();
    });
    /*show_school close button*/
    $("#show_school_btn_cls").click(function () {
        $(".show_school").hide();
        $("#body").css("background-color","white");
    });
    $(".show_school_body_2 a").click(function () {
        var city=$(this).text();//get the city
        $(this).css({
            "background-color":"rgb(0,168,155)",
            "color":"white"
        });
        $(".show_school_body_2 a").not(this).css({
            "background-color":"white",
            "color":"rgb(0,168,155)"
        });
        $(".show_school_body_3").empty();
        $.each( window.area_university,function (info,data) {
            if(data.city === city) {//select the selected city
                $.each(data.university , function (index,content) {
                    var name=content.name;
                    $(".show_school_body_3").append("<p class='fl'><a href='javascript:void(0);' onclick='school_clicked(this)' name='"+content.name+"'>"+content.name+"</a></p>")
                });
            }
        });
    });

    /*helper*/

    $(".helper-item:eq(0)").mouseenter(function () {
        $(this).html("帮助中心");
        $(this).css("padding","10px");
    }).mouseleave(function () {
        $(this).css("padding","16px");
        $(this).html("<i class='fa fa-question-circle-o fa-2x'></i>");
    });
    $(".helper-item:eq(1)").mouseenter(function () {
        $(this).html("返回顶部");
        $(this).css({
            "padding":"10px"
        });
    }).mouseleave(function () {
        $(this).css("padding","16px");
        $(this).html("<i class='fa fa-rocket fa-2x'></i>");
    }).click(function () {
        $(window).scrollTop();
        $('body,html').animate({scrollTop:0},500);
    });
    $(".helper-item:eq(2)").mouseenter(function () {
        $(this).html("微信关注<div class='item3'>"+$(this).find('.item3').html()+"</div>");
        $(this).css("padding","10px");
        $(this).find('.item3').fadeIn(400);
    }).mouseleave(function () {
        $(this).html("<i class='fa fa-qrcode fa-2x'></i><div class='item3'>"+$(this).find('.item3').html()+"</div>");
        $(this).css("padding","16px");
        $(this).find('.item3').fadeOut(400);
    });
    $(".helper-item:eq(3)").mouseenter(function () {
        $(this).html("联系我们");
        $(this).css({"padding":"10px"});
    }).mouseleave(function () {
        $(this).css("padding","16px");
        $(this).html("<i class='fa fa-phone-square fa-2x'></i>");
    });

    /*退出*/
    $("#login_btn").next('ul').find('li:last-child').click(function () {
        var list = $(".main_head ul li:not(:first-child)");
        $.each(list,function () {
            $(this).addClass('disabled').removeClass('active');
            $(this).find('a').attr('href','#');
        });
        $(".main_head ul li:first-child").removeClass('disabled').addClass('active');
        /*header login state*/
        $("#login_btn").html('登录');
        $("#login_btn").next('ul').addClass('fade');
        var str =
            '<h1>登录淘书斋</h1>' +
            '<hr>' +
            '<form action="" class="form-horizontal" role="form" method="get">' +
            '   <div class="form-group">' +
            '       <label for="username" class="col-md-2 control-label">账号</label>' +
            '       <div class="col-md-7">' +
            '           <input type="text" class="form-control" id="username" placeholder="用户名/邮箱/电话" required="required" name="username">' +
            '       </div>' +
            '   </div>' +
            '   <div class="form-group">' +
            '        <label for="password" class="col-md-2 control-label">密码</label>' +
            '        <div class="col-md-7">' +
            '            <input type="password" class="form-control" id="password" placeholder="密码" required="required" name="password">' +
            '        </div>' +
            '   </div>' +
            '   <div class="form-group">' +
            '       <div class="col-sm-3"></div>' +
            '       <div class="col-sm-2">' +
            '           <input type="reset" value="重置" class="btn btn-primary form-control">' +
            '       </div>' +
            '       <div class="col-sm-2">' +
            '           <input type="submit" value="登录" class="btn btn-warning form-control">' +
            '       </div>' +
            '       <div class="col-sm-2" id="forget_psw">' +
            '           <a href="#" class="btn btn-link">忘记密码?</a></div>' +
            '       </div>' +
            '   </form>' +
            '<hr>' +
            '<div>' +
            '   <h5>使用第三方账号进行登录</h5>' +
            '   <div class="row">' +
            '       <div class="col-md-1"></div>' +
            '       <div class="col-md-10">' +
            '          <button type="button" class="fa fa-renren btn btn-primary btn-lg col-md-3">&nbsp;人人网登录</button>' +
            '           <button type="button" class="fa fa-qq btn btn-success btn-lg col-md-3">&nbsp;qq登录</button>' +
            '           <button type="button" class="fa fa-weibo btn btn-lg btn-info col-md-3">&nbsp;微博登录</button>' +
            '          <button type="button" class="fa fa-weixin btn btn-lg btn-danger col-md-3">&nbsp;微信登录</button>' +
            '       </div>' +
            '   </div>' +
            '</div>';
        $("#login").empty().append(str);
        $("#login").addClass('in active').removeClass('fade');
    });


    /*判断登录与否*/
    $("input:submit[value='登录']").click(function () {
        var str = $("#login").html();
        var flag = false;
        $("#login").empty().append('<h1 align="center">登录中...</h1>' +
            '<p align="center"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></p>')
        setTimeout(function () {
            if(flag ==true){
                var idList=['#basic_info','#book_management','#book_sale_history','#book_bought_history','login_history','#book_else'];
                var list = $(".main_head ul li:not(:first-child)");
                $.each(list,function (info) {
                    $(this).removeClass('disabled');
                    $(this).find('a').attr('href',idList[info]);
                });
                $("#login_btn").html('我').next('ul').removeClass('fade');
                $("#login").empty().append('<h1 align="center">登录成功</h1>');

                $(".main_head ul li:nth-child(2)").addClass('active');
                $("#basic_info").addClass('in active').removeClass('fade');
                $("#login").addClass('fade').removeClass('in active');
                $(".main_head ul li:first-child").removeClass('active').addClass('disabled').find('a').attr('href','#');
            }else if(flag ==false){
                $("#login").empty().append('<h1 align="center">登录失败</h1>' +
                    '<hr>' +
                    '<p align="center">正在返回登录界面<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></p>');
                setTimeout(function () {
                    $("#login").empty().append(str);
                },2000);
            }
        },2000);

       /*
       * 后台判断登录与否
       * */



    });

});
