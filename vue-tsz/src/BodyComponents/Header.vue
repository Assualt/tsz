<template>
  <header id="header">
    <div class="header-school">
      <i class="fa fa-location-arrow fa-lg" aria-hidden="true"></i>
      <a
        href="javascript:void(0)"
        class="a_school"
        @click="showAllSchool()"
      >&nbsp;[&nbsp;{{targetSchool}}&nbsp;]</a>
      <transition name="scale">
        <div v-if="bShow" class="show_school display_show">
          <div class="show_school_head">
            <p class="fl">请选择学校</p>
            <button
              class="btn btn-sm fa fa-close fr"
              id="show_school_btn_cls"
              @click="closeAllSchool()"
            ></button>
          </div>
          <div class="show_school_body">
            <p class="fl">
              快捷方式:
              <a
                href="#"
                style="color: rgb(0,168,155);"
                @click="showAllUniversitys('所有学校',-1)"
              >所有学校</a>
            </p>
            <div class="show_school_body_2 fl">
              <a
                href="#"
                class="fl"
                v-for="(item,index) in AllProvinces"
                :key="index"
                @click="showAllUniversitys(item,index)"
              >{{item}}</a>
            </div>
            <div class="show_school_body_3 fl">
              <p v-for="(item,index) in CurrentCityUniversity" :key="index" class="fl">
                <a href="#" @click="selectSchool(item)">{{item}}</a>
              </p>
            </div>
          </div>
        </div>
      </transition>
      <div class="header_login fr">
        <li class="fl dropdown" :class="dropdown_opened? 'open':'' ">
          <a
            href="#"
            id="login_btn"
            data-toggle="dropdown"
            v-if="logined"
            @click="toggleDropDown"
            :aria-expanded="dropdown_opened"
          >我</a>
          <router-link to="/login" id="login_btn" v-else v-on:click.native="checkLoginStatus(0)">登录</router-link>&nbsp;|
          <ul class="dropdown-menu" role="menu" aria-labelledby="login_btn" v-if="logined">
            <li role="presentation">
              <router-link role="menuitem" tabindex="-1" to="/login">我的主页</router-link>
            </li>
            <li role="presentation">
              <router-link role="menuitem" tabindex="-1" :to="'/cart?u='+uid" >我的购物车</router-link>
            </li>
            <li role="presentation">
              <router-link role="menuitem" tabindex="-1" :to="'/trade?u='+uid">我的交易记录</router-link>
            </li>
            <li role="presentation">
              <router-link role="menuitem" tabindex="-1" :to="'/favorite?u='+uid">我的收藏</router-link>
            </li>
            <li role="presentation">
              <router-link role="menuitem" tabindex="-1" to="/login">修改密码</router-link>
            </li>
            <li role="presentation">
              <a role="menuitem" tabindex="-1" href="#" @click="loginout">退出</a>
            </li>
          </ul>
        </li>
        <li class="fl">
          <router-link to="/sold" target="_blacnk">出售</router-link>&nbsp;|
        </li>
        <li class="fl">
          <router-link style="color:orange" to="/login" v-on:click.native="checkLoginStatus(1)">立即注册</router-link>&nbsp;|
        </li>
        <li class="fl">
          <a href="#" class="fa fa-mobile-phone fa-1x" target="_blank">下载APP</a>
        </li>
      </div>
    </div>
  </header>
</template>
<script>
import TSZOverlay from "../components/Overlay";
export default {
  name: "Header",
  data: function() {
    return {
      AllProvinces: [
        "北京","上海","黑龙江","吉林","辽宁","天津","安徽","江苏","浙江","陕西","湖北","广东","湖南",
        "甘肃","四川","山东","福建","河南","重庆","云南","河北","江西","山西","贵州","广西","内蒙古",
        "宁夏","青海","西藏","香港","澳门","台湾"
      ],
      bShow: 0,
      CurrentCityUniversity: [],
      targetSchool: "所有学校",
      userID: "",
      userToken: "",
      bIsLogined: false,
      dropdown_opened: false
    };
  },
  components: {
    TSZOverlay
  },
  methods: {
    showAllSchool: function() {
      this.bShow = 1;
      this.bus.$emit("ReceiveMessage", true);
      this.showAllUniversitys("所有学校", -1);
    },
    closeAllSchool: function() {
      this.bShow = 0;
      this.bus.$emit("ReceiveMessage", false);
    },
    showAllUniversitys: function(City, index) {
      const self = this;
      if (this.universities == undefined) {
        console.log("universities is empty.undefined");
        return;
      }
      if (this.universities.length !== 0) {
        if (index === -1) {
          //所有学校全部Appendx
          self.CurrentCityUniversity = [];
          self.CurrentCityUniversity.push("所有学校");
          this.universities.forEach(data => {
            // console.log(JSON.stringify(data));
            if(data.university===undefined){
              return;
            }
            data.university.forEach((uni, index) => {
              if (index !== 0) self.CurrentCityUniversity.push(uni.name);
            });
          });
          self.CurrentCityIndex = -1;
          return;
        }
        if (index > 31 || index < 0) index = 1;
        if (index >= 0 && index <= 31) {
          this.universities.forEach(data => {
            if (typeof data.city === typeof City && data.city === City) {
              self.CurrentCityUniversity = [];
              data.university.forEach(uni => {
                self.CurrentCityUniversity.push(uni.name);
              });
              self.CurrentCityIndex = index;
            }
          });
        }
      }
    },
    selectSchool: function(schoolName) {
      this.targetSchool = schoolName;
      this.closeAllSchool();
      this.bus.$emit("ReceiveMessage", false);
    },
    checkLoginStatus: function(mode) {
      if(this.$store.state.isLogined == false)
        this.$store.commit("setCurrentMode", mode);
      else{
        this.$swal({
          title:'淘书斋提醒',
          text:'当前用户已经登录，不能注册!\n 如需注册，请先注销后，再注册!',
          type:'info'
        });
      }
    },
    toggleDropDown: function() {
      this.dropdown_opened = !this.dropdown_opened;
    },
    async loginout() {
      const self = this;
      if (this.logined) {
        this.$swal({
          title:'淘书摘提醒',
          text:'确认退出登录',
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          focusCancel:true,
          type:'question',
        }).then(async function(ret){
          if(ret.value){
            let params = {
              s_user: "",
              s_token: self.$cookies.get(self.$app.APP_COOKIE_NAME)
            };
            const result = await self.axios_post("api/loginout", params);
            self.$store.commit('setCurrentCookie', null);
            self.$cookies.remove(self.$app.APP_COOKIE_NAME);
            self.$store.commit('setLogined',false);
            self.bIsLogined = false;
            self.$swal({
              title:'淘书斋提醒',
              text:'注销成功',
              type:'success',
              confirmButtonText:'确定',
              showCancelButton:false,
              focusConfirm:true
            });
          }else{
            self.$swal({
              title:'淘书斋提醒',
              text:'注销取消',
              type:'success',
              confirmButtonText:'确定',
              showCancelButton:false,
              focusConfirm:true
            });
          }
        });
      } else {
        console.log("当前用户没有登录，无需注销");
      }
    }
  },
  mounted: function() {
    //html 加载完成之后执行
    this.bIsLogined = false;
  },
  computed: {
    logined() {
      var currentCookie = this.$store.state.CurrentCookie;
      if (currentCookie != "" && currentCookie != null) this.bIsLogined = true;
      return this.bIsLogined;
    },
    uid(){
      return this.$store.state.CurrentCookie;
    }
  },
  props: ["universities"],
  created: function() {
    //html 加载完成之前执行
  }
};
</script>

<style scoped>
/*header*/
#header {
  width: 100%;
  height: 35px;
  background-color: rgb(51, 51, 51);
  padding: 0 15%;
}
.a_school {
  color: rgb(1, 200, 181);
  font-style: normal;
}
.a_school:hover {
  color: #007a71;
  text-decoration: none;
}
.header-school {
  padding: 3px 0 0 8px;
}
.header-school i {
  color: rgb(1, 200, 181);
}
.show_school {
  position: absolute;
  z-index: 1024;
  background-color: #ffffff;
  width: 700px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin-left: -350px;
  margin-top: -200px;
  border-radius: 2%;
  box-shadow: 10px 10px 10px #888888;
}
.show_school_head {
  width: 100%;
  height: 31px;
  background-color: rgb(0, 168, 155);
  border-radius: 3%;
  color: white;
  font-weight: bold;
  padding-left: 10px;
  padding-top: 5px;
}
.show_school_head p {
  width: 70%;
}
#show_school_btn_cls {
  margin-top: -2.5px;
  margin-right: 11px;
  border-radius: 5%;
  background-color: rgb(0, 168, 155);
}
#show_school_btn_cls:hover {
  background-color: white;
  color: rgb(0, 168, 155);
}
.show_school_body {
  padding: 5px 20px;
}
.show_school_body p {
  width: 100%;
  height: 20px;
}
.show_school_body_2 {
  color: rgb(0, 168, 155);
  border: 1px solid #a1a7a6;
  padding: 6px 0;
  height: 105px;
}
.show_school_body_2 a {
  padding: 5px 7px 5px 5px;
  color: rgb(0, 168, 155);
  font-size: 14px;
}
.show_school_body_2 a:hover {
  background-color: rgb(0, 168, 155);
  color: white;
}
.show_school_body_3 {
  border: 1px solid #a1a7a6;
  margin-top: 10px;
  padding: 6px 0;
  width: 100%;
  height: 198px;
  overflow-y: scroll;
  z-index: 1024;
}
.show_school_body_3 p {
  width: 33%;
  height: 30px;
  padding: 0px 0 5px 5px;
}
.show_school_body_3 p a {
  padding: 2px 4px 2px 4px;
  background-color: white;
  color: rgb(0, 168, 155);
}
.show_school_body_3 > p a:hover {
  color: white;
  background-color: rgb(0, 168, 155);
}
.header_login {
  width: 250px;
  /*background-color: red;*/
  height: 100%;
}
.header_login li {
  list-style: none;
  width: auto;
  padding-left: 5px;
  padding-right: 3px;
}
.header_login li a {
  color: rgb(1, 200, 181);
}
.header_login li a:nth-child(3) {
  color: orange;
}
.header_login li a:hover {
  text-decoration: none;
  color: #007a71;
}
/*end of header*/
</style>
