<template>
  <div class="main">
    <header class="trade-header">
      <div class="col-md-2 trade-header-logo"></div>
      <div class="col-md-9 trade-header-nav">
        <ul class="col-md-7">
          <li>首页</li>
          <li @mouseover="showUserSetting=true" @mouseleave="showUserSetting=false">
            账户设置
            <transition name="fade">
              <div
                class="user-setting"
                @mouseleave="showUserSetting=false"
                v-show="showUserSetting"
              >
                <div class="user-angle"></div>
                <dl class="user-sub-col1 fl">
                  <dt>安全设置</dt>
                  <dd>
                    <p>
                      <a href="#">修改登录密码</a>
                    </p>
                    <p>
                      <a href="#">手机绑定</a>
                    </p>
                    <p>
                      <a href>密保问题设置</a>
                    </p>
                    <p>
                      <a href="#">其他</a>
                    </p>
                  </dd>
                </dl>
                <dl class="user-sub-col2 fl">
                  <dt>个人资料</dt>
                  <dd>
                    <p>
                      <a href="#">收货地址</a>
                    </p>
                    <p>
                      <a href="#">修改头像、昵称</a>
                    </p>
                    <p>
                      <a href="#">消息提醒设置</a>
                    </p>
                    <p>
                      <a href="#">隐私设置</a>
                    </p>
                  </dd>
                </dl>
                <dl class="user-sub-col3 fl">
                  <dt>账号绑定</dt>
                  <dd>
                    <p>
                      <a href="#">支付宝绑定</a>
                    </p>
                    <p>
                      <a href="#">微博绑定</a>
                    </p>
                    <p>
                      <a href="#">分享绑定</a>
                    </p>
                  </dd>
                </dl>
              </div>
            </transition>
          </li>
          <li>消息</li>
        </ul>
        <div class="col-md-4 input-group trade-header-search">
          <input class="form-control" type="password" placeholder="搜 索" style="height:40px" />
          <span class="input-group-addon">
            <i class="fa fa-search fa-1x"></i>
          </span>
        </div>
      </div>
    </header>
    <div class="trade-content" id="content">
      <div class="mytrade-panel">
        <div class="col-md-2">
          <div class="mytrade-menu-tree">
            <dl class="mytrade-menu-item">
              <dt>全部功能</dt>
              <dd>
                <a href="#">我的购物车</a>
              </dd>
              <dd>
                <a href="#">已买到的宝贝</a>
                <i class="fa fa-toggle-down fr" v-if="!bExpandAll" @click="bExpandAll=true"></i>
                <i class="fa fa-toggle-up fr" v-else @click="bExpandAll=false"></i>
                <transition name="fade">
                  <ul class="trade-list" v-show="bExpandAll">
                    <li>
                      <a href="#">我的拍卖</a>
                    </li>
                    <li>
                      <a href="#">我的保险</a>
                    </li>
                    <li>
                      <a href="#">我的彩票</a>
                    </li>
                    <li>
                      <a href="#">官方彩运</a>
                    </li>
                  </ul>
                </transition>
              </dd>
              <dd>
                <a href="#">购买过的店铺</a>
              </dd>
              <dd>
                <a href="#">我的发票</a>
              </dd>
              <dd>
                <a href="#">我的积分</a>
              </dd>
              <dd>
                <a href="#">我的收藏</a>
              </dd>
              <dd>
                <a href="#">我的优惠信息</a>
              </dd>
              <dd>
                <a href="#">评价管理</a>
              </dd>
              <dd>
                <a href="#">退款维权</a>
              </dd>
              <dd>
                <a href="#">流量钱包</a>
              </dd>
            </dl>
          </div>
        </div>
        <div class="col-md-10">
          <div class="mytrade-main">
            <div class="mytrade-main-nav">
              <div class="fl" :class="currentNavSelect==1? 'mytrade-main-nav-selected':''">
                <a
                  href="#"
                  @click="currentNavSelect=1"
                  :class="currentNavSelect==1? 'mytrade-main-p-selected':''"
                >所有订单</a>
              </div>
              <div class="fl" :class="currentNavSelect==2? 'mytrade-main-nav-selected':''">
                <a
                  href="#"
                  @click="currentNavSelect=2"
                  :class="currentNavSelect==2? 'mytrade-main-p-selected':''"
                >待付款</a>
              </div>
              <div class="fl" :class="currentNavSelect==3? 'mytrade-main-nav-selected':''">
                <a
                  href="#"
                  @click="currentNavSelect=3"
                  :class="currentNavSelect==3? 'mytrade-main-p-selected':''"
                >待发货</a>
              </div>
              <div class="fl" :class="currentNavSelect==4? 'mytrade-main-nav-selected':''">
                <a
                  href="#"
                  @click="currentNavSelect=4"
                  :class="currentNavSelect==4? 'mytrade-main-p-selected':''"
                >待收货</a>
              </div>
              <div class="fl" :class="currentNavSelect==5? 'mytrade-main-nav-selected':''">
                <a
                  href="#"
                  @click="currentNavSelect=5"
                  :class="currentNavSelect==5? 'mytrade-main-p-selected':''"
                >待评价</a>
              </div>
              <div class="fl" :class="currentNavSelect==6? 'mytrade-main-nav-selected':''">
                <a
                  href="#"
                  @click="currentNavSelect=6"
                  :class="currentNavSelect==6? 'mytrade-main-p-selected':''"
                >分阶段</a>
              </div>
              <div class="fr trash-order">
                <a href="#">
                  <i class="fa fa-trash">订单回收站</i>
                </a>
              </div>
            </div>
            <div class="mytrade-main-search">
              <div class="input-group fl">
                <input class="form-control" type="text" placeholder="输入商品标题或订单号进行搜索" />
                <span class="input-group-addon btn btn-primary">
                  <i class="fa fa-search fa-fw"></i>
                </span>
              </div>
              <div class="fl">
                <a href="#" class="btn btn-link fl" @click="changeSearchType">
                  {{orderSearchString}}筛选条件
                  <i
                    class="fa"
                    :class="orderSearchString=='详细'? 'fa-angle-up':'fa-angle-down'"
                  ></i>
                </a>
              </div>
            </div>
            <transition name="fade">
              <div class="screen row" v-show="orderSearchString=='详细'">
                <div class="col-md-3">
                  <label
                    for="order_type"
                    class="control-label col-md-4"
                    style="margin-top:8px; padding:0"
                  >订单类型</label>
                  <div class="from-group col-md-8">
                    <select id="order_type" class="form-control">
                      <option :value="item" v-for="(item,index) in orderType" :key="index">{{item}}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-8">
                  <label
                    for="order_time"
                    class="control-label col-md-2"
                    style="margin-top:8px; padding:0"
                  >成交时间</label>
                  <div class="form-group col-md-4">
                    <input type="date" class="form-control col-md" placeholder="开始时间" />
                  </div>
                  <div class="col-md-1" style="padding:6px 10px">到</div>
                  <div class="form-group col-md-4">
                    <input type="date" class="form-control col-md" placeholder="结束时间" />
                  </div>
                </div>
                <div class="col-md-3">
                  <label
                    for="order_seller_nichen"
                    class="control-label col-md-4"
                    style="margin-top:8px; padding:0"
                  >卖家昵称</label>
                  <div class="form-group col-md-8">
                    <input
                      type="text"
                      placeholder="卖家昵称"
                      id="order_seller_nichen"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <label
                    for="order_evaluate_state"
                    class="control-label col-md-4"
                    style="margin-top:8px; padding:0"
                  >评价状态</label>
                  <div class="form-group col-md-8">
                    <select id="order_evaluate_state" class="form-control">
                      <option
                        :value="item"
                        v-for="(item,index) in orderEvalateType"
                        :key="index"
                      >{{item}}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <label
                    for="order_status"
                    class="control-label col-md-4"
                    style="margin-top:8px; padding:0"
                  >交易状态</label>
                  <div class="form-group col-md-8">
                    <select id="order_status" class="form-control">
                      <option
                        :value="item"
                        v-for="(item,index) in orderStatus"
                        :key="index"
                      >{{item}}</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <label
                    for="order_service_status"
                    class="control-label col-md-4"
                    style="margin-top:8px; padding:0"
                  >服务状态</label>
                  <div class="form-group col-md-8">
                    <select id="order_service_status" class="form-control">
                      <option
                        :value="item"
                        v-for="(item,index) in orderServiceType"
                        :key="index"
                      >{{item}}</option>
                    </select>
                  </div>
                </div>
              </div>
            </transition>
            <ul class="mytrade-table-header-list">
              <li class="col-md-4">
                <a href="#">宝贝</a>
              </li>
              <li class="col-md-1">
                <a href="#">单价</a>
              </li>
              <li class="col-md-1">
                <a href="#">数量</a>
              </li>
              <div class="col-md-6">
                <li class="col-md-3">
                  <a href="#">商品操作</a>
                </li>
                <li class="col-md-3">
                  <a href="#">实付款</a>
                </li>
                <li class="col-md-3">
                  <a href="#">交易状态</a>
                </li>
                <li class="col-md-3">
                  <a href="#">交易操作</a>
                </li>
              </div>
            </ul>
            <div class="mytrade-table-list">
              <div class="fr">
                <button class="btn btn-default">上一页</button>
                <button class="btn btn-default">下一页</button>
              </div>
              <ul class="mytrade-table-main-list">
                <li
                  class="mytrade-table-main-list-item"
                  v-for="(item,index ) in orderList"
                  :key="index"
                >
                  <div class="item-header">
                    <div class="col-md-4">
                      <input type="checkbox" class="fl" style="margin-top:15px" />
                      <b>{{item.order_date}}</b>
                      <span>订单号:{{item.order_id}}</span>
                    </div>
                    <div class="col-md-2">
                      <a href="#" class="fl">
                        <img src="static/images/tm.png" width="16" height="16" />
                      </a>
                      <a href="#">
                        <span class="item-store fl">&nbsp;{{item.order_store}}</span>
                      </a>
                    </div>
                    <div class="col-md-6">
                      <div class="col-md-3">
                        <a href="#" class="hvr-float-shadow">
                          <img src="static/images/contact.jpeg" width="15" height="15" alt="#" />
                        </a>
                        <span class="item-contact">和我聯繫</span>
                      </div>
                      <div class="col-md-6"></div>
                      <div class="col-md-3">
                        <a class="item-ops fr">
                          <i class="fa fa-trash fa-fw fa-2x"></i>
                        </a>
                        <a class="item-ops fr">
                          <i class="fa fa-flag fa-fw fa-2x"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="item-main">
                    <div class="col-md-4">
                      <div class="col-md-4">
                        <img :src="item.order_pic" class="img-responsive" height="120" />
                      </div>
                      <div class="col-md-8">
                        <span class="item-link">
                          <a
                            href="#"
                          >{{item.order_advertisement}}重庆移动 手机 话费充值 20元 快充直充asdasdasdasdasdasdasd 24小时自动充 快速到帐</a>
                        </span>
                        <p class="item-link">{{item.order_info}}</p>
                        <span>
                          <img src="static/images/fenqi.png" />
                          <img src="static/images/7day.jpg" />
                          <img src="static/images/guarantee.png" />
                        </span>
                      </div>
                    </div>
                    <div class="col-md-1">&yen;&nbsp;{{item.order_s_price}}</div>
                    <div class="col-md-1">{{item.order_num}}</div>
                    <div class="col-md-6 item-other">
                      <div class="col-md-3">
                        <a :href="item.order_service_link">申请售后</a>
                      </div>
                      <div class="col-md-3">
                        <span>&yen;&nbsp;{{item.order_total_price}}</span>
                        <p>(自动充值)</p>
                        <a href="#" v-show="item.order_tel">
                          <img src="static/images/book_tel.png" />
                        </a>
                      </div>
                      <div class="col-md-3">
                        <p>充值成功</p>
                        <a :href="'/book_info?id='+item.order_id">订单详情</a>
                        <br />
                        <a :href="'/book_info?id='+item.order_id+'&type=hb'">花呗账单</a>
                      </div>
                      <div class="col-md-3">
                        <a :href="'/book_recomment?id='+item.order_id">追加评论</a>
                        <br />
                        <a :href="''">再次购买</a>
                        <br />
                        <button class="btn btn-primary btn-sm">
                          <a href="#">查看禮包</a>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="item-another" v-show="item.order_enableInsure">
                    <div class="col-md-4">保险服务</div>
                    <div class="col-md-4">&yen;&nbsp;{{item.order_insure}}</div>
                  </div>
                </li>
              </ul>
              <ul class="pagination fr">
                <li class="page-item">
                  <a class="page-link" href="#">Previous</a>
                </li>
                <li class="page-item" v-for="(item, index) in pageRange" :key="index">
                  <a class="page-link" href="#">{{item}}</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">Next</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TradeBody",
  data: function() {
    return {
      showUserSetting: false,
      showflag: false,
      currentNavSelect: 1,
      orderType: [
        "全部",
        "机票订单",
        "数字订单",
        "理财订单",
        "网游订单",
        "酒店订单",
        "保险订单",
        "企采订单"
      ],
      orderEvalateType: [
        "全部",
        "需我评价",
        "我已评价",
        "对方已评",
        "双方已评"
      ],
      orderStatus: [
        "全部",
        "等待买家付款",
        "付款确认中",
        "买家已付款",
        "买家已发货",
        "交易成功",
        "交易关闭",
        "退款中订单"
      ],
      orderServiceType: ["全部", "退款中", "已投诉"],
      orderSearchString: "",
      orderList: [
        {
          order_id: "833937697270767647",
          order_date: "2020-02-10",
          order_store: "中國移動官方旗艦店",
          order_link: "http://",
          order_pic: "static/upload/阿甘正传.jpg",
          order_advertisement:
            "重庆移动 手机 话费充值 20元 快充直充24小时自动充 快速到帐",
          order_info: "颜色：【春秋款】灰色(条纹男孩)尺码：185/2XL[加绒加厚]",
          order_s_price: 20.0,
          order_num: 1,
          order_service_link: "https://",
          order_total_price: 20.0,
          order_tel: true,
          order_insure: 0.0,
          order_enableInsure: true,
          order_status: 1
        },
        {
          order_id: "833937697270767647",
          order_date: "2020-02-10",
          order_store: "中國聯通官方旗艦店",
          order_link: "http://",
          order_pic: "static/upload/大客户.jpg",
          order_advertisement:
            "重庆移动 手机 话费充值 20元 快充直充24小时自动充 快速到帐",
          order_info: "颜色：【春秋款】灰色(条纹男孩)尺码：185/2XL[加绒加厚]",
          order_s_price: 20.0,
          order_num: 1,
          order_service_link: "https://",
          order_total_price: 20.0,
          order_tel: true,
          order_insure: 0.0,
          order_enableInsure: true,
          order_status: 1
        },
        {
          order_id: "833937697270767647",
          order_date: "2020-02-10",
          order_store: "中國聯通官方旗艦店",
          order_link: "http://",
          order_pic: "static/upload/白鹿原.jpg",
          order_advertisement:
            "重庆移动 手机 话费充值 20元 快充直充24小时自动充 快速到帐",
          order_info: "颜色：【春秋款】灰色(条纹男孩)尺码：185/2XL[加绒加厚]",
          order_s_price: 20.0,
          order_num: 1,
          order_service_link: "https://",
          order_total_price: 20.0,
          order_tel: true,
          order_insure: 0.0,
          order_enableInsure: false,
          order_status: 1
        }
      ],
      bExpandAll: true,
      pageRange:[1,2,3,4,5]
    };
  },
  methods: {
    changeSearchType: function() {
      if (this.orderSearchString == "精简") {
        this.orderSearchString = "详细";
      } else {
        this.orderSearchString = "精简";
      }
    },
    checkshowUserSetting: function() {
      if (this.showUserSetting && !this.showflag) {
        this.showUserSetting = !this.showUserSetting;
        this.showflag = true;
      }
    }
  }
};
</script>

<style scope>
.trade-header {
  width: 100%;
  height: 60px;
  background: #ff4401;
}
.trade-header-logo {
  height: 100%;
}

.trade-header-nav ul {
  height: 100%;
  margin-bottom: 0;
  padding: 10px 0;
}

.trade-header-nav ul li {
  font-size: 14px;
  width: 100px;
  height: 100%;
  color: white;
  padding: 10px 0;
}
.trade-header-search {
  padding: 10px 0;
}
.trade-header-search span {
  cursor: pointer;
}
.user-setting {
  top: 59px;
  left: -100px;
  position: absolute;
  width: 472px;
  height: 200px;
  background: white;
  padding: 18px 0;
  box-shadow: 0 1px 2px #ddd;
  border: 1px solid #e1e1e1;
  z-index: 3;
}
.user-setting dl {
  width: 33%;
  height: 100%;
  padding: 0 26px;
}
.user-setting dl dd {
  margin-top: 20px;
}
.user-sub-col1 dd p {
  height: 22px;
}
.user-sub-col1 dt {
  color: #3aac8a;
}
.user-sub-col2 dt {
  color: #ea746b;
}
.user-sub-col3 dt {
  color: #398ee8;
}
.user-angle {
  border-style: solid;
  border-width: 6px;
  font-size: 0;
  height: 0;
  line-height: 0;
  position: absolute;
  width: 0;
  border-color: transparent transparent #fff;
  _border-color: #ff4401 #ff4401 #fff;
  left: 50%;
  top: -12px;
  margin-left: -6px;
  box-shadow: 0 1px 0 #fff;
  bottom: 2px;
}

.trade-content {
  padding: 0 5%;
  /* height: 1200px; */
  overflow-y: auto;
}
.mytrade-panel {
  width: 100%;
  height: 100%;
  clear: both;
  padding-top: 20px;
}
.mytrade-menu-tree {
  overflow: inherit;
  margin-top: -5px;
}
.mytrade-menu-item {
  width: 100%;
  font-size: 12px;
}
.mytrade-menu-item dt {
  font-size: 15px;
  line-height: 28px;
  margin: 5px 10px 1px 0;
  color: #f40;
}
a {
  color: black;
}
a:hover {
  color: #f40;
}
.mytrade-menu-item dd {
  margin: 10px 0;
  height: 20px;
  font-size: 12px;
  height: 100%;
}
.mytrade-menu-item dd a {
  font-size: 12px;
  height: 20px;
  line-height: 20px;
}
ul.trade-list li {
  width: 100%;
  margin: 5px 0 0 15px;
  height: 26px;
}

div.mytrade-main-nav {
  width: 100%;
  height: 40px;
  padding: 10px 0;
  /* border: 1px solid red; */
  margin: 0%;
}
.mytrade-main-nav div {
  width: 100px;
  text-align: center;
}
.mytrade-main-nav div a {
  font-size: 16px;
  font-weight: bold;
}

.mytrade-main-p-selected {
  color: #ff6000;
}
.mytrade-main-nav-selected {
  border-bottom: 2px solid #ff6000;
}

.trash-order a i {
  font-size: 12px;
  color: #6c6c6c;
}
.mytrade-main-search {
  margin-top: 20px;
  width: 100%;
  height: 60px;
}
.mytrade-main-search div.input-group {
  width: 300px;
  margin: 0;
}

ul.mytrade-table-header-list {
  width: 100%;
  height: 40px;
  background: rgb(245, 245, 245);
  border: 1px solid #e8e8e8;
}

ul.mytrade-table-header-list li {
  text-align: center;
  line-height: 40px;
}
div.mytrade-table-list {
  width: 100%;
  height: auto;
}
ul.mytrade-table-main-list {
  margin: 10px 0 0 0;
}

li.mytrade-table-main-list-item {
  width: 100%;
  height: auto;
  margin-top: 10px;
  border-bottom: 1px solid #ececec;
  border-left: 1px solid #ececec;
  border-right: 1px solid #ececec;
}

li.mytrade-table-main-list-item:hover {
  border-bottom: 1px solid #eeeeee;
  border-left: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}

div.item-header {
  width: 100%;
  height: 42px;
  background: #ececec;
  line-height: 42px;
  padding: 0 10px;
  text-align: center;
}
div.item-header div {
  height: 100%;
}
span.item-store {
  line-height: 42px;
  width: 100px;
  font-size: 10px;
  overflow: hidden;
  white-space: nowrap;
  word-break: break-all;
  text-overflow: ellipsis;
}
span.item-contact {
  line-height: 42px;
  font-size: 12px;
  background: rgb(250, 236, 150);
  border: 1px solid #fefefe;
}
.item-ops i {
  line-height: 42px;
}

div.item-main {
  height: 150px;
  padding: 15px 5px;
}

span.item-link {
  font-size: 12px;
  overflow: hidden;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
div.item-other div {
  text-align: center;
}

div.col-md-3 a,
p {
  font-size: 12px;
}
div.item-another {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #ececec;
  border-left: 1px solid #ececec;
  border-right: 1px solid #ececec;
  line-height: 50px;
}

div.item-another:hover {
  border-bottom: 1px solid #eeeeee;
  border-left: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}
div.menu-sub {
  height: 30px;
  line-height: 30px;
}
</style>                