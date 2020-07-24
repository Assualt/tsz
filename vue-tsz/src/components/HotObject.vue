<template>
  <div class="fl hot-object" v-if="type == 1">
    <h4>
      {{objectName}}
      <i class="fa fa-free-code-camp" style="color:red;"></i>
    </h4>
    <ul id="hot-object">
      <li v-for="(item,index) in rdata" :key="index">
        <span>
          <a :href="urlpart+'/'+item.id" class="fl">
            <img :src="item.img_url" alt="图片加载错误" width="32" height="32" />
          </a>
          <p class="fl hvr-grow">{{item.name}}&nbsp;&nbsp;(&nbsp;{{item.id}}&nbsp;)</p>
        </span>
      </li>
    </ul>
  </div>
  <div class="fl most-object" v-else-if="type == 0">
    <h4>{{objectName}}</h4>
    <ul class="most-object-list">
      <li class="hvr-grow" v-for="(item,index) in rdata" :key="index">
        <a :href="urlpart+'/'+item.id">
          <img :src="item.img_url" alt="#" width="40" height="40" />
        </a>
      </li>
    </ul> 
  </div>
</template>

<script>
export default {
  name: "HotObject",
  data() {
    return {
      ownData: []
    };
  },
  props: ["objectName", "type", "rdata", "urlpart"],
  created() {
    this.ownData = this.rdata[this.objectName];
  }
};
</script>

<style scoped>
.hot-object {
  background: white;
  margin-top: 10px;
  height: 438px;
  width: 100%;
}
.hot-object h4 {
  padding-left: 15px;
  padding-bottom: 5px;
  font-weight: 600;
  border-bottom: solid 1px #dedede;
}
.hot-object ul {
  padding-left: 0px;
  margin-bottom: 0;
}
.hot-object ul li {
  width: 100%;
  padding-left: 20px;
  /*border-bottom: solid 1px #dedede;*/
}
.hot-object ul li span p {
  padding-left: 10px;
  padding-top: 5px;
}
.most-object {
  margin: 10px 0 0 0;
  width: 100%;
  height: 210px;
  background: white;
}
.most-object h4 {
  padding-left: 15px;
  padding-bottom: 5px;
  font-weight: 600;
  border-bottom: solid 1px #dedede;
  width: 100%;
}
.most-object-list {
  padding: 0 10px 0 15px;
  margin: 0;
  width: 100%;
  height: 100%;
}
.most-object-list li {
  padding: 5px;
}
.most-object-list li a img {
  opacity: 0.8;
}
.most-object-list li a img:hover {
  opacity: 0.5;
  border: solid 1px lightseagreen;
}
</style>
