<template>
  <div :class="bExpand? 'toolbar-expand' : 'toolbar'" class="animated fadeIn">
    <div class="toolbar-logo" v-if="bExpand">
      <img src="../assets/logo.png" alt class="img-responsive" />
    </div>
    <ul class="slide-list">
      <li
        class="slide-list-item"
        :class="bExpand ? '':'slide-list-item-expand'"
        data-toggle="tooltip"
        data-placement="left"
        title="首页"
      >
        <router-link to="/admin/dashboard">
          <span>
            <i class="fa fa-dashboard fa-1x"></i>
            <a href="/#/admin/dashboard" v-if="bExpand">首页</a>
          </span>
        </router-link>
      </li>
      <li
        class="slide-list-item"
        :class="bExpand ? '':'slide-list-item-expand'"
        data-toggle="tooltip"
        data-placement="left"
        title="Tags"
      >
        <router-link to="/admin/dashboard/tags">
          <span>
            <i class="fa fa-tags fa-1x"></i>
            <a href="/#/admin/dashboard/tags" v-if="bExpand">Tags</a>
          </span>
        </router-link>
      </li>
      <li
        class="slide-list-item"
        :class="bExpand ? '':'slide-list-item-expand'"
        data-toggle="tooltip"
        data-placement="right"
        title="用户管理"
        @mouseenter="bShowUserManagerExpand=true"
        @mouseleave="bShowUserManagerExpand=false"
      >
        <span>
          <i class="fa fa-user fa-1x"></i>
          <a href="#" v-if="bExpand">用户管理</a>
          <i
            class="fa fa-angle-down fa-fw fr"
            style="line-height:56px;font-size=0.75em;"
            v-if="bExpand & !bShowUserManager"
            @click="bShowUserManager=!bShowUserManager"
          ></i>
          <i
            class="fa fa-angle-up fa-fw fr"
            style="line-height:56px;font-size=0.75em;"
            v-else-if="bExpand & bShowUserManager"
            @click="bShowUserManager=!bShowUserManager"
          ></i>
        </span>

        <ul class="user-manage animated fadeInDown" v-if="bExpand & bShowUserManager">
          <li>
            <a href="/#/admin/dashboard/usermgr?type=1" v-if="bExpand">批量管理</a>
          </li>
          <li>
            <a href="/#/admin/dashboard/usermgr?type=2" v-if="bExpand">统一管理</a>
          </li>
        </ul>

        <transition name="fade">
          <ul class="user-manage-expand" v-if="!bExpand & bShowUserManagerExpand">
            <li>
              <a href="/#/admin/dashboard/usermgr?type=1" v-if="!bExpand">批量管理</a>
            </li>
            <li>
              <a href="/#/admin/dashboard/usermgr?type=2" v-if="!bExpand">统一管理</a>
            </li>
          </ul>
        </transition>
      </li>

      <li
        class="slide-list-item"
        :class="bExpand ? '':'slide-list-item-expand'"
        data-toggle="tooltip"
        data-placement="left"
        title="订单管理"
      >
        <router-link to="/admin/dashboard/ordermgr">
          <span>
            <i class="fa fa-shopping-cart fa-1x"></i>
            <a href="/#/admin/dashboard/ordermgr" v-if="bExpand">订单管理</a>
          </span>
        </router-link>
      </li>
      <li
        class="slide-list-item"
        :class="bExpand ? '':'slide-list-item-expand'"
        data-toggle="tooltip"
        data-placement="left"
        title="Server"
      >
        <router-link to="/admin/dashboard/server">
          <span>
            <i class="fa fa-server fa-1x"></i>
            <a href="/#/admin/dashboard/server" v-if="bExpand">Server</a>
          </span>
        </router-link>
      </li>
      <li
        class="slide-list-item"
        :class="bExpand ? '':'slide-list-item-expand'"
        data-toggle="tooltip"
        data-placement="left"
        title="图表"
      >
        <router-link to="/admin/dashboard/charts">
          <span>
            <i class="fa fa-line-chart fa-1x"></i>
            <a href="/#/admin/dashboard/charts" v-if="bExpand">图表</a>
          </span>
        </router-link>
      </li>
      <li
        class="slide-list-item"
        :class="bExpand ? '':'slide-list-item-expand'"
        data-toggle="tooltip"
        data-placement="left"
        title="日志管理"
      >
        <router-link to="/admin/dashboard/logsmgr">
          <span>
            <i class="fa fa-line-chart fa-1x"></i>
            <a href="/#/admin/dashboard/logsmgr" v-if="bExpand">日志管理</a>
          </span>
        </router-link>
      </li>
      <li
        class="slide-list-item"
        :class="bExpand ? '':'slide-list-item-expand'"
        data-toggle="tooltip"
        data-placement="left"
        title="退出登录"
      >
        <router-link to="/admin/dashboard/loginout">
          <span>
            <i class="fa fa-sign-out fa-1x"></i>
            <a href="/#/admin/dashboard/loginout" v-if="bExpand">退出登录</a>
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AdminSlideBar",
  components: {},
  props: [],
  data() {
    return {
      bShowUserManager: false,
      bShowUserManagerExpand: false,
      currentIndexQuery: ""
    };
  },
  props: {
    bExpand: Boolean
  }
};
</script>


<style scoped>
.toolbar-expand {
  width: 12%;
  max-height: 1680px;
  background: #304156;
  height: 100%;
  position: fixed;
}
.toolbar {
  width: 4%;
  max-height: 1680px;
  background: #304156;
  height: 100%;
  position: fixed;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: rgba(240, 240, 240, 1);
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  border-radius: 5%;
  background-color: rgba(240, 240, 240, 0.5);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 5%;
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  background-color: rgba(240, 240, 240, 0.5);
}
.toolbar-logo {
  width: 100%;
  text-align: center;
}
.slide-list {
  height: auto;
  margin: 0;
}

.slide-list-item {
  width: 100%;
  min-height: 56px;
  line-height: 56px;
  padding: 0px 10px;
}
.slide-list-item:hover {
  background-color: #263345 !important;
  /* opacity: 0.4; */
}
.slide-list-item-expand {
  text-align: center;
}
.user-manage li:hover {
  background-color: rgba(83, 149, 230, 0.8) !important;
  /* background-color: red !important; */
}
.user-manage-expand {
  position: absolute;
  width: 130px;
  height: 100px;
  left: 52px;
  top: 115px;
  background: #304156;
  z-index: 10240;
}
.user-manage-expand li {
  width: 100%;
  height: 50px;
  text-align: center;
}
.user-manage-expand li:hover {
  background-color: rgb(83, 149, 230) !important;
}
.slide-list-item span {
  font-weight: 500;
  color: rgb(123, 123, 123);
}
.slide-list-item span a {
  margin-left: 10px;
  font-size: 1em;
}
.user-manage li {
  padding-left: 10px;
  height: 40px;
  width: 100%;
  line-height: 40px;
}
.user-manage li a {
  font-size: 0.875em;
}
p,
a {
  color: white;
  font-weight: 500;
  font-family: "微软雅黑";
}
</style>