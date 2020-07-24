<template>
	<el-container style="width: 100%;background-color: rgb(51,51,51);height: 40px; line-height: 40px">
		<el-row style="width: 100%">
			<el-col :span="4" :offset="4">
				<el-button type="text" style="color: rgb(1, 200, 181);" @click="showSchoolList=true"><i
								class="el-icon-location">【{{currentSchool}}】</i></el-button>
				<el-dialog title="请选择学校" :visible.sync="showSchoolList">
					<span>快捷方式: <el-button type="text" style="color:rgb(1,200,181)"
					                       @click="changeCurrentSchool('123',-1)"><strong>所有学校</strong></el-button></span>
					<span>当前省份:{{currentSchoolList.currentProvince}}</span>
					<div style="border:1px solid #a1a7a6; width: 100%; height: 80px;padding: 0 10px;">
						<el-button type="text" v-for="(item,index) in currentSchoolList.currentProvinceList" :key="index"
						           class="province_button" @click="changeCurrentSchool(item, index)">
							{{item}}
						</el-button>
					</div>
					<div style="border: 1px solid #a1a7a6; width: 100%; height: 200px;padding: 0 10px;margin-top: 10px;overflow-y: scroll">
						<el-button type="text" class="school_button"
						           v-for="(item,index) in currentSchoolList.currentProvinceSchoolList" :key="index"
						           @click="showSchoolList=false;currentSchool=item">{{item}}
						</el-button>
					</div>
				</el-dialog>
			</el-col>
			<el-col :span="6" :offset="9">
				<el-dropdown>
					<el-button type="text" size="medium" style="color: rgb(1,200,181)">登录</el-button>
					<el-dropdown-menu slot="dropdown" style="width: 120px">
						<el-dropdown-item>我的资料</el-dropdown-item>
						<el-dropdown-item>
							<router-link to="/cart">我的购物车</router-link>
						</el-dropdown-item>
						<el-dropdown-item><router-link to="/favorite">我的收藏</router-link></el-dropdown-item>
						<el-dropdown-item>退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<router-link to="/sold">
					<el-button type="text" size="medium" style="color: rgb(1,200,181);">出售</el-button>
				</router-link>
				<router-link to="/register">
					<el-button type="text" size="medium" style="color: orange">立即注册</el-button>
				</router-link>
				<router-link to="/downloadapp">
					<el-button type="text" size="medium" style="color: rgb(1,200,181)"><i class="el-icon-apple">下载APP</i>
					</el-button>
				</router-link>
			</el-col>
		</el-row>
	</el-container>
</template>


<script>

  export default {
    name: 'Header1',

    data () {
      return {
        currentSchool: '所有学校',
        showSchoolList: false,
        currentSchoolList: {
          currentProvince: '所有学校',
          currentProvinceList: ['北京', '上海', '黑龙江', '吉林', '辽宁', '天津', '安徽', '江苏', '浙江', '陕西', '湖北', '广东', '湖南',
            '甘肃', '四川', '山东', '福建', '河南', '重庆', '云南', '河北', '江西', '山西', '贵州', '广西', '内蒙古',
            '宁夏', '青海', '西藏', '香港', '澳门', '台湾'],
          currentProvinceSchoolList: [],
          currentProvinceIndex: -1
        }
      }
    },
    props: ['universities'],
    created () {
      this.changeCurrentSchool(this.currentSchoolList.currentProvince, -1)
    },
    methods: {
      changeCurrentSchool: function (item, index) {
        const self = this
        this.currentSchoolList.currentProvinceIndex = index
        this.currentSchoolList.currentProvinceSchoolList = []
        if (index == -1) {//全部学校
          this.currentSchoolList.currentProvinceSchoolList.push('所有大学')
          this.universities.forEach((data) => {
            data.university.forEach((uni, index) => {
              if (index !== 0) self.currentSchoolList.currentProvinceSchoolList.push(uni.name)
            })
          })
        } else {
          this.universities.forEach((data) => {
            if (typeof data.city === typeof item && data.city === item) {
              data.university.forEach(uni => {
                self.currentSchoolList.currentProvinceSchoolList.push(uni.name)
              })
              this.currentSchoolList.currentProvince = item
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
	div.el-dialog__body {
		padding-top: 0;
	}

	.school_button, .province_button {
		padding: 0 5px;
		margin: 0;
		color: rgb(1, 200, 181)
	}

	.school_button:hover, .province_button:hover {
		color: white;
		background-color: rgb(1, 200, 181);
	}
</style>