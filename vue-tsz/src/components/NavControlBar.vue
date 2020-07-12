<template>
  <transition name="fade">
    <div :class="bExpand? 'nav-control-expand': 'nav-control'">
      <span class="fl expand-bar">
        <i class="fa fa-dedent" v-if="!bExpand" @click="emitExpand()"></i>
        <i class="fa fa-indent" v-else @click="emitExpand"></i>
      </span>
      <ol class="fl nav-path">
        <li v-for="(item,index) in currentPaths" :key="index" :class="item.active?'active':''">
          <a :href="'/admin/dashboard?query=' + item.path">{{item.path}}</a>
        </li>
      </ol>
      <div class="fr nav-tools">
        <span class="fl" @click="bShowSearchBox=!bShowSearchBox">
          <i class="fa fa-search"></i>
        </span>
        <transition name="linear">
          <div class="fl search-box" v-if="bShowSearchBox">
            <input type="text" placeholder="搜索" class="form-control fl" />
          </div>
        </transition>
        <span class="fl">
          <i class="glyphicon glyphicon-text-size"></i>
        </span>
        <span class="fl">
          <i class="fa fa-language"></i>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "NavControlBar",
  components: {},
  data() {
    return {
      bExpand: false,
      bShowSearchBox: false,
      currentPaths: [
        {
          path: "首页",
          active: true
        }
      ]
    };
  },
  methods: {
    emitExpand() {
      this.bExpand = !this.bExpand;
      this.$emit("navbarExpand", this.bExpand);
    }
  },
  created() {},
  watch: {
    "$route.path": function(newVal, oldVal) {
      var tmpVal = "" + newVal;
      this.currentPaths = [];
      var _this = this;
      var tmpList = tmpVal.split("/");
      tmpList.forEach((val, index) => {
        if (val == "admin")
          _this.currentPaths.push({ path: "首页", active: false });
        else if (val != "" && val != 'dashboard')
          _this.currentPaths.push({ path: val, active: false });
      });
    }
  }
};
</script>

<style scoped>
.nav-control {
  position: absolute;
  top: 0;
  float: left;
  width: 87%;
  height: 50px;
  /* border: 1px solid red; */
  line-height: 50px;
  margin-left: 13%;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.nav-control-expand {
  position: absolute;
  top: 0;
  float: left;
  width: 95%;
  height: 50px;
  /* border: 1px solid red; */
  line-height: 50px;
  margin-left: 5%;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.expand-bar {
  font-size: 20px;
}
.nav-path {
  height: 100%;
  list-style: none;
  margin-left: 20px;
}
.nav-path li {
  list-style: none;
  float: left;
  padding: 0 2px;
  height: 100%;
  line-height: 48px;
}
.nav-path > li + li:before {
  padding: 0 5px;
  color: #ccc;
  content: "/\00a0";
}
.nav-tools {
  width: auto;
  height: 100%;
  margin-right: 50px;
}
span > i {
  font-size: 16px;
}
span {
  margin: 0 4px;
}
.search-box {
  width: auto;
  padding: 8px 0;
}
</style>