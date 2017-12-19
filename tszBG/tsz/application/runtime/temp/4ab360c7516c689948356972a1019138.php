<?php if (!defined('THINK_PATH')) exit();?> <!DOCTYPE>
 <html lang="en">
    <head>
        <title>Welcome to the Tao Shu Zhai!</title>
        <meta charset="UTF-8">

        <link rel="shortcut icon" type="image/x-icon" href="STATIC/res/favicon.ico" media="screen" />
        <!--bootstrap css -->
        <link rel="stylesheet" href="STATIC/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="STATIC/css/bootstrap.min.css">
        <link rel="stylesheet" href="STATIC/font-awesome/css/font-awesome.min.css">
        <!--bootstrap js-->
        <script type="text/javascript" src="STATIC/js/jquery-3.1.1.min.js"></script>
        <script type="text/javascript" src="STATIC/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="STATIC/js/npm.js"></script>
        <!--hover css-->
        <link rel="stylesheet" href="STATIC/css/hover-min.css">

        <!--my css-->
        <link rel="stylesheet" href="STATIC/mycss/index.css">
        <!--my js-->
        <script type="text/javascript" src="STATIC/myjs/index.js"></script>
    </head>
    <body id="body">
        <header>
            <div class="header-school">
                <i class="fa fa-location-arrow fa-lg" aria-hidden="true"></i>
                <a href="javascript:void(0)" class="a_school">    [  所有学校  ]</a>
                <div class="show_school" >
                    <div class="show_school_head">
                        <p class="fl">请选择学校</p>
                        <button class="btn btn-sm fa fa-close fr" id="show_school_btn_cls"></button>
                    </div>
                    <div class="show_school_body">
                        <p class="fl">快捷方式:<a href="#" style="color: rgb(0,168,155);">　所有学校</a></p>
                        <div class="show_school_body_2 fl">
                            <a href="#" class="fl">北京</a>
                            <a href="#" class="fl">上海</a>
                            <a href="#" class="fl">黑龙江</a>
                            <a href="#" class="fl">吉林</a>
                            <a href="#" class="fl">辽宁</a>
                            <a href="#" class="fl">天津</a>
                            <a href="#" class="fl">安徽</a>
                            <a href="#" class="fl">江苏</a>
                            <a href="#" class="fl">浙江</a>
                            <a href="#" class="fl">陕西</a>
                            <a href="#" class="fl">湖北</a>
                            <a href="#" class="fl">广东</a>
                            <a href="#" class="fl">湖南</a>
                            <a href="#" class="fl">甘肃</a>
                            <a href="#" class="fl">四川</a>
                            <a href="#" class="fl">山东</a>
                            <a href="#" class="fl">福建</a>
                            <a href="#" class="fl">河南</a>
                            <a href="#" class="fl">重庆</a>
                            <a href="#" class="fl">云南</a>
                            <a href="#" class="fl">河北</a>
                            <a href="#" class="fl">江西</a>
                            <a href="#" class="fl">山西</a>
                            <a href="#" class="fl">贵州</a>
                            <a href="#" class="fl">广西</a>
                            <a href="#" class="fl">内蒙古</a>
                            <a href="#" class="fl">宁夏</a>
                            <a href="#" class="fl">青海</a>
                            <a href="#" class="fl">西藏</a>
                            <a href="#" class="fl">香港</a>
                            <a href="#" class="fl">澳门</a>
                            <a href="#" class="fl">台湾</a>
                        </div>
                        <div class="show_school_body_3 fl">
                            <!--<p><a href="#">asdasd</a></p>  Just a Test -->
                        </div>
                    </div>
                </div>
                <div class="header_login fr">
                    <li class="fl"><a href="login.html">登录</a>  |</li>
                    <li class="fl"><a href="sites/sold.html">出售</a>  |</li>
                    <li class="fl"><a href="sites/register.html" style="color: orange">立即注册</a>  |</li>
                    <li class="fl"><a href="sites/downloadApp.html" class="fa fa-mobile-phone fa-1x">下载APP</a></li>
                </div>
            </div>
        </header>
        <div class="main">
            <div class="top fl">
                <div class="scanner_view_logo fl">
                    <a href="index.html">
                        <img src="STATIC/res/logo.png" alt="未能正确加载图片" width="180" height="64">
                    </a>
                </div>
                <div class="scanner_view_list fl">
                    <ul class="scanner_view_list_ul">
                        <li><a href="#">登录</a></li>
                        <li><a href="#">注册</a></li>
                        <li><a href="#">求购</a></li>
                        <li><a href="#">免费赠阅</a></li>
                    </ul>
                </div>
            </div>
            <div class="slider_view fl">
                <ul>
                    <li>
                        <a href="javascript:void(0)" target="_blank">
                            <img src="STATIC/res/focus_0.jpg" alt="未能加载失败" value="0" id="slide_img">
                        </a>
                    </li>
                </ul>
                <div class="slider_view_btn">
                    <a  href="#" id="btn_left" class="fl"><i class="fa fa-angle-left fa-5x"></i></a>
                    <a  href="#" id="btn_right" class="fr"><i class="fa fa-angle-right fa-5x"></i></a>
                </div>
            </div>
            <div class="hot-topic fl">
                <div class="hot-topic-body">
                    <div class="hot-topic-body-left fl">
                        <p id="hot-topic" class="fl">热搜:</p>
                        <!--<a href="#">英语</a>-->
                    </div>
                    <div class="hot-topic-body-right fr">
                        <input type="text" name="search" size="50" placeholder="请输入关键字" style="height: 28px;">
                        <button class="btn btn-info hvr-sweep-to-right" id="btn_search">
                            <i class="fa fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div  class="book-list">
                <div class="book-list-left fl">
                    <div class="contact fl">
                        <span class="fa-stack fa-1x fl">
                            <i class="fa fa-circle fa-stack-2x"></i>
                            <i class="fa fa-qq fa-stack-1x fa-inverse"></i>
                        </span>
                        <p class="fl">用户体验交流群:123456789</p>
                    </div>
                    <div class="fl hot-bookstore">
                        <h4>热门书店　<i class="fa   fa-free-code-camp" style="color:red;"></i></h4>
                        <ul id="hot-bookstore"></ul>
                    </div>
                    <div class="fl hot-person">
                        <h4>热门个人　<i class="fa   fa-users" style="color:lightblue;"></i></h4>
                        <ul class="hot-person-list"></ul>
                    </div>
                    <div class="fl most-focus">
                        <h4>多人关注</h4>
                        <ul class="most-focus-list">
                            <!--<li class="hvr-sweep-to-right">-->
                                <!--<a href="dist/res/user.jpg">-->
                                    <!--<img src="dist/res/user.jpg" alt="" width="40" height="40">-->
                                <!--</a>-->
                            <!--</li>-->
                        </ul>
                    </div>
                </div>
                <div class="book-list-right fl">
                    <div class="fl book-recommend">
                        <div class="book-recommend-head fl">
                            <p class="fl">好书推荐<i class="fa fa-bookmark"></i></p>
                            <a href="javascript:void(0)" class="fr">更多<i class="fa fa-angle-right"></i></a>
                        </div>
                        <div class="book-recommend-body fl">
                            <!--<div class="book-info fl">-->
                                <!--<a href="javascript:void(0)">-->
                                    <!--<img src="dist/卡耐基.jpg.jpg" alt="卡耐基口才" width="100" height="130">-->
                                <!--</a>-->
                                <!--<div>-->
                                    <!--<h6>卡耐基魅力口才</h6>-->
                                    <!--<p class="fl now—price">-->
                                        <!--<i class="fa fa-yen"></i>-->
                                        <!--13.95-->
                                    <!--</p>-->
                                    <!--<p class="fr last-price">-->
                                        <!--<i class="fa fa-yen"></i>-->
                                        <!--<s>12.11</s>-->
                                    <!--</p>-->
                                <!--</div>-->
                            <!--</div>-->
                        </div>
                    </div>
                </div>
            </div>
            <!--<footer class="bg-info">-->


                    <!--asdsadsa-->
            <!--</footer>-->
        </div>




    </body>
 </html>