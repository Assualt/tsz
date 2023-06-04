<template>
  <div class="main">
    <el-container style="height: 100%; border: 1px solid #eee">
      <transition name="el-fade-in-linear">
        <el-aside style="background-color: #eee" :width="navigationWidth">
          <el-menu :collapse="hideNavigation">
            <transition name="el-fade-in-linear">
              <el-menu-item
                index="0"
                v-if="navigationLogo"
                style="padding: 2px; height: 100%"
              >
                <el-image
                  src="https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png"
                  fit="fill"
                ></el-image>
              </el-menu-item>
            </transition>
            <el-menu-item
              index="1"
              @click="changeNavigation('首页', '/admin/dashboard', '1-1')"
            >
              <span slot="title">首页</span>
              <i class="el-icon-message-solid"></i>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span slot="title">用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="2-1"
                  @click="
                    changeNavigation('普通用户', '/admin/dashboard/usermanager/1', '2-1')
                  "
                  >普通用户</el-menu-item
                >
                <el-menu-item
                  index="2-2"
                  @click="
                    changeNavigation(
                      '管理员账户',
                      '/admin/dashboard/usermanager/2',
                      '2-2'
                    )
                  "
                  >管理员用户</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-shopping-cart-1"></i>
                <span slot="title">订单管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="3-1"
                  @click="
                    changeNavigation('系统订单', '/admin/dashboard/bookmanager/1', '3-1')
                  "
                  >系统订单</el-menu-item
                >
                <el-menu-item
                  index="3-2"
                  @click="
                    changeNavigation('账户订单', '/admin/dashboard/bookmanager/2', '3-2')
                  "
                  >账户订单</el-menu-item
                >
                <el-menu-item
                  index="3-3"
                  @click="
                    changeNavigation('订单列表', '/admin/dashboard/bookmanager/3', '3-3')
                  "
                  >订单列表</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item
              index="4"
              @click="changeNavigation('系统设置', '/admin/dashboard/settings', '4-1')"
            >
              <span slot="title">系统设置</span>
              <i class="el-icon-setting"></i>
            </el-menu-item>
          </el-menu>
        </el-aside>
      </transition>
      <el-container>
        <el-main style="padding: 0">
          <el-row style="width: 100%">
            <el-col
              :span="1"
              style="text-align: center; line-height: 60px; background-color: #eeeeee"
            >
              <el-button type="text">
                <i
                  class="el-icon-s-fold"
                  style="color: black; font-size: 16px"
                  v-if="!hideNavigation"
                  @click="hideNavigation = true"
                ></i>
              </el-button>
              <el-button type="text">
                <i
                  class="el-icon-s-unfold"
                  style="color: black; font-size: 16px"
                  v-if="hideNavigation"
                  @click="hideNavigation = false"
                ></i>
              </el-button>
            </el-col>
            <el-col :span="15">
              <el-header
                style="text-align: right; line-height: 60px; background-color: #eeeeee"
              >
                <el-breadcrumb separator="/" style="line-height: 60px">
                  <el-breadcrumb-item
                    v-for="(item, index) in currentNavigation"
                    :to="{ path: item.url }"
                    v-bind:key="index"
                    >{{ item.name }}</el-breadcrumb-item
                  >
                </el-breadcrumb>
              </el-header>
            </el-col>
            <el-col
              :span="8"
              style="
                background-color: #eeeeee;
                line-height: 60px;
                font-size: 16px;
                color: black;
              "
              class="fr"
            >
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-input placeholder="搜索" suffix-icon="el-icon-search"></el-input>
                </el-col>
                <el-col :span="2">
                  <a>
                    <i class="el-icon-circle-plus-outline"></i>
                  </a>
                </el-col>
                <el-col :span="2">
                  <a>
                    <i class="glyphicon glyphicon-text-size"></i>
                  </a>
                </el-col>
                <el-col :span="2">
                  <a>
                    <i class="fa fa-language"></i>
                  </a>
                </el-col>
                <el-col :span="3" style="padding: 10px 0; height: 60px">
                  <el-dropdown>
                    <el-avatar
                      class="el-dropdown-link"
                      :size="35"
                      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                      style="line-height: 30px"
                    ></el-avatar>
                    <i class="el-icon-caret-bottom el-dropdown-link"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>个人中心</el-dropdown-item>
                      <el-dropdown-item>首页</el-dropdown-item>
                      <el-dropdown-item to="https://github.com/Assualt/tsz"
                        >项目地址</el-dropdown-item
                      >
                      <el-dropdown-item divided @click.native.prevent="loginout"
                        >退出登录</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-button
            v-if="!rightDrawerOpened"
            @click="rightDrawerOpened = true"
            type="primary"
            style="position: fixed; top: 200px; right: 0; z-index: 1000"
          >
            <i class="el-icon-setting"></i>
          </el-button>
          <el-button
            v-else
            type="primary"
            style="position: fixed; top: 200px; right: 15%; z-index: 2034"
          >
            <i class="el-icon-close"></i>
          </el-button>
          <!--	侧边栏弹出框		    -->
          <el-drawer
            title="系统布局配置"
            :visible.sync="rightDrawerOpened"
            direction="rtl"
            size="15%"
          >
            <el-row class="setting-row">
              <el-col :span="16" class="setting-col">主题色</el-col>
              <el-col :span="8" class="setting-col">
                <el-color-picker v-model="setting_color"></el-color-picker>
              </el-col>
            </el-row>
            <el-row class="setting-row">
              <el-col :span="16" class="setting-col">开启 Tags-View</el-col>
              <el-col :span="8" class="setting-col">
                <el-switch
                  v-model="tagviewsOpen"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-col>
            </el-row>
            <el-row class="setting-row">
              <el-col :span="16" class="setting-col">固定Header</el-col>
              <el-col :span="8" class="setting-col">
                <el-switch
                  v-model="fixedHeader"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-col>
            </el-row>
            <el-row class="setting-row">
              <el-col :span="16" class="setting-col">侧边栏Logo</el-col>
              <el-col :span="8" class="setting-col">
                <el-switch
                  v-model="navigationLogo"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-col>
            </el-row>
            <el-row class="setting-row">
              <el-col :span="16" class="setting-col">菜单支持拼音搜索</el-col>
              <el-col :span="8" class="setting-col">
                <el-switch
                  v-model="supportPinYin"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-col>
            </el-row>
            <el-row class="setting-row">
              <el-col :span="16" class="setting-col">隐藏侧边栏</el-col>
              <el-col :span="8" class="setting-col">
                <el-switch
                  v-model="hideNavigation"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-col>
            </el-row>
          </el-drawer>
          <!--  Dashboard body-->
          <el-container style="height: 1000px">
            <el-main class="height-100" v-if="currentPathIndex == '1-1'">主页</el-main>
            <el-main class="height-100" v-if="currentPathIndex == '2-1'">
              <el-table :data="userMangerData">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" class="table-expand">
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="用户名">
                            <span>{{ props.row.userName }}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="昵称">
                            <span>{{ props.row.userNickName }}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="密码">
                            <span>{{ props.row.userPassword }}</span>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="用户类别">
                            <span>{{ props.row.userOrgID }}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="性别">
                            <span>{{ props.row.userSex }}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="电话">
                            <span>{{ props.row.userTel }}</span>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="邮箱">
                            <span>{{ props.row.userEmail }}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="创建时间">
                            <span>{{ props.row.userJoinDate }}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="最近登录">
                            <span>{{ props.row.userLastLogin }}</span>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="userID" label="ID" width="80"></el-table-column>
                <el-table-column
                  prop="userName"
                  label="用户名"
                  width="80"
                ></el-table-column>
                <el-table-column
                  prop="userNickName"
                  label="昵称"
                  width="180"
                ></el-table-column>
                <el-table-column
                  prop="userPassword"
                  label="密码"
                  width="180"
                ></el-table-column>
                <el-table-column
                  prop="userOrgID"
                  label="用户类别"
                  width="180"
                ></el-table-column>
                <el-table-column prop="userSex" label="性别" width="50"></el-table-column>
                <el-table-column
                  prop="userTel"
                  label="电话"
                  width="100"
                ></el-table-column>
                <el-table-column
                  prop="userEmail"
                  label="邮箱"
                  width="180"
                ></el-table-column>
                <el-table-column
                  prop="userJoinDate"
                  label="创建时间"
                  width="180"
                ></el-table-column>
                <el-table-column
                  prop="userLastLogin"
                  label="最近登录"
                  width="180"
                ></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small"
                      >查看</el-button
                    >
                    <el-button type="text" size="small">编辑</el-button>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot="header" slot-scope="scope" fixed="right">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-main class="height-100" v-if="currentPathIndex == '2-2'"
              >yonghuguanli/管理员用户</el-main
            >
            <el-main class="height-100" v-if="currentPathIndex == '3-1'"
              >系统订单</el-main
            >
            <el-main class="height-100" v-if="currentPathIndex == '3-2'"
              >账户订单</el-main
            >
            <el-main class="height-100" v-if="currentPathIndex == '3-3'"
              >订单列表</el-main
            >
            <el-main class="height-100" v-if="currentPathIndex == '4-1'">
              <el-tabs tab-position="top" style="height: 200px">
                <el-tab-pane label="服务器配置">
                  <el-form ref="form" label-width="100px" v-model="systemDetails">
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="服务器名称">
                          <el-input
                            v-model="systemDetails.serviceName"
                            :disabled="!systemOperation.operatorEdit"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="服务器IP">
                          <el-input
                            v-model="systemDetails.serviceIP"
                            :disabled="!systemOperation.operatorEdit"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="启用">
                          <el-switch
                            v-model="systemDetails.serviceEnable"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :disabled="!systemOperation.operatorEdit"
                          ></el-switch>
                        </el-form-item>
                        <el-form-item label="服务器端口">
                          <el-input
                            v-model="systemDetails.servicePort"
                            :disabled="!systemOperation.operatorEdit"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="服务器证书">
                          <el-input
                            type="file"
                            v-model="systemDetails.serviceCA"
                            :disabled="!systemOperation.operatorEdit"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="服务允许协议">
                          <el-row :gutter="10">
                            <el-col :span="18">
                              <el-input
                                type="text"
                                v-model="systemDetails.serviceProtocol"
                                :disabled="!systemOperation.operatorEdit"
                              ></el-input>
                            </el-col>
                            <el-col :span="4">
                              <el-button
                                type="text"
                                @click="systemOperation.showServiceProtocol = true"
                                >预览协议</el-button
                              >
                              <el-dialog
                                title="用户协议"
                                :visible.sync="systemOperation.showServiceProtocol"
                                width="39%"
                                center
                                :open="getProtocolContent()"
                              >
                                <pre>{{ systemOperation.systemProtocolContent }}</pre>
                                <span slot="footer" class="dialog-footer">
                                  <el-button
                                    @click="systemOperation.showServiceProtocol = false"
                                    >取 消</el-button
                                  >
                                  <el-button
                                    type="primary"
                                    @click="systemOperation.showServiceProtocol = false"
                                    >确 定</el-button
                                  >
                                </span>
                              </el-dialog>
                            </el-col>
                          </el-row>
                        </el-form-item>
                        <el-form-item label="服务备注信息">
                          <el-input
                            type="textarea"
                            placeholder="详细信息"
                            v-model="systemDetails.serviceDescription"
                            maxlength="150"
                            show-word-limit
                            disabled
                          ></el-input>
                        </el-form-item>
                        <el-row :gutter="8">
                          <el-button
                            type="info"
                            @click="systemOperation.operatorEdit = true"
                            >修改</el-button
                          >
                          <el-button type="danger">提交</el-button>
                          <el-button
                            type="reset"
                            @click="
                              systemOperation.operatorEdit = false;
                              systemDetails = systemDetails_bak;
                            "
                            >撤销</el-button
                          >
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="服务器状态">服务器状态</el-tab-pane>
                <el-tab-pane label="服务器拓扑">服务器拓扑</el-tab-pane>
                <el-tab-pane label="定时任务">定时任务</el-tab-pane>
              </el-tabs>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AdminSlideBar from "../components/AdminToolBar";
import NavControlBar from "../components/NavControlBar";
import ScrollBar from "../components/ScrollBar";
import DashBoardBody from "../BodyComponents/DashBoardBody";
import { fetchAdminUserMngList } from "../api/user";
export default {
  name: "DashBoard",
  components: {
    AdminSlideBar,
    NavControlBar,
    ScrollBar,
    DashBoardBody,
  },
  props: [],
  data() {
    return {
      bExpand: false,
      currentNavigation: [
        {
          name: "首页",
          url: "/admin/dashboard",
        },
      ],
      rightDrawerOpened: false,
      setting_color: null,
      tagviewsOpen: true,
      fixedHeader: true,
      navigationLogo: true,
      supportPinYin: true,
      hideNavigation: false,
      navigationWidth: "200px",
      currentPathIndex: "1-1",
      systemDetails: {
        serviceName: "套书斋节点1",
        serviceIP: "192.168.0.105",
        serviceEnable: true,
        servicePort: 80,
        serviceCA: "",
        serviceProtocol: "static/protocol/service-protocol.txt",
        serviceDescription: "",
      },
      systemOperation: {
        showServiceProtocol: false,
        systemProtocolContent: "",
        operatorEdit: false,
      },
      systemDetails_bak: null,
      userMangerData: [],
      search: "",
    };
  },
  methods: {
    handleClick(scope) {},
    navbarExpand: function (childValue) {
      this.bExpand = childValue;
    },
    changeNavigation: function (menuName, menuUrl, pathIndex) {
      if (this.currentNavigation.length == 1 && pathIndex != "1-1") {
        this.currentNavigation.push({ name: "", url: "" });
      }
      if (this.currentNavigation.length == 1 && pathIndex != "1-1") {
        this.currentNavigation[1].name = menuName;
        this.currentNavigation[1].url = menuUrl;
      } else if (this.currentNavigation.length == 2 && pathIndex == "1-1") {
        this.currentNavigation.pop();
      } else if (this.currentNavigation.length == 1 && pathIndex == "1-1") {
      } else {
        this.currentNavigation[1].name = menuName;
        this.currentNavigation[1].url = menuUrl;
      }
      this.currentPathIndex = pathIndex;
    },
    async getProtocolContent() {
      try {
        const retData = await this.axios_get(this.systemDetails.serviceProtocol, []);
        if (retData.length == 0) {
          this.$message({
            type: "warning",
            message:
              "request serviceProtocol" + this.systemDetails.serviceProtocol + " error.",
          });
        } else this.systemOperation.systemProtocolContent = retData.data;
      } catch (err) {
        this.$message({
          type: "warning",
          message: "request serviceProtocol error.",
        });
      }
    },
    indexMethod(index) {
      return index * 1;
    },
    async loginout() {
      await this.$store.dispatch("user/logout");
      this.$message({ type: "success", message: "登出成功" });
      this.$router.push({ path: "/admin" });
    },
    fetch_user_mng_list() {
      fetchAdminUserMngList(1).then(response=> {
        this.userMangerData = response.data
      }).catch(err=>{
        console.log("recv is error", err);
      })
    },
  },
  created() {
    this.systemDetails_bak = this.systemDetails;
    this.fetch_user_mng_list();
  },
  watch: {
    hideNavigation(newVal, oldVal) {
      if (newVal) {
        this.navigationWidth = "60px";
      } else {
        this.navigationWidth = "200px";
      }
    },
  },
};
</script>

<style scoped>
.main {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  min-height: 1400px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
ul > li {
  float: none;
}
ul.setting-golbal-ul {
  padding: 10px;
}
ul.setting-golbal-ul > li {
  height: 40px;
  padding: 4px;
}
.setting-row {
  padding: 10px;
  height: 60px;
  font-size: 16px;
}
.setting-col {
  height: 100%;
  line-height: 40px;
}
.height-100 {
  height: 100%;
}
.width-100 {
  height: 100%;
}
.table-expand .el-form-item {
  margin-top: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
