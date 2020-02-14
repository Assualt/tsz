<template>
  <div class="slider_view fl">
    <div>
      <a href="javascript:void(0)" target="_blank">
        <img
          :src="currentSlideImgPath"
          alt="加载失败"
          value="0"
          id="slide_img"
          width="100%"
          class="img-responsive"
        />
      </a>
      <div class="slider_sel_btn">
        <span
          v-for="(item,index) in AllSlide"
          class="fa fa-circle"
          :class="[currentSlide === item-1 ? 'opacity_1': 'opacity_04']"
          :value="index"
          @mouseover="setSlide(item-1)"
		  :key="index"
        ></span>
      </div>
      <div class="slider_view_btn">
        <a href="#" id="btn_left" class="fl" @click="prev()">
          <i class="fa fa-angle-left fa-5x"></i>
        </a>
        <a href="#" id="btn_right" class="fr" @click="next()">
          <i class="fa fa-angle-right fa-5x"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SlideView",
  data() {
    return {
      currentSlideImgPath: "static/images/focus_0.jpg",
      currentSlide: 0,
      AllSlide: [1, 2, 3]
    };
  },
  methods: {
    imgFormat: function(value) {
      return "static/images/focus_" + value + ".jpg";
    },
    setSlide: function(index) {
      this.currentSlide = index;
      this.currentSlideImgPath = this.imgFormat(index);
    },
    prev: function() {
      if (this.currentSlide === 0) this.currentSlide = 2;
      else this.currentSlide = (this.currentSlide - 1) % this.AllSlide.length;
      this.currentSlideImgPath = this.imgFormat(this.currentSlide);
    },
    next: function() {
      this.currentSlide = (this.currentSlide + 1) % this.AllSlide.length;
      this.currentSlideImgPath = this.imgFormat(this.currentSlide);
    }
  }
};
</script>

<style scoped>
.slider_view {
  width: 100%;
  background: #f5f5f5;
  padding: 20px 14%;
  margin: 15px 0 1% 0;
  height: 370px;
}
.slider_view_btn {
  width: 100%;
  height: 110px;
  position: relative;
  left: 0;
  top: -170px;
}
.slider_sel_btn {
  text-align: center;
  position: relative;
  width: 100%;
  height: 20px;
  top: 0;
  padding: 2px 5px 0 5px;
  background: rgb(0, 178, 206);
}
.slider_sel_btn span {
  color: white;
}
#btn_left {
  height: 100px;
  width: 30px;
  padding: 15px 5px 15px 0;
  opacity: 0.1;
}
#btn_left:hover,
#btn_left:hover li {
  opacity: 0.3;
  background: rgb(1, 99, 90);
  color: white;
}
#btn_right:hover,
#btn_right:hover li {
  opacity: 0.3;
  background: rgb(1, 99, 90);
  color: white;
}
#btn_right {
  height: 100px;
  width: 30px;
  padding: 15px 0 15px 5px;
  opacity: 0.1;
}
</style>
