<template>
		<div class="main_right">
				<div class="main_head">
						<ul class="nav nav-tabs nav-tabs-justified">
								<li :class="checkCurrent(0)"><a href="#" @click="clickTo(0)">登录</a></li>
								<li :class="checkCurrent(1)"><a href="#" @click="clickTo(1)">基本资料</a></li>
								<li :class="checkCurrent(2)"><a href="#" @click="clickTo(2)">图书管理</a></li>
								<li :class="checkCurrent(3)"><a href="#" @click="clickTo(3)">售卖记录</a></li>
								<li :class="checkCurrent(4)"><a href="#" @click="clickTo(4)">买入</a></li>
								<li :class="checkCurrent(5)"><a href="#" @click="clickTo(5)">登录日志</a></li>
								<li :class="checkCurrent(6)"><a href="#" @click="clickTo(6)">评估</a></li>
								<li :class="checkCurrent(7)"><a href="#" @click="clickTo(7)">其他</a></li>
						</ul>
				</div>
				<div class="tab-content main_body">
						<div class="tab-pane in active" id="login" v-if="currentState == 0">
								<h1>{{title}}</h1>
								<hr>
								<form action="" class="form-horizontal" role="form" method="get">
										<div class="form-group">
												<label for="username" class="col-md-3 control-label"><i class="fa fa-user text-danger"></i></label>
												<div class="col-md-7">
														<input type="text" class="form-control" id="username" placeholder="用户名/邮箱/电话" required="required" v-model="submitData.username">
												</div>
										</div>
										<div class="form-group">
												<label for="password" class="col-md-3 control-label"><i class="fa fa-lock text-success" aria-hidden="true"></i></label>
												<div class="col-md-7">
														<input type="password" class="form-control" id="password" placeholder="键入密码" required="required" v-model="submitData.password">
												</div>
										</div>
										<div class="form-group" v-if="CurrentMode==1">
												<label for="password1" class="col-md-3 control-label"><i class="fa fa-lock text-success" aria-hidden="true"></i></label>
												<div class="col-md-7">
														<input type="password" class="form-control" id="password1" placeholder="再次键入密码" required="required" v-model="submitData.againpsw" @blur="checkPasswprd">
												</div>
										</div>
										<div class="form-group" v-if="CurrentMode==1">
												<label for="cofrimNumber" class="col-md-3 control-label"><i class="fa fa-check-circle" aria-hidden="true"></i></label>
												<div class="col-md-7" style="display:flex;">
														<input type="text" class="form-control" id="cofrimNumber" placeholder="输入验证码" required="required" v-model="submitData.confirmp" size="6">
														<a class="btn btn-link" @click="getConfirmNum" :disabled="confirmData.show" :title="confirmData.title">获取验证码</a>
														<div class="ConfrimNumtooltips" v-if="confirmData.show">{{confirmData.confirSeconds}}s 后重新获取验证码</div>
												</div>
										</div>
										<div class="form-group">
												<div class="col-sm-3"></div>
												<div class="col-sm-2">
														<input value="重置" class="btn btn-primary form-control">
												</div>
												<div class="col-sm-2">
														<input v-if="Mode==0" value="登录" class="btn btn-warning form-control" @click="onSubmit">
                            <input v-else-if="Mode==1" value="注册" class="btn btn-warning form-control" @click="onRegister">
												</div>
												<div class="col-sm-2" id="forget_psw"><a href="#" class="btn btn-link" @click="forgetPassword">忘记密码?</a></div>
										</div>
								</form>
								<hr>
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
														<legend><h3>基本账户信息</h3></legend>
														<div class="col-md-9">
																<div class="form-group">
																		<label class="control-label col-md-2" for="account">账号</label>
																		<div class="col-md-7">
																				<input type="text" v-model="userInfo.account" class="form-control" readonly name="account" id="account">
																		</div>
																</div>
																<div class="form-group">
																		<label class="control-label col-md-2">昵称</label>
																		<div class="col-md-7">
																				<input type="text" class="form-control" v-model="userInfo.nickName" name="nicheng" :disabled="!bEdit">
																		</div>
																</div>
																<div class="form-group">
																		<label class="control-label col-md-2">性别</label>
																		<div class="col-md-7">
																				<div class="col-md-4">
																						<input type="radio" name="sex" value=1 @click="checkOptions(1)" :checked="userInfo.gender.male"  :disabled="!bEdit">
																						<label class="control-label">男</label>
																				</div>
																				<div class="col-md-4">
																						<input type="radio" name="sex" value=2 @click="checkOptions(2)" :checked="userInfo.gender.female" :disabled="!bEdit">
																						<label class="control-label">女</label>
																				</div>
																				<div class="col-md-4">
																						<input type="radio" name="sex" value=3 @click="checkOptions(3)" :checked="userInfo.gender.secret" :disabled="!bEdit">
																						<label class="control-label">保密</label>
																				</div>
																		</div>
																</div>
																<div class="form-group">
																		<label class="control-label col-md-2">头像</label>
																		<div class="col-md-7">
																				<input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpg,image/jpeg" :disabled="!bEdit" @change="uploadFile($event)">
																		</div>
																</div>
																<div class="form-group">
																		<label class="control-label col-md-2">学校</label>
																		<div class="col-md-10 form-group">
																				<div class="col-md-5">
																						<select id="province" class="form-control" :disabled="!bEdit" v-model="selectProvince" @change="selectUniversity">
																								<option  v-for="(item,index) in AllProvinces" :value="item" :key="index">{{item}}</option>
																						</select>
																				</div>
																				<div class="col-md-7">
																						<select class="form-control" id="school" :disabled="!bEdit" >
																								<option v-for="(item,index) in currentProviceUniversities" :value="item" :key="index" @click="userInfo.university=item">{{item}}</option>
																						</select>
																				</div>
																		</div>
																</div>
																<div class="form-group">
																		<label class="col-md-2 control-label">地址</label>
																		<div class="col-md-10">
																				<input type="text" class="form-control" v-model="userInfo.address" :disabled="!bEdit">
																		</div>
																</div>
																<div class="form-group">
																		<label class="control-label col-md-2">描述</label>
																		<div class="col-md-10">
																				<textarea name="des" :disabled="!bEdit" placeholder="请输入描述性语言(150字以内)" maxlength="150" v-model="userInfo.description"></textarea>
																		</div>
																</div>
																<div class="form-group" id="basic_info_1_btn">
																		<button class="btn btn-link" type="button" @click="bEdit=true">修改资料</button>
																		<button class="btn btn-primary" type="reset" :disabled="!bEdit">放弃修改</button>
																		<button class="btn btn-danger" type="submit" disabled>提交</button>
																</div>
														</div>
														<div class="col-md-3" align="center">
																<img src="#" alt="头像" width="140" height="220" class="img-thumbnail" id="person_pic">
																<label for="person_pic" class="control-label">个人头像</label>
														</div>
												</fieldset>
										</form>
										<form class="form-horizontal" role="form" id="basic_info_2">
												<fieldset>
														<legend>管理收货地址</legend>
														<div class="list-group">
																<div class="panel-group" id="addr1" v-for="(item,index) in Address" :key="index">
																		<div class="panel" :class="[item.bdefault ? 'panel-primary':'panel-default']">
																				<div class="panel-heading">
																						<h4 class="panel-title">
																								<a data-toggle="collapse" :data-parent="item.id | idFilter " :href="item.id | idChildFileter">{{item.detail}}
																										<span class="badge fr" v-if="item.bdefault">默认地址</span>
																								</a>
																						</h4>
																				</div>
																				<div :id="item.id | idChild " class="panel-collapse collapse">
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
																												<h4 class="list-group-item-heading fl" title="邮政编码默认为000000">{{item.postcode}}</h4>
																										</div>
																								</div>
																								<div class="col-md-2">
																										<button class="btn btn-link" value="edit_add" type="button" v-if="!item.bdefault" @click="setDefaultAddress(item)">设置为默认地址</button>
																										<button class="btn btn-link" value="edit_add" type="button">修改地址</button>
																										<button class="btn btn-link" value="del_add" type="button" @click="deleteAddress(item)">删除地址</button>
																								</div>
																						</div>
																				</div>
																		</div>
																</div>
														</div>
														<div>
																<button class="btn btn-danger col-md-4" type="button" data-toggle="modal" data-target="#address_add_modal">
																		<span class="fa-stack fa-lg">
																				<i class="fa fa-circle-o fa-stack-2x"></i>
                                        <i class="fa fa-plus fa-stack-1x"></i>
																		</span>添加新的收货地址
																</button>
																<div class="modal fade" id="address_add_modal" tabindex="0" role="dialog" aria-labelledby="address_title" aria-hidden="true">
																		<div class="modal-dialog">
																				<div class="modal-content">
																						<div class="modal-header">
																								<button type="button" class="close" data-dismiss="modal" aria-hidden="true" >&times;</button>
																								<h4 class="modal-title" id="address_title">添加收货地址</h4>
																						</div>
																						<div class="modal-body">
																								<form class="form-inline">
																										<div>
																												<div class="form-group col-md-4">
																														<label class="sr-only" for="province2">Province</label>
																														<select class="form-control" id="province2" required v-model="selectedAddress.province" @change="Province2Cities">
																																<option :value="province" v-for="(province,index) in AllAddressProvince" :key="index">{{province}}</option>
																														</select>
																												</div>
																												<div class="form-group col-md-4">
																														<label class="sr-only" for="city2">City</label>
																														<select class="form-control" id="city2" required v-model="selectedAddress.city" @change="City2Disticts">
																																<option :value="city" v-for="(city,index) in CurrentSelectedCities" :key="index">{{city}}</option>
																														</select>
																												</div>
																												<div class="form-group col-md-4">
																														<label class="sr-only" for="district2">District</label>
																														<select class="form-control" id="district2" required v-model="selectedAddress.distict">
																																<option :value="district" v-for="(district,index) in CurrentSelectedDistricts" :key="index">{{district}}</option>
																														</select>
																												</div>
																										</div>
																										<div class="input-group add-more">
																												<span class="fl">联系电话</span>
																												<input type="tel" maxlength="20" placeholder="联系电话" required v-model="NewAddress.tel">
																										</div>
																										<div class="input-group add-more">
																												<span class="fl">姓名</span>
																												<input type="text" placeholder="姓名" required v-model="NewAddress.name">
																										</div>
																										<div class="input-group add-more">
																												<span class="fl">具体地址</span>
																												<input type="text" placeholder="详细地址" required v-model="NewAddress.detail">
																										</div>
																								</form>
																						</div>
																						<div class="modal-footer">
																								<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
																								<button type="button" class="btn btn-primary" @click="addAddress" >添加</button>
																						</div>
																				</div>
																		</div>
																</div>
														</div>
												</fieldset>
										</form>
								</div>
						</div>
				</div>
		</div>
</template>

<script>
  export default {
    name: 'LoginRight',
	  methods:{
      checkCurrent(Index){
        if(this.currentState == 0){
          if(Index >= 1 && Index <= 7){
            return "disabled";
          }else{
            if(Index == 0){
              return "active";
            }else{
              return "";
            }
          }
        }else{
          if(Index != 0){
            if(Index == this.currentState){
              return "active";
            }else{
              return "";
            }
          }else{
            return "disabled";
          }
        }
      },
	    clickTo(index){
        
		  },
      onSubmit(){ //login
        //safe check
	      if(this.submitData.username == "" || this.submitData.password==""){
          this.toolTipData.class = 'alert-warning';
          this.toolTipData.text = '当前输入的用户名为空或者密码输入为空';
          this.toolTipData.display = true;
          this.toolTipData.strongtext = '淘书斋提醒:';
          const _this = this;
          setTimeout(function(){
            _this.toolTipData.display = false;
          }, 3000);
          this.confirmData.show =true;
          return;
        } 
        const self = this;
        this.axios.post('http://192.168.0.105:5000/login', {
          name:self.submitData.username,
          passwd:this.$md5(self.submitData.password)
        }).then(res=>{
          const ResultData = res.data;
          if(ResultData.status != 200){
            console.log("登录失败"+ ResultData.message);
            return;
          }else if(ResultData.info.code != 200){
            console.log("登录失败"+ ResultData.info.message);
            return;
          }else{
            //Recevive =  sha1;cookie;Expires(d);md5
            let CookiesMsg = ResultData.info.message.split(";");
            if(CookiesMsg.length != 3){
              console.log("Such user("+ this.submitData.username + ") Receive Cookie msg is not Corrected." + CookiesMsg);
              return;
            }
            var strCookieMd5 = CookiesMsg[0];
            var strCookie = CookiesMsg[1];
            var strCookieExpireDays = parseInt(CookiesMsg[2],10);
            //坑 js/md5 与python/md5 不一致 使用sha1函数
            var CalcSha1 = this.$sha1(CookiesMsg[1]);
            if(CalcSha1 != strCookieMd5){
              console.log("Cookie "+strCookieMd5+" is not invalid");
              return;
            }
            this.$cookies.set(this.$app.APP_COOKIE_NAME, strCookie, strCookieExpireDays);
            console.log("登录成功 currentCookie:"+ this.$cookies.get(this.$app.APP_COOKIE_NAME) + " set OK");
            //set to the state
            this.$store.commit('setCurrentCookie', strCookie);
            self.currentState = 1;
          }
        }).catch(err=>{
          console.log("Request Error For Err"+err);
        });
        // get user info
        this.axios.post('http://192.168.0.105:5000/getinfo',{
          s_user:this.submitData.username,
          s_token:this.$cookies.get(this.$app.APP_COOKIE_NAME)
        }).then(res=>{
          const ResultData = res.data;
          if(ResultData.status != 200){
            console.log("获取用户数据失败!" + ResultData.message);
            return;
          }else if(ResultData.info.code != 200){
            console.log("获取用户数据失败!" + ResultData.info.message);
            return;
          }else{

          }
        }).catch(err=>{
          console.log("获取用户信息数据失败!" + err);
        });
      },
      onRegister(){
        if(this.submitData.username == "" || this.submitData.password==""){
          this.toolTipData.class = 'alert-warning';
          this.toolTipData.text = '当前输入的用户名为空或者密码输入为空';
          this.toolTipData.display = true;
          this.toolTipData.strongtext = '淘书斋提醒:';
          const _this = this;
          setTimeout(function(){
            _this.toolTipData.display = false;
          }, 3000);
          this.confirmData.show =true;
          return;
        }
        const self = this;
        this.axios.post('http://192.168.0.105:5000/register',{
          name:self.submitData.username,
          passwd:self.$md5(self.submitData.password),
          identifying_code:self.submitData.confirmp
        }).then(res=>{
          const ResultData = res.data;
          if(ResultData.status != 200){
            console.log("注册失败!" + ResultData.message);
            return;
          }else if(ResultData.info.code != 200){
            console.log("注册失败!" + ResultData.info.message);
            return;
          }else{
            console.log("注册成功!");
          }
        }).catch(err=>{
          console.log("Request Error for Err " +err);
        });
        this.Mode = 1;
        
      },
      forgetPassword(){
        if(this.submitData.username == ""){
          this.toolTipData.class = 'alert-warning';
          this.toolTipData.text = '当前输入的用户名为空,获取验证码失败';
        }else {
          this.axios.get('http://192.168.0.105:5000/verify',
            {
              params: {
                name: this.submitData.username,
                type: 2
              }
            }).then(res => {
            const ResultData = res.data;
            if (ResultData.status != 200) {
              this.toolTipData.text = ResultData['message'];
              this.toolTipData.class = 'alert-danger';
            } else if (ResultData['info']['code'] != 200) {
              this.toolTipData.text = ResultData['info']['message'];
              this.toolTipData.class = 'alert-danger';
            } else {
              this.toolTipData.text = '验证码已发送,请注意查收!';
              this.toolTipData.class = 'alert-info';
            }
          }).catch(err => {
            this.toolTipData.class = 'alert-danger';
            this.toolTipData.text = err.toString();
          });
        }
        this.toolTipData.display = true;
        this.toolTipData.strongtext = '淘书斋提醒:';
        const _this = this;
        setTimeout(function(){
          _this.toolTipData.display = false;
        }, 3000);
        this.confirmData.show =true;
        this.countDown();
      },
		  //获取验证码
      getConfirmNum:function(){
        if(this.submitData.username == ""){
          this.toolTipData.class = 'alert-warning';
          this.toolTipData.text = '当前输入的用户名为空,获取验证码失败';
        }else {
          this.axios.get('http://192.168.0.105:5000/verify',
            {
              params: {
                name: this.submitData.username,
                type: 1
              }
            }).then(res => {
            const ResultData = res.data;
            if (ResultData.status != 200) {
              this.toolTipData.text = ResultData['message'];
              this.toolTipData.class = 'alert-danger';
            } else if (ResultData['info']['code'] != 200) {
              this.toolTipData.text = ResultData['info']['message'];
              this.toolTipData.class = 'alert-danger';
            } else {
              this.toolTipData.text = '验证码已发送,请注意查收!';
              this.toolTipData.class = 'alert-info';
            }
          }).catch(err => {
            this.toolTipData.class = 'alert-danger';
            this.toolTipData.text = err.toString();
          });
        }
        this.toolTipData.display = true;
        this.toolTipData.strongtext = '淘书斋提醒:';
        const _this = this;
        setTimeout(function(){
          _this.toolTipData.display = false;
        }, 3000);
        this.confirmData.show =true;
        this.countDown();
      },
		  //验证码读秒
      countDown:function(){
        const _this = this;
        if(this.confirmData.confirSeconds == 0){
          return false;
        }else{
          this.confirmData.confirSeconds--;
        }
        setTimeout(function(){
          _this.countDown();
        },1000);
        if(this.confirmData.confirSeconds == 0) {
          this.confirmData.show = false;
          this.confirmData.title = '获取验证码';
        }else{
          this.confirmData.title = '当前无法再次获取，等待' + this.confirmData.confirSeconds + 's后重新尝试';
        }
      },
		  //检验注册状态 密码是否输入正确
      checkPasswprd:function(){
        if(this.submitData.againpsw === this.submitData.password ){
          this.toolTipData.display = true;
          this.toolTipData.text = '当前两次输入密码一致!';
          this.toolTipData.class = 'alert-info';
          this.toolTipData.strongtext = '淘书斋提醒:';
          const _this = this;
          setTimeout(function(){
            _this.toolTipData.display = false;
          }, 3000);
        }else{
          this.toolTipData.display = true;
          this.toolTipData.text = '两次输入不一致，重新输入密码。';
          this.toolTipData.class = 'alert-danger';
          this.toolTipData.strongtext = '淘书斋提醒:';
          this.submitData.againpsw = '';
          const _this = this;
          setTimeout(function(){
            _this.toolTipData.display = false;
          },3000);
        }
      },
      selectUniversity:function(){
        if(this.selectProvince == ''){
          this.currentProviceUniversities = [];
        }
        const self = this;
        this.universities.forEach((data)=>{
          if(data.name == self.selectProvince){
            self.currentProviceUniversities = data.unis;
          }
        })
      },
      addAddress:function () {
        var model = $("#address_add_modal");
        console.log(model);
        if(this.NewAddress.tel == "" || this.NewAddress.name == "" || this.NewAddress.detail == ""){
          this.NewAddress.id = '';
          this.NewAddress.name = '';
          this.NewAddress.tel = '';
          this.NewAddress.detail = '';
          model.modal('hide');
          $("div.modal-backdrop").remove();
          $("body").css('padding-right','0');
          return;
        }
        model.modal('hide');
        $("div.modal-backdrop").remove();
        $("body").css('padding-right','0');
        this.Address.push(this.NewAddress);
      },
      Province2Cities:function () {
				if(this.selectedAddress.province != '' && this.selectedAddress.province != "---- 选择省 ----"){
				  const self = this;
				  self.CurrentSelectedCities = ['---- 选择市 ----'];
				  let citiesArray = this.allcities[this.selectedAddress.province];
          citiesArray.forEach((data)=>{
            self.CurrentSelectedCities.push(data.name);
          });
				}else if(this.selectedAddress.province == "---- 选择省 ----"){
          this.CurrentSelectedCities = ['---- 选择市 ----'];
          this.CurrentSelectedDistricts = ['---- 选择区 ----'];
				}
      },
      City2Disticts:function () {
				if(this.selectedAddress.city != '' && this.selectedAddress.city  != "---- 选择市 ----"){
				  const self = this;
				  self.CurrentSelectedDistricts = [];
          let citiesArray = this.allcities[this.selectedAddress.province];
          citiesArray.forEach((data)=>{
            if(this.selectedAddress.city == data.name){
              self.CurrentSelectedDistricts = ['---- 选择区 ----'];
              data.dis.forEach((district)=>{
                self.CurrentSelectedDistricts.push(district);
              });
            }
          });
				}else if(this.selectedAddress.city  == "---- 选择市 ----"){
				  this.CurrentSelectedDistricts = ['---- 选择区 ----'];
				}
      }
	  },
	  data(){
      return{
        currentState: 0,
	      title: '登录淘书斋',
        submitData:{ //提交的表单数据
          username:'',
          password:'',
          againpsw:'',
          confirmp:''
        },
	      confirmData:{
          confirSeconds:'10',
          show:false,
          title:'获取验证码',
        },
	      Mode:0,  // 0. 登录模式  1. 注册模式
	      //用户模式
        userInfo:{
          account:"",
          nickName:"",
          gender:{
            male:false,
            female:false,
            secret:false
          },
          nickPhoto:'',
          province:'',
          university:'',
          address:'',
          description:''
        },
        selectProvince:'',
        currentProviceUniversities:[],
	      bEdit:false,
        AllProvinces:[],
        Address:[{
          name:'xxx',
          tel:'1375xxx198',
          detail:'重庆市黔江区**街道**路',
          postcode:'400000',
          bdefault:true
        }],
        NewAddress:{
          id:"addr1",
          name:"",
          tel:"",
          detail:"",
          postcode:"40000",
          bdefault:false
        },
	      //Address Selected
	      selectedAddress:{
          province:'',
		      city:'',
		      distict:''
	      },
	      AllAddressProvince:['---- 选择省 ----'],
	      CurrentSelectedCities:['---- 选择市 ----'],
	      CurrentSelectedDistricts:['---- 选择区 ----']
      }
	  },
	  props:[
	    'toolTipData','universities','allcities'
	  ],
	  created () {
      const self = this;
		  this.universities.forEach((data)=>{
			  self.AllProvinces.push(data.city);
			  let unis = [];
			  data.university.forEach((uni, index)=>{
				  if(index!=0)
					  unis.push(uni.name);
			  });
			  self.universities.push({'name': data.city, 'unis':unis});
		  });
		  for(const province in this.allcities){
		    self.AllAddressProvince.push(province);
		  }
    },
    filters:{
      idFilter(id){
        return "#" + id;
      },
      idChildFileter(id){
        return "#" + id + "1";
      },
      idChild(id){
        return id + "1";
      },
      toFixed(val){
        return val.toFixed(2);
      },
      showPrice(val){
        return '' + val ;
      }
    },
		computed:{
      /**
       * @return {int}
       */
      CurrentMode(){
        this.Mode = this.$store.state.CurrentMode;
        return this.$store.state.CurrentMode;
      }
		}
  }
</script>

<style scoped>
		.main_right{
				width: 70%;
				height: 100%;
				/*border: 1px solid red ;*/
				max-height: 900px;
				overflow-y: scroll;
				background: white;
		}
		.main_head{
				width: 100%;
				padding: 1%;
				height: 60px;
				border: 1px silver solid;
				background: rgb(245,245,245);
		}
		.main_head a{
				color: black;
				opacity: 0.7;
		}

		.main_body{
				/*height: 93%;*/
				/*border: 1px solid red;*/
				padding: 1% 3%;
		}

		.loginOtherWays{
				display:flex;
				padding: 0 15%;
		}

		.toolTip{
				position:absolute;
				right:10px;
				top:10px;
				width:450px;
				height:50px;
		}

		.ConfrimNumtooltips{
				font-size: 10px;
				flex: none;
				padding-top: 10px;
		}

		#login{
				width: 100%;
				height: 100%;
		}
		#login h1{
				font-family: 华文宋体;
				font-weight: bold;
				color:rgb(155,168,0);
		}
		#login form{
				padding-top: 5%;
				height: 40%;
		}

		#basic_info{
				height: 100%;
				overflow-y: auto;
		}
		#basic_info label{
				font-weight: normal;
		}
		#basic_info textarea{
				width: 500px;
				height: 100px;
				resize: none;
				overflow-y: auto;
		}
		#basic_info_2 fieldset ul li{
				width: 100%;
				border: none;
		}
		#basic_info_2 fieldset ul li.active{
				border: solid 1px #ddd;
		}
		#basic_info_2 fieldset ul li.active a{
				color: white;
		}
		.add-more{
				width: 100%;
				height: 30px;
				margin-top: 15px;
		}
		.add-more span{
				width: 90px;
				text-align: center;
				padding: 6px 12px;
				font-size: 14px;
				background: #eee;
				border: 1px solid #ccc;
				border-radius: 4px;
				color: #555;
		}
		.add-more input{
				width: 138px;
				height: 34px;
				border: 1px solid #ccc;
				border-radius:  4px;
				padding-left: 15px;
		}
		.add-more:last-child input{
				width: 400px;
		}

		#book_management{
				width: 100%;
				height: 100%;
		}
		#book_management_1 fieldset div.tab-content{
				width: 100%;
				height:auto;
				overflow-x: auto;
		}
		#show_in_table{
				width: 100%;
		}
		#show_in_table table{
				width: 1000px;
				height: auto;
		}
		thead tr th{
				width: 10%;
				text-align: center;
				font-size: 1em;
				font-weight: 300;
				background: #dddddd;
				margin: auto;
		}
		tbody tr td{
				width: 10%;
				height: 30px;
				text-align: center;
		}
		tbody tr th{
				font-size: 10px;
				font-weight: 100;
		}

		#show_in_list h4 a{
				color:rgb(155,180,0);
		}
		#show_in_list ul {
				width: 100%;
				padding: 0;
		}
		#show_in_list ul li{
				width: 100%;
				height: 160px;
				border: 1px solid #dedede;
				/*border: 1px solid red;*/
				background: rgb(245,245,245);
				margin-top: 5px;
		}
		.book_list_info{
				height: 100%;
		}
		.book_list_info_left{
				height: 100%;
				padding: 10px 0 0 20px;
				background: white;
				width: 23%;
		}
		.book_list_info_right{
				width: 77%;
				height: 100%;
		}
		.list_info_1{
				width: 100%;
				height: 20px;
				padding-top: 3px;
				padding-left: 10px;
		}
		.list_info_1 a{
				color: black;
		}
		.list_info_1 a:hover{
				color: orange;
		}
		.list_info_2{
				width: 100%;
				height: 35px;
				padding: 5px;
		}
		.list_info_2 div.badge:nth-child(1){
				background: rgba(255,0,0,0.5);
		}
		.list_info_2 div.badge:nth-child(2){
				background: rgba(174, 160, 113, 0.8);
		}
		.list_info_2 div.badge:nth-child(3){
				background: rgba(209, 219, 113, 0.8);
		}
		.list_info_2 div.badge a{
				color: white;
		}
		.list_info_3{
				margin-top: 3px;
				width: 100%;
				height: 25px;
		}
		.list_info_4{
				width: 100%;
				height: 25px;
		}
		.list_info_5{
				padding-left: 10px;
				width: 100%;
				height: auto;
		}
		.list_info_2 h4{
				margin: 5px 5px 5px 15px;
				color: rgba(233,123,1,1);
		}
		.list_info_2 div{
				color: white;
				padding: 6px;
				margin-left: 5px;
		}
		.info_price{
				font-size: 16px;
				font-weight: bolder;
				color: red;
				margin: 3px 9px;
		}
		.info_price_before{
				font-size: 12px;
				font-weight: 400;
				color: #777777;
				opacity: 0.5;
				margin: 5px 6px;
		}
		.info_price_dis{
				color: #aaaaaa;
				font-size: 12px;
				margin-top: 4px;
		}
		#book_management_2{
				width: 100%;
				/*overflow: visible;*/
		}
		#book_management_2 fieldset{
				width: 100%;
		}

		#book_sale_history{
				width: 100%;
				height: 100%;
		}
		#book_sale_history div.container-fluid,#sale_hist_chart{
				height: 100%;
				width: 100%;
		}
		#sale_his_pie,#sale_his_bar,#sale_his_line{
				width: 660px;
				height: 500px;
		}
		#local_time{
				padding-top: 10px;
				font-weight: normal;
				font-size: 0.5em;
		}

		#psw_strength_check{
				padding: 0;
				height: 20px;
				border-radius: 5px;
				text-align: center;
				background: white;
		}
		#psw_strength_check div{
				background: white;
				border: 1px solid #ddd;
		}
		#psw_old+i{
				/*display: none;*/
				position: absolute;
				top: 7px;
				font-size: 20px;
				left: 90%;
				color: #333;
		}

		#psw_new+a{
				position: absolute;
				top: 7px;
				font-size: 20px;
				left: 90%;
				color: #aaa;
				cursor: pointer;
		}
		#psw_again+a{
				color: red;
				font-size: 1.25em;
				position: absolute;
				top: 7px;
				left: 90%;
				cursor: pointer;
				display: none;
		}
		#yzm+i{
				position: absolute;
				top: 7px;
				font-size: 20px;
				left: 63%;
				color: green;
				display: none;

		}
		canvas.yzm{
				border: 1px solid #ddd;
				width: 120px;
				height: 40px;
				cursor: pointer;
				text-align: center;
		}

</style>
