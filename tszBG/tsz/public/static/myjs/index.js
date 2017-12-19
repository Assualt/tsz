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
    }
    $("#slide_img").attr('src',path);
    $("#slide_img").attr('value',index);
}
/*school clicked*/
function school_clicked(a) {
    var obj= $(a);
    $(".a_school").text('[  '+obj.attr('name') +'  ]');
    $(".show_school").hide(100);
}
/*define the json path*/
window.JSONPATH="STATIC/res/json/";
$(document).ready(function () {
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
                      "     <p class='fl'>"+cont.bookstore_name+"("+cont.bookstore_id+")"+"</p>" +
                      "  </span>" +
                      "</li>";
                  // alert(string);
                  $("#hot-bookstore").append(string);
              });
          }
          if(data.name ==="hot-person"){/*define the json for hot-person*/
              Pcolor=['red','orange','yellow'];
              $(".hot-person-list").empty();
              $.each(data.value,function (info,cont) {
                  var a=parseInt(info)+1;
                  var string =
                      "<li>" +
                      "  <span>" +
                      "      <a href='javascript:void(0)' class='fl'>" +
                      "          <img src='" + cont.img_url + "' alt='图片加载错误' width='32' height='32'>" +
                      "      </a>" +
                      "      <p class='fl'> " + cont.name + " (" + cont.count + ")" +
                      "      </p>" +
                      "  </span>";
                  if(info<3) {
                      string += "<i class='fa fa-free-code-camp fa-2x fr' style='color:" + Pcolor[info] + ";padding-right: 10px'></i></li>";
                  }
                  else
                      string+="</li>";
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
       });
    });
    /*define the json for recommended book */
    $.getJSON(window.JSONPATH+"book-recommend.json",function (content) {
       window.book_recommend = content;
       $(".book-recommend-body").empty();
       $.each(content,function (info ,data) {
          var string=
              "<div class='book-info fl'>" +
              "     <a href='javascript:void(0)' id='book-info'>"+
              "         <img src="+data.img_url+" alt='"+data.book_name+"&"+data.book_author+"&"+data.book_seller+ "' width='90' height='120'  class='hvr-grow-shadow'>"+
              "     </a>"+
              "     <div>" +
              "         <h6>"+data.book_name +"</h6>"+
              "         <p class='fl now—price'>" +
              "             <i class='fa fa-yen'>" +data.price_now+ "</i>"+
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
    window.setInterval ("slide('right')", 5000);

});
