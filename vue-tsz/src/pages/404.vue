<template>
	<div class="main-404">
		<el-container align="center" style="height: 100%;width: 100%">
			<el-main style="height: 100%">
				<el-row style="height: 100%"  justify="center" align="middle" type="flex">
					<el-col :span="6" :offset="3">
						<el-image src="static/images/404_notfound.png" fit="fill" style="width: 600px; height: 329px;"></el-image>
					</el-col>
					<el-col :span="6" align="left">
						<el-row>
							<b class="oops">OOPS!</b>
						</el-row>
						<el-row style="margin-top: 20px">
							<p class="right-404">All rights reserved <a href="#">wallstreetcn</a></p>
						</el-row>
						<el-row>
							<strong class="info-404">The webmaster said that you can not enter this page...</strong>
						</el-row>
						<el-row>
							<p class="info1-404">Please check that the URL you entered is correct, or click the button below to return to the homepage</p>
						</el-row>
						<el-row>
							<el-button type="primary" round @click="backHome()">Back to Home</el-button>
						</el-row>
					</el-col>
				</el-row>
			</el-main>
		</el-container>
	</div>
</template>
<script>
	export default {
	  name:'notfound',
		methods:{
	    backHome(){
	      this.$router.push({
		      path:'/'
	      })
	    }
		}
	}
</script>


<style>
	.main-404 {
		height: 100%;
		width: 100%;
		margin: 0 auto;
	}
	b.oops{
		color:#1482f0;
		font-size: 32px;
		line-height: 40px;
	}
	p.right-404{
		font-size: 16px;
	}
	strong.info-404{
		font-size: 18px;
	  font-weight: 600;
  }
	p.info1-404{
		font-size: 13px;
		color: grey;
	}


</style>