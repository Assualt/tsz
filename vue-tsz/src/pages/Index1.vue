<template>
	<div>
		<Header1 :universities="universities"></Header1>
		<el-main style="padding: 0 10%;width: 100%">
			<el-row style="height: 100px;line-height: 100px; width: 100%">
				<el-col :span="8" :offset="2">
					<img src="../assets/logo.png" alt="" width="180" height="64">
				</el-col>
				<el-col :span="8" :offset="6">
					<el-col :span="4">
						<el-button type="text" class="bold" style="color: rgb(1, 200 ,181);">登录</el-button>
					</el-col>
					<el-col :span="4">
						<router-link to="/sold">
							<el-button type="text" class="bold" style="color: #000000;">出售</el-button>
						</router-link>
					</el-col>
					<el-col :span="4">
						<router-link to="buy">
							<el-button type="text" class="bold" style="color: black;">求购</el-button>
						</router-link>
					</el-col>
					<el-col :span="4">
						<el-button type="text" class="bold" style="color: black;">免费赠阅</el-button>
					</el-col>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="20" :offset="2">
					<el-carousel height="300px" style="width: 100%">
						<el-carousel-item v-for="(item,index) in carouselImagePath" :key="index">
							<el-image :src="item" style="width: 100%"/>
						</el-carousel-item>
					</el-carousel>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col :span="20" :offset="2" style="height: 100%">
					<el-row>
						<el-col style="height: 30px">
							<span class="hot-keyword">
								<p class="fl">热搜:</p>
								<a v-for="(item,index) in hotkeyWord" :key="index" class="fl">{{item}}</a>
							</span>
						</el-col>
					</el-row>
					<el-row style="margin-top: 10px;" :gutter="6">
						<el-col :span="7">
							<el-card shadow="never">
								<div slot="header" class="clearfix hot-store">
									<span><b>热门书店</b><i class="fa fa-free-code-camp" style="color: red"></i></span>
								</div>
								<ul>
									<li v-for="(item,index) in hotStore" :key="index" style="width: 100%">
										<span>
											<a :href="'/store/'+item.id">
												<el-image :src="item.img_url" style="width: 32px;height: 32px" fit="fill">
													<div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
												</el-image>
											</a>
											<p class="hvr-grow">{{item.name}}&nbsp;&nbsp;(&nbsp;{{item.id}}&nbsp;)</p>
										</span>
									</li>
								</ul>
							</el-card>
							<el-card shadow="never" style="margin-top: 10px">
								<div slot="header" class="clearfix hot-store">
									<span><b>热门个人</b><i class="fa fa-free-code-camp" style="color: red"></i></span>
								</div>
								<ul>
									<li v-for="(item,index) in hotPerson" :key="index" style="width: 100%">
										<span>
											<a :href="'/store/'+item.id">
												<el-image :src="item.img_url" style="width: 32px;height: 32px" fit="fill">
													<div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
												</el-image>
											</a>
											<p class="hvr-grow">{{item.name}}&nbsp;&nbsp;(&nbsp;{{item.id}}&nbsp;)</p>
										</span>
									</li>
								</ul>
							</el-card>
						</el-col>
						<el-col :span="17">
							<el-card shadow="never" style="padding: 10px">
								<div slot="header" class="clearfix" style="height: 30px;line-height: 30px;justify-content: center">
									<span style="font-size: 20px;font-weight: 600">好书推荐<i class="el-icon-water-cup"></i></span>
									<el-button type="text" style="float: right;color: rgb(1,200,181);height: 100%;padding: 0">更多<i class="el-icon-arrow-right"></i></el-button>
								</div>
								<div style="width: 100%">
									<div v-for="(item,index) in booksList.goodbooks" class="book_info" :key="index">
										<a :href="'search?bookname='+item.book_name+'&sorted=recommend'">
											<el-image :src="item.img_url" :title="item.book_name" :alt="item.book_name"
											          style="width: 90px;height: 120px" class="hvr-grow-shadow">
												<div slot="error" class="image-slot">
													<i class="el-icon-picture-outline"></i>
												</div>
											</el-image>
										</a>
										<h6 class="line-limit">{{item.book_name}}</h6>
										<el-row>
											<el-col :span="6" :offset="6">
												<p class="now—price">
													<i class="fa fa-yen">{{item.price_now}}</i>
												</p>
											</el-col>
											<el-col :span="6" :offset="2">
												<p class="last-price">
													<del class="fa fa-yen">{{item.price_before}}</del>
												</p>
											</el-col>
										</el-row>
									</div>
								</div>
							</el-card>
							<el-card shadow="never" style="padding: 10px; margin-top: 10px">
								<div slot="header" class="clearfix" style="height: 30px;line-height: 30px;justify-content: center">
									<span style="font-size: 20px;font-weight: 600">打折推荐 <i class="el-icon-water-cup"></i></span>
									<el-button type="text" style="float: right;color: rgb(1,200,181);height: 100%;padding: 0">更多<i class="el-icon-arrow-right"></i></el-button>
								</div>
								<div style="width: 100%">
									<div v-for="(item,index) in booksList.discounrbooks" class="book_info" :key="index">
										<a :href="'search?bookname='+item.book_name+'&sorted=discount'">
											<el-image :src="item.img_url" :title="item.book_name" :alt="item.book_name"
											          style="width: 90px;height: 120px" class="hvr-grow-shadow">
												<div slot="error" class="image-slot">
													<i class="el-icon-picture-outline"></i>
												</div>
											</el-image>
										</a>
										<h6 class="line-limit">{{item.book_name}}</h6>
										<el-row>
											<el-col :span="6" :offset="6">
												<p class="now—price">
													<i class="fa fa-yen">{{item.price_now}}</i>
												</p>
											</el-col>
											<el-col :span="6" :offset="2">
												<p class="last-price">
													<del class="fa fa-yen">{{item.price_before}}</del>
												</p>
											</el-col>
										</el-row>
									</div>
								</div>
							</el-card>
							<el-card shadow="never" style="padding: 10px; margin-top: 10px">
								<div slot="header" class="clearfix" style="height: 30px;line-height: 30px;justify-content: center">
									<span style="font-size: 20px;font-weight: 600">新书推荐 <i class="el-icon-water-cup"></i></span>
									<el-button type="text" style="float: right;color: rgb(1,200,181);height: 100%;padding: 0">更多<i class="el-icon-arrow-right"></i></el-button>
								</div>
								<div style="width: 100%">
									<div v-for="(item,index) in booksList.newlybooks" class="book_info">
										<a :href="'search?bookname='+item.book_name+'&sorted=newbook'">
											<el-image :src="item.img_url" :title="item.book_name" :alt="item.book_name"
											          style="width: 90px;height: 120px" class="hvr-grow-shadow">
												<div slot="error" class="image-slot">
													<i class="el-icon-picture-outline"></i>
												</div>
											</el-image>
										</a>
										<h6 class="line-limit">{{item.book_name}}</h6>
										<el-row>
											<el-col :span="6" :offset="6">
												<p class="now—price">
													<i class="fa fa-yen">{{item.price_now}}</i>
												</p>
											</el-col>
											<el-col :span="6" :offset="2">
												<p class="last-price">
													<del class="fa fa-yen">{{item.price_before}}</del>
												</p>
											</el-col>
										</el-row>
									</div>
								</div>
							</el-card>
							<el-card shadow="never" style="padding: 10px; margin-top: 10px">
								<div slot="header" class="clearfix" style="height: 30px;line-height: 30px;justify-content: center">
									<span style="font-size: 20px;font-weight: 600">最受欢迎推荐 <i class="el-icon-water-cup"></i></span>
									<el-button type="text" style="float: right;color: rgb(1,200,181);height: 100%;padding: 0">更多<i class="el-icon-arrow-right"></i></el-button>
								</div>
								<div style="width: 100%">
									<div v-for="(item,index) in booksList.discounrbooks" class="book_info">
										<a :href="'search?bookname='+item.book_name+'&sorted=popular'">
											<el-image :src="item.img_url" :title="item.book_name" :alt="item.book_name"
											          style="width: 90px;height: 120px" class="hvr-grow-shadow">
												<div slot="error" class="image-slot">
													<i class="el-icon-picture-outline"></i>
												</div>
											</el-image>
										</a>
										<h6 class="line-limit">{{item.book_name}}</h6>
										<el-row>
											<el-col :span="6" :offset="6">
												<p class="now—price">
													<i class="fa fa-yen">{{item.price_now}}</i>
												</p>
											</el-col>
											<el-col :span="6" :offset="2">
												<p class="last-price">
													<del class="fa fa-yen">{{item.price_before}}</del>
												</p>
											</el-col>
										</el-row>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-main>
		<Footer></Footer>
	</div>

</template>

<script>

  import Header1 from '../BodyComponents/Header1'
  import Footer from '../BodyComponents/Footer'
  import HotObject from '../components/HotObject'

  export default {
    name: 'Index1.vue',
    components: {Footer, Header1, HotObject},
    props: ['universities'],
    data () {
      return {
        carouselImagePath: ['static/images/focus_0.jpg', 'static/images/focus_1.jpg', 'static/images/focus_2.jpg'],
        hotkeyWord: ['英文', '计算机', 'CET4/6', 'English'],
        hotStore: [],
        hotPerson: [],
        mostFocus: [],
        newRegister: [],
        booksList: {
          goodbooks: [],
					discounrbooks:[],
	        newlybooks:[],
	        popularbooks:[]
        }
      }
    },
    async created () {
      let RetData = await this.axios_get('static/json/hot-topic.json', [])
      if (RetData == false) {
        console.log('Request Data is empty.')
      } else {
        const allData = RetData.data
        allData.forEach(data => {
          if (data.name === 'hot-topic') {
            this.hotTopicWord = data.value
          } else if (data.name === 'hot-bookstore') {
            this.hotStore = data.value
          } else if (data.name === 'hot-person') {
            this.hotPerson = data.value
          } else if (data.name === 'most-focus') {
            this.mostFocus = data.value
          } else if (data.name === 'new-register') {
            this.newRegister = data.value
          }
        })
      }
      RetData = await this.axios_get('static/json/book-discount.json', [])
      if (RetData != false) {
        this.booksList.goodbooks = RetData.data
      }
      RetData = await this.axios_get("static/json/book-discount.json",[]);
      if (RetData != false) {
        this.booksList.discounrbooks = RetData.data;
      }
      RetData = await this.axios_get("static/json/book-new-comment.json",[]);
      if (RetData != false) {
        this.booksList.newlybooks = RetData.data;
      }
      RetData = await this.axios_get("static/json/book-popular.json",[]);
      if (RetData != false) {
        this.booksList.popularbooks = RetData.data;
      }
    }
  }
</script>

<style scoped>
	.bold {
		font-size: 20px;
		font-weight: 600;
		cursor: pointer;
	}

	span.hot-keyword {
		height: 100%;
		line-height: 30px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		background-color: #efefef;

	}

	span.hot-keyword p {
		line-height: 30px;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		font-weight: 400;
		padding-left: 10px;
		font-size: 16px;
		width: 50px;
		margin: 0
	}

	span.hot-keyword a {
		width: auto;
		height: 100%;
		font-size: 16px;
		color: rgb(0, 168, 155);
		padding: 0 10px;
	}

	.book_info {
		width: 20%;
		height: 25%;
		float: left;
		text-align: center;
	}

	.line-limit {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	p.now—price{
		font-size: 16px;
		color: rgb(1,200,181);
		line-height: 20px;
	}
	p.last-price{
		font-size: 10px;
		line-height: 20px;
		color: #C0C4CC;
	}
</style>