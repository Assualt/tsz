<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script type="text/javascript" src="STATIC/js/jquery-3.1.1.min.js" ></script>
    <!--<script type="text/javascript" src="STATIC/js/jquery-3.1.1.min.js"></script>-->
    <!--<link rel="stylesheet" type="text/css" href="STATIC/css/mycss.css">-->

</head>
<body>
<input type="text" id="tt" name="username">
<input id="aa" type="submit" >
</body>
<script type="text/javascript">
    $("#aa").click(function(){
        alert(1);
        data={"username":"aa","password":"111"};
        alert($("#tt").text());
        $.ajax({url:"http://127.0.0.1/tsz/public/index/user_controller/register",
            type:"post",
            data:data,
            success:function(){}
        })
        alert(2)
    })
</script>
</html>