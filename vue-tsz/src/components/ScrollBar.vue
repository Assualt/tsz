<template>
  <transition name="fade">
    <div :class="bExpand? 'scroll-bar-expand' : 'scroll-bar'">
      <ul class="scroll-bar-menu">
        <li
          class="scroll-bar-item"
          :class="item.active? 'scroll-bar-item-active':''"
          v-for="(item,index) in ScrollBarList"
          :key="index"
          @click="selectPath(item.name)"
        >
          <div class="scroll-bar-item-active-option" v-if="item.active"></div>
          {{item.name}}
          <a
            href="javascript:void(0)"
            v-if="item.needClose"
            class="scroll-bar-item-close"
            @click="closeAddress(item.name)"
          >
            <i class="fa fa-close fa-fw"></i>
          </a>
        </li>
      </ul>
    </div>
  </transition>
</template>


<script>
export default {
  name: "ScrollBar",
  components: {},
  data() {
    return {
      ScrollBarList: [
        {
          name: "首页",
          active: true,
          needClose: false
        }
      ]
    };
  },
  methods: {
    closeAddress(name) {
      let tmpList = this.ScrollBarList;
      this.ScrollBarList = [];
      var _this = this;
      tmpList.forEach((val, index) => {
        if (val.name != name) {
          if (index == 0) val.active = true;
          _this.ScrollBarList.push(val);
        }
      });
      if (this.ScrollBarList.length == 1) this.ScrollBarList[0].active = true;
    },
    selectPath(name) {
      this.ScrollBarList.forEach((val, index) => {
        if (val.name == name) val.active = true;
        else val.active = false;
      });
      this.$route.path = '';
    }
  },
  props: {
    bExpand: Boolean
  },
  watch: {
    "$route.path": function(newVal, oldVal) {
      var tmpVal = "" + newVal;
      var tmpList = tmpVal.split("/");
      var _this = this;
      this.ScrollBarList = [];
      tmpList.forEach((val, index) => {
        if (val == "admin") {
          _this.ScrollBarList.push({
            name: "首页",
            active: false,
            needClose: false
          });
        } else if (val != "dashboard" && val != "") {
          _this.ScrollBarList.push({
            name: val,
            active: true,
            needClose: true
          });
        }
      });
      if (tmpList.length == 3) _this.ScrollBarList[0].active = true;
    }
  }
};
</script>

<style  scoped>
.scroll-bar {
  width: 96%;
  height: 50px;
  position: absolute;
  top: 56px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  margin-left: 4%;
}
.scroll-bar-expand {
  width: 87%;
  height: 50px;
  position: absolute;
  top: 56px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  margin-left: 12%;
}
.scroll-bar-menu {
  line-height: 56px;
  padding: 0px 10px;
  width: 100%;
  height: 100%;
  margin: 0;
}
.scroll-bar-item {
  margin: 9px 3px;
  height: 30px;
  line-height: 30px;
  padding: 0 8px 0 10px;
  border: 1px solid #d8dce5;
  border-radius: 3px;
  background-color: #fff;
  font-size: 12px;
}
.scroll-bar-item-active {
  border: 1px solid #d8dce5;
  background-color: #42b983;
  border-color: #42b983;
}
.scroll-bar-item-active-option {
  background-color: #fff;
  color: white;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  float: left;
  margin: 10px 2px 0 0;
}
.scroll-bar-item-close {
  border-radius: 50%;
  color: grey;
}
.scroll-bar-item-close:hover {
  background-color: grey;
  color: white;
}
</style>