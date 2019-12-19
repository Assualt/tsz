<template>
  <div class="container shop">
    <ul class="shop-header fl">
      <li class="fl">
        <a href="#">
          全部商品&nbsp;
          <strong>{{cartGoodsNum}}</strong>
        </a>
      </li>
      <div class="jg fl">|</div>
      <li class="fl">
        <a href="#">
          降价商品&nbsp;
          <strong>4</strong>
        </a>
      </li>
      <div class="jg fl">|</div>
      <li class="fl">
        <a href="#">
          库存紧张&nbsp;
          <strong>4</strong>
        </a>
      </li>
      <div class="fr total">
        <p class="fl">已选商品:(不含运费)</p>
        <p class="fa fa-yen fl">{{allTotalMoney}}</p>
        <input
          type="button"
          value="结算"
          class="btn btn-warning hvr-grow fr"
          disabled
          id="btn_js1"
          @click="submitCheck()"
        />
      </div>
    </ul>
    <div class="shop_all fl">
      <div class="fl shop_all_body">
        <div class="shop_all_head fl">
          <input
            type="checkbox"
            class="fl"
            value="all_sel"
            name="1"
            @click="handleAllCnt(0,cartGoodsShops,false)"
            v-model="isAllSelected"
          />&nbsp;全选&nbsp;
        </div>
        <div class="shop_all_head fl">商品信息</div>
        <div class="shop_all_head fl">单价</div>
        <div class="shop_all_head fl">数量</div>
        <div class="shop_all_head fl">金额</div>
        <div class="shop_all_head fl">操作</div>
      </div>
    </div>
    <ul class="shop_list fl">
      <li
        class="fl"
        v-for="(item,index) in cartGoodsShops"
        :style="{height: getHeight(item) + 'px'}"
        :key="index"
      >
        <div class="shop_list_head fl">
          <input
            type="checkbox"
            class="fl"
            value="shop_name"
            @click="handleAllCnt(1,item,false)"
            v-model="item.isChecked"
          />
          <p class="fl">&nbsp;店铺&nbsp;{{item.goods_store_name}}</p>
          <a href="#" class="fl hvr-float-shadow">
            <img src="static/images/contact.jpeg" alt="#" width="15" height="15" />
          </a>
          <div class="fl discount">
            <a href="#">
              &nbsp;&nbsp;&nbsp;优惠券&nbsp;
              <i class="fa fa-angle-down"></i>&nbsp;
            </a>
            <ul class="shop_list_item fl">
              <li class="shop_list_body fl" v-for="(itt,inn) in item.goods_info" :key="inn">
                <div class="body_info fl">
                  <input
                    type="checkbox"
                    value="goods_item"
                    class="fl"
                    style="width: 5%;"
                    @click="handleAllCnt(2,itt,false)"
                    v-model="itt.isChecked"
                  />
                  <div class="fl body_info_img">
                    <a href="#" class="hvr-grow-shadow">
                      <img
                        :src="itt.book_img"
                        alt="未能正确加载图片"
                        width="70"
                        height="90"
                        :title="itt.book_name"
                      />
                    </a>
                  </div>
                  <div class="fl body_info_des">
                    <div class="body_info_des_top">
                      <a href="#" class="body_info_des_top_fnt">{{itt.book_ad}}</a>
                    </div>
                    <div class="body_info_des_top">
                      <a href="#" title="信用卡支付">
                        <img src="static/images/xcard.png" alt />
                      </a>
                      <a href="#" title="0首付，慢慢还，拥有所爱，无需等待！">
                        <img src="static/images/fenqi.png" alt />
                      </a>
                      <a href="#" title="消费者保障服务，卖家承诺商品如实描述">
                        <img src="static/images/customer_guarantee.png" alt />
                      </a>
                      <a href="#" title="订单险">
                        <img src="static/images/guarantee.png" alt />
                      </a>
                      <a href="#" title="满足7天无理由退货申请的前提下，包邮商品需要买家承担退货邮费，非包邮商品需要买家承担发货和退货邮费。">
                        <img src="static/images/7day.jpg" alt />
                      </a>
                    </div>
                  </div>
                  <div class="fl body_info_type">
                    <p>出版社&nbsp;{{itt.book_des[0].publisher}}</p>
                    <p>规格&nbsp;{{itt.book_des[0].size}}</p>
                    <p>版次&nbsp;{{itt.book_des[0].edition}}</p>
                    <p>作者&nbsp;{{itt.book_des[0].author}}</p>
                  </div>
                </div>
                <div class="body_else fl body_price">
                  <del>
                    <i class="fa fa-yen"></i>
                    {{itt.book_des[0].old_price}}
                  </del>
                  <br />
                  <p class="fa fa-yen">
                    <strong>{{itt.book_des[0].dis_price}}</strong>
                  </p>
                </div>
                <div class="body_else fl body_num">
                  <span>
                    <button type="button" class="fl" value="sub" @click="DecreaseCnt(itt)">-</button>
                    <input
                      type="text"
                      v-model="itt.book_des[0].num"
                      class="fl"
                      name="goods_num"
                      ng-pattern="/[^a-zA-Z]"
                      @change="InputChange(itt)"
                    />
                    <button type="button" class="fl" value="plus" @click="IncreaseCnt(itt)">+</button>
                  </span>
                </div>
                <div class="body_else fl body_all_price">
                  <p
                    class="fa fa-yen"
                  >{{ (itt.book_des[0].num * itt.book_des[0].dis_price).toFixed(2) }}</p>
                </div>
                <div class="body_else fl body_op">
                  <a href="#" @click="moveIntoLocale(itt)">移入收藏夹</a>
                  <br />
                  <a href="#" @click="removeItem(itt)">删除</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
    <div class="all_total fl">
      <div class="all_total_left fl">
        <input
          type="checkbox"
          class="fl"
          value="all_sel"
          name="2"
          @click="handleAllCnt(0,cartGoodsShops,false)"
          v-model="isAllSelected"
        />&nbsp;全选&nbsp;
        <a href="javascript:void(0)" id="delete" @click="removeSeleted()">删除</a>
        <a href="#" id="clear">清除失效宝贝</a>
        <a href="#" id="join">移入收藏夹</a>
        <a href="#">分享</a>
      </div>
      <div class="all_total_right fl">
        <p class="fl">共选商品</p>
        <strong class="fl">&nbsp;{{allCount}}&nbsp;</strong>
        <p class="fl">件&nbsp;&nbsp;&nbsp;</p>
        <p class="fl">合计(不含运费):&nbsp;&nbsp;&nbsp;</p>
        <p class="fl fa fa-yen" name="total">&nbsp;{{allTotalMoney}}</p>
      </div>
    </div>
    <button
      type="button"
      class="fl btn btn-danger"
      value="结算"
      id="btn_js2"
      @click="submitCheck()"
      disabled
    >结算</button>
  </div>
</template>

<script>
export default {
  name: "GoodsTable",
  data() {
    return {
      cartGoodsShops: [],
      cartGoodsNum: 0, //已加入购物车图书数量
      isAllSelected: false, //是否所有购物车商品被全部选中
      allCount: 0, //选中的商品数量
      allTotalMoney: 0.0, //所有选择的商品计费金额
      SelectedAllShops: [] //所有已经选择的商品数据
    };
  },
  methods: {
    IncreaseCnt: function(Item) {
      if (Item.book_des[0].num > 19) {
        console.log("淘书斋提醒" + "当前商品库存20件，最大选择20件" + "info");
        Item.book_des[0].num = 20;
      } else {
        Item.book_des[0].num++;
      }
      this.handleAllCnt(2, Item, true);
      // console.log("Increase Cnt" + Item.book_des[0].num);
    },
    DecreaseCnt: function(Item) {
      if (Item.book_des[0].num === 1) {
        console.log("淘书斋提醒" + "当前至少选择一件商品" +"info");
      } else {
        Item.book_des[0].num--;
      }
      this.handleAllCnt(2, Item, true);
      // console.log("Decrease Cnt" + Item.book_des[0].num);
    },
    InputChange: function(Item) {
      if (isNaN(Item.book_des[0].num)) {
        alert("淘书斋提醒\n" +"你输入的不是一个有效的整数,请重新输入\n");
        Item.book_des[0].num = 1;
      } else if (Item.book_des[0].num < 0) {
        alert("淘书斋提醒\n" + "当前至少选择一件商品\n");
        Item.book_des[0].num = 1;
      } else if (Item.book_des[0].num > 20) {
        alert("淘书斋提醒\n"+"当前商品库存20件，最大选择20件\n");
        Item.book_des[0].num = 20;
      }
      this.handleAllCnt(2, Item, true);
    },
    moveIntoLocale: function(good) {
      //移入收藏夹
      console.log("移入当前商品收藏夹");
    },
    moveSeletedtoLocale: function() {
      //移入选中到收藏夹
      console.log("移入选中的进入收藏夹");
    },
    removeItem: function(good) {
      //删除商品
      console.log("remove item");
    },
    removeSeleted: function() {
      console.log(this.SelectedAllShops.length);
    },
    /**
     * @function: handleAllCnt 处理所有选中的图书
     * @param: Index  0:全选 1:商店全选 2:书本的选择
     * @param: Item   当前书本的所有属性,判断是否为选中或者取消选中
     * @param: bskip  false:点击单选或者全选按钮 true:修改选中书本的数量
     */
    handleAllCnt: function(Index, Item, bskip) {
      if (!bskip) {
        if (Index === 0) {
          //全选
          var flag = !this.isAllSelected;
          this.isAllSelected = flag;
          Item.forEach(data => {
            data.isChecked = flag;
            data.goods_info.forEach(da => {
              da.isChecked = flag;
            });
          });
        } else if (Index === 1) {
          var flag = !Item.isChecked;
          Item.isChecked = flag;
          Item.goods_info.forEach(data => {
            data.isChecked = flag;
          });
        } else if (Index === 2) {
          var flag = !Item.isChecked;
          Item.isChecked = flag;
        }
      }
      this.SelectedAllShops = [];
      var _this = this;
      if (this.isAllSelected) {//书本全部选择
        this.cartGoodsShops.forEach(res => {
          var bookStoreID = res.goods_store_id;
          var bookStoreName = res.goods_store_name;
          res.goods_info.forEach(data => {
            _this.SelectedAllShops.push({
              ID: this.randomWord(false, 20),
              bookStoreID: bookStoreID,
              bookStoreName: bookStoreName,
              bookName: data.book_name,
              bookID: data.book_des[0].ID,
              bookAuthor: data.book_des[0].author,
              bookPrice: data.book_des[0].dis_price,
              bookCnt: data.book_des[0].num,
              bookTotal: (
                data.book_des[0].dis_price * data.book_des[0].num
              ).toFixed(2)
            });
          });
        });
      } else {
        //部分书本选择
        this.cartGoodsShops.forEach(res => {
          var bookStoreID = res.goods_store_id;
          var bookStoreName = res.goods_store_name;
          if (res.isChecked === true) {
            //这个商店被全部选中
            res.goods_info.forEach(data => {
              _this.SelectedAllShops.push({
                ID: this.randomWord(false, 20), //订单ID
                bookStoreID: bookStoreID,
                bookStoreName: bookStoreName,
                bookName: data.book_name,
                bookID: data.book_des[0].ID,
                bookAuthor: data.book_des[0].author,
                bookPrice: data.book_des[0].dis_price,
                bookCnt: data.book_des[0].num,
                bookTotal: (
                  data.book_des[0].dis_price * data.book_des[0].num
                ).toFixed(2)
              });
            });
          } else {
            res.goods_info.forEach(data => {
              //这个商店部分书籍被选择
              if (data.isChecked === true) {
                _this.SelectedAllShops.push({
                  ID: this.randomWord(false, 20),
                  bookStoreName: bookStoreName,
                  bookStoreID: bookStoreID,
                  bookName: data.book_name,
                  bookID: data.book_des[0].ID,
                  bookAuthor: data.book_des[0].author,
                  bookPrice: data.book_des[0].dis_price,
                  bookCnt: data.book_des[0].num,
                  bookTotal: (
                    data.book_des[0].dis_price * data.book_des[0].num
                  ).toFixed(2)
                });
              }
            });
          }
        });
      }
      var EnableSubmit = this.SelectedAllShops.length == 0 ? true : false;
      $("#btn_js1").attr("disabled", EnableSubmit);
      $("#btn_js2").attr("disabled", EnableSubmit);
      console.log(JSON.stringify(this.SelectedAllShops));
      var _this = this;
      _this.allCount = 0;
      _this.allTotalMoney = 0;
      _this.SelectedAllShops.forEach(res => {
        _this.allCount += res.bookCnt;
        _this.allTotalMoney =
          parseFloat(_this.allTotalMoney) + parseFloat(res.bookTotal);
        _this.allTotalMoney = _this.allTotalMoney.toFixed(2);
      });
    },
    randomWord: function(randomFlag, min, max) {
      var str = "",
        range = min,
        arr = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
        ];
      // 随机产生
      if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
      }
      for (var i = 0; i < range; i++) {
        var pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
    submitCheck: function() {
      console.log("提交订单");
    },
    getHeight: function(Item) {
      return Item.goods_info.length * 145;
    },
    async init_cart_book(){
      const RetData = await this.axios_get("static/json/cart.json",[]);
      const _this = this;
      if(RetData != {}){
        RetData.data.forEach(data => {
          if (data.id == "1") {
            _this.cartGoodsShops = data.goods;
            _this.cartGoodsShops.forEach(data => {
              var goods = data.goods_info;
              _this.cartGoodsNum += Object.keys(goods).length;
            });
          }
        });
      }
    }
  },
  async created(){
    await this.init_cart_book();
  },
  mounted() {

    
  },
  computed:{
    
  }
};
</script>

<style scoped>
.shop {
  width: 100%;
  padding: 2% 5% 2% 5%;
}
.shop-header {
  height: 60px;
  width: 100%;
  padding: 5px;
  margin: 0;
  /*border: solid 1px red;*/
  border-bottom: solid 2px #f5f5f5;
}
.shop-header li {
  width: 14%;
  height: 100%;
  text-align: center;
  padding: 20px 3px 3px 3px;
}
.shop-header li:hover {
  border-bottom: solid 2px orange;
}
.shop-header li:first-child a {
  color: orange;
}
.shop-header li a {
  color: rgb(60, 60, 60);
  font-size: 1.15em;
  font-weight: 700;
}
.jg {
  width: 11px;
  padding: 18px 5px 12px 5px;
  height: 100%;
  color: rgb(232, 232, 232);
}
.total {
  width: 25%;
  padding: 15px 0 0 0;
  text-align: center;
  margin-top: 2px;
  margin-left: 55%;
  position: absolute;
}
.total input {
  padding-top: 3px;
  padding-bottom: 3px;
}
.total p:first-child {
  padding-top: 12px;
  font-size: 12px;
}
.total p:nth-child(2) {
  color: orange;
  margin: 0;
  height: 100%;
  font-size: 1em;
  font-weight: 500;
  padding: 10px 2px 0 5px;
  width: 32%;
}

.shop_all {
  width: 100%;
  /*height: 800px;*/
  /*border:solid 1px red;*/
  margin-top: 10px;
  padding: 5px 10px 5px 10px;
}
.shop_all_body {
  width: 100%;
}

.body_info {
  width: 48%;
  height: 100%;
}
.body_else {
  width: 13%;
  height: 100%;
}

.shop_all_head {
  width: 13%;
}
.shop_all_head:nth-child(2) {
  width: 35%;
}
.shop_all_head p {
  margin: 0;
}
.shop_list {
  width: 100%;
  height: 760px;
  /*border:solid 1px red;*/
  padding: 5px;
  min-height: 50px;
  max-height: 600px;
  overflow: auto;
  margin-bottom: 20px;
}
.shop_list li {
  width: 100%;
  /*border: solid 1px red;*/
  padding: 5px;
}
.shop_list_head {
  width: 100%;
  height: 22.15px;
  /*border: solid 1px red;*/
  padding-left: 5px;
  padding-right: 5px;
}
.shop_list_item {
  width: 100%;
  height: auto;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom: 10px;
}

.shop_list_head p {
  margin-bottom: 0;
}
.discount {
  margin-left: 10px;
}
.discount a {
  color: orange;
}
.shop_list_body {
  margin-top: 4px;
  width: 100%;
  height: 112px;
  border: solid 1px rgb(204, 204, 204);
  padding: 5px;
}
.body_info_img {
  margin-left: 10px;
  margin-right: 10px;
  width: 13%;
  margin-top: 5px;
}
.body_info_des {
  width: 39%;
  height: 100%;
  padding: 2px 5px 2px 5px;
}
.body_info_des_top {
  height: 50%;
  width: 100%;
}
.body_info_des_top:nth-child(2) {
  padding-top: 20px;
}
.body_info_des_top_fnt {
  font-size: 12px;
  color: black;
}
.body_info_des_top_fnt:hover {
  color: orange;
}
.body_info_type {
  width: 39%;
  height: 100%;
  padding: 5px 5px 5px 10px;
}
.body_info_type:hover {
  border: dashed 1px red;
}
.body_info_type p {
  margin: 0;
}
.body_price {
  padding: 5px 5px 5px 10px;
}
.body_price del {
  font-size: 12px;
  color: rgba(204, 204, 204, 0.8);
}
.body_price p {
  margin: 0;
}
.body_num {
  padding: 20px 5px 5px 10px;
}
.body_num span input {
  width: 40px;
  text-align: center;
}
.body_num span button {
  width: 18px;
  opacity: 0.6;
  border: solid 1px rgb(204, 204, 204);
  height: 26px;
}
.body_num span button:hover {
  border: solid 1px orange;
}
.body_all_price {
  padding: 20px 5px 5px 10px;
  color: orange;
  font-weight: bold;
  font-size: 18px;
}
.body_op {
  padding: 20px 5px 5px 10px;
}
.body_op a {
  font-size: 12px;
  color: black;
}
.body_op a:hover {
  color: orange;
}
.all_total {
  width: 90%;
  height: 50px;
  border: solid 1px red;
  padding: 12px 15px 12px 15px;
  background: rgb(229, 229, 229);
  margin-left: 10px;
}
.all_total a {
  margin-left: 20px;
  margin-right: 20px;
  color: black;
  font-size: 12px;
}
.all_total a:hover {
  color: red;
}
.all_total_left {
  width: 55%;
  height: 100%;
}
.all_total_right {
  width: 45%;
}
.all_total_right p {
  margin: 0;
}
.all_total_right strong {
  font-size: 16px;
  color: red;
}
.all_total_right button {
  width: 80px;
  height: 100%;
}

p[name="total"] {
  font-size: 20px;
  color: red;
}
#btn_js2 {
  border-radius: 0;
  height: 50px;
  width: 100px;
}
</style>