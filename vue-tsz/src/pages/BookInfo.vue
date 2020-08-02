<template>
	<div>
		<Header1 :universities="universities"></Header1>
		<el-main style="width: 100%;padding: 20px 10%">
			<el-row style="height: 100px;line-height: 100px; width: 100%">
				<el-col :span="8" :offset="2">
					<img src="../assets/logo.png" alt="" width="180" height="64">
				</el-col>
				<el-col :span="6">
					<el-input placeholder="请输入关键词" v-model="currentSearchKey">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="6" :offset="1">
					<el-button type="default" icon="el-icon-shopping-cart-full">购物车</el-button>
					<!--					<el-badge :value="currentCart.size" type="hot" style="position: relative;left: -75px;top: -13px;"></el-badge>-->
				</el-col>
			</el-row>
			<hr>
			<el-row style="padding: 20px 8%">
				<el-col>
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: '/' }">阅读</el-breadcrumb-item>
						<el-breadcrumb-item>休闲</el-breadcrumb-item>
					</el-breadcrumb>
				</el-col>

			</el-row>
			<el-row style="padding: 10px 8%" :guater="10">
				<el-col :span="5">
					<div style="border: 1px solid #dcdcdc;height: 350px;padding: 40px 35px;margin-bottom: 10px">
						<a href="#">
							<el-image src="/static/upload/陪孩子终生成长(樊登2020新书).jpg" style="height: 268px;width: 200px;"></el-image>
						</a>
					</div>
					<el-link>收藏</el-link>
					<el-divider direction="vertical"></el-divider>
					<el-link>分享</el-link>
					<el-divider direction="vertical"></el-divider>
					<el-link>阅读</el-link>
				</el-col>
				<el-col :span="14" :offset="1">
					<h3>{{currentBook.name}}</h3>
					<p :title="currentBook.description" class="book-description">{{currentBook.description}}</p>
					<el-row style="line-height: 30px;background-color: #f5f5f5;padding: 5px">
						<el-col :span="2">售价:</el-col>
						<el-col :span="3" style="font-size: 24px;font-weight: bold;color: red">&yen;{{currentBook.price.now}}
						</el-col>
						<el-col :span="2" :offset="2">原价:</el-col>
						<el-col :span="4">
							<del style="color: gray">&yen;{{currentBook.price.before}}</del>
							/ {{ (currentBook.price.now / currentBook.price.before * 10).toFixed(2)}}折
						</el-col>
						<el-col :span="16"></el-col>
						<el-col :span="2">作者:</el-col>
						<el-col :span="3">
							<el-link plain :underline="false">{{currentBook.author}}</el-link>
						</el-col>
						<el-col :span="2">出版社:</el-col>
						<el-col :span="5">
							<el-link :underline="false">{{currentBook.publish}}</el-link>
						</el-col>
						<el-col :span="3">出版时间:</el-col>
						<el-col :span="4">{{currentBook.pub_time}}</el-col>
						<el-col style="line-height: 40px">在
							<el-link :href="currentBook.rank.url" :underline="false">{{currentBook.rank.typename}}</el-link>
							排{{currentBook.rank.value}}名
						</el-col>
						<el-col>
							<span>{{currentBook.rate.readcount}}人正在读</span>
							<el-divider direction="vertical"></el-divider>
							<span>{{currentBook.rate.commentcount}}人评论</span>
							<el-rate v-model="currentBook.rate.score" show-score text-color="#ff9900" class="fr"
							         style="padding-right: 40px" disabled></el-rate>
						</el-col>
					</el-row>
					<el-row style="padding: 5px;line-height:40px">
						<el-col :span="3">配送至:</el-col>
						<el-col :span="10">
							<el-cascader :options="cityOptions" clearable size="small"></el-cascader>
						</el-col>
						<el-col :span="2">库存:</el-col>
						<el-col :span="3">{{currentBook.storage_number < 10 ? '库存紧张':currentBook.storage_number}}</el-col>
						<el-col :span="6">
							<el-popover placement="bottom" width="200" trigger="hover">
								<ul style="font-size: 12px;color: black">
									<li>自营订单满49元（含）免运费</li>
									<li>不足金额订单收取运费6元起</li>
								</ul>
								<p slot="reference">快递费</p>
							</el-popover>
						</el-col>
						<el-col :span="3">服务:</el-col>
						<el-col :span="20">由"当当"发货，并提供售后服务。 23:15前完成下单，预计明天<strong>(8月2日)</strong>可送达</el-col>
						<el-col :span="3">数量:</el-col>
						<el-col :span="4">
							<el-input-number v-model="currentBook.select_cnt" :min="1" :max="currentBook.storage_number"
							                 size="small"></el-input-number>
						</el-col>
						<el-col :span="15" :offset="2">
							<el-button type="danger" @click="addtocart">加入购物车</el-button>
							<el-button type="warning">立即购买</el-button>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="4">
					<el-col style="padding: 3px">
						<a :href="'#/store/'+currentbookstore.id">
							<img :src="currentbookstore.img_url" alt="" width="200px">
						</a>
					</el-col>
					<el-col style="padding-left: 10px;color: gray">
						<a :href="'#/store/'+currentbookstore.id" style="color: gray">{{currentbookstore.name}}</a>
					</el-col>
					<el-col style="padding-left: 10px;margin-top:10px ">
						<ul>
							<li style="width: 50%;color:#855758">
								<el-link href="#" :underline="false">正品保障</el-link>
							</li>
							<li style="width: 50%;color:#855758">
								<el-link href="#" :underline="false">服务支持</el-link>
							</li>
							<li style="width: 50%;color:#855758">
								<el-link href="#" :underline="false">差价返还</el-link>
							</li>
							<li style="width: 50%;color:#855758">
								<el-link href="#" :underline="false">15天换货</el-link>
							</li>
							<li style="width: 50%;color:#855758">
								<el-link href="#" :underline="false">礼品包装</el-link>
							</li>
							<li style="width: 100%;color:#855758">
								<el-link href="#" :underline="false">支持7天无理由退货</el-link>
							</li>
							<li style="width: 100%;color:#855758">
								<el-link href="#" :underline="false">支持礼品卡</el-link>
							</li>
						</ul>
					</el-col>
					<el-col style="margin-top: 10px;padding-left: 10px">
						<el-button type="text">进入店铺</el-button>
						<el-button type="text">收藏店铺</el-button>
					</el-col>
					<el-col style="padding: 10px;background-color: #f5f5f5">
						<p>44个商家在售</p>
						<span style="color: red">&yen;<strong>29.40</strong></span>&nbsp;起
						<p>商家预计送达时间5-14天</p>
					</el-col>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-row style="padding: 10px 8% 0 8%">
				<el-col :span="4">
					<p>浏览此商品的顾客也同时浏览</p>
					<el-col style="text-align: center;padding: 10px;border:1px solid #f5f5f5" v-for="(item,index) in books_other"
					        :key="index">
						<el-link style="text-align: center;">
							<img :src="item.url" :alt="item.alt" :title="item.title">
						</el-link>
						<el-col style="text-align: left;margin-top: 10px;padding-left: 10px">
							<span style="font-size: 16px;color: red;text-align: left">&yen;{{item.price}}</span>
						</el-col>
						<el-col style="-webkit-line-break: 2;text-overflow: ellipsis;text-align: left;margin-top: 5px;padding-left: 10px">
							<el-link :underline="false">{{item.name}}</el-link>
						</el-col>
						<el-col style="text-align: left;margin-top: 5px;padding-left: 10px">
							<p>{{item.author}}著</p>
						</el-col>
					</el-col>
				</el-col>
				<el-col :span="19" :offset="1">
					<el-tabs type="card">
						<el-tab-pane label="经常一起购买的商品">
							<div v-if="currentBook.relativebooks.total == 0" style="padding: 10px">
								暂无相关书籍
							</div>
							<el-row v-else style="padding: 10px;margin-bottom: 30px">
								<el-col :span="5" v-for="(item,index) in currentBook.relativebooks.data" type="flex">
									<el-col style="text-align: center">
										<el-link :underline="false">
											<img :src="item.img_path" :alt="item.book_name" width="140" height="180">
										</el-link>
									</el-col>
									<span style="font-size: 18px;color: red">&yen;<strong>{{item.price}}</strong></span>
									<el-link type="text" plain :underline="false">{{item.book_name}}</el-link>
								</el-col>
							</el-row>
						</el-tab-pane>
					</el-tabs>
					<el-tabs type="card" tab-position="top">
						<el-tab-pane label="商品详情">
							<el-row :gutter="10" style="padding: 10px">
								<el-col :span="6">开 本：20开</el-col>
								<el-col :span="6" :offset="2">纸 张：胶版纸</el-col>
								<el-col :span="6" :offset="2">包 装：平装-胶订</el-col>
								<el-col :span="6" style="margin-top:10px">是否套装: 否</el-col>
								<el-col style="margin-top: 10px">国际标准书号ISBN：9787111571544</el-col>
							</el-row>
							<div>
								<div class="comments-title">
									<p>产品特色</p>
								</div>
								<div class="info-body">
									<img src="http://img59.ddimg.cn/99999990133849049.jpg" alt="">
								</div>
							</div>
							<div>
								<div class="comments-title">
									<p>目录</p>
								</div>
								<div class="info-body">{{currentBook.info.directory}}</div>
							</div>
							<div style="margin-top: 10px">
								<div class="comments-title">
									<p>前言</p>
								</div>
								<div class="info-body">{{currentBook.info.preface}}</div>
							</div>
							<div style="margin-top: 10px">
								<div class="comments-title">
									<p>内容简介</p>
								</div>
								<div>{{currentBook.info.content}}</div>
							</div>
							<div style="margin-top: 10px">
								<div class="comments-title">
									<p>作者简介</p>
								</div>
								<div class="info-body">{{currentBook.info.author}}</div>
							</div>
						</el-tab-pane>
						<el-tab-pane :label="'商品评论('+ currentBook.comments.total+')'">
							<div>
								<div class="comments-title">
									<p>短评 ({{currentBook.comments.total}})</p>
								</div>
								<el-row>
									<el-col :span="4">
										<div class="comments-outer">
											<div class="comments-inner">
												<span>好评率</span>
												<span style="color: red;font-size: 20px">100%</span>
											</div>
										</div>
									</el-col>
									<el-col :span="18">
										<p>买过的人都觉得</p>
										<el-row>
											<el-tag v-for="(item,index) in currentBook.comments.tags" :key="index" type="warning"
											        class="comments-tags">{{item.value +' ('+ item.count + ')' }}
											</el-tag>
										</el-row>
									</el-col>
								</el-row>
							</div>
							<div style="margin-top: 20px">
								<div class="comments-title">
									<el-col :span="2">全部 ({{currentBook.comments.total}})</el-col>
									<el-col :span="2" :offset="2">好评 ({{currentBook.comments.evaluate[0]}})</el-col>
									<el-col :span="2" :offset="2">中评 ({{currentBook.comments.evaluate[1]}})</el-col>
									<el-col :span="2" :offset="2">差评 ({{currentBook.comments.evaluate[2]}})</el-col>
									<el-col :span="2" :offset="2">有图 ({{currentBook.comments.evaluate[3]}})</el-col>
								</div>
								<ul class="comments-body">
									<li v-for="(item,index) in currentBook.comments.data" style="width: 100%">
										<el-col :span="19">
											<el-col style="margin-top: 5px">
												<el-rate v-model="item.score" :max="5" disabled show-score text-color="#ff9900"
												         score-template="{value}"></el-rate>
											</el-col>
											<el-col style="margin-top: 10px">
												<el-link :href="item.detail_url" plain :underline="false">{{item.detail}}</el-link>
											</el-col>
											<el-col style="margin-top: 5px">
												<span style="color: gray">{{item.time}}</span>
												<img src="http://product.dangdang.com/images/icon_yg.png" alt="">
												<span class="fr">
													<el-button type="text" class="glyphicon glyphicon-thumbs-up">{{item.approve}}</el-button>
												</span>
											</el-col>
										</el-col>
										<el-col :span="4" :offset="1" style="float: right">
											<el-image style="width: 60px; height: 60px;border-radius: 50%" :src="item.logo"></el-image>
											<p>{{item.name}}</p>
											<p>{{item.level}}</p>
										</el-col>
										<el-divider class="fl"></el-divider>
									</li>
								</ul>
							</div>
							<el-col>
								<el-pagination layout="prev, pager, next" :total="50" class="fr"></el-pagination>
							</el-col>
							<el-col>
								<p style="background-color: #f5f5f5">评论专区</p>
								<el-col :span="4">书本满意度:</el-col>
								<el-col :span="6">
									<el-rate v-model="comments_new.rank" show-score text-color="#ff9900"
									         score-template="{value}"></el-rate>
								</el-col>
								<el-col style="margin-top: 10px">
									<el-input type="textarea" placeholder="请输入评价内容" v-model="comments_new.text" maxlength="200"
									          show-word-limit></el-input>
								</el-col>
								<el-col style="margin-top: 10px">
									<el-button type="primary" @click="submit_comment">提交</el-button>
								</el-col>
							</el-col>
						</el-tab-pane>
						<el-tab-pane :label="'商品问答('+ currentBook.answers.total+')'">123</el-tab-pane>
					</el-tabs>
				</el-col>
			</el-row>

		</el-main>
		<Footer></Footer>
	</div>
</template>

<script>
  import Header1 from '../BodyComponents/Header1'
  import Footer from '../BodyComponents/Footer'

  export default {
    name: 'BookInfo',
    components: {Footer, Header1},
    props: [
      'universities'
    ],
    data () {
      return {
        searchOptions: ['宝贝', '书本'],
        currentOption: '宝贝',
        currentSearchKey: '',
        searchHotKeyList: ['学会自我接纳', '请停止道歉', '治愈隐性虐待', '新基建', '情绪免疫'],
        currentCart: {
          size: 0
        },
        currentBookTags: ['阅读', '休闲'],
        bookRateValue: 4.7,
        currentBook: {
          name: '陪孩子终身成长(2020新书)',
          id: 12345,
          author: '樊登',
          publish: '中国友谊出版公司',
          pub_time: '2020年4月',
          rate: {
            score: 4.4,
            commentcount: 11231,
            readcount: 33000
          },
          img_path: '/static/upload/陪孩子终生成长(樊登2020新书).jpg',
          description: '樊登读书创始人樊登读书创始人洞察所有亲子问题背后的根源影响40，000,000人的领读人樊登在《读懂孩子的心》后，向家长们解答了家庭教育的底层逻辑。为什么在家长的眼中，孩子的问题是无穷无尽的？为什么家长一味给孩子找“药方”，却不能想想自己是不是可以改和弥补？焦虑和担心不能让孩子变得更好！樊登洞察所有亲子问题背后的根源：你必须成长，才能帮孩子成长。',
          price: {
            now: 18.99,
            before: 45.99
          },
          rank: {
            typename: '当当亲子/家教畅销榜',
            url: '',
            value: 11
          },
          word_count: 99000,
          tags: ['生活', '亲子/家教', '家教理论和方法'],
          storage_number: 10,
          free_post_limit: 49,
          select_cnt: 1,
          info: {
            content: '樊登不仅是 40，000，000 会员的领读人，还是参与、陪伴和享受孩子成长的父亲。\n' +
              '面对东西方多样的育儿理念和方法，家长们无所适从。樊登去芜存菁，将个人认同并验证的教育理念和方法写入《读懂孩子的心》。帮助迷茫中的父母解决了各种棘手难题：孩子抵触写作业、叛逆期、性格内向、缺乏社会能力等等。\n' +
              '继《读懂孩子的心》后，父母们渴望找到家庭教育的底层逻辑：什么样的教育应该发生在孩子出现问题之前？什么样的原则应该渗透到日常所有的教育中？\n' +
              '樊登在《陪孩子终身成长》中建立起亲子教育的三根支柱：无条件的爱、价值感、终身成长的心态。无条件的爱，为孩子提供幸福和勇气；价值感，让孩子有内驱力去创造成就；终身成长的心态，是一切美德背后的美德。\n' +
              '本书献给所有渴望和孩子一起成长的父母：\n' +
              '孩子提出的每一个问题，都将是彼此成长的一次机会。',
            author: '  樊登\n' +
              '“樊登读书”创始人\n' +
              '西安交通大学本硕、北京师范大学博士\n' +
              '1999年国际大专辩论赛冠军\n' +
              '央视主持人，曾在中央电视台主持《12演播室》《三星智力快车》等节目。\n' +
              '2004年起，在北京交通大学任教。2013年从北京交通大学辞职，创办以自己名字命名的“樊登读书会”，2018年“樊登读书会”完成品牌战略升级，正式更名为“樊登读书”。至今已影响超过4000万用户。\n' +
              '著有《读懂孩子的心》《读书是一辈子的事》《读懂一本书》等畅销作品。',
            directory: 'Part1 理解养育的本质\n' +
              '第一章为什么说亲子关系决定孩子的一生\n' +
              '亲子关系，决定我们与世界的关系\n' +
              '父母对孩子的影响是最大的\n' +
              '所有关系都是原生家庭关系的投射\n' +
              '我们的思维模式，由父母决定\n' +
              '家暴是遏制孩子健康成长的杀手\n' +
              '为什么我们会缺乏安全感\n' +
              '带来终身恐惧的冷暴力\n' +
              '那些藏在潜意识里的童年创伤\n' +
              '养育孩子，本质上是一个复杂体系\n' +
              '在复杂中成长，生命才会充满活力\n' +
              '人生最重要的三根支柱\n' +
              '第四章 培养无条件的爱，让孩子的内心充满力量\n',
            preface: '因为介绍了一些家庭教育方面的知识，很多家长便把我当成了家庭教育的专家，总喜欢问我关于孩子的问题：“我儿子不爱学习，该让他看什么书？”“我女儿自律性差，应该读什么书？ ”“我儿子做事缺乏耐心…… ”“ 我女儿脾气暴躁……”……\n' +
              '被问得多了，我就总结出了几条规律：\n' +
              '第一，在家长眼中，孩子的问题是无穷无尽的。孩子不爱说话，家长便希望他外向；孩子外向了，家长又觉得他太调皮了；孩子很乖，但是不爱学习；爱学习，可是没朋友；朋友多，却不懂得筛选……总之，家长的担心和焦虑无穷无尽，谁也不用羡慕谁。\n' +
              '第二，大部分家长看不到孩子的行为和自己的教养方式之间的联系。家长总希望给孩子找到一个药方，甚至不惜花大价钱把孩子送去各种训练营集中“修理”，也不愿意想想是不是自己做错了，可不可以改进和弥补。'
          },
          comments: {
            total: 113,
            evaluate: [10, 80, 20, 3],
            pageNumber: 0,
            data: [
              {
                score: 5,
                detail: '书收到了，还没有开始看，今年一直都在听樊登读书会的书，特别是教育类型的，感觉自己有事不是一个合格的妈妈！需要更深入的学习！争取做一个合格的妈妈！',
                time: '2020-04-28 16:10:20',
                approve: 0,
                detail_url: '#',
                logo: 'http://img7x7.ddimg.cn/imghead/69/17/2033624668947-1_o.png',
                name: '晶晶凉凉',
                level: '砖石会员'
              }

            ],
            tags: [
              {
                value: '家长必读',
                count: 12
              },
              {
                value: '家长必读',
                count: 12
              },
              {
                value: '亲子关系',
                count: 12
              }
              ,
              {
                value: '共同成长',
                count: 12
              },
              {
                value: '共同成长',
                count: 12
              }
              , {
                value: '共同成长',
                count: 12
              },
              {
                value: '共同成长',
                count: 12
              }

            ]

          },
          relativebooks: {
            total: 1,
            data: [
              {
                img_path: '/static/upload/陪孩子终生成长(樊登2020新书).jpg',
                book_name: '陪孩子终身成长(2020新书)',
                price: 32.50
              },
              {
                img_path: '/static/upload/陪孩子终生成长(樊登2020新书).jpg',
                book_name: '陪孩子终身成长(2020新书)',
                price: 32.50
              }
            ]
          },
          answers: {
            total: 10,
            data: []
          }
        },
        cityOptions: [
          {
            value: '北京市',
            label: '北京市',
            children: [
              {
                value: '北京市',
                label: '北京市',
                children: [
                  {
                    value: '东城区',
                    label: '东城区'
                  },
                  {
                    value: '西城区',
                    label: '西城区'
                  },
                  {
                    value: '朝阳区',
                    label: '朝阳区'
                  },
                ]
              }
            ]
          }

        ],
        comments_new: {
          rank: 5.0,
          text: ''

        },
        books_other: [
          {
            name: '妈妈知道怎么办：一学就通的养育法入选樊登读书年度书单俞敏',
            title: '妈妈知道怎么办：一学就通的养育法入选樊登读书年度书单俞敏洪、马东、凯叔、王芳强力推荐 百万妈妈信赖，著名主持人，亲子教育专家王小骞全新力作！硬核带娃攻略，拯救父母的终极武器！赠送价值129元的《给孩子的大师艺术课》！',
            alt: '妈妈知道怎么办：一学就通的养育法入选樊登读书年度书单俞敏',
            url: 'http://img3m0.ddimg.cn/45/11/28528380-1_l_14.jpg',
            author: '王小骞',
            price: 114
          },
          {
            name: '妈妈知道怎么办：一学就通的养育法入选樊登读书年度书单俞敏',
            title: '妈妈知道怎么办：一学就通的养育法入选樊登读书年度书单俞敏洪、马东、凯叔、王芳强力推荐 百万妈妈信赖，著名主持人，亲子教育专家王小骞全新力作！硬核带娃攻略，拯救父母的终极武器！赠送价值129元的《给孩子的大师艺术课》！',
            alt: '妈妈知道怎么办：一学就通的养育法入选樊登读书年度书单俞敏',
            url: 'http://img3m0.ddimg.cn/45/11/28528380-1_l_14.jpg',
            author: '王大骞',
            price: 113
          }
        ],
        currentbookstore: {
          img_url: 'http://img51.ddimg.cn/9002780034324851.jpg',
          id: 123,
          name: '北京磨铁图书有限公司',

        }

      }
    },
    methods: {
      submit_comment: function () {
        this.comments_new.text = this.comments_new.text.trim()
        if (this.comments_new.text == '') {
          this.$message({
            type: 'warning',
            message: '请认真填写相关评论'
          })
        } else {
          if (!this.$store.getters.token) {
            this.$message({
              type: 'warning',
              message: '当前用户没有登录,请登录后在评论书籍'
            })
            return
          }
          if (this.comments_new.rank >= 0 && this.comments_new.rank <= 1.5) {
            this.currentBook.comments.evaluate[2] += 1
          } else if (this.comments_new.rank > 1.5 && this.comments_new.rank < 4) {
            this.currentBook.comments.evaluate[1] += 1
          } else {
            this.currentBook.comments.evaluate[0] += 1
          }

          var self = this
          this.currentBook.comments.total += 1
          this.currentBook.comments.data.push(
            {
              name: 'user info',
              detail: self.comments_new.text,
              time: new Date().toDateString(),
              approve: 0,
              detail_url: '#',
              logo: 'http://img7x7.ddimg.cn/imghead/69/17/2033624668947-1_o.png',
              level: '白银会员',
              score: self.comments_new.rank
            }
          )
          // checked login
          this.$message({
            type: 'success',
            message: '评论成功'
          })
          this.comments_new.text = ''
          this.comments_new.rank = 5.0
        }
      },
      addtocart: function () {
        if (this.$store.getters.token === undefined || this.$store.getters.token == '') {
          this.$message({
            type: 'warning',
            message: '当前用户没有登录,无法添加到购物车'
          })
          return
        }
        this.$message({
          type: 'success',
          message: '添加书籍到购物车成功'
          })

      }
    }
  }
</script>

<style scoped>
	.book-description {
		text-overflow: ellipsis;
		white-space: nowrap;
		-webkit-line-break: 2;
		overflow: hidden;
		color: gray;
	}

	.comments-outer {
		width: 120px;
		height: 120px;
		background-color: red;
		z-index: 100;
		border-radius: 50%;
	}

	.comments-inner {
		width: 110px;
		height: 110px;
		background-color: #fef0f0;
		z-index: 101;
		position: absolute;
		top: 5px;
		left: 5px;
		border-radius: 50%;
		padding: 33px;
		text-align: center;
		/*line-height: 30px;*/
	}

	.comments-tags {
		margin-right: 10px;
		cursor: pointer;
		margin-top: 10px;
	}

	.comments-tags:hover {
		border: 1px solid red;
	}

	.comments-title {
		background-color: #f5f5f5;
		height: 30px;
		font-size: 12px;
		padding-left: 10px;
		font-family: microsoft YaHei;
		line-height: 30px;
	}

	.comments-body {
		padding: 5px;
	}

	.info-body {
		padding: 10px;
		font-size: 14px;

	}
</style>