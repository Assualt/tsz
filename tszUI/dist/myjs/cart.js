
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

    /*btn all select*/
    $("input:checkbox[value='all_sel']").click(function () {
        var flag=$(this).is(':checked');
        $("input:checkbox[value='all_sel']").prop("checked",flag);
        $("input:checkbox[value='shop_name'],input:checkbox[value='goods_item']").prop("checked",flag);
        Set_All_Num_Price(flag);
    });
    /*shop select*/
    $("input:checkbox[value='shop_name']").click(function () {
        var flag=$(this).is(":checked");
       $(this).parents('.shop_list_head').next('.shop_list_item').find('.shop_list_body .body_info input').prop('checked',flag);
        Set_All_Num_Price(true);
    });
    /*goods select*/
    $("input:checkbox[value='goods_item']").click(function () {
        var flag=$(this).is(":checked");
       $(this).parents(".shop_list_item").prev('.shop_list_head').find('input').prop('checked',flag);
        Set_All_Num_Price(true);
    });
    /*goods num */
    $("input:text[name='goods_num']").bind('input propertychange',function () {
        var uprice = parseFloat($(this).parents('.body_num').prev('.body_price').find('p strong').html());
        var num= parseInt($(this).val());
        if(num === 0) {
            alert('商品数量不能为0');
            $(this).prev('button').attr('disabled',true);
            $(this).val(1);
        }else if(num >20){
            alert('商品数量超过库存');
            $(this).next('button').attr('disabled',true);
            $(this).val(20);
        }else{
            $(this).prev('button').attr('disabled',false);
            $(this).next('button').attr('disabled',false);
        }

        var allpri= uprice* num;
        $(this).parents('.body_num').next('.body_all_price').find('p').html(allpri.toFixed(2));
        Set_All_Num_Price(true);
    });


    $("button[value='sub']").click(function () {
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
    $("button[value='plus']").click(function () {
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

    /*scroll*/
    $(".shop_list").bind('height',function () {

    });

    /*body_op*/
    $(".body_op a:last-child").click(function () {

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
           if($(this).is(":checked") === true)
               $(this).parents('li').remove();
       });
       // var delete_books =$("input:checkbox[value='goods_item']");
       // $.each(delete_books,function () {
       //    if($(this).is(":checked") === true) {
       //        $(this).parents('.shop_list_body').remove();
       //    }
       // });

    });

});