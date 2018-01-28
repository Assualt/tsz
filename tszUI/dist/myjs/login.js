/**
* Created by T_T on 2018/1/18.
**/

/*school clicked*/
function school_clicked(a) {
    var obj= $(a);
    $(".a_school").text('[  '+obj.attr('name') +'  ]');
    $(".show_school").hide(100);
}
function address_refresh() {
    var address_list =$("#basic_info_2").find('div.panel-group');
    if(address_list.length == 0){
        $("#basic_info_2").find('div.list-group').append('<h3 align="center" style="opacity: 0.7;">没有收货地址请添加</h3><br>')
    }else{
        $.each(address_list,function (info) {
            var str = $(this).find('h4.panel-title').html();
            info++;
            str = str.substring(0,str.indexOf(':')-1)+info+str.substring(str.indexOf(':'),str.length);
            $(this).find('h4.panel-title').html(str);
        });
    }
    return false;
}

$(document).ready(function () {
    window.JSONPATH="../dist/res/json/";

    /*define the json for area_university*/
    $.getJSON(window.JSONPATH+"area_university.json",function (content) {
        var str = "";
        window.area_university =content;
        $.each(content,function (info,data) {
            if(data.city === "北京") {//select the selected city
                $.each(data.university , function (index,content) {
                    $(".show_school_body_3").append("<p class='fl'><a href='javascript:void(0);' onclick='school_clicked(this)' name='"+content.name+"'>"+content.name+"</a></p>")
                });
            }else{}
            str +="<option value='"+data.city+"'>"+data.city+"</option>";
        });
        /*init the province select*/
        $("#province").append(str);
    });
    $("#province").change(function () {
        var pro = $(this).val();
        $.each(window.area_university,function (info,data) {
           if(data.city == pro){
               var str ="";
               $.each(data.university,function (info,data) {
                   if(info>=1) {
                       str += "<option value='" + data.name + "'>" + data.name + "</option>";
                   }
               });
               $("#school").empty().append(str);
           }else if(pro =="选择省"){
               $("#school").empty().append('<option value="请选择学校">请选择学校</option>')
               $("input[name='myuniversity']").val('');
           }
        });
    });
    $("#school").change(function () {
        var pro =$("#province").val();
        if(pro =="重庆" || pro =="天津" || pro =="北京" ||pro =="上海"){
            pro+="市";
        }else if(pro=="广西"){
            pro+="壮族自治区";
        }else if(pro=="新疆"){
            pro+="维吾尔自治区";
        }else if(pro=="宁夏"){
            pro+="回族自治区";
        }else if(pro=="西藏"){
            pro+="藏族自治区";
        }else{
            pro+="省";
        }
        $("input[name='myuniversity']").val(pro+" "+$(this).val());
    });

    $(".a_school").click(function () {
        $(".show_school").show();
        // $("*").not($(".show_school")).css('opacity',0.5);
    });
    /*show_school close button*/
    $("#show_school_btn_cls").click(function () {
        $(".show_school").hide();
        $("#body").css("background-color","white");
    });
    $(".show_school_body_2").find('a').click(function () {
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

    $("#basic_info_1_btn").find("button:first-child").click(function () {
       // // alert($(this).html());
       // $(this).parents('.col-md-9').find('.form-group:not(:last-child) div input').attr('disabled',false);
       //  $(this).parents('.col-md-9').find('.form-group:nth-child(5) div div select').attr('disabled',false);
       // $(this).next('button').next('button').attr('disabled',true);
    });


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
        var flag = true;
        /*
        *flag 为标志位
        * 后台判断登录与否
        **/
        $("#login").empty().append('<h1 align="center">登录中...</h1>' +
            '<p align="center"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></p>')
        setTimeout(function () {
            if(flag ==true){
                var idList=['basic_info','book_management','book_sale_history','book_bought_history','login_history','account_evaluate','book_else'];
                var list = $(".main_head ul li:not(:first-child)");
                $.each(list,function (info) {
                    $(this).removeClass('disabled');
                    $(this).find('a').attr('href','#'+idList[info]);
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
    });

   /*设置默认地址*/
   $("#basic_info_2").on("click",'button',function () {
       var value =$(this).val();
      if(value == "edit_add"){
          swal("edit_add clicked");
      }else if(value =="set_def"){
          var def_panel = $(this).parents('div.list-group').find('div.panel.panel-primary');
          if(def_panel.length == 1){
              def_panel.removeClass('panel-primary').addClass('panel-default');
              def_panel.find('div.panel-heading h4 a span').remove();
              var append_str = "<button class='btn btn-link' type='button' value='set_def'>设置默认</button>";
              def_panel.find('button').parent().append(append_str);
          }
          var panel = $(this).parents('div.panel');
          panel.addClass('panel-primary').removeClass('panel-default');
          var str = panel.find('h4.panel-title a').html()+"<span class='fr badge'>默认地址</span>";
          panel.find('h4.panel-title a').html(str);
          $(this).remove();
      }else if(value == "del_add") {
          var obj = $(this).parents('.panel-group');
          swal({
              title:'淘书斋提醒',
              text:'确定删除本条收货地址么？',
              type:'warning',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
          }).then(function (isconfirm) {
              if(isconfirm == true){
                  swal('淘书斋提醒','删除成功','success');
                  obj.remove();
                  address_refresh();
              }else if(isconfirm == false){
                  swal('淘书斋提醒','删除失败','error');
              }
          });
      }
   });

   /*添加收货地址 btn click*/
   $("#add_ok").click(event,function () {
       //得到地址
       var localaddress = $("#province2").val() +"&nbsp;"+ $("#city2").val() +"&nbsp;"+ $("#district2").val()
           +"&nbsp;"+$(".add-more input[type='text']:eq(1)").val();
       var localusername = $(".add-more input[type=text]:eq(0)").val();
       var localusertel =$(".add-more input[type='tel']").val();
       var add_list = $("#basic_info_2").find('div.list-group div.panel-group');
       var local_add_index =0;
       if(add_list.length ==0){
           local_add_index =1;
       }else{
            local_add_index = add_list.length+1;
       }
       var str =
           "<div class='panel-group' id='add"+local_add_index+"'>" +
           "    <div class='panel panel-default'>" +
           "        <div class='panel-heading'>" +
           "            <h4 class='panel-title'>" +
           "                <a data-toggle='collapse' data-parent='#add"+local_add_index+"' href='#addr"+local_add_index+"1'>地址"+local_add_index+":"+localaddress.substring(0,20)+"...</a>"+
           "            </h4>" +
           "        </div>" +
           "        <div id='addr"+local_add_index+"1' class='panel-collapse collapse in'>" +
           "            <div class='panel-body'>" +
           "                <div class='col-md-10'>" +
           "                    <div class='col-md-6'>   " +
           "                        <strong class='fl'>收件人姓名:&nbsp;&nbsp;</strong>" +
           "                        <h4 class='fl list-group-item-heading'>"+localusername+"</h4> " +
           "                    </div>" +
           "                    <div class='col-md-6'>   " +
           "                        <strong class='fl'>联系电话:&nbsp;&nbsp;</strong>" +
           "                        <h4 class='fl list-group-item-heading'>"+localusertel+"</h4> " +
           "                    </div>" +
           "                    <div class='col-md-12'>   " +
           "                        <strong class='fl'>详细地址:&nbsp;&nbsp;</strong>" +
           "                        <h4 class='fl list-group-item-heading'>"+localaddress+"</h4> " +
           "                    </div>" +
           "                    <div class='col-md-12'>   " +
           "                        <strong class='fl'>邮政编码:&nbsp;&nbsp;</strong>" +
           "                        <h4 class='fl list-group-item-heading' title='邮政编码默认为000000'>4000000</h4> " +
           "                    </div>" +
           "                </div> " +
           "                <div class='col-md-2'> " +
           "                    <button type='button' class='btn btn-link' value='edit_add'>修改地址</button>" +
           "                    <button type='button' class='btn btn-link' value='del_add'>删除地址</button> " +
           "                    <button type='button' class='btn btn-link' value='set_def'>设置默认</button>  " +
           "                </div> " +
           "            </div>" +
           "        </div>" +
           "    </div>" +
           "</div>";
       $("#address_add_modal").modal('hide');//隐藏
       $("#basic_info_2").find('div.list-group').append(str);//添加地址
       swal('添加地址','成功','success');
       $("#basic_info_2").find('div.list-group h3').remove();
       $("#basic_info_2").find('div.list-group br').remove();
   });


    // swal('Oops...', 'Something went wrong!', 'success');
});
