<template>
  <div class="main">
    <div class="header-tools">
      <div class="header-tools-left fl">
        <a href="#">
          <img src="../assets/logo.png" alt width="180" height="64" />
        </a>
      </div>
      <div class="header-tools-right fr form-inline">
        <form class="form-group-sm fr" role="form" action=" ">
          <div class="form-group fl">
            <select class="form-control fl">
              <option value="宝贝">宝贝</option>
              <option value="书本">书本</option>
              <option value="店铺">店铺</option>
            </select>
          </div>
          <div class="form-group fl">
            <input type="text" class="form-control" placeholder="搜  索" name="search" size="30" />
          </div>
          <div class="form-group fl">
            <input type="submit" class="form-control btn btn-warning" value="搜  索" />
          </div>
        </form>
      </div>
    </div>
    <TSZGoodsTable></TSZGoodsTable>
    <TSZCartSlide></TSZCartSlide>
  </div>
</template>

<script>
import TSZGoodsTable from '../components/GoodsTable'
import TSZCartSlide from "../components/CartSlide"
export default {
  name: "CartBody",
  components:{
      TSZGoodsTable,
      TSZCartSlide
  }
};
</script>


<style scoped>
.header-tools {
  width: 100%;
  height: 100px;
  /*border: solid 1px red;*/
  padding: 5px 8% 5px 8%;
}
.header-tools-left {
  width: 30%;
  height: 100%;
  text-align: center;
  padding-top: 10px;
}
.header-tools-right {
  width: 70%;
  height: 100%;
  text-align: center;
  padding: 3% 10%;
}
.header-tools-right .form-inline {
  border: 3px solid rgb(255, 68, 0);
}
.header-tools-right input,
.header-tools-right select {
  border-radius: 0;
}
.header-tools-right input[type="button"] {
  width: 100px;
  background: rgb(255, 68, 0);
  font-size: 16px;
  font-weight: 700;
  border: 0;
}
/*end header-tools*/
</style>