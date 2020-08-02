<template>
	<div id="sold">
		<Header1 :universities="universities"></Header1>
		<el-main style="width: 100%;height: 1800px;padding: 0 10%">
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
			<el-row style="line-height: 60px;padding: 0 10%">
				<el-row align="center">
					<el-col :span="2" style="margin-top: 25px">
						<el-breadcrumb separator-class="el-icon-arrow-right">
							<el-breadcrumb-item :to="{ path: '/' }">全部</el-breadcrumb-item>
							<el-breadcrumb-item>图书</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-tag closable type="success" size="small" v-for="(item,index) in currentSelect.tagList"
					        @close="removeTag(item,0)"
					        style="margin:0 5px" :key="index">{{item}}
					</el-tag>
					<span>
							<el-link type="text" :underline="false" @click="removeTag(null, 1)">清除筛选</el-link>&nbsp;
							<b>当前共{{currentSelect.booksListSize}}件商品</b>
					</span>
				</el-row>
				<ul class="book-filter list-group">
					<li class="list-group-item" v-for="(item, index) in currentSelect.options" :key="index">
						<el-col :span="2" style="height: 100%;background-color:rgb(254,248,245)">{{item.value}}</el-col>
						<el-col :span="18" align="left" style="height: 100%">
							<el-link v-for="(it,index) in item.itemlist.slice(0,8)" :key="index" :underline="false"
							         style="padding: 0 10px" v-if="!item.expand" @click="addToTagList(it)">
								{{it}}
							</el-link>
						</el-col>
						<el-col :span="3" :offset="1" style="float: right" v-if="item.showMore">
							<el-button type="text" class="el-icon-plus" style="color: black" @click="item.expand=true">多选</el-button>
							<el-button type="text" :class="item.expand?'el-icon-arrow-up':'el-icon-arrow-down'" style="color: black"
							           @click="item.expand=!item.expand">更多
							</el-button>
						</el-col>
						<el-collapse-transition>
							<el-col :span="22" :offset="2" v-if="item.expand" style="border: 1px solid #eee">
								<el-row style="text-align: left">
									<el-link v-for="(it,index) in item.itemlist" :key="index" :underline="false" style="padding: 0 10px"
									         @click="addToTagList(it)">
										{{it}}
									</el-link>
								</el-row>
								<el-button-group>
									<el-button type="text" style="margin-right: 10px">取消</el-button>
									<el-button type="text" @click="item.expand=false">确认</el-button>
								</el-button-group>
							</el-col>
						</el-collapse-transition>
					</li>
				</ul>
			</el-row>
			<el-row class="books-filter-by-sort">
				<el-link :underline="false" class="sort-by-Comprehensive">综合排序</el-link>
				<el-divider direction="vertical"></el-divider>
				<el-link :underline="false"
				         @click="currentSelect.filter.sortBySaleCountDesc=!currentSelect.filter.sortBySaleCountDesc">销量 <i
								:class="!currentSelect.filter.sortBySaleCountDesc? 'glyphicon glyphicon-arrow-down':'glyphicon glyphicon-arrow-up'"></i>
				</el-link>
				<el-divider direction="vertical"></el-divider>
				<el-link :underline="false"
				         @click="currentSelect.filter.sortByRecommentDesc=!currentSelect.filter.sortByRecommentDesc">好评 <i
								:class="!currentSelect.filter.sortByRecommentDesc? 'glyphicon glyphicon-arrow-down':'glyphicon glyphicon-arrow-up'"></i>
				</el-link>
				<el-divider direction="vertical"></el-divider>
				<el-link :underline="false"
				         @click="currentSelect.filter.sortByPublishTimeDesc=!currentSelect.filter.sortByPublishTimeDesc">出版时间 <i
								:class="!currentSelect.filter.sortByPublishTimeDesc? 'glyphicon glyphicon-arrow-down':'glyphicon glyphicon-arrow-up'"></i>
				</el-link>
				<el-divider direction="vertical"></el-divider>
				<el-link :underline="false" @click="currentSelect.filter.sortByPrice=!currentSelect.filter.sortByPrice">价格 <i
								:class="!currentSelect.filter.sortByPrice? 'glyphicon glyphicon-arrow-down':'glyphicon glyphicon-arrow-up'"></i>
				</el-link>
				<el-divider direction="vertical"></el-divider>
				<el-input prefix-icon="fa fa-yen" style="width: 70px" v-model="currentSelect.filter.money.min"
				          size="mini"></el-input>
				<el-input prefix-icon="fa fa-yen" style="width: 70px" v-model="currentSelect.filter.money.max"
				          size="mini"></el-input>
				<el-divider direction="vertical"></el-divider>
				<span>配送至:</span>
				<el-input size="mini" style="width: 60px" v-model="currentSelect.filter.destination.select"></el-input>
				<el-divider direction="vertical"></el-divider>
				<el-checkbox-group v-model="currentSelect.filter.checkTips" class="fr" style="width: 500px">
					<el-checkbox v-for="(tip,index) in currentSelect.filter.tips" :label="tip" :key="index" style="margin:0 5px">
						{{tip}}
					</el-checkbox>
				</el-checkbox-group>
			</el-row>
			<el-col style="padding: 0 10%;height: 1000px">
				<li class="filter-books-info" v-for="(item,index) in currentSelect.bookItem" :key="index">
					<el-col :span="4">
						<a :href="'#/book/'+item.book_id">
							<img :src="item.book_image_url" :alt="item.book_author + '/' + item.book_publish.name" width="200"
							     height="220">
						</a>
					</el-col>
					<el-col :span="16" style="padding: 5px">
						<el-col>
							<el-link :underline="false" style="font-size: 16px">{{item.book_advertisment}}</el-link>
						</el-col>
						<el-col style="margin-top: 5px">
							<span class="fa fa-yen now-price">{{item.book_now_price}}</span>
							<span class="before-price">定价:<del class="fa fa-yen">{{item.book_before_price}}</del></span>
						</el-col>
						<el-col style="margin-top: 10px">
							<span class="author"><a href="#">{{item.book_author}}</a>&nbsp;著&nbsp;/&nbsp;{{item.book_publish.time}}&nbsp;/&nbsp;<a
											href="#">{{item.book_publish.name}}</a></span>
						</el-col>
						<el-col style="margin-top: 5px">
							<el-col :span="6">
								<el-rate v-model="item.book_rate.score" show-text show-score disabled></el-rate>
							</el-col>
							<el-col :span="6">
								共{{item.book_rate.comment_number}}人评论
							</el-col>
						</el-col>
						<el-col style="margin-top: 5px;" v-if="item.autarky">
							<el-tag type="success">当当自营</el-tag>
							<el-tag type="danger">限时秒杀</el-tag>
						</el-col>
						<el-col style="margin-top: 5px" v-else>
              <span class="el-icon-store">
                <el-link :href="'/store/'+item.book_store.id" :underline="false" type="danger" icon="el-icon-s-shop">{{item.book_store.name}}</el-link>
                <span v-if="item.book_store.has_gift" style="background:red;color:white;padding: 1px 4px">赠品</span>
              </span>
						</el-col>
						<el-col style="margin-top: 5px">
							<p>{{item.book_description}}</p>
						</el-col>
						<el-col style="margin-top: 0px">
							<el-button type="info" size="small" @click="addtocart">加入购物车</el-button>
							<el-button type="danger" size="small" @click="addtofavor">收藏</el-button>
						</el-col>
					</el-col>
				</li>
			</el-col>
		</el-main>
		<Footer></Footer>
	</div>
</template>

<script>
  import Header1 from '../BodyComponents/Header1'
  import Footer from '../BodyComponents/Footer'
  import * as Loading from 'element-ui'

  export default {
    name: 'Sold1',
    components: {Footer, Header1},
    data () {
      return {
        currentSelect: {
          tagList: [],
          booksListSize: 0,
          options: {
            publish: {
              value: '出版社',
              selected: '',
              expand: false,
              itemlist: ['人民出版社', '电子机械出版社', '中国华侨出版社', '北方妇女儿童出版社', '青岛出版社', '光明日报出版社', '沈阳出版社', '重庆出版社', '金城出版社', '黄山书社', '万卷出版公司',
                '时代文艺出版社', '文汇出版社', '文化艺术出版社', '长江出版社', '国际文化出版公司', '花山文艺出版社', '长江文艺出版社', '北方文艺出版社', '知识出版社', '河南文艺出版社', '陕西人民出版社',
                '团结出版社', '新星出版社', '成都时代出版社', '广东旅游出版社', '贵州人民出版社'
              ],
              showMore: true
            },
            author: {
              value: '作者',
              selected: '',
              itemlist: ['林家成', '唐七公子'],
              expand: false,
              showMore: true
            },
            brand: {
              value: '品牌',
              selected: '',
              itemlist: ['未读', '理想国', '知音'],
              expand: false,
              showMore: true
            },
            privce: {
              value: '价格',
              selected: '',
              itemlist: ['0-19', '19-39'],
              expand: false,
              showMore: false
            },
            level: {
              value: '评价',
              selected: '',
              itemlist: ['5星', '4星', '3星', '2星', '1星'],
              showMore: false
            }
          },
          filter: {
            money: {
              max: 100,
              min: 0
            },
            destination: {
              select: '北京',
              items: ['北京', '上海']
            },
            checkTips: [],
            tips: ['自营', '有货', '促销', '手机专享', '特卖', '预售', '入驻商家'],
            sortBySaleCountDesc: false,
            sortByRecommentDesc: false,
            sortByPublishTimeDesc: false,
            sortByPrice: false
          },
          bookItem: []
        },
        rateTest: 4.5
      }
    },
    methods: {
      async getFilterBooks () {
        //axio post
        const RetData = await this.axios_get('static/json/sold_filter.json', [])
        if (RetData == false) {
          this.$message({message: '请求数据失败', type: 'error'})
          return
        }
        this.currentSelect.bookItem = RetData.data
        this.currentSelect.booksListSize = this.currentSelect.bookItem.length
      },
      addToTagList (key) {
        if (this.currentSelect.tagList.indexOf(key) != -1) {
          this.$message({
            message: '当前标签已经选择了,请勿重复添加标签',
            type: 'warning'
          })
        } else if (this.currentSelect.tagList.length == 10) {
          this.$message({
            message: '当前标签过多,建议删除部分标签后,重新添加',
            type: 'info'
          })
        } else {
          this.currentSelect.tagList.push(key)
        }
      },
      removeTag (tagName, type) {
        if (type == 1) {
          this.currentSelect.tagList = []
        } else {
          // this.currentSelect.tagList
          var index = this.currentSelect.tagList.indexOf(tagName)
          if (index != -1) {
            this.currentSelect.tagList.splice(index, 1)
          }
        }
      },
      addtofavor: function () {
        if (this.$store.getters.token === undefined || this.$store.getters.token == '') {
          this.$message({
            type: 'warning',
            message: '当前用户未登录,无法收藏'
          })
          return
        }
      },
      addtocart: function () {
        if (this.$store.getters.token === undefined || this.$store.getters.token == '') {
          this.$message({
            type: 'warning',
            message: '当前用户未登录,无法添加到购物车  '
          })
          return
        }else{

        }
      }

    },
    props: ['universities'],
    async created () {
      await this.getFilterBooks()
    },
  }
</script>

<style scoped>
	.bold {
		font-size: 20px;
		font-weight: 600;
		cursor: pointer;
	}

	ul.book-filter {
		width: 100%;
	}

	ul.book-filter li {
		width: 100%;
		text-align: center;
		min-height: 40px;
		padding: 0;
		line-height: 40px;
		border-left: none;
		border-right: none;
	}

	.books-filter-by-sort {
		background-color: #e6e6e6;
		height: 40px;
		margin: 20px 10%;
		padding: 0 10px;
		line-height: 40px;
	}

	.sort-by-Comprehensive {
		color: red;
		padding: 10px 0;
		height: 30px;
	}

	.sort-by-Comprehensive:hover {
		background-color: #e6e6e6;
	}

	.filter-books-info {
		height: 260px;
		padding: 20px 10px;
		list-style: none;
	}

	.filter-books-info:hover {
		background-color: #f8f8f8;
	}

	.now-price {
		color: red;
		font-size: 18px;
		font-weight: bold;

	}

	.before-price {
		color: #969696;
		text-decoration: line-through;
		font-size: 12px;
		font-weight: normal;
		font-family: arial, 'Hiragino Sans GB', "Simsun";
		margin-left: 10px;

	}
</style>