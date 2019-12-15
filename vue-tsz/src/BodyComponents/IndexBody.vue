<template>
  <div class="main">
    <div class="top fl">
      <div class="scanner_view_logo fl">
        <router-link to="/">
          <img src="../assets/logo.png" alt="未能正确加载图片" width="180" height="64" />
        </router-link>
      </div>
      <div class="scanner_view_list fl">
        <ul class="scanner_view_list_ul">
          <li>
            <router-link to="/login" v-on:click.native="checkLoginStatus(0)">登录</router-link>
          </li>
          <li>
            <router-link to="/sold">出售</router-link>
          </li>
          <li>
            <a href="#">求购</a>
          </li>
          <li>
            <a href="#">免费赠阅</a>
          </li>
        </ul>
      </div>
    </div>
    <TSZSlideView></TSZSlideView>
    <div class="hot-topic fl">
      <div class="hot-topic-body">
        <div class="hot-topic-body-left fl">
          <p id="hot-topic" class="fl">热搜:</p>
          <a href="#" v-for="(item,index) in hotTopicWord" :key="index" class="fl">{{item}}</a>
        </div>
      </div>
    </div>
    <div class="book-list">
      <div class="book-list-left fl">
        <div class="contact fl">
          <span class="fa-stack fa-1x fl">
            <i class="fa fa-circle fa-stack-2x" style="color: rgb(24,144,137);"></i>
            <i class="fa fa-qq fa-stack-1x" style="color: white;"></i>
          </span>
          <p class="fl">
            <a href="javascript:void(0)" id="joinus">加入用户体验交流群</a>
          </p>
        </div>
        <TSZHotObject objectName="热门书店" :rdata="hotStore" type="1"></TSZHotObject>
        <TSZHotObject objectName="热门个人" :rdata="hotPerson" type="1"></TSZHotObject>
        <TSZHotObject objectName="多人关注" :rdata="mostFocus" type="0"></TSZHotObject>
        <TSZHotObject objectName="最近注册" :rdata="newRegister" type="0"></TSZHotObject>
      </div>
      <div class="book-list-right fr">
        <TSZImgSection sectionName="好书推荐" type="0"></TSZImgSection>
        <TSZImgSection sectionName="打折推荐" type="1"></TSZImgSection>
        <TSZImgSection sectionName="新书推荐" type="2"></TSZImgSection>
        <TSZImgSection sectionName="最受欢迎" type="3"></TSZImgSection>
      </div>
    </div>
  </div>
</template>

<script>
import TSZSlideView from "../components/SlideView";
import TSZHotObject from "../components/HotObject";
import TSZImgSection from "../components/ImgSection";
export default {
  name: "IndexBody",
  components: {
    TSZSlideView,
    TSZHotObject,
    TSZImgSection
  },
  data() {
    return {
      hotTopicWord: [],
      hotStore: [],
      hotPerson: [],
      mostFocus: [],
      newRegister: []
    };
  },
  props: ["blogined"],
  methods: {
    checkLoginStatus: function(mode) {
      this.$store.commit("setCurrentMode", mode);
    }
  },
  created() {
    this.axios
      .get("static/json/hot-topic.json")
      .then(res => {
        let allData = res.data;
        allData.forEach(data => {
          if (data.name === "hot-topic") {
            this.hotTopicWord = data.value;
          } else if (data.name === "hot-bookstore") {
            this.hotStore = data.value;
          } else if (data.name === "hot-person") {
            this.hotPerson = data.value;
          } else if (data.name === "most-focus") {
            this.mostFocus = data.value;
          } else if (data.name === "new-register") {
            this.newRegister = data.value;
          }
        });
      })
      .catch(function(err) {
        console.log("Request Error. err" + err);
      });
  }
};
</script>

<style scoped>
.top {
  width: 100%;
  height: 78px;
  padding: 5px 15% 5px 15%;
}
.scanner_view_logo {
  width: 50%;
  height: 100%;
}
.scanner_view_list {
  width: 50%;
  height: 100%;
}
.scanner_view_list_ul li {
  width: 25%;
  height: 100%;
  padding: 20px 0;
}
.scanner_view_list_ul li a {
  color: black;
  font-size: 17px;
  font-weight: bold;
}
.scanner_view_list_ul li a:hover {
  color: rgb(0, 168, 155);
}
.scanner_view_list_ul li:first-child a {
  color: rgb(0, 168, 155);
  font-size: 17px;
}

.hot-topic {
  height: 50px;
  width: 100%;
  padding: 5px 13.8% 5px 13.8%;
}
.hot-topic-body {
  background: white;
  height: 100%;
  width: 100%;
}
.hot-topic-body-left p {
  font-size: 16px;
  width: 50px;
  height: 100%;
  padding: 10px 0 0 10px;
}
.hot-topic-body-left a {
  width: auto;
  height: 100%;
  padding: 10px 0 0 10px;
  font-size: 14px;
  color: rgb(0, 168, 155);
}
.book-list {
  padding: 5px 14% 5px 14%;
}
/*left*/
.book-list-left {
  width: 35%;
  padding-right: 10px;
}
.contact {
  width: 100%;
  height: 30px;
  background: white;
  padding-left: 10px;
}
.contact p {
  padding: 7px 0 0 10px;
}
/*right*/
.book-list-right {
  width: 65%;
  padding-left: 5px;
}
.book-list-right {
  width: 65%;
  padding-left: 5px;
}
</style>
