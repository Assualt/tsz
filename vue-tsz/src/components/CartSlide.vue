<template>
  <div class="recommend_daily">
    <div class="recommend_daily_head">
      <ul class="list-group">
        <li
          :class="[ recommendIndex == 1 ? ShowClassLine : HideClassLine ]"
          value="1"
          @mouseenter="showDiv(1)"
        >掌柜热卖</li>
        <li class="fl list-group-item">|</li>
        <li
          :class="[ recommendIndex == 2 ? ShowClassLine : HideClassLine ]"
          value="2"
          @mouseenter="showDiv(2)"
        >最近浏览</li>
        <li class="fl list-group-item">|</li>
        <li
          :class="[ recommendIndex == 3 ? ShowClassLine : HideClassLine ]"
          value="3"
          @mouseenter="showDiv(3)"
        >猜你喜欢</li>
      </ul>
    </div>
    <div :class="[ recommendIndex == 1 ? ShowClass : HideClass ]" id="daily_hot">
      <ol class="fl carousel-indicators">
        <li
          value="0"
          @mouseenter="showDailyHot(0)"
          :class="[dailyHotCurrentIndex == 0 ? 'active' : '' ]"
        ></li>
        <li
          value="1"
          @mouseenter="showDailyHot(1)"
          :class="[dailyHotCurrentIndex == 1 ? 'active' : '' ]"
        ></li>
        <li
          value="2"
          @mouseenter="showDailyHot(2)"
          :class="[dailyHotCurrentIndex == 2 ? 'active' : '' ]"
        ></li>
        <li
          value="3"
          @mouseenter="showDailyHot(3)"
          :class="[dailyHotCurrentIndex == 3 ? 'active' : '' ]"
        ></li>
        <li
          value="4"
          @mouseenter="showDailyHot(4)"
          :class="[dailyHotCurrentIndex == 4 ? 'active' : '' ]"
        ></li>
      </ol>
      <div class="carousel-inner">
        <ul class="item active daily_list">
          <li v-for="(item,index) in dailyHot" :key="index">
            <div class="daily_hot_list-head">
              <img
                :src="item.book_img_url"
                alt="未能正确加载图片"
                :title="item.book_name"
                width="160"
                height="180"
              />
            </div>
            <div class="daily_hot_list_body">
              <div class="daily_hot_list_body_item">
                <p class="fa fa-yen fl">
                  <strong>{{item.book_price_now}}</strong>
                </p>
                <del class="fa fa-yen fl">&nbsp;{{item.book_price_before}}</del>
                <a class="fr">
                  <img src="../assets/postfree.png" alt title="包邮" />
                </a>
              </div>
              <div class="daily_hot_list_body_item">
                <p>{{item.book_title}}</p>
              </div>
              <div class="daily_hot_list_body_item">
                <p class="fl">销量:&nbsp;{{item.book_sell_num}}</p>
                <a class="fr">{{item.book_else_des}}</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="carousel_btn">
        <a class="carousel-control fl" type="button" @click="prev('daily-hot')">&lsaquo;</a>
        <a class="carousel-control fl" type="button" @click="next('daily-hot')">&rsaquo;</a>
      </div>
    </div>
    <div :class="[ recommendIndex == 2 ? ShowClass : HideClass ]" id="daily_history">
      <ol class="fl carousel-indicators"></ol>
      <div class="carousel-inner">
        <ul class="item active daily_list">
          <li v-for="(item,index) in dailyHistory" :key="index">
            <div class="daily_hot_list-head">
              <img
                :src="item.book_img_url"
                alt="未能正确加载图片"
                :title="item.book_name"
                width="160"
                height="180"
              />
            </div>
            <div class="daily_hot_list_body">
              <div class="daily_hot_list_body_item">
                <p class="fa fa-yen fl">
                  <strong>{{item.book_price_now}}</strong>
                </p>
                <del class="fa fa-yen fl">&nbsp;{{item.book_price_before}}</del>
                <a class="fr">
                  <img src="../assets/postfree.png" alt title="包邮" />
                </a>
              </div>
              <div class="daily_hot_list_body_item">
                <p>{{item.book_title}}</p>
              </div>
              <div class="daily_hot_list_body_item">
                <p class="fl">浏览时间:&nbsp;</p>
                <a class="fr">{{item.book_else_des}}</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div :class="[ recommendIndex == 3 ? ShowClass : HideClass ]" id="guess_like">
      <ol class="fl carousel-indicators">
        <li
          value="0"
          @mouseenter="showGuessLike(0)"
          :class="[guessLikeCurrentIndex == 0 ? 'active' : '' ]"
        ></li>
        <li
          value="1"
          @mouseenter="showGuessLike(1)"
          :class="[guessLikeCurrentIndex == 1 ? 'active' : '' ]"
        ></li>
        <li
          value="2"
          @mouseenter="showGuessLike(2)"
          :class="[guessLikeCurrentIndex == 2 ? 'active' : '' ]"
        ></li>
        <li
          value="3"
          @mouseenter="showGuessLike(3)"
          :class="[guessLikeCurrentIndex == 3 ? 'active' : '' ]"
        ></li>
        <li
          value="4"
          @mouseenter="showGuessLike(4)"
          :class="[guessLikeCurrentIndex == 4 ? 'active' : '' ]"
        ></li>
      </ol>
      <div class="carousel-inner">
        <ul class="item active daily_list">
          <li v-for="(item,index) in guessLike" :key="index">
            <div class="daily_hot_list-head">
              <img
                :src="item.book_img_url"
                alt="未能正确加载图片"
                :title="item.book_name"
                width="160"
                height="180"
              />
            </div>
            <div class="daily_hot_list_body">
              <div class="daily_hot_list_body_item">
                <p class="fa fa-yen fl">
                  <strong>{{item.book_price_now}}</strong>
                </p>
                <del class="fa fa-yen fl">&nbsp;{{item.book_price_before}}</del>
                <a class="fr">
                  <img src="../assets/postfree.png" alt title="包邮" />
                </a>
              </div>
              <div class="daily_hot_list_body_item">
                <p>{{item.book_title}}</p>
              </div>
              <div class="daily_hot_list_body_item">
                <p class="fl">销量:&nbsp;{{item.book_sell_num}}</p>
                <a class="fr">{{item.book_else_des}}</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="carousel_btn">
        <a class="carousel-control fl" type="button" @click="prev('guess-like')">&lsaquo;</a>
        <a class="carousel-control fl" type="button" @click="next('guess-like')">&rsaquo;</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cartSlide",
  data() {
    return {
      dailyHot: [],
      dailyHistory: [],
      guessLike: [],
      dailyHotAll: [],
      guessLickAll: [],
      //Dayhot history guess_like Div
      recommendIndex: 1,
      ShowClass: "recommend_daily_body carousel slide display_show",
      HideClass: "recommend_daily_body carousel slide display_hide",
      //Selector
      ShowClassLine: "list-group-item fl border-line",
      HideClassLine: "list-group-item fl border-offline",
      //轮播 选择
      dailyHotCurrentIndex: 0,
      guessLikeCurrentIndex: 0
    };
  },
  mounted() {
    this.Init();
  },
  methods: {
    Init: function() {
      var _this = this;
      this.axios.get("static/json/daily_interest.json", []).then(res => {
        let allData = res.data;
        allData.forEach(data => {
          if (data.name === "guess_like") {
            _this.guessLikeAll = data.item;
            _this.guessLike = [];
            var tStart = _this.guessLikeCurrentIndex * 5;
            var tEnd =
              tStart + 5 > data.item.length ? data.item.length : tStart + 5;
            for (var i = tStart; i < tEnd; i++) {
              _this.guessLike.push(data.item[i]);
            }
          } else if (data.name === "daily_history") {
            _this.dailyHistory = data.item;
          } else if (data.name === "daily_hot") {
            //  5 Items
            _this.dailyHotAll = data.item;
            _this.dailyHot = [];
            var tStart = _this.dailyHotCurrentIndex * 5;
            var tEnd =
              tStart + 5 > data.item.length ? data.item.length : tStart + 5;
            for (var i = tStart; i < tEnd; i++) {
              _this.dailyHot.push(data.item[i]);
            }
          }
        });
      });
    },
    lubbo: function() {
      $("#daily_hot").carousel({ interval: 5000 });
      $("#guess_like").carousel({ interval: 5000 });
    },
    showDiv: function(Index) {
      this.recommendIndex = Index;
    },
    showDailyHot: function(Index) {
      this.dailyHotCurrentIndex = Index;
      var tStart = this.dailyHotCurrentIndex * 5;
      var tEnd =
        tStart + 5 > this.dailyHotAll.length
          ? this.dailyHotAll.length
          : tStart + 5;
      this.dailyHot = [];
      for (var i = tStart; i < tEnd; i++) {
        this.dailyHot.push(this.dailyHotAll[i]);
      }
    },
    showGuessLike: function(Index) {
      this.guessLikeCurrentIndex = Index;
      var tStart = this.guessLikeCurrentIndex * 5;
      var tEnd =
        tStart + 5 > this.guessLikeAll.length
          ? this.guessLikeAll.length
          : tStart + 5;
      this.guessLike = [];
      for (var i = tStart; i < tEnd; i++) {
        this.guessLike.push(this.guessLikeAll[i]);
      }
    },
    next: function(options) {
      if (options === "daily-hot") {
        this.dailyHotCurrentIndex = (this.dailyHotCurrentIndex + 1) % 5;
        this.showDailyHot(this.dailyHotCurrentIndex);
      } else if (options === "guess-like") {
        this.guessLikeCurrentIndex = (this.guessLikeCurrentIndex + 1) % 5;
        this.showGuessLike(this.guessLikeCurrentIndex);
      }
    },
    prev: function(options) {
      if (options === "daily-hot") {
        if (this.dailyHotCurrentIndex == 0) this.dailyHotCurrentIndex = 4;
        else this.dailyHotCurrentIndex = (this.dailyHotCurrentIndex + 1) % 5;
        this.showDailyHot(this.dailyHotCurrentIndex);
      } else if (options === "guess-like") {
        if (this.guessLikeCurrentIndex == 0) this.guessLikeCurrentIndex = 4;
        else this.guessLikeCurrentIndex = (this.guessLikeCurrentIndex + 1) % 5;
        this.showGuessLike(this.guessLikeCurrentIndex);
      }
    }
  }
};
</script>

<style scoped>
/*recommend_daily*/
.recommend_daily {
  width: 100%;
  height: 400px;
  /*border: dashed 1px red;*/
  padding: 5px 8% 5px 8%;
}
.recommend_daily_head {
  width: 100%;
  height: 15%;
  border-bottom: 2px solid rgb(245, 245, 245);
  padding-top: 7px;
}
.recommend_daily_head ul li:nth-child(2n) {
  border: none;
}
.border-line {
  border-bottom: solid 3px rgb(255, 86, 0);
  border-top: none;
  border-right: none;
  border-left: none;
}
.border-offline {
  border: none;
}
.recommend_daily_body {
  width: 100%;
  height: 85%;
  /*border: 1px solid red;*/
}
#daily_hot ol {
  margin-bottom: 0;
  bottom: 0;
}
#daily_hot ol li {
  background: rgb(204, 204, 204);
  width: 15px;
  height: 15px;
}
#daily_hot ol li.active {
  background: rgb(255, 68, 0);
}
#daily_hot div.carousel-inner {
  height: 90%;
  padding: 0;
}
.daily_list {
  width: 100%;
  height: 100%;
  /*border: solid 1px red;*/
  padding: 5px 5px 5px 13px;
}
.daily_list li {
  width: 19%;
  height: 100%;
  border: solid 1px #ddd;
  /*margin-left: 1%;*/
}
.daily_list li:not(:first-child) {
  margin-left: 1%;
}
.daily_list li:hover {
  border: solid 1px rgba(255, 68, 0, 0.8);
}
.daily_hot_list-head {
  width: 100%;
  height: 70%;
  padding: 5px 30px;
}
.daily_hot_list_body {
  width: 100%;
  height: 30%;
  padding: 5px;
}
div.daily_hot_list_body_item:first-child {
  height: 40%;
}
div.daily_hot_list_body_item:first-child p {
  color: rgb(255, 68, 0);
  font-size: 20px;
}
div.daily_hot_list_body_item:first-child del {
  opacity: 0.7;
  font-size: 10px;
  margin-left: 10px;
  margin-top: 6px;
}
div.daily_hot_list_body_item {
  height: 30%;
  width: 100%;
  /*border: 1px solid lightcoral;*/
  padding: 3px 10px;
}
div.daily_hot_list_body_item p {
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
div.daily_hot_list_body_item:last-child p {
  opacity: 0.7;
}
div.daily_hot_list_body_item:last-child a {
  font-family: serif;
  color: white;
  background: rgb(73, 204, 0);
  padding: 1px;
  line-height: 16px;
}
#daily_history ol {
  margin-bottom: 0;
  bottom: 0;
}
#daily_history ol li {
  background: rgb(204, 204, 204);
  width: 15px;
  height: 15px;
}
#daily_history ol li.active {
  background: rgb(255, 68, 0);
}
#daily_history div.carousel-inner {
  height: 90%;
  padding: 0;
}
#guess_like ol {
  margin-bottom: 0;
  bottom: 0;
}
#guess_like ol li {
  background: rgb(204, 204, 204);
  width: 15px;
  height: 15px;
}
#guess_like ol li.active {
  background: rgb(255, 68, 0);
}
#guess_like div.carousel-inner {
  height: 90%;
  padding: 0;
}
.carousel_btn {
  width: 100%;
  position: absolute;
  height: 50px;
  top: 100px;
}
a.carousel-control {
  width: 50px;
  height: 50px;
  background: rgb(203, 203, 204);
  color: white;
  font-size: 30px;
  font-weight: bold;
}
a.carousel-control:last-child {
  margin-left: 95.5%;
}

/*end recommend_daily*/
</style>