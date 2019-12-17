<template>
  <div
    id="overlay"
    ref="mask"
    class="swal2-container overlay"
    tabindex="-1"
    :class="[ bOverLay ? 'display_show' : 'display_hide']"
  ></div>
</template>

<script>
export default {
  name: "Overlay",
  data: function() {
    return {
      bOverLay: false
    };
  },
  methods: {
    setOverlay: function(tmp) {
      this.bOverLay = tmp;
    }
  },
  mounted() {
    this.$refs.mask.style.height = "3000px";
	// console.log("height:" + document.getElementById("app").clientHeight);
    let self = this;
    this.bus.$on("ReceiveMessage", function(item) {
      self.bOverLay = item;
    });
  }
};
</script>

<style scoped>
.overlay {
  background-color: rgba(0, 0, 0, 0.4);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  position: fixed;
}
/*end of overlay*/
</style>
