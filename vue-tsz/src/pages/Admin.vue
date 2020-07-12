<template>
  <el-container style="height: 100%;">
		<el-main style="background-color: #2d3a4b;" class="height-100">
			<el-form label-width="80px" class="height-100">
				<el-row class="height-100 row-bg" type="flex" justify="center" align="middle">
					<el-col :span="8">
						<el-form-item align="center" >
							<h1 style="color: white">系统登录</h1>
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
						<el-form-item>
							<el-input v-model="login_form.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="login_form.userpass" placeholder="请输入用户名" prefix-icon="el-icon-lock" show-password type="passwd"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" class="btn btn-block" @click="adminLogin()">登录</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-main>
  </el-container>
</template>
<script>
export default {
  name: "Admin",
  components: {},
  props: [],
  data() {
    return {
      login_form:{
        username:'',
	      userpass:''
      },
	    currentLanguage: 1
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
		right: -50px;
		top: 20px;
	}
</style>
