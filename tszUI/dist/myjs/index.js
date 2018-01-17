/**
 * Created by T_T on 2017/11/06.
 **/
/*slide left or right*/
function slide(a) {
    var path = $("#slide_img")[0].src;
    var index = $("#slide_img").attr('value');
    if (a === "right") {//right
        if (index === '2') {
            path = path.substring(0, path.indexOf('_') + 1) + '0' + ".jpg";
            index = 0;
        }
        else {
            index++;
            path = path.substring(0, path.indexOf('_') + 1) + index + ".jpg";
        }
    }else if(a==="left")//left
    {
        if(index === '0') {
            path = path.substring(0,path.indexOf('_')+1)+'2'+".jpg";
            index = 2;
        }
        else {
            path = path.substring(0,path.indexOf('_')+1)+--index+".jpg";
        }
    }else{
        path = path.substring(0,path.indexOf('_')+1)+a+".jpg";
    }
    $("#slide_img").attr('src',path);
    $("#slide_img").attr('value',index);
    if(index===0) {
        $(".slider_sel_btn span:not(0)").css("opacity",1);
        $(".slider_sel_btn span:eq(0)").css("opacity",0.4);
    }else if(index===1){
        $(".slider_sel_btn span:not(1)").css("opacity",1);
        $(".slider_sel_btn span:eq(1)").css("opacity",0.4);
    }else if(index===2){
        $(".slider_sel_btn span:not(2)").css("opacity",1);
        $(".slider_sel_btn span:eq(2)").css("opacity",0.4);
    }

}
/*school clicked*/
function school_clicked(a) {
    var obj= $(a);
    $(".a_school").text('[  '+obj.attr('name') +'  ]');
    $(".show_school").hide(100);
}
/*define the json path*/


$(document).ready(function () {
    window.JSONPATH="dist/res/json/";
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
    /*define the json for hot-topic*/
    $.getJSON(window.JSONPATH+"hot-topic.json",function (content) {
       window.hottopic=content;
       $.each(content,function (info,data) {
          if(data.name === "hot-topic"){/*define the json for hot-topic-words*/
              $.each(data.value,function (info,cont) {
                 $(".hot-topic-body-left").append("<a href='#' class='fl'>"+cont+"</a>");
              });
          }
          if(data.name === "hot-bookstore"){/*define the json for hot-bookstore*/
              // $("#hot-bookstore").empty();
              $.each(data.value,function (info,cont) {
                  var string =
                      "<li>" +
                      "  <span>" +
                      "     <a href='javascript:void(0)' class='fl'>" +
                      "         <img src="+ cont.bookstore_img_url+" alt='图片加载错误' width='32' height='32'>" +
                      "     </a>" +
                      "     <p class='fl hvr-grow'>"+cont.bookstore_name+"&nbsp;&nbsp;(&nbsp;"+cont.bookstore_id+"&nbsp;)"+"</p>" +
                      "  </span>" +
                      "</li>";
                  // alert(string);
                  $("#hot-bookstore").append(string);
              });
          }
          if(data.name ==="hot-person"){/*define the json for hot-person*/
              Pcolor=['rgb(245,69,69)','rgb(255,133,71)','rgb(255,172,56)'];
              $(".hot-person-list").empty();
              $.each(data.value,function (info,cont) {
                  var a=parseInt(info)+1;
                  var string =
                      "<li>" +
                      "  <span>" +
                      "      <a href='javascript:void(0)' class='fl'>" +
                      "          <img src='" + cont.img_url + "' alt='图片加载错误' width='32' height='32'>" +
                      "      </a>" +
                      "      <p class='fl hvr-grow' href='javascript:void(0)'> " + cont.name +
                      "      </p>" +
                      "  </span>";
                  if(info<3) {
                      string += "<span class='badge fr' style='background:" + Pcolor[info] + ";color: #bbbbbb gb;margin-right: 10px;'>&nbsp;"+cont.count+"&nbsp;</span></li>";
                  }
                  else
                      string+="<span class='badge fr' style='background:rgb(142,185,245);margin-right: 10px;'>&nbsp;"+cont.count+"&nbsp;</span></li>";
                 // alert(string);
                  $(".hot-person-list").append(string);
              });
          }
          if(data.name ==="most-focus"){/*define the json for most -focus*/
              $(".most-focus-list").empty();
              $.each(data.value,function (info,cont) {
                 var string=
                     "<li class='hvr-grow'>" +
                     "  <a href='"+cont.img_url+"'>" +
                     "      <img src='"+cont.img_url+"' alt='"+cont.name+cont.name_id+"' width='40' height='40'>"+
                     "  </a>" +
                     "</li>";
                 // alert(string);
                  $(".most-focus-list").append(string);
              });
          }
          if(data.name ==="new-register"){
              $(".new-register-list").empty();
              $.each(data.value,function (info,cont) {
                  var string =
                      "<li class='hvr-grow'>" +
                      "  <a href='" + cont.img_url + "'>" +
                      "      <img src='" + cont.img_url + "' alt='" + cont.name + cont.name_id + "' width='40' height='40'>" +
                      "  </a>" +
                      "</li>";
                  // alert(string);
                  $(".new-register-list").append(string);
              });
          }
       });
    });
    /*define the json for recommended book */
    $.getJSON(window.JSONPATH+"book-recommend.json",function (content) {
       window.book_recommend = content;
       $(".book-recommend-body").empty();
       $.each(content,function (info ,data) {
          var string=
              "<div class='book-info fl'>" +
              "     <a href='javascript:void(0)' >"+
              "         <img src="+data.img_url+" alt='"+data.book_name+"&"+data.book_author+"&"+data.book_seller+ "' width='90' height='120'  class='hvr-grow-shadow'>"+
              "     </a>"+
              "     <div>" +
              "         <h6>"+data.book_name +"</h6>"+
              "         <p class='fl now—price'>" +
              "             <i class='fa fa-yen'>" + "</i>"+data.price_now+
              "         </p>"+"" +
              "         <p class='fr last-price'>" +
              "             <del class='fa fa-yen'>" +data.price_before+ "</del>"+
              "         </p>"+
              "     </div>"+
              "</div>"
           // alert(string);
           $(".book-recommend-body").append(string);
       });
    });
    /*define the json for discount book*/
    $.getJSON(window.JSONPATH+"book-discount.json",function (content) {
        window.book_discout=content;
        $(".book-discount-body-list").empty();
        var string ="";
        $.each(content,function (info,data) {
            string +=
                "<li class='book-info fl'>" +
                "     <a href='javascript:void(0)' >"+
                "         <img src="+data.img_url+" alt='"+data.book_name+"&"+data.book_author+"&"+data.book_seller+ "' width='90' height='120'  class='hvr-grow-shadow'>"+
                "     </a>"+
                "     <div>" +
                "         <h6>"+data.book_name +"</h6>"+
                "         <p class='fl now—price'>" +
                "             <i class='fa fa-yen'>" + "</i>"+data.price_now+
                "         </p>"+"" +
                "         <p class='fr last-price'>" +
                "             <s class='fa fa-yen'>" +data.price_before+ "</s>"+
                "         </p>"+
                "     </div>"+
                "</li>";
        });
        $(".book-discount-body-list").append(string);
    });
    /*define the json for new comment book*/
    $.getJSON(window.JSONPATH+"book-new-comment.json",function (content) {
       window.book_new_comment = content;
       $(".book-new-comment-body-list").empty();
       var string ="";
       $.each(content,function (info,data) {
           string +=
               "<li class='book-info2 fl'>" +
               "     <a href='javascript:void(0)' >"+
               "         <img src="+data.img_url+" alt='"+data.book_name+"&"+data.book_author+"&"+data.book_seller+ "' width='90' height='120'  class='hvr-grow-shadow'>"+
               "     </a>"+
               "     <div>" +
               "         <h6>"+data.book_name +"</h6>"+
               "         <p class='fl now—price'>" +
               "             <i class='fa fa-yen'>" + "</i>"+data.price_now+
               "         </p>"+"" +
               "         <p class='fr last-price'>" +
               "             <s class='fa fa-yen'>" +data.price_before+ "</s>"+
               "         </p>"+
               "     </div>"+
               "</li>";
       });
       $(".book-new-comment-body-list").append(string);
    });

    /*define the json for new comment book*/
    $.getJSON(window.JSONPATH+"book-popular.json",function (content) {
        window.book_new_comment = content;
        $(".book-popular-body-list").empty();
        var string ="";
        $.each(content,function (info,data) {
            string +=
                "<li class='book-info3 fl'>" +
                "     <a href='javascript:void(0)' >"+
                "         <img src="+data.img_url+" alt='"+data.book_name+"&"+data.book_author+"&"+data.book_seller+ "' width='90' height='120'  class='hvr-grow-shadow'>"+
                "     </a>"+
                "     <div>" +
                "         <h6>"+data.book_name +"</h6>"+
                "         <p class='fl now—price'>" +
                "             <i class='fa fa-yen'>" + "</i>"+data.price_now+
                "         </p>"+"" +
                "         <p class='fr last-price'>" +
                "             <s class='fa fa-yen'>" +data.price_before+ "</s>"+
                "         </p>"+
                "     </div>"+
                "</li>";
        });
        $(".book-popular-body-list").append(string);
    });

    /*hover click*/
    $(".slider_sel_btn span").on("click mouseover",function () {
        $(this).css("opacity",0.4);
        $(".slider_sel_btn span").not(this).css("opacity",1);
        slide($(this).attr("value"));
    });
    /*show the school*/
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
    /*slide btn_left */
    $("#btn_left").click(function () {//left
        slide("left");
    });
    /*slide btn_right*/
    $("#btn_right").click(function () {//right
       slide("right")
    });
    /*time task*/
    window.setInterval ("slide('right')", 5000 );
    /*click to join us*/
    $("#joinus").click(function () {
        window.location.href="sites/login.html";
    });

    $(".show_school_body_3 p").click(function () {
       alert($(this).attr('name'));
    });

    $(".header_login li:first-child a").click(function () {
        var storage =  window.localStorage;
        storage['username']= '侯鑫';
    });

    /*more books btn click*/
    $(".book-recommend-head a").click(function () {
       alert(1);

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

});
