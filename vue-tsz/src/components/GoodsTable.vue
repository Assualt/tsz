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
          <strong>{{ReducedpriceNum}}</strong>
        </a>
      </li>
      <div class="jg fl">|</div>
      <li class="fl">
        <a href="#">
          库存紧张&nbsp;
          <strong>{{TightstockNum}}</strong>
        </a>
      </li>
      <div class="fr total">
        <p class="fl">已选商品:(不含运费)</p>
        <p class="fa fa-yen fl">{{allTotalMoney}}</p>
        <input
          type="button"
          value="结算"
          class="btn btn-warning hvr-grow fr"
          id="btn_js1"
          @click="submitCheck()"
          :disabled="SelectedAllShops.length==0"
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
            @click="handleBooks(0,null,true)"
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
            @click="handleBooks(1,item.goods_store_id, true)"
            :checked="item.isChecked"
          />
          <p class="fl">&nbsp;店铺&nbsp;{{item.goods_store_name}}&nbsp;&nbsp;</p>
          <a href="#" class="fl hvr-float-shadow">
            <img src="static/images/contact.jpeg" alt="#" width="15" height="15" />
          </a>
          <div class="fl discount">
            <a href="#" @click="selectShowCoupon(item.goods_store_id)">
              &nbsp;&nbsp;&nbsp;优惠券&nbsp;
              <i class="fa fa-angle-up" v-if="item.showCoupon==true"></i>
              <i class="fa fa-angle-down" v-else></i>&nbsp;
            </a>
            <div class="favorcontent" v-show="item.showCoupon">
              <div class="angle"></div>
              <a href="#" class="close-coupon" @click="item.showCoupon=false">
                <i class="fa fa-close"></i>
              </a>
              <div class="favortips">
                <i class="fa fa-bullhorn" aria-hidden="true"></i>
                <span>已经领取 {{item.coupon.gotnumber}} 张优惠券，有新优惠券待领取</span>
              </div>
              <ul class="coupon-list">
                <li v-for="(it,index) in item.coupon.available" :key="index">
                  <div class="coupon-amount">
                    <span class="rmb">&yen;</span>
                    {{it.coupon_price}}
                  </div>
                  <div class="coupon-detail">
                    <div class="coupon-info fl">
                      <p class="coupon-title">优惠券&nbsp;满{{it.coupon_acquire}}减{{it.coupon_price}}</p>
                      <p class="coupon-time">{{it.coupon_time}}</p>
                    </div>
                    <div class="coupon-op">
                      <span
                        class="coupon-button"
                        v-if="!it.has_received"
                        @click="getCoupon(item.goods_store_id, it.coupon_id)"
                      >领 取</span>
                      <span class="coupon-button" v-else>已 领 取</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <ul class="shop_list_item fl">
            <li class="shop_list_body fl" v-for="(itt,inn) in item.goods_info" :key="inn">
              <div class="body_info fl">
                <input
                  type="checkbox"
                  value="goods_item"
                  class="fl"
                  style="width: 5%;"
                  @click="handleBooks(2,itt.book_des.ID, true)"
                  v-model="itt.isChecked"
                  v-if="!itt.book_invalid"
                />
                <input type="checkbox" style="width: 5%;" v-else disabled class="fl" />
                <div class="fl body_info_img">
                  <a :href="itt.book_img" class="hvr-grow-shadow" target="_blank">
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
                    <a href="javascript:void(0)" title="信用卡支付">
                      <img src="static/images/xcard.png" alt />
                    </a>
                    <a href="javascript:void(0)" title="0首付，慢慢还，拥有所爱，无需等待！">
                      <img src="static/images/fenqi.png" alt />
                    </a>
                    <a href="javascript:void(0)" title="消费者保障服务，卖家承诺商品如实描述">
                      <img src="static/images/customer_guarantee.png" alt />
                    </a>
                    <a href="javascript:void(0)" title="订单险">
                      <img src="static/images/guarantee.png" alt />
                    </a>
                    <a
                      href="javascript:void(0)"
                      title="满足7天无理由退货申请的前提下，包邮商品需要买家承担退货邮费，非包邮商品需要买家承担发货和退货邮费。"
                    >
                      <img src="static/images/7day.jpg" alt />
                    </a>
                  </div>
                </div>
                <div class="fl body_info_type">
                  <p>出版社&nbsp;{{itt.book_des.publisher}}</p>
                  <p>规格&nbsp;{{itt.book_des.size}}</p>
                  <p>版次&nbsp;{{itt.book_des.edition}}</p>
                  <p>作者&nbsp;{{itt.book_des.author}}</p>
                </div>
              </div>
              <div class="body_else fl body_price">
                <del>
                  <i class="fa fa-yen"></i>
                  {{itt.book_des.old_price}}
                </del>
                <br />
                <p class="fa fa-yen">
                  <strong>{{itt.book_des.dis_price}}</strong>
                </p>
              </div>
              <div class="body_else fl body_num">
                <span>
                  <button type="button" class="fl" value="sub" @click="DecreaseCnt(itt)">-</button>
                  <input
                    type="text"
                    v-model="itt.book_des.num"
                    class="fl"
                    name="goods_num"
                    ng-pattern="/[^a-zA-Z]"
                    @change="InputChange(itt)"
                  />
                  <button type="button" class="fl" value="plus" @click="IncreaseCnt(itt)">+</button>
                </span>
              </div>
              <div class="body_else fl body_all_price">
                <p class="fa fa-yen">{{ (itt.book_des.num * itt.book_des.dis_price).toFixed(2) }}</p>
              </div>
              <div class="body_else fl body_op">
                <a href="#" @click="moveIntoLocale(itt)">移入收藏夹</a>
                <br />
                <a href="#" @click="removeItem(itt)">删除</a>
                <p
                  v-if="itt.book_invalid"
                  style="color:red;font-size:14px;font-weight:bold;"
                >该商品已经失效</p>
              </div>
            </li>
          </ul>
        </div>
      </li>
      <div v-if="AllBooksCleared">
        <h1 align="center">
          亲，你当前的购物车
          <i class="fa fa-cart-plus primary" aria-hidden="true"></i>空空如也！
        </h1>
        <p align="center" style="color:#123321">
          <router-link to="/sold">赶紧去挑选基本适合自己的书籍吧.</router-link>
        </p>
      </div>
    </ul>

    <div class="all_total fl">
      <div class="all_total_left fl">
        <input
          type="checkbox"
          class="fl"
          value="all_sel"
          name="2"
          @click="handleBooks(0, null, true)"
          v-model="isAllSelected"
        />&nbsp;全选&nbsp;
        <a href="javascript:void(0)" id="delete" @click="removeSeleted()">删除</a>
        <a href="#" id="clear" @click="removeInvalidBooks()">清除失效宝贝</a>
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
      :disabled="SelectedAllShops.length==0"
    >结算</button>
  </div>
</template>

<script>
export default {
  name: "GoodsTable",
  data() {
    return {
      //降价商品
      ReducedpriceNum: 0,
      //库存紧张商品
      TightstockNum: 0,
      cartGoodsShops: [],
      cartGoodsNum: 0, //已加入购物车图书数量
      isAllSelected: false, //是否所有购物车商品被全部选中
      allCount: 0, //选中的商品数量
      allTotalMoney: 0.0, //所有选择的商品计费金额
      SelectedAllShops: [] //所有已经选择的商品数据
    };
  },
  methods: {
    /**
     * @function: removeInvalidBooks 清除掉失效的图书
     * @param: None
     * @return: None
     */
    removeInvalidBooks: function() {
      const self = this;
      var cartShopBooks = [];
      var clearedInValidBook = false;
      var clearedInvalidBooksNumber = 0;
      this.cartGoodsShops.forEach(shop => {
        shop.goods_info.forEach((book, index) => {
          if (!book.book_invalid) {
            cartShopBooks.push(book);
          } else {
            clearedInvalidBooksNumber++;
            clearedInValidBook = true;
            self.cartGoodsNum--;
          }
        });
        shop.goods_info = cartShopBooks;
      });
      cartShopBooks = [];
      this.cartGoodsShops.forEach((shop, index) => {
        if (shop.goods_info.length != 0) {
          cartShopBooks.push(shop);
        }
      });
      this.cartShopBooks = cartShopBooks;

      if (clearedInValidBook) {
        this.$swal({
          title: "淘书斋提醒",
          text: "已清除" + clearedInvalidBooksNumber + "失效图书.",
          type: "info",
          showCancelButton: false,
          confirmButtonText: "确定"
        });
      } else if (clearedInvalidBooksNumber == 0) {
        this.$swal({
          title: "淘书斋提醒",
          text: "当前无失效的图书，无需清理!",
          type: "info",
          showCancelButton: false,
          confirmButtonText: "确定"
        });
      } else {
        this.$swal({
          title: "淘书斋提醒",
          text: "清除无效图书失败!",
          type: "error",
          showCancelButton: false,
          confirmButtonText: "确定"
        });
      }
    },
    //获得优惠券
    /**
     * @function:getCoupon 根据书店的ID和优惠券的ID计算当前可用的优惠券数量
     * @param: goods_store_id 书店的ID
     * @param: coupon_id 优惠券ID
     * @return:
     */
    getCoupon: function(goods_store_id, coupon_id) {
      this.cartGoodsShops.forEach(shop => {
        if (shop.goods_store_id == goods_store_id) {
          shop.coupon.available.forEach(signle_coupon => {
            if (signle_coupon.coupon_id == coupon_id) {
              signle_coupon.has_received = true;
              shop.coupon.gotnumber++;
            }
          });
        }
      });
    },
    /**
     * @function: selectShowCoupon 根据书店的ID显示优惠券多个书店只显示一个优惠券菜单
     * @param: store_id 书店的ID
     * @return: 
     */
    selectShowCoupon: function(store_id) {
      this.cartGoodsShops.forEach(shop => {
        if (shop.goods_store_id == store_id) {
          shop.showCoupon = !shop.showCoupon;
        } else {
          shop.showCoupon = false;
        }
      });
    },
    /**
     * @function: IncreaseCnt 增加Item图书的选择数量
     * @param: Item 每一个图书的所有属性
     * @return:
     */
    IncreaseCnt: function(Item) {
      if (
        Item.book_des.num + 1 > Item.book_des.buy_limit &&
        Item.book_des.buy_limit != -1
      ) {
        this.$swal({
          title: "淘书斋提醒",
          text:
            "当前商品限购" +
            Item.book_des.buy_limit +
            "件，最大选择" +
            Item.book_des.buy_limit,
          type: "info",
          showCancelButton: false
        });
        Item.book_des.num = Item.book_des.buy_limit;
      } else {
        Item.book_des.num++;
      }
      this.handleBooks(2, Item.book_des.ID, false);
      // console.log("Increase Cnt" + Item.book_des.num);
    },
    /**
     * @function: DecreaseCnt 减少Item图书的选择数量
     * @param: Item 每一个图书的所有属性
     * @return:
     */
    DecreaseCnt: function(Item) {
      if (Item.book_des.num === 1) {
        this.$swal({
          title: "淘书斋提醒",
          text: "当前至少选择一件商品",
          type: "info",
          showCancelButton: false
        });
      } else {
        Item.book_des.num--;
      }
      this.handleBooks(2, Item.book_des.ID, false);
    },
    /**
     * @function: InputChange 输入框输入书籍的数量
     * @param: Item 每本图书的所有属性
     * @return:
     */
    InputChange: function(Item) {
      if (isNaN(Item.book_des.num)) {
        this.$swal({
          title: "淘书斋提醒",
          text: "你输入的不是一个有效的整数，请重新输入",
          type: "info",
          showCancelButton: false
        });
        Item.book_des.num = 1;
      } else if (Item.book_des.num <= 0) {
        this.$swal({
          title: "淘书斋提醒",
          text: "当前至少选择一件商品",
          type: "info",
          showCancelButton: false
        });
        Item.book_des.num = 1;
      } else if (
        parseInt(Item.book_des.num) + 1 > Item.book_des.buy_limit &&
        Item.book_des.buy_limit != -1
      ) {
        this.$swal({
          title: "淘书斋提醒",
          text:
            "当前商品限购" +
            Item.book_des.buy_limit +
            "件，最大选择" +
            Item.book_des.buy_limit,
          type: "info",
          showCancelButton: false
        });
        Item.book_des.num = Item.book_des.buy_limit;
      }
      this.handleBooks(2, Item.book_des.ID, false);
    },
    /**
     * @function: moveIntoLocale 把当前商品移入收藏夹
     * @param: Item 当前物品
     * @return:
     */
    moveIntoLocale: function(Item) {
      //移入收藏夹
      console.log("移入当前商品收藏夹");
    },
    /**
     * @function: moveSeletedtoLocale 把当前选中商品移入收藏夹
     * @return:
     */
    moveSeletedtoLocale: function() {
      //移入选中到收藏夹
      console.log("移入选中的进入收藏夹");
    },
    /**
     * @function: removeItem 把当前商品删除
     * @param: Item 当前物品
     * @return:
     */
    removeItem: function(Item) {
      const self = this;
      //删除商品
      this.$swal({
        title: "淘书斋提醒",
        text:
          "确定删除《" +
          Item.book_name +
          "》[" +
          Item.book_des.author +
          " 著] 的图书吗?",
        type: "question",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        focusCancel: true
      }).then(ret => {
        if (ret.value) {
          var temp = [];
          self.cartGoodsShops.forEach(shop => {
            shop.goods_info.forEach((book, index) => {
              if (book.book_des.ID == Item.book_des.ID) {
                if (book.book_des.tight_stock == true) self.TightstockNum--;
                book.isChecked = false; //清除 选择
                self.cartGoodsNum--;
              } else {
                temp.push(book);
              }
            });
            shop.goods_info = temp;
          });
          temp = [];
          self.cartGoodsShops.forEach((shop, index) => {
            if (shop.goods_info.length != 0) {
              temp.push(shop);
            }
          });
          self.cartGoodsShops = temp;
          this.$swal({
            title: "淘书斋提醒",
            text:
              "删除《" +
              Item.book_name +
              "》[" +
              Item.book_des.author +
              " 著] 的图书成功",
            type: "success",
            showCancelButton: false
          });
          this.handleBooks(2, Item.book_des.ID, false);
        }
      });
    },
    /**
     * @function: removeSeleted 把当前选中商品删除
     * @return:
     */
    removeSeleted: function() {
      if (this.SelectedAllShops.length == 0) {
        return;
      }
      let Removetext = "删除";
      this.SelectedAllShops.forEach(Item => {
        Removetext += "《" + Item.bookName + "》[" + Item.bookAuthor + " 著],";
      });
      this.$swal({
        title: "淘书斋提醒",
        text: "确定" + Removetext + "的图书吗？",
        type: "question",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        focusCancel: true
      }).then(ret => {
        if (ret.value) {
          const self = this;
          var temp;
          this.SelectedAllShops.forEach(Item => {
            temp = [];
            self.cartGoodsShops.forEach(shop => {
              shop.goods_info.forEach((book, index) => {
                if (book.book_des.ID == Item.bookID) {
                  book.isChecked = false;
                  self.cartGoodsNum--;
                } else {
                  temp.push(book);
                }
              });
              shop.goods_info = temp;
            });
          });
          temp = [];
          self.cartGoodsShops.forEach((shop, index) => {
            if (shop.goods_info.length != 0) {
              temp.push(shop);
            }
          });
          self.cartGoodsShops = temp;
          this.$swal({
            title: "淘书斋提醒",
            text: "删除" + Removetext + "的图书成功",
            type: "success",
            showCancelButton: false
          });
          self.SelectedAllShops = [];
          self.allTotalMoney = 0.0;
          self.allCount = 0;
        }
      });
    },
    /**
     * @function: 保证单选，多选，全选的情况，并计算生产选中的商品以及动态计算支付成本
     * @param: handleType: 0.全选 1.某个书店被全部选择 2.某一本书被选中
     * @param: Item: 可以是null, 可以是某个书店的id, 或者是书本的id
     * @param: flag: 手否去掉更新checked属性
     * @return:
     */
    handleBooks: function(handleType, id, flag) {
      const self = this;
      //更新 checked 属性
      if (flag) {
        if (handleType == 0) {
          this.isAllSelected = !this.isAllSelected;
          this.cartGoodsShops.forEach(shop => {
            shop.isChecked = self.isAllSelected;
            shop.goods_info.forEach(book => {
              if (!book.book_invalid) {
                book.isChecked = self.isAllSelected;
              }
            });
          });
        } else if (handleType == 1) {
          this.cartGoodsShops.forEach(shop => {
            if (shop.goods_store_id == id) {
              var isShopChecked = !shop.isChecked;
              shop.isChecked = isShopChecked;
              shop.goods_info.forEach(book => {
                if (!book.book_invalid) book.isChecked = isShopChecked;
              });
            }
          });
        } else if (handleType == 2) {
          this.cartGoodsShops.forEach(shop => {
            shop.goods_info.forEach(book => {
              if (book.book_des.ID == id && !book.book_invalid) {
                book.isChecked = !book.isChecked;
              }
            });
          });
        }
      }
      //计算 checked的书籍 并且更新 Selected
      //先清空 选择的数据
      this.SelectedAllShops = [];
      this.cartGoodsShops.forEach(shop => {
        shop.goods_info.forEach(book => {
          if (book.isChecked && !book.book_invalid) {
            self.SelectedAllShops.push({
              ID: self.randomWord(false, 20), //订单ID
              bookStoreID: shop.goods_store_id,
              bookStoreName: shop.goods_store_name,
              bookName: book.book_name,
              bookID: book.book_des.ID,
              bookAuthor: book.book_des.author,
              bookPrice: book.book_des.dis_price,
              bookCnt: book.book_des.num,
              bookTotal: (book.book_des.dis_price * book.book_des.num).toFixed(
                2
              )
            });
          }
        });
      });
      //计算需要支付的金额
      this.allTotalMoney = 0.0;
      this.allCount = 0;
      this.SelectedAllShops.forEach(book_order => {
        self.allCount += parseInt(book_order.bookCnt);
        self.allTotalMoney += parseFloat(book_order.bookTotal);
      });
    },
    /**
     * @function: randomWord 生产随机字符串
     * @param: randomFlag
     * @param: min
     * @param: max
     * @return:
     */
    randomWord: function(randomFlag, min, max) {
      var str = "",
      range = min,
      arr = [
          "0","1","2","3","4","5","6","7","8","9",
          "a","b","c","d","e","f","g","h","i","j",
          "k","l","m","n","o","p","q","r","s","t",
          "u","v","w","x","y","z","A","B","C","D",
          "E","F","G","H","I","J","K","L","M","N",
          "O","P","Q","R","S","T","U","V","W","X",
          "Y","Z"
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
    /**
     * @function: submitCheck 提交订单
     * @param:
     * @return:
     */
    submitCheck: function() {
      console.log("提交订单");
    },
    /**
     * @function: getHeight 获取div高度设置
     * @param: Item 
     * @return:
     */
    getHeight: function(Item) {
      return Item.goods_info.length * 145;
    },
    /**
     * @function: init_cart_book 初始化购物车数据
     * @param:
     * @return:
     */
    async init_cart_book() {
      const RetData = await this.axios_get("static/json/cart.json", []);
      const _this = this;
      if (RetData != false) {
        RetData.data.forEach(data => {
          if (data.id == "1") {
            _this.cartGoodsShops = data.goods;
            _this.cartGoodsShops.forEach(books => {
              var goods = books.goods_info;
              _this.cartGoodsNum += Object.keys(goods).length;
              goods.forEach(book => {
                if (book.book_des.tight_stock) _this.TightstockNum++;
              });
            });
          }
        });
      }
    }
  },
  computed: {},
  async created() {
    await this.init_cart_book();
  },
  mounted() {},
  computed: {
    AllBooksCleared() {
      return this.cartGoodsShops.length == 0;
    }
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
  height: auto;
  /*border:solid 1px red;*/
  padding: 5px;
  min-height: 200px;
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
  margin-top: 10px;
}
.favorcontent {
  position: absolute;
  width: 338px;
  border: solid 1px #efefef;
  padding: 5px 8px;
  background: #fff;
  margin-top: 10px;
}
.angle {
  border-style: solid;
  border-width: 6px;
  font-size: 0;
  height: 0;
  line-height: 0;
  position: absolute;
  width: 0;
  border-color: transparent transparent rgb(231, 224, 2);
  _border-color: #ff4401 #ff4401 #fff;
  left: 12%;
  top: -12px;
  margin-left: -6px;
  box-shadow: 0 1px 0 #fff;
  bottom: 2px;
}
.favortips {
  height: 36px;
  padding: 11px 10px 6px 8px;
  width: 100%;
  border-bottom: solid 1px #efefef;
}
.favortips span {
  font-size: 12px;
  padding-left: 10px;
}

.coupon-list li {
  width: 100%;
  height: 30px;
  margin: 10px 0;
}
.coupon-amount {
  float: left;
  width: 55px;
  height: 25px;
  line-height: 25px;
  background-position: -125px -25px;
  font-size: 14px;
  font-weight: 700;
  font-family: Arial;
  padding-left: 8px;
  background: transparent url(/static/images/favor.png) no-repeat;
}
.coupon-amount .rmb {
  font-weight: 400;
  padding-right: 2px;
  font-size: 12px;
}
.coupon-detail .coupon-info {
  float: left;
  width: 166px;
  line-height: 1;
  margin-left: 10px;
}
.coupon-detail .coupon-info .coupon-title {
  font-size: 12px;
  margin-bottom: 5px;
  color: #6d6d6d;
}
.coupon-detail .coupon-info .coupon-time {
  font-size: 12px;
  color: #a5a5a5;
  font-family: Tahoma;
}
.coupon-op .coupon-button {
  float: right;
  color: #666;
  display: block;
  width: auto;
  height: 23px;
  border: 1px solid #e9e9e9;
  line-height: 23px;
  text-align: center;
  margin-right: 25px;
}
.close-coupon {
  position: absolute;
  right: 20px;
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
  height: 24px;
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