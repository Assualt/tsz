
/*
* create 2018.1.3 by T_T
*
*/

function Gen_goods_list() {
    var arry = $("input:checkbox[value='goods_item']:checked");
    $(".table tbody").empty();
    $.each(arry,function () {
        var book_name = $(this).nextAll('.body_info_img').find('a img').attr('title');
        var str = $(this).nextAll('.body_info_type').find('p:last-child').html();
        var book_author = str.substring(str.indexOf(';')+1,str.length);
        var book_price = $(this).parents('.body_info').nextAll('.body_price').find('p strong').html();
        var book_num = $(this).parents('.body_info').nextAll('.body_num').find('span input').val();
        var book_all_price = $(this).parents('.body_info').nextAll('.body_all_price').find('p ').html();
        var str =
            "<tr>" +
            "   <td>"+book_name+"</td>" +
            "   <td>"+book_author+"</td>" +
            "   <td>"+book_price+"</td>" +
            "   <td>"+book_num+"</td>" +
            "   <td>"+book_all_price+"</td>" +
            "</tr>";
        $(".table tbody").append(str);
        // alert(book_author +book_name + singer_price +num + all_price);
    });
    var total_price = $(".total p:eq(1)").html();
    var total_num = $(".all_total_right strong").html();

    var str =
        "<tr>" +
        "   <td> 总计 </td>" +
        "   <td> --- </td>" +
        "   <td> --- </td>" +
        "   <td>"+total_num+"</td>" +
        "   <td>"+total_price+"</td>" +
        "</tr>";
    $(".table tbody").append(str);

}
function Set_All_Num_Price(flag) {
    if(flag === true) {
        var arry = $("input:text[name='goods_num']");
        var All_num = parseInt(0);
        var All_price = parseFloat(0);
        $.each(arry, function () {
            if($(this).parents('.body_num').prevAll('.body_info').find('input').is(':checked') === true){
                All_num += parseInt($(this).val());
            }
        })
        $(".all_total_right strong").html("&nbsp;" + All_num + "&nbsp;");
        arry = $(".body_all_price p");
        $.each(arry, function () {
            // alert($(this).html());
            if($(this).parents('.body_all_price').prevAll('.body_info').find('input').is(':checked') === true){
                All_price += parseFloat($(this).html());
            }
        });
        $(".all_total_right p:last-child").html("&nbsp;" + All_price.toFixed(2));
        $(".total p:nth-child(2)").html(All_price.toFixed(2));
        // alert(All_num+"  "+All_price);
    }else{
        $(".all_total_right strong").html("&nbsp;" + 0 + "&nbsp;");
        $(".all_total_right p:last-child").html("&nbsp; 0.00  &nbsp;");
        $(".total p:nth-child(2)").html("0.00");
    }
    $("input:button[value='结算']").attr('disabled',!flag);
}
function Set_All_Goods_mum() {
    var goods_length = $(".body_info input:checkbox[value='goods_item']").length;
    $(".shop-header li:first-child a strong").html(goods_length);
    // alert($(".shop-header li:first-child a strong").html() + $(".shop-header li a strong").length);
    $(".shop-header li:eq(1) a strong").html(goods_length);
    $(".shop-header li:eq(2) a strong").html(goods_length);
}
function Set_Address(Address) {
   var str = $(".step-two ul li input:checked").next('p').html();
   var i = str.indexOf('<strong');
   str = Address + str.substring(i,str.length);
   $(".step-two ul li input:checked").next('p').html(str);

}

$(document).ready(function () {
    window.JSONPATH="../dist/res/json/";

    var name= window.localStorage.username;
    document.title = name+ '的购物车';
    $.getJSON(window.JSONPATH+'cart.json',function (content) {
        window.cartlist = content;
        $(".shop_list").empty();
        var append_str="";
        $.each(content,function (info,person_cart) {/*person cart*/
            if(person_cart.id =="1".trim()){/*verify the customer*/
                var person_goods = person_cart.goods;
                $.each(person_goods,function (info,book_store) {/*customer book store*/
                   append_str +=
                       "<li class='fl'>" +
                       "   <div class='shop_list_head fl'>" +
                       "   <input type='checkbox' class='fl' value='shop_name'>"+
                       "<p class='fl'>&nbsp;店铺&nbsp;"+book_store.goods_store_name +"</p>"+
                       "<a href='#' class='fl hvr-float-shadow'>" +
                       "    <img src='../dist/res/contact.jpeg' alt='' width='15' height='15'>" +
                       "</a>"+
                       "<div class='fl discount'>" +
                       "    <a href='#' >" +
                       "        &nbsp;&nbsp;&nbsp;优惠券&nbsp;" +
                       "        <i class=\"fa fa-angle-down\"></i>&nbsp;" +
                       "    </a>" +
                       "</div>" +
                       "</div>" +
                       "<ul class='shop_list_item fl'>";
                        var goods_info = book_store.goods_info;
                        $.each(goods_info,function (info,good) {
                            append_str+=
                                "<li class='shop_list_body fl'>" +
                                "   <div class='body_info fl'>" +
                                "       <input type='checkbox' value='goods_item' class='fl' style='width: 5%;'>" +
                                "       <div class='fl body_info_img'>" +
                                "           <a href='#' class='hvr-grow-shadow'>" +
                                "               <img src='"+good.book_img+"' alt='未能正确加载图片' width='70' height='90' title='"+good.book_name+"'>" +
                                "           </a>" +
                                "       </div>" +
                                "       <div class='fl body_info_des'>" +
                                "           <div class='body_info_des_top'>" +
                                "               <a href='#' class='body_info_des_top_fnt'>" +good.book_ad+"</a>" +
                                "           </div>" +
                                "           <div class='body_info_des_top'>" +
                                "               <a href='#' title='信用卡支付'>" +
                                "                   <img src='../dist/res/pay_icon/xcard.png' alt=''>" +
                                "               </a>" +
                                "               <a href='#' title='0首付，慢慢还，拥有所爱，无需等待！'>" +
                                "                   <img src='../dist/res/pay_icon/fenqi.png' alt=''>" +
                                "               </a>" +
                                "               <a href='#' title='消费者保障服务，卖家承诺商品如实描述'>" +
                                "                   <img src='../dist/res/pay_icon/Customer%20guarantee.png' alt=''>" +
                                "               </a>" +
                                "               <a href='#' title='订单险'>" +
                                "                    <img src='../dist/res/pay_icon/book%20guarantee.png' alt=''>" +
                                "               </a>" +
                                "               <a href='#' title='满足7天无理由退货申请的前提下，包邮商品需要买家承担退货邮费，非包邮商品需要买家承担发货和退货邮费。'>" +
                                "                   <img src='../dist/res/pay_icon/7day.jpg' alt=''>" +
                                "               </a>" +
                                "            </div>" +
                                "       </div>" +
                                "       <div class='fl body_info_type'>";
                                var good_des = good.book_des;
                                $.each(good_des,function (info,good_des_item) {
                                    var total_num = (parseInt(good_des_item.num) *parseFloat(good_des_item.dis_price)).toFixed(2);
                                    append_str+=
                                        "   <p>出版社&nbsp;"+good_des_item.publisher +"</p>"+
                                        "   <p>规格&nbsp;"+good_des_item.size+"</p>"+
                                        "   <p>版次&nbsp;"+good_des_item.edition+"</p>"+
                                        "   <p>作者&nbsp;"+good_des_item.author+"</p>"+
                                        "   </div>" +
                                        "</div>" +
                                        "<div class='body_else fl body_price'>" +
                                        "   <del><i class='fa fa-yen'></i>"+good_des_item.old_price+"</del>" +
                                        "   <br>" +
                                        "   <p class='fa fa-yen'><strong>"+good_des_item.dis_price+"</strong></p>" +
                                        "</div>" +
                                        "<div class='body_else fl body_num'>" +
                                        "   <span>" +
                                        "       <button type='button' class='fl' value='sub'>-</button>" +
                                        "       <input type='text' value='"+good_des_item.num+"' class='fl' name='goods_num' onkeyup=\"value=value.replace(/[^\\d]/g,'1') \" ng-pattern='/[^a-zA-Z]'>" +
                                        "       <button type='button' class='fl' value='plus'>+</button>" +
                                        "    </span>" +
                                        "</div>" +
                                        "<div class='body_else fl body_all_price'>" +
                                        "   <p class='fa fa-yen'>"+total_num +"</p>" +
                                        "</div>" +
                                        "<div class='body_else fl body_op'>" +
                                        "   <a href='#'>移入收藏夹</a><br>" +
                                        "   <a href='#'>删除</a>" +
                                        "</div>" +
                                        "</li>";


                                });
                        });
                        append_str+="</ul></li>";
                });
            }
        });
        // alert(append_str);
        $(".shop_list").append(append_str);
        Set_All_Goods_mum();
    });

    /*btn all select*/
    $("input:checkbox[value='all_sel']").on("click",function () {
        var flag=$(this).is(':checked');
        $("input:checkbox[value='all_sel']").prop("checked",flag);
        $("input:checkbox[value='shop_name'],input:checkbox[value='goods_item']").prop("checked",flag);
        Set_All_Num_Price(flag);
    });
    /*shop select*/
    $(".shop_list").on("click","input:checkbox[value='shop_name']",function () {
        var flag=$(this).is(":checked");
       $(this).parents('.shop_list_head').next('.shop_list_item').find('.shop_list_body .body_info input').prop('checked',flag);
        Set_All_Num_Price(true);
    });
    /*goods select*/
    $(".shop_list").on("click","input:checkbox[value='goods_item']",function () {
        var flag=$(this).is(":checked");
            $(this).parents(".shop_list_item").prev('.shop_list_head').find('input').prop('checked',flag);
        Set_All_Num_Price(true);
    });
    /*goods num */
    $(".shop_list").on("input propertychange","input:text[name='goods_num']",function () {
        var uprice = parseFloat($(this).parents('.body_num').prev('.body_price').find('p strong').html());
        var num= parseInt($(this).val());
        if(num === 0 || num === 1) {
            alert('商品数量不能为0');
            $(this).prev('button').attr('disabled',true);
            $(this).val(1);
            num=1;
        }else if(num >20){
            alert('商品数量超过库存');
            $(this).next('button').attr('disabled',true);
            $(this).val(20);
            num=20;
        }else{
            $(this).prev('button').attr('disabled',false);
            $(this).next('button').attr('disabled',false);
        }

        var allpri= uprice * num;
        $(this).parents('.body_num').next('.body_all_price').find('p').html(allpri.toFixed(2));
        Set_All_Num_Price(true);
    });

    $(".shop_list").on("click","button[value='sub']",function () {
       var goods_num= parseFloat($(this).next('input').val());
       $(this).nextAll('button').attr('disabled',false);
       if(goods_num === 1){
           alert('商品数量不能为0');
           $(this).attr('disabled',true);
           $(this).next('input').val(1);
           goods_num=1;
       }else if(goods_num > 1){
           goods_num--;
           $(this).next('input').val(goods_num);
       }
       // alert($(".body_price p").html());
       var uprice = parseFloat($(this).parents('.body_num').prev('.body_price').find('p strong').html());
       var allpri = goods_num * uprice;
       $(this).parents('.body_num').next('.body_all_price').find('p').html(allpri.toFixed(2));
       Set_All_Num_Price(true);

    });
    $(".shop_list").on("click","button[value='plus']",function () {
       var goods_num = parseFloat($(this).prev('input').val());
       $(this).prevAll('button').attr('disabled',false);
       if(goods_num > 20) {
           alert('商品数量超过库存');
           $(this).attr('disabled',true);
           $(this).prev('input').val(20)
           goods_num=20;
       }else{
           goods_num++;
           $(this).prev('input').val(goods_num);
       }
        var uprice = parseFloat($(this).parents('.body_num').prev('.body_price').find('p strong').html());
        var allpri = (goods_num * uprice).toFixed(2);
        $(this).parents('.body_num').next('.body_all_price').find('p').html(allpri);
        Set_All_Num_Price(true);
    });

    /*body_op*/
    $(".shop_list").on("click",".body_op a:last-child",function () {
        var flag = confirm("确认删除次本书");
        if(flag === true){
            $(this).parents('.shop_list_body').remove();
            Set_All_Num_Price(true);
            Set_All_Goods_mum();
        }
    });
    /*delete*/
    $("#delete").click(function () {
       var all= $("input:checkbox[value='all_sel']").is(":checked");
       // alert(all);
       if(all == true){
           if(confirm("确认删除所有图书？")===true) {
               $(".shop_list").remove();
           }
       }
       var delete_shop=$("input:checkbox[value='shop_name']");
       $.each(delete_shop,function () {
           if($(this).is(":checked") === true){
               var delete_goods = $(this).parent(".shop_list_head").next(".shop_list_item").find('.shop_list_body .body_info input');
               var flag = true;
               $.each(delete_goods,function () {
                  if($(this).is(":checked") === false)
                      flag = false;
               });
               if(flag == true)
                    $(this).parents('li').remove();
               else{
                   $.each(delete_goods,function () {
                       if($(this).is(":checked") === true) {
                           $(this).parents('.shop_list_body').remove();
                       }
                   });
               }
           }

       });
       Set_All_Goods_mum();
    });

    /*Address sel*/
    $(".step-two ul").on("click","li input",function () {
        var all_address = $(this).parents('li').siblings().find('p');
        var Sel_Address = $(this).next('p').html();
        var i = Sel_Address.indexOf("<a");
        if(Sel_Address.indexOf('<strong')===-1){
            Sel_Address = Sel_Address.substring(0,i) +"<strong style='color:#888888;'>默认地址</strong><a href='#' data-toggle='modal' data-target='#edit_add'>&nbsp;&nbsp;修改默认地址</a>";
            $(this).next('p').html(Sel_Address);
            $(this).parents('li').css('border','solid 1px red');
        }else{}
        $.each(all_address,function () {
            i= $(this).html().indexOf('<strong');
            if(i != -1){
               var html = $(this).html().substring(0,i)+ "<a href='#' >&nbsp;&nbsp;设置为默认地址</a>" ;
               $(this).html(html);

            }else{}
            $(this).parents('li').css("border","none");
        });
    });

    $(".step-two ul").on("click","li p a",function () {
        var checked = $(this).parents('li').find('input');
        $.each(checked,function () {
           if($(this).is(":checked") === true){//修改默认地址
           }else if($(this).is(":checked") === false){//设置为默认地址
               var html = $(this).next('p').html();
               var i = html.indexOf('<a');
               html = html.substring(0,i)+"<strong style='color:#888888;'>默认地址</strong><a href='javascript:void(0)' data-toggle='modal' data-target='#edit_add'>&nbsp;&nbsp;修改默认地址</a>";
               $(this).next('p').html(html);
               $(this).prop('checked',true);
               $(this).parents('li').css('border','solid 1px red');
               var all_address = $(this).parents('li').siblings().find('p').not(this);
               $.each(all_address,function () {
                   i= $(this).html().indexOf('<strong');
                   if(i != -1){
                       $(this).prev('input').prop('checked',false);
                       var html = $(this).html().substring(0,i)+ "<a href='javascript:void(0)'>&nbsp;&nbsp;设置为默认地址</a>" ;
                       $(this).html(html);
                   }else{}
                   $(this).parents('li').css("border","none");
               });

           }
        });

    });
    /*edit address ok btn*/
    $("#edit_address_ok").click(function () {

        $("#edit_add").modal('hide');
        var provice = $("#province2").val();
        var city = $("#city2").val();
        var district = $("#district2").val();
        var tel = $(".add-more input[type='tel']").val();
        var name = $(".add-more input[type=text]:eq(0)").val();
        var more = $(".add-more input[type='text']:eq(1)").val();
        var string = "&nbsp;"+provice +"&nbsp;"+city +"&nbsp;"+district+"&nbsp;"+ more+ "&nbsp;(&nbsp;"+name+"收&nbsp;)&nbsp;"+tel;
        Set_Address(string);
    });
    /*edit_address_cancel*/
    $("#edit_address_cancel").click(function () {
        $("#edit_add").modal('hide');
    });

    /*js btn*/
    $("input:button[value='结算']").click(function () {
        var append_str = "";
        $(".step-two ul").empty();
        $.each(window.cartlist,function (info,item) {//
            if(item.id === "1".trim()){//verify the customer
                var cart_add = item.address;
                $.each(cart_add,function (info,item) {//query add
                    if(item.add_default === true){
                        append_str +=
                            "<li>" +
                            "   <input type='radio' name='address' class='fl' checked>" +
                            "   <p>&nbsp;" +item.add_province+"&nbsp;"+item.add_district+"&nbsp;"+item.add_more_detail+"&nbsp;(&nbsp;"+item.add_contact_name+"收&nbsp;)"+item.add_contact_phone+"&nbsp;" +
                            "   <strong style='color:#888888;'>默认地址</strong>" +
                            "       <a href='javascript:void(0)' data-toggle='modal' data-target='#edit_add'>" +
                            "           &nbsp;&nbsp;修改默认地址" +
                            "       </a>"+
                            "   </p>" +
                            "</li>";
                    }
                    else{
                        append_str+=
                            "<li>" +
                            "   <input type='radio' name='address' class='fl'>" +
                            "   <p>&nbsp;" +item.add_province+"&nbsp;"+item.add_district+"&nbsp;"+item.add_more_detail+"&nbsp;(&nbsp;"+item.add_contact_name+"收&nbsp;)"+item.add_contact_phone+"&nbsp;" +
                            "       <a href='javascript:void(0)'>" +
                            "           &nbsp;&nbsp;设置为默认地址" +
                            "       </a>"+
                            "   </p>" +
                            "</li>";
                    }

                });
                // alert(append_str);
            }
        });
        Gen_goods_list();
        $(".step-two ul").append(append_str);
    });

    /*step_prev*/
    $("#step_prev").click(function () {
        var flag1=$(".step-one").css('display') == 'block';
        var flag2=$(".step-two").css('display') == 'block';
        var flag3=$(".step-three").css('display') =='block';
        // alert(flag1 +" "+flag2 +"  " +flag3);
        if(flag2 === true){
            $(".step-one").css('display','block');
            $(".step-two").css('display','none');
            $(".step-three").css('display','none');
            $(".modal-body-head p:last-child").remove();
            $("#step_prev").attr('disabled',true);
        }else if(flag3 === true){
            $(".step-one").css('display','none');
            $(".step-two").css('display','block');
            $(".step-three").css('display','none');
            $(".modal-body-head p:last-child").remove();
            $("#step_next").attr('disabled',false);
        }else{}
        $("#step_submit").attr('disabled',true);

    });
    $("#step_next").click(function () {
        var flag1=$(".step-one").css('display') == 'block';
        var flag2=$(".step-two").css('display') == 'block';
        var flag3=$(".step-three").css('display') =='block';
        // alert( flag3 + " "+ flag2 +" "+flag1);
        $("#step_prev").attr('disabled',false);
        if(flag1 === true){
            $(".step-one").css('display','none');
            $(".step-two").css('display','block');
            $(".step-three").css('display','none');
            var str = "<p class='fl'><a>&nbsp;STEP 2 &nbsp;</a><i class='fa fa-angle-right'></i></p>";
            $(".modal-body-head").append(str);
        }else if(flag2 === true){
            $(".step-one").css('display','none');
            $(".step-two").css('display','none');
            $(".step-three").css('display','block');
            var str = "<p class='fl'><a>&nbsp;STEP 3 &nbsp;</a></p>";
            $(".modal-body-head").append(str);
            $("#step_next").attr('disabled',true);
        }else{}

        $("#step_submit").attr('disabled',!$("#step_next").attr('disabled'));

    });
    $("#step_submit").click(function () {

    });


});