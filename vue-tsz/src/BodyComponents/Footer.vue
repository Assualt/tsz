<template>
  <div class="footer fl">
    <ul class="footer-head fl">
      <li class="fl">
        <a href="#" class="hvr-grow">关于我们</a>
      </li>
      <li class="fl">
        <a href="#" class="hvr-grow">申请合作</a>
      </li>
      <li class="fl">
        <a href="#" class="hvr-grow">隐私政策</a>
      </li>
      <li class="fl">
        <a href="#" class="hvr-grow">服务条款</a>
      </li>
      <li class="fl">
        <a href="#" class="hvr-grow">帮助</a>
      </li>
      <li class="fl">
        <a href="#" class="hvr-grow">友情链接</a>
      </li>
    </ul>
    <div class="footer-body fl">
      <p class="fa fa-copyright">&nbsp;by Copyright 淘书斋 渝ICP备12345678号-2</p>
      <p>淘书斋二手书平台&nbsp;|&nbsp;地址:重庆市xxx区 xxx街道 xxx办公室&nbsp;|&nbsp; 联系电话:13232343531</p>
      <p>买卖二手书，就上淘书斋。淘书斋二手书交易网-您身边最全的二手书网站</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
/*footer*/
.footer {
  background: rgb(63, 63, 63);
  width: 100%;
  height: 150px;
}
.footer-head {
  width: 100%;
  height: 25%;
  padding-top: 20px;
  padding-left: 38%;
  margin-bottom: 0;
}
.footer-head li {
  width: auto;
  padding: 0 5px 0 5px;
  text-align: center;
}
.footer-head li a {
  color: rgb(174, 189, 185);
  font-size: 12px;
  font-family: Consolas;
}
.footer-body {
  width: 100%;
  height: 75%;
  text-align: center;
  padding: 10px;
}
.footer-body p {
  color: rgb(174, 189, 185);
}
/*end footer*/
</style>
