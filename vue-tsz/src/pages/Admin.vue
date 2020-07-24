<template>
  <el-container style="height: 100%;">
		<el-main class="height-100" style="background-image: url('static/admin/background-4.jpg') !important ;background-repeat:no-repeat;background-size:cover;">
			<el-card style="width: 400px;position:absolute;left: 40%;top: 25%" shadow="hover">
				<el-form label-width="0px" class="height-100" status-icon :rules="rules" :model="login_form">
					<el-form-item>
						<h4 style="color: black;text-align: center">淘书斋后台管理系统</h4>
						<span class="language-span">
							<el-dropdown @command="handlecommand">
								<span class="el-dropdown-link"><i class="fa fa-language fa-2x"></i></span>
								<el-dropdown-menu slot="dropdown" style="width: 100px">
					        <el-dropdown-item :disabled="currentLanguage==1" command="1">简体中文</el-dropdown-item>
					        <el-dropdown-item :disabled="currentLanguage==2" command="2">繁体中文</el-dropdown-item>
					        <el-dropdown-item :disabled="currentLanguage==3" command="3">EngLish</el-dropdown-item>
					        <el-dropdown-item :disabled="currentLanguage==4" command="4">日语</el-dropdown-item>
					      </el-dropdown-menu>
							</el-dropdown>
						</span>
					</el-form-item>
					<el-form-item style="text-align: center;padding: 0 30px;" prop="username">
						<el-input v-model="login_form.username" placeholder="请输入用户名" prefix-icon="el-icon-user" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item style="text-align: center;padding: 0 30px;" prop="userpass">
						<el-input v-model="login_form.userpass" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password type="passwd" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item style="text-align: center;padding: 0 30px;" prop="verfiycode">
						<el-col :span="12">
							<el-input v-model="login_form.verfiycode" placeholder="请键入验证码" prefix-icon="el-icon-lock" autocomplete="off"></el-input>
						</el-col>
						<el-col :span="12"></el-col>
					</el-form-item>
					<el-form-item style="text-align: center;padding: 0 30px;">
						<el-button round type="primary" class="btn btn-block" @click="adminLogin()">登录</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-main>
  </el-container>
</template>
<script>
export default {
  name: "Admin",
  components: {},
  props: [],
  data() {
    var checkUserkName = (rule, value, callback) =>{
      if(value === '')
        return callback('请输入用户名');
	  };
    var checkPass = (rule, value, callback)=>{
      if(value === '')
        return callback('请输入密码');
    };
    var checkVerfiy = (rule, value, callback)=>{
      if(value === '')
        return callback('请输入验证码信息');
    };
    return {
      login_form:{
        username:'',
	      userpass:'',
	      verfiycode: ''
      },
	    currentLanguage: 1,
	    rules:{
				username: [{validator: checkUserkName, trigger: 'blur'}],
        userpass: [{validator: checkPass, trigger: 'blur'}],
		    verfiycode:[{validator: checkVerfiy, tigger: 'blur'}]
	    }
    };
  },
  methods: {
    async adminLogin(){
      if(this.login_form.userpass == '' || this.login_form.username == ''){
        this.$message({
	        type: 'error',
	        message: '当前输入的用户/密码为空,无法进行登录'
        });
      }else{

        setTimeout(function(){
          console.log("timeout");
        }, 3000);

        this.$message({
	        type: 'success',
	        message: '登录成功..'
        });
        await this.$router.push({
          path: '/admin/dashboard',
          query: {
            id: '123213'
          }
        });
      }
    },
	  handlecommand(command){
      if(this.currentLanguage == command){
        return;
      }
      this.currentLanguage = command;
	  }
  }
};
</script>

<style scoped>
	.height-100{
		height: 100%;
	}
	.language-span{
		position: absolute;
		width: 40px;
		right: -20px;
		top: 20px;
	}
	.el-form-item__content{
		margin: 0 20px;
	}
</style>
