<template>
  <el-footer height="200px" class="footer">
		<el-row style="margin-top: 10px;width: 100%;height: 35%;padding-top: 20px" type="flex" :gutter="10">
			<el-col :span="8" :offset="8" style="text-align: center;">
				<el-link :underline="false" class="hvr-grow footer-link" href="/about">关于我们</el-link>
				<el-link :underline="false" class="hvr-grow footer-link" href="/joinus">申请合作</el-link>
				<el-link :underline="false" class="hvr-grow footer-link" href="/app/private_policy">隐私政策</el-link>
				<el-link :underline="false" class="hvr-grow footer-link" href="/app/license">服务条款</el-link>
				<el-link :underline="false" class="hvr-grow footer-link" href="/app/links">友情链接</el-link>
			</el-col>
		</el-row>
	  <div class="footer-body fl">
		  <p class="fa fa-copyright">&nbsp;by Copyright 淘书斋 渝ICP备12345678号-2</p>
		  <p>淘书斋二手书平台&nbsp;|&nbsp;地址:重庆市xxx区 xxx街道 xxx办公室&nbsp;|&nbsp; 联系电话:13232343531</p>
		  <p>买卖二手书，就上淘书斋。淘书斋二手书交易网-您身边最全的二手书网站</p>
	  </div>
  </el-footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
/*footer*/
.footer {
  background-color: rgb(63, 63, 63);
  width: 100%;
	bottom: 0;
	/*position: fixed;*/
}
.footer-link{
  color: rgb(174, 189, 185);
  font-size: 12px;
  font-family: Consolas;
}
.footer-body {
  width: 100%;
  height: 45%;
  text-align: center;
  padding: 10px;
}
.footer-body p {
  color: rgb(174, 189, 185);
}
/*end footer*/
</style>
