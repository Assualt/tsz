/**
 * Created by T_T on 2018/1/18.
 **/

/*school clicked*/
function school_clicked(a) {
    var obj= $(a);
    $(".a_school").text('[  '+obj.attr('name') +'  ]');
    $(".show_school").hide(100);
}
function page_refresh(flag) {
    var page_tools =$("#page_tools ").find("li:not(:first-child,:last-child)");
    $.each(page_tools,function () {
        // alert($(this).find(a).html());
        $(this).find('a').html(parseInt($(this).find('a').html())+flag);
    });
    var page_tools1 = $("#page_tools_1 li:not(:first-child,:last-child)");
    $.each(page_tools1,function () {
        $(this).find('a').html(parseInt($(this).find('a').html())+flag);
    });
    return false;
}
function Set_page_active(value) {
    var page_tools =$("#page_tools li:not(:first-child,:last-child)");
    $.each(page_tools,function () {
        if($(this).find('a').html() ==value){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    });
    var page_tools_1 =$("#page_tools_1 li:not(:first-child,:last-child)");
    $.each(page_tools_1,function () {
        if($(this).find('a').html() ==value){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    });
    Page_content_refresh(value);
    $(".page_total p:first-child").html('当前第'+value+'页');
    // alert(page_tools.length+" "+page_tools_1.length);
    return false;
}
function page_tools_action(flag,value) {
    var page_tools =$("#page_tools");
    var val;
    var LocalMaxPage = page_tools.find("li:last-child").prev('li').find('a').html();
    var LocalMinPage = page_tools.find("li:first-child").next('li').find('a').html();
    // alert(LocalMaxPage+" "+LocalMinPage);
    if(flag ===1){//page_tools clicked
        Set_page_active(value);
    }else if(flag === 2){//page_tools_1 clicked
        if(value === "prev"){
            val = parseInt(page_tools.find("li.active a").html());
            if(val <= 1){
                alert("已经在首页,无法向前翻页");
            }else{
                val--;
                if(val<LocalMinPage){
                    // alert(val+" "+LocalMinPage);
                    page_refresh(-1);
                    Set_page_active(val);
                }else {
                    Set_page_active(val);
                }
            }

        }else if(value === "next"){
            val = parseInt(page_tools.find("li.active a").html());
            var Max_page =Get_Page_Max_Num();
            // alert("Max_page"+Max_page);
            if(val >= Max_page){
                alert("最大页数,无法向后翻页");
            }else{
                val++;
                if(val >LocalMaxPage){
                    // alert(val+" "+LocalMaxPage);
                    page_refresh(1);
                    Set_page_active(val);
                }else {
                    Set_page_active(val);
                }
            }
        }
    }
    return false;
}
function helper_display() {
    var this_scroll_y = $(this).scrollTop();
    // alert(screen_y);
    var helper=$(".helper");
    if(this_scroll_y  > 1000){
        helper.show(500);
    }else{
        helper.hide(500);
    }
    return false;
}
function Page_content_refresh(pageNum) {
    var page_content_start = (parseInt(pageNum)-1) * 12;
    var page_content_end = page_content_start+12;
    var str = "";
    var content_list=$(".content_list");
    content_list.empty();
    $.each(window.all_book,function (info,data) {
        if(data) {
            if (info >= page_content_start && info <page_content_end) {
                str +=
                    "<li class='list_info'>" +
                    "   <div class='book_img fl'>" +
                    "       <img src='" + data.img_url + "' alt='' class='img-rounded' width='120' height='150' title='" + data.book_name + "&nbsp;&&nbsp;&male;&nbsp;&" + data.book_publisher + "'>" +
                    "   <h6 title='作者:&nbsp;" + data.book_author + "' class='hvr-push'>作者:&nbsp;" +
                    "       <a href='https://baike.baidu.com/item/" + data.book_author + "'>" + data.book_author + "</a>&nbsp;&male;" +
                    "   </h6>" +
                    "   </div>" +
                    "   <div class='book_des fl'>" +
                    "       <div class='book_des_head'>" +
                    "           <strong title='" + data.book_name + "'>" +
                    "               <a href='#'>" + data.book_name + "</a>" +
                    "           </strong>" +
                    "       </div>" +
                    "       <div class='book_des_body'>" +
                    "           <ul class='body_item fl'>" +
                    "               <li>" +
                    "                   <p class='fl'>分类&nbsp;</p>";

                var tags = data.book_tags;
                $.each(tags, function (info, tagName) {
                    str +=
                        "<a class='fl badge body_item_tags hvr-grow' href='#'>" + tagName + "</a>";
                });
                var dis = parseFloat(data.price_now) / parseFloat(data.price_before) * 10;
                str +=
                    "</li>" +
                    "<li>" +
                    "   <p class='fl'>" + data.book_publisher + "&nbsp;/&nbsp;</p>" +
                    "   <p class='fl'>" + data.book_author + "&nbsp;/&nbsp;</p>" +
                    "   <p class='fl'>" + data.book_edition + "</p>" +
                    "</li>" +
                    "<li>" +
                    "   <p class='fl'>&yen;" + data.price_now + "&nbsp;&nbsp;&nbsp;</p>" +
                    "   <del class='fl'>&yen;" + data.price_before + "&nbsp;</del> " +
                    "   <p class='fl'>&nbsp;&nbsp;&lbbrk;" + dis.toFixed(1) + "折&rbbrk;</p>" +
                    "</li>" +
                    "</ul>" +
                    "<div class='body_item fr'>" +
                    "   <button class='btn btn-info hvr-grow-shadow'>加入<i class='fa fa-shopping-cart'></i></button>" +
                    "   <button class='btn btn-success hvr-grow-shadow'>收藏</button>" +
                    "</div>" +
                    "</div>" +
                    "<div class='book_des_rear'>" +
                    "   <a href='sel"+data.book_seller_id+"' class='fl'>" +
                    "       <img src='../dist/res/user_img/1.jpg' alt='' width='32' height='32'>&nbsp;"+data.book_store_name+
                    "</a>" +
                    "   <p class='fl' title='" + data.book_seller + "'>" +
                    "       <i class='fa fa-male'>&nbsp;&nbsp;</i>&nbsp;" + data.book_uni +
                    "   </p>" +
                    "</div>" +
                    "</div>" +
                    "</li>" +
                    " ";
            }
        }
    });
    content_list.append(str);
}
function Get_Page_Max_Num() {
    var len =window.all_book.length;
    var Max_page =(len%12)===0 ? (len/12) : (len/12+1).toFixed(0);
    $(".page_total").find("p:last-child").html('&nbsp;共&nbsp;'+Max_page+'页');
    return Max_page;
}
function Get_Page_Sel_Num() {
    return $("#page_tools").find("li:not(:first-child,:last-child).active").find('a').html();
}
function Init() {
    var login_status=sessionStorage['Login_ok'];
    var status =sessionStorage['status'];
    if(login_status ==='true' && status ==='success'){
        var login_btn = $("#login_btn")
        login_btn.html('我');
        login_btn.next('ul').removeClass('fade');
    }else if(login_status ==='false'){
        alert(2);
    }

}
$(document).ready(function () {
    Init();

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
        return false;
    });
    $(".a_school").click(function () {
        $(".show_school").show();
        return false;
    });
    /*show_school close button*/
    $("#show_school_btn_cls").click(function () {
        $(".show_school").hide();
        $("#body").css("background-color","white");
        return false;
    });
    $(".show_school_body_2").find('a').click(function () {
        var city=$(this).text();//get the city
        $(this).css({
            "background-color":"rgb(0,168,155)",
            "color":"white"
        });
        var show_school_body_3 = $(".show_school_body_3");
        $(".show_school_body_2").find('a').not(this).css({
            "background-color":"white",
            "color":"rgb(0,168,155)"
        });
        show_school_body_3.empty();
        $.each( window.area_university,function (info,data) {
            if(data.city === city) {//select the selected city
                $.each(data.university , function (index,content) {
                    show_school_body_3.append("<p class='fl'><a href='javascript:void(0);' onclick='school_clicked(this)' name='"+content.name+"'>"+content.name+"</a></p>")
                });
            }
        });
        return false;
    });
    /*show list*/
    $.getJSON(window.JSONPATH +"all_book.json",function (content) {
        window.all_book = content;
        // var str = "";
        Page_content_refresh(1);
        // $(".content_list").empty();
        // $.each(content,function (info,data) {
        //     if(info<12) {
        //         str +=
        //             "<li class='list_info'>" +
        //             "   <div class='book_img fl'>" +
        //             "       <img src='" + data.img_url + "' alt='' class='img-rounded' width='120' height='150' title='" + data.book_name + "&nbsp;&&nbsp;&male;&nbsp;&" + data.book_publisher + "'>" +
        //             "   <h6 title='作者:&nbsp;" + data.book_author + "' class='hvr-push'>作者:&nbsp;" +
        //             "       <a href='https://baike.baidu.com/item/" + data.book_author + "'>" + data.book_author + "</a>&nbsp;&male;" +
        //             "   </h6>" +
        //             "   </div>" +
        //             "   <div class='book_des fl'>" +
        //             "       <div class='book_des_head'>" +
        //             "           <strong title='" + data.book_name + "'>" +
        //             "               <a href='#'>" + data.book_name + "</a>" +
        //             "           </strong>" +
        //             "       </div>" +
        //             "       <div class='book_des_body'>" +
        //             "           <ul class='body_item fl'>" +
        //             "               <li>" +
        //             "                   <p class='fl'>分类&nbsp;</p>";
        //
        //         var tags = data.book_tags;
        //         $.each(tags, function (info, tagName) {
        //             str +=
        //                 "<a class='fl badge body_item_tags hvr-grow' href='#'>" + tagName + "</a>";
        //         });
        //         var dis = parseFloat(data.price_now) / parseFloat(data.price_before) * 10;
        //         str +=
        //             "</li>" +
        //             "<li>" +
        //             "   <p class='fl'>" + data.book_publisher + "&nbsp;/&nbsp;</p>" +
        //             "   <p class='fl'>" + data.book_author + "&nbsp;/&nbsp;</p>" +
        //             "   <p class='fl'>" + data.book_edition + "</p>" +
        //             "</li>" +
        //             "<li>" +
        //             "   <p class='fl'>&yen;" + data.price_now + "&nbsp;&nbsp;&nbsp;</p>" +
        //             "   <del class='fl'>&yen;" + data.price_before + "&nbsp;</del> " +
        //             "   <p class='fl'>&nbsp;&nbsp;&lbbrk;" + dis.toFixed(1) + "折&rbbrk;</p>" +
        //             "</li>" +
        //             "</ul>" +
        //             "<div class='body_item fr'>" +
        //             "   <button class='btn btn-info hvr-grow-shadow'>加入<i class='fa fa-shopping-cart'></i></button>" +
        //             "   <button class='btn btn-success hvr-grow-shadow'>收藏</button>" +
        //             "</div>" +
        //             "</div>" +
        //             "<div class='book_des_rear'>" +
        //             "   <a href='#' class='fl'>" +
        //             "       <img src='../dist/res/user_img/1.jpg' alt='' width='32' height='32'>&nbsp;二手书教材网" +
        //             "</a>" +
        //             "   <p class='fl' title='" + data.book_seller + "'>" +
        //             "       <i class='fa fa-male'>&nbsp;&nbsp;</i>&nbsp;" + data.book_uni +
        //             "   </p>" +
        //             "</div>" +
        //             "</div>" +
        //             "</li>" +
        //             " ";
        //     }
        // });
        // $(".content_list").append(str);
        return false;
    });


    /*helper*/

    $(".helper-item:eq(0)").mouseenter(function () {
        $(this).html("帮助中心");
        $(this).css("padding","10px");
    }).mouseleave(function () {
        $(this).css("padding","16px");
        $(this).html("<i class='fa fa-question-circle-o fa-2x'></i>");
        return false;
    });
    $(".helper-item:eq(1)").mouseenter(function () {
        $(this).html("返回顶部");
        $(this).css({
            "padding":"10px"
        });
        return false;
    }).mouseleave(function () {
        $(this).css("padding","16px");
        $(this).html("<i class='fa fa-rocket fa-2x'></i>");
        return false;
    }).click(function () {
        $(window).scrollTop();
        $('body,html').animate({scrollTop:0},500);
        return false;
    });
    $(".helper-item:eq(2)").mouseenter(function () {
        $(this).html("微信关注<div class='item3'>"+$(this).find('.item3').html()+"</div>");
        $(this).css("padding","10px");
        $(this).find('.item3').fadeIn(400);
        return false;
    }).mouseleave(function () {
        $(this).html("<i class='fa fa-qrcode fa-2x'></i><div class='item3'>"+$(this).find('.item3').html()+"</div>");
        $(this).css("padding","16px");
        $(this).find('.item3').fadeOut(400);
        return false;
    });
    $(".helper-item:eq(3)").mouseenter(function () {
        $(this).html("联系我们");
        $(this).css({"padding":"10px"});
        return false;
    }).mouseleave(function () {
        $(this).css("padding","16px");
        $(this).html("<i class='fa fa-phone-square fa-2x'></i>");
        return false;
    });


    /*search tag */
    $(".search_keyword li a").click(function () {
        $(this).addClass('selected');
        $(".search_keyword li a").not(this).removeClass('selected');
        return false;
    });

    /*display order*/
    $(".list_order").on('click','li a',function () {
        var flag = $(this).parent('li').html().indexOf('<i');
        if(flag === -1){/*has no i*/
            var li = $(this).parents('ul').find('li:not(:first-child) i');
            li.remove();
            var start = $(this).parents('li').html().indexOf('</a>');
            start = $(this).parents('li').html().substring(0,start+4) +"<i class='fa fa-sort-down'></i>";
            $(this).parents('li').html(start);
        }else{
            var i = $(this).next('i');
            i.toggleClass('fa-sort-down').toggleClass('fa-sort-up');
        }
        return false;
    });

    /*pagination tools*/
    $("#page_tools,#page_tools_1").find(" li:not(:first-child,:last-child) a").click(function () {
        // alert($(this).html());
        page_tools_action(1,$(this).html());
        return false;
    });

    $("#page_tools,#page_tools_1").find("li:first-child a").click(function () {
        page_tools_action(2,"prev");
        return false;
    });
    $("#page_tools,#page_tools_1").find("li :last-child a").click(function () {
        page_tools_action(2,"next");
        return false;
    });

    $("#page_tools_2").click(function () {
        var val = $(this).prev('input').val();
        if(val ===""){}
        else{
            if(parseInt(val)>Get_Page_Max_Num()){
                alert('输入页数大于总页数');
                $(this).prev('input').val(Get_Page_Sel_Num());
            }
            else{
                var page_tools = $("#page_tools");
                var Local_Min_Page_Num = page_tools.find("li:first-child").next('li').find('a').html();
                var Local_Max_Page_Num = page_tools.find("li:last-child").prev('li').find('a').html();
                if(val>=Local_Min_Page_Num && val <= Local_Max_Page_Num){
                    Set_page_active(val);
                }else {
                    if(val <= 5 && val >=1){
                        page_refresh(val-Local_Min_Page_Num);
                        Set_page_active(val);
                    }else if(val>5 && val<=Get_Page_Max_Num()){
                        page_refresh(val - Local_Max_Page_Num);
                        Set_page_active(val);
                    }else{
                        alert("输入页数操出索引范围!");
                        $(this).prev('input').val(Get_Page_Sel_Num());
                    }
                }
            }
        }
        return false;
    });

    window.setInterval(helper_display,1000);
    /*退出*/
    $("#login_btn").click(function () {
        var text = $(this).html();
        if(text === '登录'){
            window.location.href='login.html';
        }
    }).next('ul').find('li:last-child a').click(function () {
        sessionStorage['Login_ok']='';
        $("#login_btn").html('登录');
        $(this).parents('ul.dropdown-menu').addClass('fade');
    });

});