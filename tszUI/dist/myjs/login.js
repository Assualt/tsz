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
    var basic_info_2 =$("#basic_info_2");
    var address_list =basic_info_2.find('div.panel-group');
    var length =address_list.length;
    if(length===0){
        basic_info_2.find('div.list-group').append('<h3 align="center" style="opacity: 0.7;">没有收货地址请添加</h3><br>');
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
function time_toString() {
    var Mydate = new Date();
    var year = Mydate.getFullYear();
    var month = Mydate.getMonth()+1;
    var date = Mydate.getDate();
    var hour =Mydate.getHours();
    var min = Mydate.getMinutes();
    var sec = Mydate.getSeconds();
    var time = "当前时间:"+year+"/"+month+"/"+date+"  "+hour+":"+min+":"+sec;
    $("#book_sale_history").find('div.container-fluid legend label').html(time);
}
function Psw_Strength_Check(psw_new) {
    /*
    *密码强度:
    * 全数字 :1
    * 全字母 :a-z A-Z  2
    * 大小写混:4
    * 特殊字符:8
    * 0-4 弱
    * 4-8 中
    * 8-12 强
    */
    var str_num = psw_new.length;
    var Num_char_num = (psw_new.match(/[0-9]/ig)==null )? 0 :(psw_new.match(/[0-9]/ig)).length ;
    var Small_char_num = (psw_new.match(/[a-z]/g)==null) ? 0 :(psw_new.match(/[a-z]/g)).length;
    var Big_char_num = (psw_new.match(/[A-Z]/g)==null) ? 0: (psw_new.match(/[A-Z]/g)).length;
    var Esp_char_num =psw_new.length -Num_char_num-Small_char_num-Big_char_num;
    var strength =0;
    if(str_num===Num_char_num){//全数字
        strength+=1;
    }else if(str_num===Big_char_num || str_num===Small_char_num){//全字母 全大/小写
        strength+=2;
    }else if((str_num===Big_char_num+Small_char_num && Big_char_num*Small_char_num>0)||
             (str_num===Big_char_num+Num_char_num && Big_char_num*Num_char_num>0)||
             (str_num===Small_char_num+ Num_char_num && Small_char_num*Num_char_num>0)){
        //为大写混合 或者大/小写字母和数字混合
        strength+=4;
    }else if((str_num===Num_char_num+Big_char_num+ Small_char_num) && (Num_char_num * Small_char_num * Big_char_num>0)){//大小写和字母混合
        var num_rate =Num_char_num/parseFloat(str_num);
        var big_rate =Big_char_num/parseFloat(str_num);
        var small_rate =Small_char_num/parseFloat(str_num);
        var abs =Math.abs(num_rate-small_rate)+Math.abs(big_rate-num_rate)+Math.abs(small_rate-big_rate);
        if(abs>=0 && abs <=0.1){//三者出现频率相当
            strength+=10;
        }else if(abs>0.1&&abs<=0.3){
            strength+=9;
        }else if(abs>0.3 && abs<=0.5){//三
            strength+=8;
        }else{//
            strength+=7;
        }
    }else if(Esp_char_num>0){
        strength=4;
        var rest_num =str_num-Esp_char_num;
        if(rest_num===Big_char_num||rest_num===Small_char_num||rest_num===Num_char_num){//有特殊字符和 大/小写/数字其一组合
            strength+=2;
        }else if((rest_num===Big_char_num+Num_char_num && Big_char_num* Num_char_num>0)||
                 (rest_num===Big_char_num+Small_char_num && Big_char_num* Small_char_num>0)||
                 (rest_num===Num_char_num+Small_char_num && Num_char_num* Small_char_num>0)){
            //有特殊字符和 大/小写/数字其二组合
            strength+=4;
        }else if(rest_num===Big_char_num+Num_char_num+Small_char_num &&Big_char_num*Small_char_num* Num_char_num > 0 ){
            strength+=6;
        }
    }
    return strength;
}
function Set_psw_strength(val) {
    var obj1=$("#psw_strength_check");
    var obj;
    if(val >=0 &&  val <4){
        obj = obj1.find('div:first-child');
        obj.css('background','rgba(255,0,0,0.7)');
        obj1.find('div').not(obj).css('background','white');
    }else if(val>=4 && val<8){
        obj = obj1.find('div:nth-child(2)');
        obj.css('background','rgba(255,128,0,0.7)');
        obj1.find('div').not(obj).css('background','white');
    }else if(val>=8){
        obj = obj1.find('div:last-child');
        obj.css('background','rgba(0,128,0,0.7)');
        obj1.find('div').not(obj).css('background','white');
    }
}
function RandNum(min,max) {
    return  Math.floor(Math.random()*(max-min)+min);
}
function Rand_rgb(min,max) {
    var r =RandNum(min,max);
    var g =RandNum(min,max);
    var b =RandNum(min,max);
    return "rgb("+r+","+g+","+b+")";
}
function Draw_yzm_pic(str) {
    var i;
    var canvas =$(".yzm")[0];
    var width =canvas.width;
    var height =canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.textBaseline ='bottom';
    /**绘制背景色**/
    ctx.fillStyle = Rand_rgb(180,240);
    ctx.fillRect(0,0,width,height);
    /**绘制文字**/
    for(i=0;i<4;i++){
        var txt =str[i];
        ctx.fillStyle = Rand_rgb(50,160);//随机生成字体颜色
        ctx.font = RandNum(70,100)+'px SimHei'; //随机生成字体大小
        var x = (i+1)*50;
        var y = RandNum(60,120);
        var deg = RandNum(-45,45);
        ctx.translate(x,y);
        ctx.rotate(deg*Math.PI/180);
        ctx.fillText(txt, 0,0);
        //恢复坐标原点和旋转角度
        ctx.rotate(-deg*Math.PI/180);
        ctx.translate(-x,-y);
    }
    /**绘制干扰线**/
    for(i=0; i<8; i++){
        ctx.strokeStyle = Rand_rgb(40,180);
        ctx.beginPath();
        ctx.moveTo( RandNum(0,width), RandNum(0,height) );
        ctx.lineTo( RandNum(0,width), RandNum(0,height) );
        ctx.stroke();
    }
    /**绘制干扰点**/
    for(i=0; i<100; i++){
        ctx.fillStyle = Rand_rgb(0,255);
        ctx.beginPath();
        ctx.arc(RandNum(0,width),RandNum(0,height), 1, 0, 2*Math.PI);
        ctx.fill();
    }
}
function LoginIN() {
    var login = $("#login");
    var str = login.html();

    //登录 flag 标志位
    var flag = true;
    //登录 flag 标志位
    sessionStorage['Login_ok']='true';
    /*
    *flag 为标志位
    * 后台判断登录与否
    **/
    var idList=['basic_info','book_management','book_sale_history','book_bought_history','login_history','account_evaluate','book_else'];
    login.empty().append('<h1 align="center">登录中...</h1>' +
        '<p align="center"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></p>');
    setTimeout(function () {
        if(flag===true){
            var list = $(".main_head ul li:not(:first-child)");
            $.each(list,function (info) {
                $(this).removeClass('disabled');
                $(this).find('a').attr('href','#'+idList[info]);
            });
            $("#login_btn").html('我').next('ul').removeClass('fade');
            $("#login").empty().append('<h1 align="center">登录成功</h1>');
            $(".main_head ul li:nth-child(2)").addClass('active');
            $("#basic_info").addClass('in active').removeClass('fade');
            login.addClass('fade').removeClass('in active');
            $(".main_head ul li:first-child").removeClass('active').addClass('disabled').find('a').attr('href','#');
        }else if(flag===false){
            $("#login").empty().append('<h1 align="center">登录失败</h1>' +
                '<hr>' +
                '<p align="center">正在返回登录界面<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></p>');
            setTimeout(function () {
                $("#login").empty().append(str);
            },2000);
        }
    },2000);

    var items = $(".more_list").find('li:not(:last-child)');

    $.each(items,function (info) {
        if(info!=items.length) {
            $(this).find('a').attr('href', '#' + idList[info]);
        }
    });
    $(".more_list").find('li:first-child').css({
        'background-color':'rgb(245,245,245)'
    });
}
function Exit() {
    var flag = confirm('确认退出登录吗？');
    if(flag === true) {
        var list = $(".main_head").find(" ul li:not(:first-child)");
        $.each(list, function () {
            $(this).addClass('disabled').removeClass('active');
            $(this).find('a').attr('href', '#');
        });
        $(".main_head ").find("ul li:first-child").removeClass('disabled').addClass('active');
        /*header login state*/

        /*我按钮变成登录字样 然后去除下列ul*/
        var login_btn = $("#login_btn");
        login_btn.html('登录');
        login_btn.next('ul').addClass('fade');
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
        var all_div = $(".main_body").find('div.tab-pane');
        $.each(all_div, function (info) {
            if (info === 0) {
                $(this).addClass('in active').removeClass('fade');
            } else {
                $(this).addClass('fade').removeClass('in active');
            }
        });
        var more_list = $(".more_list").find('li:not(:last-child)');
        $.each(more_list, function () {
            $(this).find('a').attr('href', '');
            $(this).css('background', 'white');
        });
    }
}

$(document).ready(function () {

    Draw_yzm_pic("1234");
    $(".yzm").click(function () {
        var str = 'ABCEFGHJKLMNPQRSTWXY1234567890abcdefghijklmnopqrstuvwxyz';
        var txt="";
        for(var i=0;i<4;i++)
             txt +=str[RandNum(0,str.length)];
        Draw_yzm_pic(txt);

    });

    $("#yzm").on('input propertychange',function () {
       var val = $(this).val().trim();
       $(this).val(val);
       if(val==="1234"){
           $(this).next('i').show();
       }else{
           $(this).next('i').hide();
       }

    });

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
        var school =$("#school");
        $.each(window.area_university,function (info,data) {
           if(data.city===pro){
               var str ="";
               $.each(data.university,function (info,data) {
                   if(info>=1) {
                       str += "<option value='" + data.name + "'>" + data.name + "</option>";
                   }
               });
               school.empty().append(str);
           }else if(pro ==="选择省"){
               school.empty().append('<option value="请选择学校">请选择学校</option>');
               var input_university = $("input[name='myuniversity']");
               input_university.val('');
           }
        });
    });
    $("#school").change(function () {
        var pro =$("#province").val();
        var input_university = $("input[name='myuniversity']");
        if(pro ==="重庆" || pro ==="天津" || pro ==="北京" ||pro ==="上海"){
            pro+="市";
        }else if(pro==="广西"){
            pro+="壮族自治区";
        }else if(pro==="新疆"){
            pro+="维吾尔自治区";
        }else if(pro==="宁夏"){
            pro+="回族自治区";
        }else if(pro==="西藏"){
            pro+="藏族自治区";
        }else{
            pro+="省";
        }
        input_university.val(pro+" "+$(this).val());
    });

    $(".a_school").click(function () {
        $(".show_school").show();
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
                    $(".show_school_body_3").append("<p class='fl'><a href='javascript:void(0);' onclick='school_clicked(this)' name='"+content.name+"'>"+content.name+"</a></p>")
                });
            }
        });
    });

    /*#basic_info_1_btn 3个button*/
    $("#basic_info_1_btn").find('button').click(function () {
        var value =$(this).html();
        var input_all = $(this).parent().prevAll('.form-group:not(:first-child)').find('input');
        switch (value){
            case "修改资料":
                input_all.attr('disabled',false);
                $("#province").attr('disabled',false);
                $("#school").attr('disabled',false);
                $("textArea[name='des']").attr('disabled',false);
                $(this).nextAll('button').attr('disabled',false);
                $(this).parents('.col-md-9').find('.form-group:not(:last-child) div input').attr('disabled',false);
                $(this).parents('.col-md-9').find('.form-group:nth-child(5) div div select').attr('disabled',false);
                $(this).next('button').next('button').attr('disabled',true);
                break;
            case "放弃修改":
                input_all.attr('disabled',true);
                $("#province,#school").attr('disabled',true);
                $("textArea").attr('disabled',true);
                $(this).attr('disabled',true);
                $(this).next('button').attr('disabled',true);
                break;
            case "提交":
                break;
            default:
                break;
        }
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
        Exit();
    });
    /*判断登录与否*/
    $("input:submit[value='登录']").click(function () {
       LoginIN();
    });
    /*设置默认地址*/
    $("#basic_info_2").on("click",'button',function () {
       var value =$(this).val();
      if(value === "edit_add"){
          swal("edit_add clicked");
      }else if(value === "set_def"){
          var def_panel = $(this).parents('div.list-group').find('div.panel.panel-primary');
          if(def_panel.length===1){
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
      }else if(value==="del_add") {
          var obj = $(this).parents('.panel-group');
          swal({
              title:'淘书斋提醒',
              text:'确定删除本条收货地址么？',
              type:'warning',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
          }).then(function (isconfirm) {
              if(isconfirm===true){
                  swal('淘书斋提醒','删除成功','success');
                  obj.remove();
                  address_refresh();
              }else if(isconfirm===false){
                  swal('淘书斋提醒','删除失败','error');
              }
          });
      }
   });
    /*添加收货地址 btn click*/
    $("#add_ok").click(function () {
       //得到地址
        var province2= $("#province2");
        var city2=$("#city2");
        var district2=$("#district2");
        var add_more=$(".add-more");
        var basic_info_2=$("#basic_info_2");
        var localaddress = province2.val() +"&nbsp;"+ city2.val() +"&nbsp;"+ district2.val()
           +"&nbsp;"+ add_more.find("input[type='text']:eq(1)").val();
        var localusername =add_more.find("input[type=text]:eq(0)").val();
        var localusertel =add_more.find("input[type='tel']").val();
        var add_list = basic_info_2.find('div.list-group div.panel-group');
        var local_add_index =0;
        if(add_list.length ===0){
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
        basic_info_2.find('div.list-group').append(str);//添加地址
        swal('添加地址','成功','success');
        basic_info_2.find('div.list-group h3').remove();
        basic_info_2.find('div.list-group br').remove();
   });


    // swal('Oops...', 'Something went wrong!', 'success');//echarts 绘图
    $.getJSON(window.JSONPATH+"book_his_chart.json",function (content) {
        var sale_his_line = echarts.init($("#sale_his_line")[0]);
        var sale_his_bar =echarts.init($("#sale_his_bar")[0]);
        var sale_his_pie =echarts.init($("#sale_his_pie")[0]);
        $.each(content,function (info,psr) {
            if(psr.name === "1"){
                var data = psr.charts;
                $.each(data,function (info,eachType) {
                    if(eachType.types==="line"){
                        sale_his_line.setOption(eachType.options);
                    }
                    if(eachType.types==="bar"){
                        sale_his_bar.setOption(eachType.options);
                    }
                    if(eachType.types==="pie"){
                        sale_his_pie.setOption(eachType.options);
                    }
                });
            }
        });
    });

    window.setInterval(time_toString,1000);

    /*显示历史售卖条数选择*/
    $("#book_sale_history_time_list").click(function () {
       alert($(this).find('option:selected').text());
    });


    $("#psw_again").on('input propertychange',function () {
       var psw_new = $("#psw_new").val().trim();
       if(psw_new===""){
           $(this).next('a').hide();
           return false;
       }else{
           var psw_again =$(this).val().trim();
           $(this).val(psw_again);
           if(psw_again===""){
               $(this).next('a').hide();
           }else{
               $(this).next('a').show();
               if (psw_again === psw_new) {
                   $(this).next('a').removeClass('fa-close').addClass('fa-check').css({
                       color: "green"
                   });
               } else {
                   $(this).next('a').removeClass('fa-check').addClass('fa-close').css({
                       color: "red"
                   });
               }
           }
       }
       return false;
    }).next('a.fa-close').click(function () {
       $(this).val("");
       $(this).hide();
       return false;
    });

    $("#psw_new").on('input propertychange',function () {
        var psw_new = $(this).val();
        var psw_strength_check =$("#psw_strength_check");
        $(this).val(psw_new.trim());
        if(psw_new.length<6 && psw_new.length>0){
            psw_strength_check.html('当前密码太弱');
        }else if(psw_new.length>18){
            psw_strength_check.html('当前密码过长操出限制');
        }else{
            var strength = Psw_Strength_Check(psw_new);
            var str =
                '<div class="col-md-4">弱</div>'+
                '<div class="col-md-4">中</div>'+
                '<div class="col-md-4">强</div>';
            psw_strength_check.empty().html(str);
            Set_psw_strength(strength);
        }
    }).next('a').click(function () {    /*密码可显示*/
        var type1 = $(this).prev('input').attr('type');
        var type = (type1==="password") ? "text":"password";
        $(this).prev('input').attr('type',type);
        var flag = $(this).hasClass('fa-eye');
        if(flag ===true) {
            $(this).removeClass('fa-eye').addClass('fa-eye-slash').css({
                color: "black"
            });
        }
        else {
            $(this).addClass('fa-eye').removeClass('fa-eye-slash').css({
                color: "#aaa"
            });
        }
    });

    //more_list 功能点击事件
    $(".more_list").find('li').click(function () {
        if($(this).attr('value') === "8"){//Exit
            Exit();
        }else{
            $(this).css('background-color','rgb(245,245,245)');
            $(".more_list").find('li').not(this).css('background-color','white');

            /*跳转到相应界面*/
            var id_value = parseInt($(this).attr('value'));//获取序号
            var tabs_link = $("div.main_head").find('ul li');//link
            var tabs_body = $("div.main_body").find('.tab-pane');//body
            var id ;
            $.each(tabs_link,function (info) {
               if(id_value === info ){
                   id = $(this).find('a').attr('href');
                   id = id.substring(1,id.length);
                   $(this).addClass('active');
               }else{
                   $(this).removeClass('active');
               }
            });
            $.each(tabs_body,function () {
                if($(this).attr('id') === id){
                    $(this).removeClass('fade').addClass('in active');
                }else{
                    $(this).removeClass('in active').addClass('fade');
                }
            });
        }
    });

    //main_head 点击事件
    $(".main_head").find('ul li a').click(function () {
       var id_sel = $(this).attr('href');
       var id_tables = $(".more_list").find('li');
       $.each(id_tables,function () {
          if($(this).find('a').attr('href') === id_sel){
              $(this).css('background-color','rgb(245,245,245)');
          }else{
              $(this).css('background-color','white');
          }
       });
    });
});
