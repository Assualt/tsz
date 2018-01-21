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

});
