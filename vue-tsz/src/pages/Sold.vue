<template>
  <div>
    <TSZHeader :universities="universities"></TSZHeader>
    <TSZSoldBody></TSZSoldBody>
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
import TSZSoldBody from "../BodyComponents/SoldBody";

export default {
  name: "Index",
  components: { TSZHeader, TSZFooter, TSZOverlay, TSZSoldBody },
  props: ["universities"]
};
</script>

<style scoped>
</style>
