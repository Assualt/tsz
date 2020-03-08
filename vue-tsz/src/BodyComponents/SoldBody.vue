<template>
  <div class="main">
    <div class="top fl">
      <div class="scanner_view_logo fl">
        <router-link to="/index">
          <img src="../assets/logo.png" alt="未能正确加载图片" width="180" height="64" />
        </router-link>
      </div>
      <div class="scanner_view_list fl">
        <ul class="scanner_view_list_ul">
          <li>
            <router-link to="/index">主页</router-link>
          </li>
          <li>
            <router-link to="/sold">出售</router-link>
          </li>
          <li>
            <a href="#">求购</a>
          </li>
          <li>
            <a href="#">免费赠阅</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="main_book_list fl">
      <div class="fl">
        <div class="search_type fl">
          <div class="search_item">
            <p class="fl">时间:  </p>
            <ul>
              <li><a href="#">不限</a></li>
              <li><a href="#">2019</a></li>
              <li><a href="#">2018</a></li>
              <li><a href="#">2017</a></li>
              <li><a href="#">2016</a></li>
              <li><a href="#">2015</a></li>
              <li><a href="#">2014</a></li>
            </ul>
          </div>
          <div class="search_item">
            <p class="fl">种类: </p>
            <ul>
              <li><a href="#">不限</a></li>
              <li><a href="#">文学艺术</a></li>
              <li><a href="#">人文社科</a></li>
              <li><a href="#">经济管理</a></li>
              <li><a href="#">计算机</a></li>
              <li><a href="#">医学</a></li>
              <li><a href="#">生活休闲</a></li>
              <li><a href="#">外语学习</a></li>
            </ul>
          </div>
          <div class="search_item">
            <p class="fl">作者: </p>
            <ul>
              <li><a href="#">不限</a></li>
              <li><a href="#"></a></li>
              <li><a href="#">玄幻</a></li>
              <li><a href="#">校园</a></li>
            </ul>
          </div>
        </div>
        <div class="search_tag fl">
          <ul class="search_keyword fl">
            <li>
              <a href="javascript:void(0)" class="selected" title="所有人的">所有人的</a>
            </li>
            <li>
              <a href="javascript:void(0)" title="关注的">关注的</a>
            </li>
            <li>
              <a href="javascript:void(0)" title="粉丝的">粉丝的</a>
            </li>
            <li>
              <a href="javascript:void(0)" title="留言的">留言过的</a>
            </li>
            <li>
              <a href="javascript:void(0)" title="赠送的">赠送的</a>
            </li>
          </ul>
          <form class="search_input fr" action>
            <input type="text" placeholder="请输入关键字" name="kw" class="fl" />
            <button type="submit" value="搜索" class="btn btn-success fl">搜索</button>
          </form>
        </div>
        <div class="book_content_list fl">
          <div class="content_list_head fl">
            <ul class="list_order fl">
              <li>
                <a href="javascript:void(0)"></a>排序&nbsp;
              </li>
              <li>
                <a href="javascript:void(0)">更新时间&nbsp;</a>
                <i class="fa fa-sort-down fa-fw"></i>
              </li>
              <li>
                <a href="javascript:void(0)">上架时间&nbsp;</a>
              </li>
              <li>
                <a href="javascript:void(0)">留言数&nbsp;</a>
              </li>
              <li>
                <a href="javascript:void(0)">价格&nbsp;</a>
              </li>
            </ul>
            <ul class="pagination pagination-sm fr" id="page_tools">
              <li>
                <a href="javascript:void(0)">&laquo;</a>
              </li>
              <li class="active">
                <a href="javascript:void(0)">1</a>
              </li>
              <li>
                <a href="javascript:void(0)">2</a>
              </li>
              <li>
                <a href="javascript:void(0)">3</a>
              </li>
              <li>
                <a href="javascript:void(0)">4</a>
              </li>
              <li>
                <a href="javascript:void(0)">5</a>
              </li>
              <li>
                <a href="javascript:void(0)">&raquo;</a>
              </li>
            </ul>
          </div>
          <div class="content_list_body fl">
            <ul class="content_list">
              <li class="list_info" v-for="(item,index) in CurrentBooks" :key="index">
                <div class="book_img fl">
                  <img
                    :src="item.book_Img"
                    alt="123"
                    class="img-rounded fl"
                    height="200"
                    :title="item.book_Name+'&'+item.book_Publish"
                  />
                </div>
                <div class="book_des fl">
                  <div class="book_des_head fl">
                    <strong :title="item.book_Name">
                      <a href="javascript:void(0)">{{item.book_Name}}</a>
                    </strong>
                  </div>
                  <div class="book_des_body fl">
                    <ul class="body_item fl">
                      <li>
                        <p class="fl">分类&nbsp;</p>
                        <a class="fl badge body_item_tags hvr-grow" href="#" v-for="(tag,inde) in item.book_Tag" :key="inde">{{tag}}</a>
                      </li>
                      <li>
                        <p class="fl">{{item.book_Publish}}&nbsp;/&nbsp;</p>
                        <p class="fl">{{item.book_Author}}&nbsp;/&nbsp;</p>
                        <p class="fl">{{item.book_Edition}}</p>
                      </li>
                      <li>
                        <p class="fl">¥{{item.book_Price_Now}}&nbsp;&nbsp;&nbsp;</p>
                        <del class="fl">¥{{item.book_Price_Before}}&nbsp;</del>
                        <p class="fl">&nbsp;&nbsp;❲{{(item.book_Price_Now/item.book_Price_Before * 10).toFixed(2)}}折❳</p>
                      </li>
                    </ul>
                    <div class="body_item fr">
                      <button class="btn btn-info hvr-grow-shadow">
                        加入
                        <i class="fa fa-shopping-cart"></i>
                      </button>
                      <button class="btn btn-success hvr-grow-shadow">收藏</button>
                    </div>
                  </div>
                  <div class="book_des_rear fl">
                    <a :href="'/store/'+item.book_Store_ID" class="fl">
                      <img src="" alt width="32" height="32" />&nbsp;{{item.book_StoreName}}
                    </a>
                    <p class="fl" title="陈彦君">
                      <i class="fa fa-male">&nbsp;&nbsp;</i>&nbsp;{{item.book_Seller_UNI}}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="content_list_rear fl">
            <div class="fr page_total">
              <p class="fl">当前第1页</p>
              <input type="text" class="fl small" size="2" placeholder="翻页" />
              <input type="button" value="跳转" class="fl btn btn-default" id="page_tools_2" />
              <p class="fl">&nbsp;共 页</p>
            </div>
            <ul class="pagination pagination-sm fr" id="page_tools_1">
              <li>
                <a href="javascript:void(0)">&laquo;</a>
              </li>
              <li class="active">
                <a href="javascript:void(0)">1</a>
              </li>
              <li>
                <a href="javascript:void(0);">2</a>
              </li>
              <li>
                <a href="javascript:void(0)">3</a>
              </li>
              <li>
                <a href="javascript:void(0)">4</a>
              </li>
              <li>
                <a href="javascript:void(0)">5</a>
              </li>
              <li>
                <a href="javascript:void(0)">&raquo;</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SoldBody",
  data(){
    return {
      CurrentBooks:[
        {
          book_ID:123456,
          book_Name:"五分钟丰胸",
          book_Img:"static/upload/5分钟丰胸.jpg",
          book_Author:"卡耐基",
          book_Tag:["励志","阳光","青春"],
          book_Publish:"人民教育出版社",
          book_Edition:"第二版",
          book_Price_Now:19.80,
          book_Price_Before:29.80,
          book_Seller_UNI:"海南大学",
          book_StoreName:"第一书店",
          book_Store_ID:123
          
        }
      ]
    }
  },
  filters:{
    

  }
};
</script>


<style scope>
div.main {
  height: 1800px;
}
div.top {
  width: 100%;
  height: 78px;
  padding: 5px 15% 5px 15%;
}
div.scanner_view_logo {
  width: 50%;
  height: 100%;
}
div.scanner_view_list {
  width: 50%;
  height: 100%;
}
ul.scanner_view_list_ul li {
  width: 25%;
  height: 100%;
  padding: 20px 0;
}
ul.scanner_view_list_ul li a {
  color: black;
  font-size: 17px;
  font-weight: bold;
}
ul.scanner_view_list_ul li a:hover {
  color: rgb(0, 168, 155);
}
ul.scanner_view_list_ul li:first-child a {
  color: rgb(0, 168, 155);
  font-size: 17px;
}

.main_book_list {
  background: rgb(232, 232, 232);
  width: 100%;
  height: 97.4%;
  /*border: solid 1px red;*/
  padding: 10px 15% 10px 15%;
}
.main_book_list_left {
  height: 100%;
  width: 33%;
  /*border: solid 1px red;*/
}
.search_tag {
  height: 38px;
  width: 100%;
  padding: 2px 5px;
  background: white;
  border: solid 1px rgb(232, 232, 232);
}
.search_keyword {
  width: 50%;
  height: 100%;
  padding: 3px;
}
.search_keyword li {
  padding: 2px;
}
.search_keyword li a {
  color: rgb(0, 168, 155) !important;
}
.search_keyword li a.selected {
  font-weight: bold;
}
.search_input {
  width: 50%;
  height: 100%;
  padding: 2px;
}
.search_input input {
  width: 70%;
  height: 100%;
  padding-left: 10px;
  border: solid 1px rgb(0, 168, 155);
}
.search_input button {
  border-radius: 0;
  width: 80px;
  height: 100%;
  padding-top: 3px;
  padding-bottom: 3px;
}

.book_content_list {
  width: 100%;
  height: 98%;
  border: solid 1px rgb(232, 232, 232);
  margin-top: 10px;
  background: white;
}
.content_list_head {
  width: 100%;
  height: 40px;
  /*border: solid 1px red;*/
  padding: 5px;
}
.list_order {
  width: 50%;
  height: 100%;
}
.list_order li {
  line-height: 30px;
  height: 100%;
}
.list_order li:not(:first-child) {
  padding-left: 10px;
}
.list_order li:not(:first-child) a {
  font-size: 12px;
  color: rgb(0, 168, 155);
}


#page_tools,
#page_tools_1 {
  margin: 0;
}

.content_list_body {
  width: 100%;
  height: 96.85%;
  /*border: solid 1px red;*/
  padding: 10px;
  /*display: none;*/
}
.content_list {
  width: 100%;
  height: 100%;
}
.list_info {
  width: 100%;
  height: 8.25%;
  /*border: solid 1px red;*/
  border-bottom: dotted 2px #d1d1d1;
  padding: 10px 0 0 0;
}
.book_img {
  width: 25%;
  height: 100%;
  padding: 1%;
  /*border: solid 1px red;*/
  text-align: center;
}
.book_des {
  width: 75%;
  height: 100%;
  /*border: 1px solid red;*/
}
.book_des_head {
  width: 100%;
  height: 20%;
  /*border: 1px solid red;*/
  line-height: 39px;
}
.book_des_head a {
  color: rgb(0, 168, 155);
}

.book_des_body {
  width: 100%;
  height: 60%;
  /*border: 1px solid red;*/
  padding: 7px 5px;
  border-top: dashed 1px #9b9b9b;
  border-bottom: dashed 1px #9b9b9b;
}
.body_item:first-child {
  width: 70%;
  height: 100%;
}
.body_item:last-child {
  width: 30%;
  height: 100%;
  padding-left: 10px;
  padding-top: 10px;
}
.body_item:last-child button {
  margin: 2px;
}
.body_item li {
  width: 100%;
  height: 33%;
  /*border: 1px solid red;*/
  padding: 6px 0 6px 10px;
  text-align: center;
}
.body_item_tags {
  margin-left: 5px;
  color: whitesmoke;
}
.body_item_tags:nth-child(2) {
  background: rgb(245, 69, 69);
}
.body_item_tags:nth-child(3) {
  background: rgb(255, 133, 71);
}
.body_item_tags:nth-child(4) {
  background: rgb(255, 172, 56);
}
.body_item li:nth-child(2) p {
  font-family: 微软雅黑;
  font-size: 12px;
  opacity: 0.7;
}
.body_item li:nth-child(3) p {
  font-size: 12px;
  opacity: 0.8;
}
.body_item li:nth-child(3) p.fa-yen {
  color: rgb(255, 68, 0);
  font-weight: bold;
}

.body_item li:nth-child(3) del {
  opacity: 0.5;
  font-size: 12px;
}
.book_des_rear {
  width: 100%;
  height: 20%;
  line-height: 40px;
}
.book_des_rear a {
  color: rgb(0, 168, 155);
  margin-right: 10px;
}
.book_des_rear p {
  margin-left: 10px;
}
.content_list_rear {
  width: 100%;
  height: 50px;
  /*border: solid 1px red;*/
  padding-top: 0px;
  padding-right: 35px;
}
.page_total {
  width: 50%;
  height: 40px;
  text-align: center;
  padding-left: 20px;
}
.page_total p {
  padding: 4px 3px;
}
.page_total input[type="text"] {
  margin-left: 6px;
  margin-top: 3px;
  height: 60%;
}
.page_total input[type="button"] {
  width: auto;

  margin-left: 6px;
  height: 60%;
  margin-top: 3px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.search_type{
  width: 100%;
  height: 120px;
  background: white;
  margin-bottom: 10px; 
  padding-left: 10px;
}

.search_item{
  height: 30px;
  line-height: 30px;
}
.search_item p{
  margin: 0;
}
.search_item ul li{
  padding:0 5px;
  line-height: 30px;
  text-align: center;
  height: 100%;
}

.search_item ul li a{
  font-size: 14px;
  color: rgb(0, 168, 155);
}
</style>