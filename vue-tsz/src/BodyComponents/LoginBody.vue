<template>
  <div class="main" id="main">
    <TSZLoginLeft></TSZLoginLeft>
    <TSZToolTip :toolTipData="tooltip"></TSZToolTip>
    <TSZLoginRight :toolTipData="tooltip" :universities="universities" :allcities="allcities"></TSZLoginRight>
  </div>
</template>

<script>
import TSZLoginLeft from "../components/LoginLeft";
import TSZLoginRight from "../components/LoginRight";
import TSZToolTip from "../components/ToolTip";
export default {
  name: "LoginBody",
  components: {
    TSZLoginLeft,
    TSZToolTip,
    TSZLoginRight,
  },
  data() {
    return {
      tooltip: {
        display: false,
        strongtext: "",
        text: ""
      },
      allUniversity: []
    };
  },
  props: ["universities", "allcities"]
};
</script>

<style scoped>
.main {
  width: 100%;
  height: 800px;
  padding: 10px 10% 10px 10%;
  background: rgb(245, 245, 245);
  display: flex;
}
</style>
