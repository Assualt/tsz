<template>
  <div class="main_right">
    <div class="main_head">
      <ul class="nav nav-tabs nav-tabs-justified">
        <li :class="checkCurrent(0)">
          <a href="#" @click="clickTo(0)">登录</a>
        </li>
        <li :class="checkCurrent(1)">
          <a href="#" @click="clickTo(1)">基本资料</a>
        </li>
        <li :class="checkCurrent(2)">
          <a href="#" @click="clickTo(2)">收货地址</a>
        </li>
        <li :class="checkCurrent(3)">
          <a href="#" @click="clickTo(3)">图书管理</a>
        </li>
        <li :class="checkCurrent(4)">
          <a href="#" @click="clickTo(4)">售卖记录</a>
        </li>
        <li :class="checkCurrent(5)">
          <a href="#" @click="clickTo(5)">买入</a>
        </li>
        <li :class="checkCurrent(6)">
          <a href="#" @click="clickTo(6)">登录日志</a>
        </li>
        <li :class="checkCurrent(7)">
          <a href="#" @click="clickTo(7)">评估</a>
        </li>
        <li :class="checkCurrent(8)">
          <a href="#" @click="clickTo(8)">其他</a>
        </li>
      </ul>
    </div>
    <div class="tab-content main_body">
      <div class="tab-pane in active" id="login" v-if="currentState == 0">
        <h1>{{title}}</h1>
        <hr />
        <form action class="form-horizontal" role="form" method="get">
          <div class="form-group">
            <label for="username" class="col-md-3 control-label">
              <i class="fa fa-user text-danger"></i>
            </label>
            <div class="col-md-7">
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="用户名/邮箱/电话"
                required="required"
                v-model="submitData.username"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="password" class="col-md-3 control-label">
              <i class="fa fa-lock text-success" aria-hidden="true"></i>
            </label>
            <div class="col-md-7">
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="键入密码"
                required="required"
                v-model="submitData.password"
              />
            </div>
          </div>
          <div class="form-group" v-if="CurrentMode==1">
            <label for="password1" class="col-md-3 control-label">
              <i class="fa fa-lock text-success" aria-hidden="true"></i>
            </label>
            <div class="col-md-7">
              <input
                type="password"
                class="form-control"
                id="password1"
                placeholder="再次键入密码"
                required="required"
                v-model="submitData.againpsw"
                @blur="checkPasswprd"
              />
            </div>
          </div>
          <div class="form-group" v-if="CurrentMode==1">
            <label for="cofrimNumber" class="col-md-3 control-label">
              <i class="fa fa-check-circle" aria-hidden="true"></i>
            </label>
            <div class="col-md-7" style="display:flex;">
              <input
                type="text"
                class="form-control"
                id="cofrimNumber"
                placeholder="输入验证码"
                required="required"
                v-model="submitData.confirmp"
                size="6"
              />
              <a
                class="btn btn-link"
                @click="getConfirmNum"
                :disabled="confirmData.show"
                :title="confirmData.title"
              >获取验证码</a>
              <div
                class="ConfrimNumtooltips"
                v-if="confirmData.show"
              >{{confirmData.confirSeconds}}s 后重新获取验证码</div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-3"></div>
            <div class="col-sm-2">
              <input
                value="重置"
                class="btn btn-primary form-control"
                @click="submitData.password= ''; submitData.againpsw ='';"
              />
            </div>
            <div class="col-sm-2">
              <input
                v-if="Mode==0"
                value="登录"
                class="btn btn-warning form-control"
                @click="onSubmit"
              />
              <input
                v-else-if="Mode==1"
                value="注册"
                class="btn btn-warning form-control"
                @click="onRegister"
              />
            </div>
            <div class="col-sm-2" id="forget_psw">
              <a href="#" class="btn btn-link" @click="forgetPassword">忘记密码?</a>
            </div>
          </div>
        </form>
        <hr />
        <div>
          <h5>使用第三方账号进行登录</h5>
          <div class="loginOtherWays">
            <button type="button" class="fa fa-renren btn btn-primary btn-lg">&nbsp;人人网登录</button>
            <div class="col-md-1"></div>
            <button type="button" class="fa fa-qq btn btn-success btn-lg">&nbsp;qq登录</button>
            <div class="col-md-1"></div>
            <button type="button" class="fa fa-weibo btn btn-lg btn-info">&nbsp;微博登录</button>
            <div class="col-md-1"></div>
            <button type="button" class="fa fa-weixin btn btn-lg btn-danger">&nbsp;微信登录</button>
          </div>
        </div>
      </div>
      <div class="tab-pane in active" id="basic_info" v-else-if="currentState==1">
        <div class="container-fluid">
          <form class="form-horizontal" role="form" id="basic_info_1">
            <fieldset>
              <legend>
                <h3>基本账户信息</h3>
              </legend>
              <div class="col-md-9">
                <div class="form-group">
                  <label class="control-label col-md-2" for="account">账号</label>
                  <div class="col-md-7">
                    <input
                      type="text"
                      v-model="userInfo.account"
                      class="form-control"
                      readonly
                      id="account"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-2">昵称</label>
                  <div class="col-md-7">
                    <input
                      type="text"
                      class="form-control"
                      v-model="userInfo.nickName"
                      :disabled="!bEdit"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-2">性别</label>
                  <div class="col-md-7">
                    <div class="col-md-4">
                      <input type="radio" value="0" v-model="userInfo.gender" :disabled="!bEdit" />
                      <label class="control-label">男</label>
                    </div>
                    <div class="col-md-4">
                      <input type="radio" value="1" v-model="userInfo.gender" :disabled="!bEdit" />
                      <label class="control-label">女</label>
                    </div>
                    <div class="col-md-4">
                      <input type="radio" value="2" v-model="userInfo.gender" :disabled="!bEdit" />
                      <label class="control-label">保密</label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-2">头像</label>
                  <div class="col-md-7">
                    <input
                      type="file"
                      accept="image/*"
                      :disabled="!bEdit"
                      @change="changeLogoImage($event)"
                    />
                  </div>
                </div>
                <div class="form-group" v-if="bEdit">
                  <label class="control-label col-md-2">学校</label>
                  <div class="col-md-10 form-group">
                    <div class="col-md-5">
                      <select
                        id="province"
                        class="form-control"
                        :disabled="!bEdit"
                        v-model="selectedProvince"
                        @change="selectUniversity"
                      >
                        <option
                          v-for="(item,index) in AllProvinces"
                          :value="item"
                          :key="index"
                        >{{item}}</option>
                      </select>
                    </div>
                    <div class="col-md-7">
                      <select
                        class="form-control"
                        id="school"
                        :disabled="!bEdit"
                        v-model="selectedUniversity"
                        @change="userInfo.university=selectedProvince+selectedUniversity"
                      >
                        <option
                          v-for="(item,index) in currentProviceUniversities"
                          :value="item"
                          :key="index"
                        >{{item}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="form-group" v-else>
                  <label class="control-label col-md-2">学校</label>
                  <div class="col-md-7">
                    <input
                      type="text"
                      class="form-control"
                      v-model="userInfo.university"
                      name="university"
                      :disabled="!bEdit"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-2 control-label">地址</label>
                  <div class="col-md-10">
                    <input
                      type="text"
                      class="form-control"
                      v-model="userInfo.address"
                      :disabled="!bEdit"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-md-2">描述</label>
                  <div class="col-md-10">
                    <textarea
                      :disabled="!bEdit"
                      placeholder="请输入描述性语言(150字以内)"
                      maxlength="150"
                      v-model="userInfo.description"
                    ></textarea>
                  </div>
                </div>
                <div class="form-group" id="basic_info_1_btn">
                  <button class="btn btn-link" type="button" @click="bEdit=true">修改资料</button>
                  <button
                    class="btn btn-primary"
                    @click="giveupUpdateUserInfo()"
                    :disabled="!bEdit"
                  >放弃修改</button>
                  <button class="btn btn-danger" :disabled="!bEdit" @click="updateUserInfo()">提交</button>
                </div>
              </div>
              <div class="col-md-3" align="center">
                <img
                  :src="userInfo.nickLogo.logoData"
                  alt="头像"
                  width="140"
                  height="220"
                  class="img-thumbnail"
                  id="person_pic"
                />
                <label for="person_pic" class="control-label">个人头像</label>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
      <div class="tab-pane in active" id="address_management" v-else-if="currentState==2">
        <form class="form-horizontal" id="basic_info_2">
          <fieldset>
            <legend>管理收货地址</legend>
            <div class="list-group">
              <div
                class="panel-group"
                :id="item.id | idFilter"
                v-for="(item,index) in Address"
                :key="index"
              >
                <div class="panel" :class="[item.bdefault ? 'panel-primary':'panel-default']">
                  <div class="panel-heading">
                    <h4 class="panel-title">
                      <a href="#" @click="item.bExpand=!item.bExpand">
                        {{item.detail}}
                        <span class="badge fr" v-if="item.bdefault">默认地址</span>
                      </a>
                    </h4>
                  </div>
                  <div class="panel-collapse collapse" :class="item.bExpand?'in':''">
                    <div class="panel-body">
                      <div class="col-md-10">
                        <div class="col-md-6">
                          <strong class="fl">收件人姓名:&nbsp;&nbsp;</strong>
                          <h4 class="fl list-group-item-heading">{{item.name}}</h4>
                        </div>
                        <div class="col-md-6">
                          <strong class="fl">联系电话:&nbsp;&nbsp;</strong>
                          <h4 class="list-group-item-heading fl">{{item.tel}}</h4>
                        </div>
                        <div class="col-md-12">
                          <strong class="fl">详细地址:&nbsp;&nbsp;</strong>
                          <h4 class="list-group-item-heading fl">{{item.detail}}</h4>
                        </div>
                        <div class="col-md-12">
                          <strong class="fl">邮政编码:&nbsp;&nbsp;</strong>
                          <h4
                            class="list-group-item-heading fl"
                            title="邮政编码默认为000000"
                          >{{item.postcode}}</h4>
                        </div>
                      </div>
                      <div class="col-md-2">
                        <button
                          class="btn btn-link"
                          value="edit_add"
                          type="button"
                          v-if="!item.bdefault"
                          @click="setDefaultAddress(item)"
                        >设为默认</button>
                        <button class="btn btn-link" value="edit_add" type="button">修改地址</button>
                        <button
                          class="btn btn-link"
                          value="del_add"
                          type="button"
                          @click="deleteAddress(item)"
                        >删除地址</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button class="btn btn-danger col-md-4" type="button" @click="openNewAddressModel">
                <!-- data-toggle="modal"
                data-target="#address_add_modal"
                >-->
                <span class="fa-stack fa-lg">
                  <i class="fa fa-circle-o fa-stack-2x"></i>
                  <i class="fa fa-plus fa-stack-1x"></i>
                </span>添加新的收货地址
              </button>
              <transition name="fade">
                <div
                  v-if="bshowNewAddressModel"
                  class="modal"
                  id="address_add_modal"
                  tabindex="0"
                  role="dialog"
                  aria-labelledby="address_title"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button
                          type="button"
                          class="close"
                          data-dismiss="modal"
                          aria-hidden="true"
                          @click="removePaddingAndClosingModel"
                        >&times;</button>
                        <h4 class="modal-title" id="address_title">添加收货地址</h4>
                      </div>
                      <div class="modal-body">
                        <form class="form-inline">
                          <div>
                            <div class="form-group col-md-4">
                              <label class="sr-only" for="province2">Province</label>
                              <select
                                class="form-control"
                                id="province2"
                                required
                                v-model="selectedAddress.province"
                                @change="Province2Cities"
                              >
                                <option
                                  :value="province"
                                  v-for="(province,index) in AllAddressProvince"
                                  :key="index"
                                >{{province}}</option>
                              </select>
                            </div>
                            <div class="form-group col-md-4">
                              <label class="sr-only" for="city2">City</label>
                              <select
                                class="form-control"
                                id="city2"
                                required
                                v-model="selectedAddress.city"
                                @change="City2Disticts"
                              >
                                <option
                                  :value="city"
                                  v-for="(city,index) in CurrentSelectedCities"
                                  :key="index"
                                >{{city}}</option>
                              </select>
                            </div>
                            <div class="form-group col-md-4">
                              <label class="sr-only" for="district2">District</label>
                              <select
                                class="form-control"
                                id="district2"
                                required
                                v-model="selectedAddress.distict"
                              >
                                <option
                                  :value="district"
                                  v-for="(district,index) in CurrentSelectedDistricts"
                                  :key="index"
                                >{{district}}</option>
                              </select>
                            </div>
                          </div>
                          <div class="input-group add-more">
                            <span class="fl">联系电话</span>
                            <input
                              type="tel"
                              maxlength="20"
                              placeholder="联系电话"
                              required
                              v-model="NewAddress.tel"
                            />
                          </div>
                          <div class="input-group add-more">
                            <span class="fl">姓名</span>
                            <input type="text" placeholder="姓名" required v-model="NewAddress.name" />
                          </div>
                          <div class="input-group add-more">
                            <span class="fl">邮政编码</span>
                            <input
                              type="text"
                              placeholder="姓名"
                              required
                              v-model="NewAddress.postcode"
                            />
                          </div>
                          <div class="input-group add-more">
                            <span class="fl">具体地址</span>
                            <input
                              type="text"
                              placeholder="详细地址"
                              required
                              v-model="NewAddress.detail"
                            />
                          </div>
                        </form>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-default"
                          @click="removePaddingAndClosingModel"
                        >取消</button>
                        <button type="button" class="btn btn-primary" @click="addAddress">添加</button>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="tab-pane in active" id v-else-if="currentState==3">
        <TSZBookTable></TSZBookTable>
      </div>
      <div class="tab-pane in active" id v-else-if="currentState==4">
        <TSZBooksEval></TSZBooksEval>
      </div>
    </div>
  </div>
</template>

<script>
import TSZOverlay from "../components/Overlay";
import TSZBookTable from "../components/BooksTable";
import TSZBooksEval from "../components/BooksSaleEval";
export default {
  name: "LoginRight",
  components: {
    TSZOverlay,
    TSZBookTable,
    TSZBooksEval
  },
  methods: {
    checkCurrent(Index) {
      if (this.currentState == 0) {
        if (Index >= 1 && Index <= 8) {
          return "disabled";
        } else {
          if (Index == 0) {
            return "active";
          } else {
            return "";
          }
        }
      } else {
        if (Index != 0) {
          if (Index == this.currentState) {
            return "active";
          } else {
            return "";
          }
        } else {
          return "disabled";
        }
      }
    },
    clickTo(index) {
      if (this.currentState != 0) {
        if (index == 0) {
          console.log("确定要退出吗");
        } else {
          this.currentState = index;
        }
      }
    },
    //设置默认地址
    setDefaultAddress: function(item) {
      for (var i = 0; i < this.Address.length; i++) {
        if (this.Address[i].id == item.id) {
          this.Address[i].bdefault = true;
        } else {
          this.Address[i].bdefault = false;
        }
      }
    },
    deleteAddress: function(item) {
      for (var i = 0; i < this.Address.length; i++) {
        if (this.Address[i].id == item.id) {
          this.Address.splice(i, 1);
          break;
        }
      }
    },
    //remove the body padding
    removePaddingAndClosingModel() {
      console.log("removePaddingAndClosingModel");
      $("body").css("padding-right", 0);
      this.bshowNewAddressModel = false;
      this.bus.$emit("ReceiveMessage", false);
    },
    openNewAddressModel: function() {
      console.log("Open NewAddressModel");
      this.bshowNewAddressModel = true;
      this.bus.$emit("ReceiveMessage", true);
    },
    async onSubmit() {
      //login
      //safe check
      if (this.submitData.username == "" || this.submitData.password == "") {
        this.toolTipData.class = "alert-warning";
        this.toolTipData.text = "当前输入的用户名为空或者密码输入为空";
        this.toolTipData.display = true;
        this.toolTipData.strongtext = "淘书斋提醒:";
        const _this = this;
        setTimeout(function() {
          _this.toolTipData.display = false;
        }, 3000);
        this.confirmData.show = true;
        return;
      }
      let loginParams = {
        name: this.submitData.username,
        passwd: this.$md5(this.submitData.password)
      };
      let Result = await this.axios_post("api/login", loginParams);
      if (Result == {}) return;
      let ResultData = Result.data;
      if (ResultData.status != 200) {
        console.log("登录失败" + ResultData.message);
        return;
      } else if (ResultData.info.code != 200) {
        console.log("登录失败" + ResultData.info.message);
        return;
      } else {
        let CookiesMsg = ResultData.info.message.split(";");
        if (CookiesMsg.length != 3) {
          console.log(
            "Such user(" +
              this.submitData.username +
              ") Receive Cookie msg is not Corrected." +
              CookiesMsg
          );
          return;
        }
        var strCookieMd5 = CookiesMsg[0];
        var strCookie = CookiesMsg[1];
        var strCookieExpireDays = parseInt(CookiesMsg[2], 10);
        //坑 js/md5 与python/md5 不一致 使用sha1函数
        var CalcSha1 = this.$sha1(CookiesMsg[1]);
        if (CalcSha1 != strCookieMd5) {
          console.log("Cookie " + strCookieMd5 + " is not invalid");
          return;
        }
        this.$cookies.set(
          this.$app.APP_COOKIE_NAME,
          strCookie,
          strCookieExpireDays
        );
        console.log(
          "登录成功 currentCookie:" +
            this.$cookies.get(this.$app.APP_COOKIE_NAME) +
            " set OK"
        );
      }

      let getInfoParams = {
        s_user: this.submitData.username,
        s_token: this.$cookies.get(this.$app.APP_COOKIE_NAME)
      };
      Result = await this.axios_post("api/getinfo", getInfoParams);
      if (Result == {}) return;
      ResultData = Result.data;
      if (ResultData.status != 200) {
        console.log("获取用户数据失败!" + ResultData.message);
        return;
      } else if (ResultData.info.code != 200) {
        console.log("获取用户数据失败!" + ResultData.info.message);
        return;
      }
      console.log(
        "获取用户数据成功!" + JSON.stringify(ResultData.info.message)
      );
      this.userInfo.account = ResultData.info.message.name;
      this.userInfo.nickName = ResultData.info.message.nichen;
      this.userInfo.gender = parseInt(ResultData.info.message.sex);
      this.userInfo.address = ResultData.info.message.address;
      this.userInfo.university = ResultData.info.message.uni;
      this.userInfo.description = ResultData.info.message.desc;
      this.userInfo_const = this.userInfo;
      this.currentState = 1;
    },
    async onRegister() {
      if (this.submitData.username == "" || this.submitData.password == "") {
        this.toolTipData.class = "alert-warning";
        this.toolTipData.text = "当前输入的用户名为空或者密码输入为空";
        this.toolTipData.display = true;
        this.toolTipData.strongtext = "淘书斋提醒:";
        const _this = this;
        setTimeout(function() {
          _this.toolTipData.display = false;
        }, 3000);
        this.confirmData.show = true;
        return;
      }
      const self = this;
      let RegisterParam = {
        name: self.submitData.username,
        passwd: self.$md5(self.submitData.password),
        identifying_code: self.submitData.confirmp
      };
      const Result = await this.axios_post("api/register", RegisterParam);
      if (Result == {}) return;
      const ResultData = Result.data;
      if (ResultData.status != 200) {
        console.log("注册失败!" + ResultData.message);
        return;
      } else if (ResultData.info.code != 200) {
        console.log("注册失败!" + ResultData.info.message);
        return;
      }
      console.log("注册成功!");
      // this.checkLoginStatus(0);
    },
    async forgetPassword() {
      if (this.submitData.username == "") {
        this.toolTipData.class = "alert-warning";
        this.toolTipData.text = "当前输入的用户名为空,获取验证码失败";
      } else {
        let Params = {
          name: this.submitData.username,
          type: 2
        };
        const Result = await this.axios_get("api/verify", Params);
        if (Result == {}) return;
        const ResultData = Result.data;
        if (ResultData.status != 200) {
          this.toolTipData.text = ResultData["message"];
          this.toolTipData.class = "alert-danger";
        } else if (ResultData["info"]["code"] != 200) {
          this.toolTipData.text = ResultData["info"]["message"];
          this.toolTipData.class = "alert-danger";
        } else {
          this.toolTipData.text = "验证码已发送,请注意查收!";
          this.toolTipData.class = "alert-info";
        }
      }
      this.toolTipData.display = true;
      this.toolTipData.strongtext = "淘书斋提醒:";
      const _this = this;
      setTimeout(function() {
        _this.toolTipData.display = false;
      }, 3000);
      this.confirmData.show = true;
      this.countDown();
    },
    //获取验证码
    async getConfirmNum() {
      if (this.submitData.username == "") {
        this.toolTipData.class = "alert-warning";
        this.toolTipData.text = "当前输入的用户名为空,获取验证码失败";
      } else {
        let Params = {
          name: this.submitData.username,
          type: 1
        };
        const Result = this.axios_post("api/verify",Params);
        if(Result=={}){
          this.toolTipData.class = "alert-danger";
          this.toolTipData.text = err.toString();
        }else{
          const ResultData = Result.data;
          if (ResultData.status != 200) {
            this.toolTipData.text = ResultData["message"];
            this.toolTipData.class = "alert-danger";
          } else if (ResultData["info"]["code"] != 200) {
            this.toolTipData.text = ResultData["info"]["message"];
            this.toolTipData.class = "alert-danger";
          } else {
            this.toolTipData.text = "验证码已发送,请注意查收!";
            this.toolTipData.class = "alert-info";
          }
        }
      }
      this.toolTipData.display = true;
      this.toolTipData.strongtext = "淘书斋提醒:";
      const _this = this;
      setTimeout(function() {
        _this.toolTipData.display = false;
      }, 3000);
      this.confirmData.show = true;
      this.countDown();
    },
    //验证码读秒
    countDown: function() {
      const _this = this;
      if (this.confirmData.confirSeconds == 0) {
        this.ResetConfirmData();
        return false;
      } else {
        this.confirmData.confirSeconds--;
      }
      setTimeout(function() {
        _this.countDown();
      }, 1000);
      if (this.confirmData.confirSeconds == 0) {
        this.confirmData.show = false;
        this.confirmData.title = "获取验证码";
      } else {
        this.confirmData.title =
          "当前无法再次获取，等待" +
          this.confirmData.confirSeconds +
          "s后重新尝试";
      }
    },
    //检验注册状态 密码是否输入正确
    checkPasswprd: function() {
      if (this.submitData.againpsw === this.submitData.password) {
        this.toolTipData.display = true;
        this.toolTipData.text = "当前两次输入密码一致!";
        this.toolTipData.class = "alert-info";
        this.toolTipData.strongtext = "淘书斋提醒:";
        const _this = this;
        setTimeout(function() {
          _this.toolTipData.display = false;
        }, 3000);
      } else {
        this.toolTipData.display = true;
        this.toolTipData.text = "两次输入不一致，重新输入密码。";
        this.toolTipData.class = "alert-danger";
        this.toolTipData.strongtext = "淘书斋提醒:";
        this.submitData.againpsw = "";
        const _this = this;
        setTimeout(function() {
          _this.toolTipData.display = false;
        }, 3000);
      }
    },
    selectUniversity: function() {
      if (this.selectedProvince == "") {
        this.currentProviceUniversities = [];
      }
      const self = this;
      this.universities.forEach(data => {
        if (data.city == self.selectedProvince) {
          self.currentProviceUniversities = [];
          data.university.forEach((d, i) => {
            if (i != 0) self.currentProviceUniversities.push(d.name);
          });
        }
      });
    },
    addAddress: function() {
      if (
        this.NewAddress.tel == "" ||
        this.NewAddress.name == "" ||
        this.NewAddress.detail == ""
      ) {
        this.NewAddress.name = "";
        this.NewAddress.tel = "";
        this.NewAddress.detail = "";
        console.log("添加地址Failed");
        this.removePaddingAndClosingModel();
        return;
      }
      var maxID = 0;
      for (var i = 0; i < this.Address.length; i++) {
        if (parseInt(this.Address[i].id) >= maxID) {
          maxID = parseInt(this.Address[i].id);
        }
      }
      console.log("Get Max ID:" + maxID);
      this.NewAddress.id = maxID + 1;
      this.Address.push(this.NewAddress);
      console.log("添加地址OK");
      this.removePaddingAndClosingModel();
    },
    Province2Cities: function() {
      if (
        this.selectedAddress.province != "" &&
        this.selectedAddress.province != "---- 选择省 ----"
      ) {
        const self = this;
        self.CurrentSelectedCities = ["---- 选择市 ----"];
        let citiesArray = this.allcities[this.selectedAddress.province];
        citiesArray.forEach(data => {
          self.CurrentSelectedCities.push(data.name);
        });
      } else if (this.selectedAddress.province == "---- 选择省 ----") {
        this.CurrentSelectedCities = ["---- 选择市 ----"];
        this.CurrentSelectedDistricts = ["---- 选择区 ----"];
      }
    },
    City2Disticts: function() {
      if (
        this.selectedAddress.city != "" &&
        this.selectedAddress.city != "---- 选择市 ----"
      ) {
        const self = this;
        self.CurrentSelectedDistricts = [];
        let citiesArray = this.allcities[this.selectedAddress.province];
        citiesArray.forEach(data => {
          if (this.selectedAddress.city == data.name) {
            self.CurrentSelectedDistricts = ["---- 选择区 ----"];
            data.dis.forEach(district => {
              self.CurrentSelectedDistricts.push(district);
            });
          }
        });
      } else if (this.selectedAddress.city == "---- 选择市 ----") {
        this.CurrentSelectedDistricts = ["---- 选择区 ----"];
      }
    },
    //重置确认信息框的数据
    ResetConfirmData: function() {
      this.confirmData.confirSeconds = 10;
      this.confirmData.show = false;
    },
    changeLogoImage: function(e) {
      let ImageFile = event.target.files[0];
      console.log("上传->" + ImageFile);
      let fileReader = new FileReader();
      if (ImageFile.size > 1024 * 1024) {
        //大于1M no accepted
        alert("上传图片超过1M，请重新选择图片");
        ImageFile.value = "";
        return;
      }
      console.log("changeLogoImage:" + e);
      this.userInfo.nickLogo.logoName = ImageFile.name;
      this.userInfo.nickLogo.logoFile = e.target.files;
      fileReader.readAsDataURL(ImageFile); //读取图片
      let _this = this;
      fileReader.onload = event => {
        //读取成功
        event.srcElement.value = "";
        _this.userInfo.nickLogo.logoData = fileReader.result;
        console.log("读取数据成功");
        _this.bEdit = true;
      };
    },
    //更新用户数据
    updateUserInfo: function() {
      this.userInfo_const = this.userInfo;
      console.log("提交更改");
    },
    //放弃更改数据
    giveupUpdateUserInfo: function() {
      this.selectUniversity = "";
      this.selectedProvince = "";
      this.userInfo = this.userInfo_const;
      this.bEdit = false;
    }
  },
  data() {
    return {
      currentState: 0,
      title: "登录淘书斋",
      submitData: {
        //提交的表单数据
        username: "",
        password: "",
        againpsw: "",
        confirmp: ""
      },
      confirmData: {
        confirSeconds: 10,
        show: false,
        title: "获取验证码"
      },
      Mode: 0, // 0. 登录模式  1. 注册模式
      //用户模式
      userInfo: {
        //存放可用于修改的数据
        account: "",
        nickName: "",
        gender: 2, //0.male 1.female 2.默认 保密
        province: "",
        university: "",
        address: "",
        description: "",
        nickLogo: {
          logoName: "",
          logoFile: "",
          logoData: "#"
        }
      },
      userInfo_const: {
        account: "",
        nickName: "",
        gender: 2, //0.male 1.female 2.默认 保密
        province: "",
        university: "",
        address: "",
        description: "",
        nickLogo: {
          logoName: "",
          logoFile: "",
          logoData: "#"
        }
      },
      selectedProvince: "",
      selectedUniversity: "",
      currentProviceUniversities: [],
      bEdit: false,
      AllProvinces: [
        "北京",
        "上海",
        "黑龙江",
        "吉林",
        "辽宁",
        "天津",
        "安徽",
        "江苏",
        "浙江",
        "陕西",
        "湖北",
        "广东",
        "湖南",
        "甘肃",
        "四川",
        "山东",
        "福建",
        "河南",
        "重庆",
        "云南",
        "河北",
        "江西",
        "山西",
        "贵州",
        "广西",
        "内蒙古",
        "宁夏",
        "青海",
        "西藏",
        "香港",
        "澳门",
        "台湾"
      ],
      Address: [
        {
          id: 1,
          name: "xxx",
          tel: "1375xxx198",
          detail: "重庆市黔江区**街道**路",
          postcode: "400000",
          bdefault: true,
          bExpand: false
        }
      ],
      NewAddress: {
        id: "",
        name: "",
        tel: "",
        detail: "",
        postcode: "",
        bdefault: false,
        bExpand: false
      },
      //Address Selected
      selectedAddress: {
        province: "",
        city: "",
        distict: ""
      },
      AllAddressProvince: ["---- 选择省 ----"],
      CurrentSelectedCities: ["---- 选择市 ----"],
      CurrentSelectedDistricts: ["---- 选择区 ----"],
      bshowNewAddressModel: false //是否打开新建地址框
    };
  },
  props: ["toolTipData", "universities", "allcities"],
  created() {
    const self = this;
    this.universities.forEach(data => {
      self.AllProvinces.push(data.city);
      let unis = [];
      data.university.forEach((uni, index) => {
        if (index != 0) unis.push(uni.name);
      });
      self.universities.push({ name: data.city, unis: unis });
    });
    for (const province in this.allcities) {
      self.AllAddressProvince.push(province);
    }
  },
  filters: {
    idChildFileter(id) {
      return "#addr" + id + "1";
    },
    idFilter(id) {
      return "addr" + id;
    },
    idChild(id) {
      return "addr" + id + "1";
    },
    toFixed(val) {
      return val.toFixed(2);
    },
    showPrice(val) {
      return "" + val;
    }
  },
  computed: {
    /**
     * @return {int}
     */
    CurrentMode() {
      this.Mode = this.$store.state.CurrentMode;
      return this.$store.state.CurrentMode;
    }
  }
};
</script>

<style scoped>
.main_right {
  width: 70%;
  height: 100%;
  /*border: 1px solid red ;*/
  max-height: 900px;
  overflow-y: scroll;
  background: white;
}
.main_head {
  width: 100%;
  padding: 1%;
  height: 60px;
  border: 1px silver solid;
  background: rgb(245, 245, 245);
}
.main_head a {
  color: black;
  opacity: 0.7;
}

.main_body {
  /*height: 93%;*/
  /*border: 1px solid red;*/
  padding: 1% 3%;
}

.loginOtherWays {
  display: flex;
  padding: 0 15%;
}

.toolTip {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 450px;
  height: 50px;
}

.ConfrimNumtooltips {
  font-size: 10px;
  flex: none;
  padding-top: 10px;
}

#login {
  width: 100%;
  height: 100%;
}
#login h1 {
  font-family: 华文宋体;
  font-weight: bold;
  color: rgb(155, 168, 0);
}
#login form {
  padding-top: 5%;
  height: 40%;
}

#basic_info {
  height: 100%;
  overflow-y: auto;
}
#basic_info label {
  font-weight: normal;
}
#basic_info textarea {
  width: 500px;
  height: 100px;
  resize: none;
  overflow-y: auto;
}
#basic_info_2 fieldset ul li {
  width: 100%;
  border: none;
}
#basic_info_2 fieldset ul li.active {
  border: solid 1px #ddd;
}
#basic_info_2 fieldset ul li.active a {
  color: white;
}
.add-more {
  width: 100%;
  height: 30px;
  margin-top: 15px;
}
.add-more span {
  width: 90px;
  text-align: center;
  padding: 6px 12px;
  font-size: 14px;
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #555;
}
.add-more input {
  width: 138px;
  height: 34px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-left: 15px;
}
.add-more:last-child input {
  width: 400px;
}

#book_management {
  width: 100%;
  height: 100%;
}
#book_management_1 fieldset div.tab-content {
  width: 100%;
  height: auto;
  overflow-x: auto;
}
#show_in_table {
  width: 100%;
}
#show_in_table table {
  width: 1000px;
  height: auto;
}
thead tr th {
  width: 10%;
  text-align: center;
  font-size: 1em;
  font-weight: 300;
  background: #dddddd;
  margin: auto;
}
tbody tr td {
  width: 10%;
  height: 30px;
  text-align: center;
}
tbody tr th {
  font-size: 10px;
  font-weight: 100;
}

#book_management_2 {
  width: 100%;
  /*overflow: visible;*/
}
#book_management_2 fieldset {
  width: 100%;
}

#book_sale_history {
  width: 100%;
  height: 100%;
}
#book_sale_history div.container-fluid,
#sale_hist_chart {
  height: 100%;
  width: 100%;
}
#sale_his_pie,
#sale_his_bar,
#sale_his_line {
  width: 660px;
  height: 500px;
}
#local_time {
  padding-top: 10px;
  font-weight: normal;
  font-size: 0.5em;
}

#psw_strength_check {
  padding: 0;
  height: 20px;
  border-radius: 5px;
  text-align: center;
  background: white;
}
#psw_strength_check div {
  background: white;
  border: 1px solid #ddd;
}
#psw_old + i {
  /*display: none;*/
  position: absolute;
  top: 7px;
  font-size: 20px;
  left: 90%;
  color: #333;
}

#psw_new + a {
  position: absolute;
  top: 7px;
  font-size: 20px;
  left: 90%;
  color: #aaa;
  cursor: pointer;
}
#psw_again + a {
  color: red;
  font-size: 1.25em;
  position: absolute;
  top: 7px;
  left: 90%;
  cursor: pointer;
  display: none;
}
#yzm + i {
  position: absolute;
  top: 7px;
  font-size: 20px;
  left: 63%;
  color: green;
  display: none;
}
canvas.yzm {
  border: 1px solid #ddd;
  width: 120px;
  height: 40px;
  cursor: pointer;
  text-align: center;
}

#address_add_modal {
  width: 600px;
  height: 500px;
  margin: 0 28%;
  display: block;
}
</style>
