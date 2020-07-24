<template>
	<div>
		<Header1 :universities="universities"></Header1>
		<el-main style="width: 100%;padding: 0 10%;border: 1px solid red;overflow: auto;height: 800px">
			<el-col style="margin-top: 5%">
				<el-steps :active="currentStep" finish-status="success" align-center>
					<el-step title="确认收货地址"></el-step>
					<el-step title="订单确认"></el-step>
					<el-step title="支付"></el-step>
					<el-step title="查看状态"></el-step>
				</el-steps>
			</el-col>
			<el-col style="height: 550px;padding: 5% 0">
				<el-col :span="20" :offset="2">
					123
				</el-col>
			</el-col>
			<el-col>
				<el-col :span="6" :offset="6">
					<el-button @click="prevstep" :disabled="currentStep==1">上一步</el-button>
				</el-col>
				<el-col :span="6" :offset="2">
					<el-button @click="nextstep" :disabled="currentStep==4">下一步</el-button>
				</el-col>
			</el-col>
		</el-main>
		<Footer></Footer>
	</div>
</template>

<script>
  import Footer from '../BodyComponents/Footer'
  import Header1 from '../BodyComponents/Header1'
  export default {
    name: 'Submit',
    components: {Footer, Header1},
    props: ["universities"],
	  data(){
      return{
        currentStep:1
      }
	  },
	  methods:{
      prevstep:function () {
        if(this.currentStep > 1)
					this.currentStep--;
      },
		  nextstep:function () {
				if(this.currentStep < 4)
				  this.currentStep ++;
      }
	  }
  }
</script>

<style scoped>

</style>