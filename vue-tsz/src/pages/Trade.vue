<template>
  <div>
    <TSZHeader :universities="universities"></TSZHeader>
    <TSZTradeBody></TSZTradeBody>
    <TSZCartSlide></TSZCartSlide>
    <TSZFooter></TSZFooter>
    <TSZOverlay></TSZOverlay>
  </div>
</template>

<script>
//Common
import TSZHeader from "../BodyComponents/Header";
import TSZFooter from "../BodyComponents/Footer";
import TSZOverlay from "../components/Overlay";

//body
import TSZTradeBody from "../BodyComponents/TradeBody"
import TSZCartSlide from "../components/CartSlide"

export default {
  name: "Trade",
  components: { TSZHeader, TSZFooter, TSZOverlay, TSZTradeBody,TSZCartSlide},
  props: ["universities"]
};
</script>

<style scoped>
</style>
