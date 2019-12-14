<template>
  <div>
    <TSZHeader :universities="universities"></TSZHeader>
    <TSZCartBody></TSZCartBody>
    <TSZFooter></TSZFooter>
    <TSZOverlay></TSZOverlay>
  </div>
</template>

<script>
import TSZHeader from "../BodyComponents/Header";
import TSZFooter from "../BodyComponents/Footer";
import TSZOverlay from "../components/Overlay";
import TSZCartBody from "../BodyComponents/CartBody"
export default {
  name: "cart",
  components: {
    TSZHeader,
    TSZFooter,
    TSZOverlay,
    TSZCartBody
  },
  props: ["universities"]
};
</script>

<style scoped>
</style>