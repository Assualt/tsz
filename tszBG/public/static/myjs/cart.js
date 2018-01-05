
/*
* create 2018.1.3 by T_T
*
*/
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

$(document).ready(function () {
    window.JSONPATH="../dist/res/json/";

    $.getJSON(window.JSONPATH+'cart.json',function (content) {
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
                                "               <img src='"+good.book_img+"' alt='未能正确加载图片' width='70' height='90'>" +
                                "           </a>" +
                                "       </div>" +
                                "       <div class='fl body_info_des'>" +
                                "           <div class='body_info_des_top'>" +
                                "               <a href='#' class='body_info_des_top_fnt'>" +good.book_ad+"</a>" +
                                "           </div>" +
                                "           <div class='body_info_des_top'>" +
                                "               <a href='#' class='fa fa-credit-card fa-lg'></a>" +
                                "               <a href='#' class='fa fa-cc-discover fa-lg'></a>" +
                                "               <a href='#' class='fa fa-cc-diners-club fa-lg'></a>" +
                                "               <a href='#' class='fa fa-cc-visa fa-lg'></a>" +
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
                                        "       <input type='text' value='"+good_des_item.num+"' class='fl' name='goods_num'>" +
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
        if(num === 0) {
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
        var allpri = goods_num * uprice;
        $(this).parents('.body_num').next('.body_all_price').find('p').html(allpri);
        Set_All_Num_Price(true);
    });

    /*body_op*/
    $(".shop_list").on("click",".body_op a:last-child",function () {

        var confirm = prompt("确认删除此本书？ Yes !  No！");
        if(confirm === 'yes'){
            $(this).parents('.shop_list_body').remove();
            Set_All_Num_Price(true);
        }

    });
    /*delete*/
    $("#delete").click(function () {
       var all= $("input:checkbox[value='all_sel']").is(":checked");
       // alert(all);
       if(all == true){
            $(".shop_list").remove();
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
       // var delete_books =$("input:checkbox[value='goods_item']");
       // $.each(delete_books,function () {
       //    if($(this).is(":checked") === true) {
       //        $(this).parents('.shop_list_body').remove();
       //    }
       // });

    });






});