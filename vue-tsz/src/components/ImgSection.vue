<template>
  <div class="fl book-sections">
    <div class="book-sections-head fl">
      <p class="fl">
        {{sectionName}}&nbsp;
        <i class="fa fa-bookmark"></i>
      </p>
      <a href="javascript:void(0)" class="fr" name="click_more">
        更多
        <i class="fa fa-angle-right"></i>
      </a>
    </div>
    <div class="book-sections-body fl">
      <div class="book-info fl" v-for="(item,index) in books" :key="index">
        <a href="javascript:void(0)">
          <img
            :src="item.img_url"
            :title="item.book_name"
            :alt="item.book_name"
            width="90"
            height="120"
            class="hvr-grow-shadow"
          />
        </a>
        <div>
          <h6 class="line-limit">{{item.book_name}}</h6>
          <p class="fl now—price">
            <i class="fa fa-yen">{{item.price_now}}</i>
          </p>
          <p class="fr last-price">
            <del class="fa fa-yen">{{item.price_before}}</del>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImgSection",
  props: ["sectionName", "type"],
  data() {
    return {
      books: []
    };
  },
  async created() {
    if (this.type == 0) {
      const RetData = await this.axios_get("static/json/book-recommend.json",[]);
      if (RetData != {}) {
        this.books = RetData.data;
      }
    } else if (this.type == 1) {
      const RetData = await this.axios_get("static/json/book-discount.json",[]);
      if (RetData != {}) {
        this.books = RetData.data;
      }
    } else if (this.type == 2) {
      const RetData = await this.axios_get("static/json/book-new-comment.json",[]);
      if (RetData != {}) {
        this.books = RetData.data;
      }
    } else if (this.type == 3) {
      const RetData = await this.axios_get("static/json/book-popular.json",[]);
      if (RetData != {}) {
        this.books = RetData.data;
      }
    }
  }
};
</script>

<style scoped>
.book-sections {
  width: 100%;
  height: 800px;
  background: white;
  margin-bottom: 10px;
}
.book-sections-head {
  width: 100%;
  height: 5%;
  border-bottom: solid 1px #dedede;
  padding-right: 10px;
  padding-left: 10px;
  padding-top: 5px;
}
.book-sections-head p {
  font-size: 16px;
  font-weight: 800;
  font-family: 微软雅黑;
  margin-bottom: 0;
}
.book-sections-head a {
  color: rgb(0, 168, 155);
  opacity: 0.5;
}
.book-sections-head a:hover {
  opacity: 0.7;
}
.book-sections-body {
  width: 100%;
  height: 95%;
  padding: 10px;
}
.book-info {
  width: 20%;
  height: 25%;
  /*border: solid 1px red;*/
  padding: 5px 2px 5px 2px;
  text-align: center;
}
.book-info div h6 {
  margin: 0;
  padding-top: 7px;
  height: 20px;
}
.book-info div h6:hover {
  font-size: 14px;
  color: rgb(0, 168, 155);
  cursor: pointer;
}
/*end book-sections*/

.now—price {
  width: 50%;
  font-size: 14px;
  color: rgb(0, 168, 155);
  margin: 0;
  padding: 5% 0 0 5%;
  font-weight: bold;
}
.last-price {
  width: 50%;
  font-size: 10px;
  opacity: 0.4;
  margin-bottom: 0;
  padding: 8.5% 5% 0 0;
}
</style>
