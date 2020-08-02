<template>
	<div>
		<Header1 :universities="universities"></Header1>
		<el-main style="width: 100%;padding: 0 10%;overflow: auto">
			<el-row style="height: 100px;line-height: 100px; width: 100%">
				<el-col :span="8" :offset="2">
					<img src="../assets/logo.png" alt="" width="180" height="64">
				</el-col>
				<el-col :span="8" :offset="4">
					<el-input placeholder="请输入关键词" v-model="currentSearchKey">
						<el-select v-model="currentOption" slot="prepend" placeholder="请选择" style="width: 100px">
							<el-option :label="item" v-for="(item,index) in searchOptions" :key="index" style="width: 100px"
							           :value="item">{{item}}
							</el-option>
						</el-select>
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
				<el-col :span="6">
				</el-col>
			</el-row>
			<el-row style="margin-bottom: 20px">
				<el-row style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);line-height: 52px">
					<el-col :span="3" align="center" class="cart-body-title"
					        :class="cartsBody.currentCountsIndex==0?'cart-body-title-hovered':''">
						<span @mouseenter="cartsBody.currentCountsIndex=0">全部商品 {{cartsBody.counts.allshops}}</span>
					</el-col>
					<el-col :span="1">
						<el-divider direction="vertical"></el-divider>
					</el-col>
					<el-col :span="3" align="center" class="cart-body-title"
					        :class="cartsBody.currentCountsIndex==1?'cart-body-title-hovered':''">
						<span @mouseenter="cartsBody.currentCountsIndex=1">降价商品 {{cartsBody.counts.discountshops}}</span>
					</el-col>
					<el-col :span="1">
						<el-divider direction="vertical"></el-divider>
					</el-col>
					<el-col :span="3" align="center" class="cart-body-title"
					        :class="cartsBody.currentCountsIndex==2?'cart-body-title-hovered':''">
						<span @mouseenter="cartsBody.currentCountsIndex=2">库存紧张 {{cartsBody.counts.tightshops}}</span>
					</el-col>
					<el-col :span="6" :offset="5">
						<span>已选商品:(不含运费)
              <p class="fa fa-yen" style="color: orange;font-size: 16px;font-weight: bold">:{{cartsBody.selectOptions.price}}</p>
            </span>
					</el-col>
					<el-col :span="2" align="right">
						<el-button type="primary" :disabled="cartsBody.selectOptions.price == 0.00" size="medium"
						           @click="submitBooks">结算
						</el-button>
					</el-col>
				</el-row>
				<el-row style="height: 30px;line-height: 30px">
					<el-col :span="4">
						<el-checkbox v-model="checkAll">全选</el-checkbox>
					</el-col>
					<el-col :span="8">
						<span>商品信息</span>
					</el-col>
					<el-col :span="3" align="center">
						<span>单价</span>
					</el-col>
					<el-col :span="3" align="center">
						<span>数量</span>
					</el-col>
					<el-col :span="3" align="center">
						<span>金额</span>
					</el-col>
					<el-col :span="3" align="center">
						<span>操作</span>
					</el-col>
				</el-row>
				<el-row v-if="cartsEmpty" style="margin-bottom: 20px">
					<h1 align="center">
						亲，你当前的购物车
						<i class="fa fa-cart-plus primary" aria-hidden="true" style="color: red"></i>空空如也！
					</h1>
					<p align="center" style="color:#123321">
						<router-link to="/sold">赶紧去挑选基本适合自己的书籍吧.</router-link>
					</p>
				</el-row>
				<el-row v-for="(store_books, index) in cartsBody.cartsBooks" :key="index"
				        style="margin-top: 5px;line-height: 40px;" v-else>
					<el-col :span="3">
						<el-checkbox v-model="store_books.isChecked" @change="handleCheckedChange(1,-1, store_books)"></el-checkbox>
						<span style="font-size: 16px">店铺: {{store_books.goods_store_name}}</span>
					</el-col>
					<el-col :span="1">
						<a href="#" class="fl hvr-float-shadow">
							<img src="static/images/contact.jpeg" alt="#" width="15" height="15"/>
						</a>
					</el-col>
					<el-col :span="4">
						<el-popover placement="bottom-start" title="标题" width="350" trigger="click">
							<el-row style="border-bottom: 1px solid rgba(0, 0, 0, .04)">
								<span style="font-size: 12px;"><i class="fa fa-bullhorn"></i> 已经领取 {{cartsBody.coupons.have}} 张优惠券，有{{cartsBody.coupons.avaliable}}张新优惠券待领取</span>
								<el-col v-for="(it,index) in store_books.coupon.available" :key="index" style="margin-top: 10px">
									<div class="coupon-amount">
										<span class="rmb">&yen;</span>
										{{it.coupon_price}}
									</div>
									<div class="coupon-detail">
										<div class="coupon-info fl">
											<p class="coupon-title">优惠券&nbsp;满{{it.coupon_acquire}}减{{it.coupon_price}}</p>
											<p class="coupon-time">{{it.coupon_time}}</p>
										</div>
										<div class="coupon-op">
											<el-button size="mini" v-if="!it.has_received">领 取</el-button>
											<el-button size="mini" v-else>已 领 取</el-button>
										</div>
									</div>
								</el-col>
							</el-row>
							<el-button type="text" slot="reference">优惠券<i class="el-icon-arrow-down"></i></el-button>
						</el-popover>
					</el-col>
					<el-col v-for="(book, index) in store_books.goods_info" :key="index"
					        style="height: 160px;border:1px solid #ccc;margin-bottom: 5px;padding: 5px">
						<el-col :span="1" style="padding: 10px ">
							<el-checkbox v-model="book.isChecked" :disabled="book.book_invalid"
							             @change="handleCheckedChange(2, book.isChecked, store_books)"></el-checkbox>
						</el-col>
						<el-col :span="3">
							<a :href="book.book_img" class="hvr-grow-shadow" target="_blank">
								<img :src="book.book_img" alt="未能正确加载图片" width="100" height="140" :title="book.book_name"/>
							</a>
						</el-col>
						<el-col :span="8">
							<el-col :span="12">
								<el-link href="#" :underline="false" class="book-advertisement">{{book.book_ad}}</el-link>
								<el-row style="padding: 40px 0 0 10px;">
									<a href="javascript:void(0)" title="信用卡支付">
										<img src="static/images/xcard.png" alt/>
									</a>
									<a href="javascript:void(0)" title="0首付，慢慢还，拥有所爱，无需等待！">
										<img src="static/images/fenqi.png" alt/>
									</a>
									<a href="javascript:void(0)" title="消费者保障服务，卖家承诺商品如实描述">
										<img src="static/images/customer_guarantee.png" alt/>
									</a>
									<a href="javascript:void(0)" title="订单险">
										<img src="static/images/guarantee.png" alt/>
									</a>
									<a href="javascript:void(0)" title="满足7天无理由退货申请的前提下，包邮商品需要买家承担退货邮费，非包邮商品需要买家承担发货和退货邮费。">
										<img src="static/images/7day.jpg" alt/>
									</a>
								</el-row>
							</el-col>
							<el-col :span="12" class="book-description" v-on:mouseenter.native="handleHideEdition(book, false)"
							        v-on:mouseleave.native="handleHideEdition(book, true)">
								<span class="book-description-edit" v-if="book.book_des.operator_hide==false"
								      @click="OepneditOptions = true">修改</span>
								<el-dialog title="修改" :visible.sync="OepneditOptions" width="30%">
									<span>this is just text</span>
									<span slot="footer" class="dialog-footer">
							      <el-button @click="OepneditOptions = false">取 消</el-button>
							      <el-button type="primary" @click="OepneditOptions = false">确 定</el-button>
                  </span>
								</el-dialog>
								<li v-for="(value,key,index) in book.book_des.options" :key="index" class="book-description-list">
									{{key}} : {{value}}
								</li>
							</el-col>
						</el-col>
						<el-col :span="3" align="center">
							<del>
								<i class="fa fa-yen"></i>
								{{book.book_des.old_price}}
							</del>
							<br/>
							<p class="fa fa-yen">
								<strong>{{book.book_des.dis_price}}</strong>
							</p>
						</el-col>
						<el-col :span="3" align="center">
							<el-input-number size="mini" v-model="book.book_des.num" :step="1" :min="1" :max="book.book_des.buy_limit"
							                 :disabled="book.book_invalid"></el-input-number>
						</el-col>
						<el-col :span="3" align="center">
							<p class="fa fa-yen">{{ (book.book_des.num * book.book_des.dis_price).toFixed(2) }}</p>
						</el-col>
						<el-col :span="3" align="center">
							<el-popconfirm confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red"
							               title="确认将本书移入收藏夹吗？"
							               v-on:onConfirm="moveToBookMark(book,0)">
								<el-button slot="reference" type="text" :class="!book.book_invalid? 'link-operation':''"
								           :disabled="book.book_invalid || book.marked">{{ book.marked ? '已':'' }}移入收藏夹
								</el-button>
							</el-popconfirm>
							<br>
							<el-button type="text" :class="!book.book_invalid?'link-operation':''" :disabled="book.book_invalid"
							           @click="deleteBooks(0,book)">删除
							</el-button>
							<br>
							<p style="color:red;font-size:14px;font-weight:bold;" v-if="book.book_invalid">该商品已失效</p>
						</el-col>
					</el-col>
				</el-row>
				<el-row style="height: 50px;line-height: 50px;background-color: #e5e5e5;padding: 0 5px;margin-top: 10px">
					<el-col :span="12">
						<el-row>
							<el-checkbox v-model="checkAll" class="cart-body-operation">全选</el-checkbox>
							<el-button type="text" class="cart-body-operation link-operation" @click="deleteBooks(1,null)">删除
							</el-button>
							<el-button type="text" class="cart-body-operation link-operation">清除失效宝贝</el-button>
							<el-button type="text" class="cart-body-operation link-operation" @click="moveToBookMark(undefined, 1)">
								移入收藏夹
							</el-button>
							<el-button type="text" class="cart-body-operation link-operation">分享</el-button>
						</el-row>
					</el-col>
					<el-col :span="6">
						<span>共选商品 {{cartsBody.selectOptions.count}} 件   合计(不含运费):
							<i class="fa fa-yen" style="font-size: 20px;color: red">{{cartsBody.selectOptions.price}}</i></span>
					</el-col>
					<el-col :span="2" :offset="4" align="right">
						<el-button :disabled="cartsBody.selectOptions.price==0" type="danger" size="medium" @click="submitBooks">
							结算
						</el-button>
					</el-col>
				</el-row>
			</el-row>
			<el-row style="height: 40px;width: 100%">
				<el-col>
					<span class="books-display" @mouseenter="currentBooksListIndex=0">掌柜热卖</span>
					<el-divider direction="vertical"></el-divider>
					<span class="books-display" @mouseenter="currentBooksListIndex=1">最近浏览</span>
					<el-divider direction="vertical"></el-divider>
					<span class="books-display" @mouseenter="currentBooksListIndex=2">猜你喜欢</span>
				</el-col>
				<el-col>
					<el-carousel v-if="currentBooksListIndex==0" indicator-position="none">
						<el-carousel-item style="height: 100%" v-for="(hotitem,index) in bookscommend.dailyHot" :key="index">
							<el-row :gutter="50">
								<el-col :span="4" v-for="(item,index) in hotitem" :key="index" style="margin-top: 20px">
									<el-card :body-style="{ padding: '20px 0', height: '100px'}" shadow="hover"
									         style="text-align: center;" class="daily_hot_card">
										<img :src="item.book_img_url" alt="未能正确加载图片" :title="item.book_name" width="120" height="140">
										<el-col style="height: 40px;padding:20px 20px 0 20px;text-align: left">
											<span class="fa fa-yen price_info"><strong>{{item.book_price_now}}</strong></span>
											<del class="fa fa-yen price_info_del">{{item.book_price_now}}</del>
											<a href="#" class="fr">
												<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAOCAIAAABRrfAqAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAbAAAADgDiQGLfAAABQ0lEQVQ4y3WTUY7EMAhDn1GP1vTQ054t3g8gzexqURWlERiwQT5BYhrxx4TAxiCBETj9DOuFPsV0ANhIG6I2LFcAxuDE2i6z8dOCo36iX28zouKzIoHMhIAJjxmd/vbbz6mMOhCQXatQ7/m7+0tv9XVp5yuY5jEhbOCoBrP024wOWuw8xhDi05nuxkq/x4woEGW3yeNtruB2fY+/yvSGMhoL+JhTiKVtFH3O6gww9Fb6awDSWX7vQ5U7SqVVrUriXTiE+qWkmFXXbiP4zGIGouAWa8DjFrEjQ3U99Z4r2XJrZZqjWUmq5WQ2f3fFaLfpSj+++tjmcQ1E9uul5mZJWYouvfkuFY/S8VJuI0ru/2xEud29tc6eeiNl+VStRBHq2p/qQtvabVy/4vVTxqIAM1nziXpV90HPra+zKYousiTKxfUPfLezfMskNqoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMTAtMDlUMTc6MjI6NDMrMDg6MDBFHy/NAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEwLTA5VDE3OjIyOjQzKzA4OjAwNEKXcQAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII="
												     alt="包邮">
											</a>
										</el-col>
										<el-col align="left" class="book_info_mid">
											<p style="font-size: 14px">{{item.book_name}}</p>
										</el-col>
										<el-col class="book_tail">
											<p class="fl">销量:&nbsp;{{item.book_sell_num}}</p>
											<a class="fr">{{item.book_else_des}}</a>
										</el-col>
									</el-card>
								</el-col>
							</el-row>
						</el-carousel-item>
					</el-carousel>
					<el-carousel v-if="currentBooksListIndex==1" indicator-position="none">
						<el-carousel-item style="height: 100%" v-for="(hotitem,index) in bookscommend.guesslike" :key="index">
							<el-row :gutter="50">
								<el-col :span="4" v-for="(item,index) in hotitem" :key="index" style="margin-top: 20px">
									<el-card :body-style="{ padding: '20px 0', height: '100px'}" shadow="hover"
									         style="text-align: center;" class="daily_hot_card">
										<img :src="item.book_img_url" alt="未能正确加载图片" :title="item.book_name" width="120" height="140">
										<el-col style="height: 40px;padding:20px 20px 0 20px;text-align: left">
											<span class="fa fa-yen price_info"><strong>{{item.book_price_now}}</strong></span>
											<del class="fa fa-yen price_info_del">{{item.book_price_now}}</del>
											<a href="#" class="fr">
												<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAOCAIAAABRrfAqAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAbAAAADgDiQGLfAAABQ0lEQVQ4y3WTUY7EMAhDn1GP1vTQ054t3g8gzexqURWlERiwQT5BYhrxx4TAxiCBETj9DOuFPsV0ANhIG6I2LFcAxuDE2i6z8dOCo36iX28zouKzIoHMhIAJjxmd/vbbz6mMOhCQXatQ7/m7+0tv9XVp5yuY5jEhbOCoBrP024wOWuw8xhDi05nuxkq/x4woEGW3yeNtruB2fY+/yvSGMhoL+JhTiKVtFH3O6gww9Fb6awDSWX7vQ5U7SqVVrUriXTiE+qWkmFXXbiP4zGIGouAWa8DjFrEjQ3U99Z4r2XJrZZqjWUmq5WQ2f3fFaLfpSj+++tjmcQ1E9uul5mZJWYouvfkuFY/S8VJuI0ru/2xEud29tc6eeiNl+VStRBHq2p/qQtvabVy/4vVTxqIAM1nziXpV90HPra+zKYousiTKxfUPfLezfMskNqoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMTAtMDlUMTc6MjI6NDMrMDg6MDBFHy/NAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEwLTA5VDE3OjIyOjQzKzA4OjAwNEKXcQAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII="
												     alt="包邮">
											</a>
										</el-col>
										<el-col align="left" class="book_info_mid">
											<p style="font-size: 14px">{{item.book_name}}</p>
										</el-col>
										<el-col class="book_tail">
											<p class="fl">销量:&nbsp;{{item.book_sell_num}}</p>
											<a class="fr">{{item.book_else_des}}</a>
										</el-col>
									</el-card>
								</el-col>
							</el-row>
						</el-carousel-item>
					</el-carousel>
					<el-carousel v-if="currentBooksListIndex==2" indicator-position="none">
						<el-carousel-item style="height: 100%" v-for="(hotitem,index) in bookscommend.guesslike" :key="index">
							<el-row :gutter="50">
								<el-col :span="4" v-for="(item,index) in hotitem" :key="index" style="margin-top: 20px">
									<el-card :body-style="{ padding: '20px 0', height: '100px'}" shadow="hover"
									         style="text-align: center;" class="daily_hot_card">
										<img :src="item.book_img_url" alt="未能正确加载图片" :title="item.book_name" width="120" height="140">
										<el-col style="height: 40px;padding:20px 20px 0 20px;text-align: left">
											<span class="fa fa-yen price_info"><strong>{{item.book_price_now}}</strong></span>
											<del class="fa fa-yen price_info_del">{{item.book_price_now}}</del>
											<a href="#" class="fr">
												<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAOCAIAAABRrfAqAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAbAAAADgDiQGLfAAABQ0lEQVQ4y3WTUY7EMAhDn1GP1vTQ054t3g8gzexqURWlERiwQT5BYhrxx4TAxiCBETj9DOuFPsV0ANhIG6I2LFcAxuDE2i6z8dOCo36iX28zouKzIoHMhIAJjxmd/vbbz6mMOhCQXatQ7/m7+0tv9XVp5yuY5jEhbOCoBrP024wOWuw8xhDi05nuxkq/x4woEGW3yeNtruB2fY+/yvSGMhoL+JhTiKVtFH3O6gww9Fb6awDSWX7vQ5U7SqVVrUriXTiE+qWkmFXXbiP4zGIGouAWa8DjFrEjQ3U99Z4r2XJrZZqjWUmq5WQ2f3fFaLfpSj+++tjmcQ1E9uul5mZJWYouvfkuFY/S8VJuI0ru/2xEud29tc6eeiNl+VStRBHq2p/qQtvabVy/4vVTxqIAM1nziXpV90HPra+zKYousiTKxfUPfLezfMskNqoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTUtMTAtMDlUMTc6MjI6NDMrMDg6MDBFHy/NAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEwLTA5VDE3OjIyOjQzKzA4OjAwNEKXcQAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAASUVORK5CYII="
												     alt="包邮">
											</a>
										</el-col>
										<el-col align="left" class="book_info_mid">
											<p style="font-size: 14px">{{item.book_name}}</p>
										</el-col>
										<el-col class="book_tail">
											<p class="fl">销量:&nbsp;{{item.book_sell_num}}</p>
											<a class="fr">{{item.book_else_des}}</a>
										</el-col>
									</el-card>
								</el-col>
							</el-row>
						</el-carousel-item>
					</el-carousel>
				</el-col>
			</el-row>
			<el-dialog :title="cartsBody.selectOptions.title" :visible.sync="cartsBody.selectOptions.dialogOpened"
			           width="30%">
				<el-table :data="cartsBody.selectOptions.books">
					<el-table-column label="ID" prop="book_des.ID"></el-table-column>
					<el-table-column label="书名" prop="book_name"></el-table-column>
					<el-table-column label="作者" prop="author"></el-table-column>
				</el-table>
				<span slot="footer">
					<el-button @click="cartsBody.selectOptions.dialogOpened=false">取 消</el-button>
          <el-button v-if="cartsBody.selectOptions.oeprator_type == 1" type="primary" @click="moveToBookMark(null, 2 )">确 定</el-button>
					<el-button v-else-if="cartsBody.selectOptions.oeprator_type == 2" type="primary"
					           @click="deleteBooks(2, null )">确 定</el-button>
				</span>
			</el-dialog>
		</el-main>
		<el-backtop :bottom="70">
			<div style="{height: 100%;width: 100%;background-color: #f2f5f6;box-shadow: 0 0 6px rgba(0,0,0, .12);text-align: center;line-height: 40px;color: #1989fa;}">
				UP
			</div>
		</el-backtop>
		<Footer></Footer>
	</div>
</template>

<script>
  import Header1 from '../BodyComponents/Header1'
  import Footer from '../BodyComponents/Footer'

  export default {
    name: 'Cart1',
    components: {Footer, Header1},
    props: ['universities'],
    data () {
      return {
        searchOptions: ['宝贝', '书本'],
        currentOption: '宝贝',
        currentSearchKey: '',
        currentBooksListIndex: 0,
        bookscommend: {
          dailyHot: [],
          dailyHistory: [],
          guesslike: []
        },
        cartsBody: {
          counts: {
            allshops: 0,
            discountshops: 0,
            tightshops: 0,
          },
          currentCountsIndex: 0,
          selectOptions: {
            dialogOpened: false,
            price: 0.00,
            count: 0,
            books: [],
            title: '',
            oeprator_type: 1

          },
          cartsBooks: [],
          coupons: {
            have: 0,
            avaliable: 3
          },
          isIndeterminate: true
        },
        checkAll: false,
        OepneditOptions: false
      }
    },
    computed: {
      cartsEmpty () {
        return this.cartsBody.cartsBooks.length == 0
      },
      invalidCartsSize () {
        var invalidSize = 0
        this.cartsBody.cartsBooks.forEach((store) => {
          store.goods_info.forEach((book) => {
            if (book.book_invalid) invalidSize++
          })
        })
        return invalidSize
      },
      allCartsSize () {
        var allCartsize = 0
        this.cartsBody.cartsBooks.forEach((store) => {
          allCartsize += store.goods_info.length
        })
        return allCartsize
      },
      allCheckedSize () {
        var allCheckSize = 0
        this.cartsBody.cartsBooks.forEach((store) => {
          store.goods_info.forEach((book) => {
            if (book.isChecked) allCheckSize++
          })
        })
        return allCheckSize
      }
    },
    async created () {
      const _this = this
      let RetData = await this.axios_get('static/json/daily_interest.json', [])
      if (RetData != false) {
        RetData.data.forEach((data) => {
          if (data.name === 'daily_hot') {
            var hotItem = []
            data.item.forEach((book, index) => {
              if (index % 6 == 0 && hotItem.length != 0) {
                _this.bookscommend.dailyHot.push(hotItem)
                hotItem = []
              }
              hotItem.push(book)
            })
          } else if (data.name === 'daily_history') {
            var hotItem = []
            data.item.forEach((book, index) => {
              if (index % 6 == 0 && hotItem.length != 0) {
                _this.bookscommend.dailyHistory.push(hotItem)
                hotItem = []
              }
              hotItem.push(book)
            })
          } else if (data.name === 'guess_like') {
            var guesslike = []
            data.item.forEach((book, index) => {
              if (index % 6 == 0 && guesslike.length != 0) {
                _this.bookscommend.guesslike.push(guesslike)
                guesslike = []
              }
              guesslike.push(book)
            })
          }
        })
      }

      RetData = await this.axios_get('static/json/cart.json', [])
      if (RetData != false) {
        let data = RetData.data
        if (data.id == '1') {
          _this.cartsBody.cartsBooks = data.goods
          _this.cartsBody.cartsBooks.forEach(books => {
            var goods = books.goods_info
            _this.cartsBody.counts.allshops += Object.keys(goods).length
            goods.forEach(book => {
              if (book.book_des.tight_stock) _this.cartsBody.counts.tightshops++
            })
          })
        }
      }
    },
    methods: {
      handleCheckedChange: function (type, newVal, item) {
        if (type == 0) {
          this.cartsBody.cartsBooks.forEach((store) => {
            store.isChecked = newVal
            store.goods_info.forEach((book) => {
              if (!book.book_invalid) book.isChecked = newVal
            })
          })
        } else if (type == 1) { // bookstore
          var isChecked = item.isChecked
          if (item.length != 0) {
            item.goods_info.forEach((book) => {
              if (!book.book_invalid) book.isChecked = isChecked
            })
          }
        } else if (type == 2) {
          if (!newVal) {
            item.isChecked = false
          } else {
            var isCheckedSize = 0
            var allValidSize = 0

            item.goods_info.forEach((book) => {
              if (!book.book_invalid) allValidSize++
              if (!book.book_invalid && book.isChecked) isCheckedSize++
            })
            if (isCheckedSize == allValidSize) {
              item.isChecked = true
            }
          }
        }
        this.checkAll = this.allCheckedSize + this.invalidCartsSize == this.allCartsSize
        this.cartsBody.selectOptions.books = []
        this.cartsBody.cartsBooks.forEach((store) => {
          store.goods_info.forEach((book) => {
            if (!book.book_invalid && book.isChecked) {
              this.cartsBody.selectOptions.books.push(book)
            }
          })
        })
      },
      deleteBooks (type, bookItem) {
        if (type == 0) {
          if (bookItem.book_invalid) {
            return
          }
          this.cartsBody.selectOptions.books = [bookItem]
        } else if (type == 1) {
          if (this.cartsBody.selectOptions.books.length == 0) {
            this.$message({
              message: '当前没有任何书籍被选定,无法删除图书',
              type: 'warning'
            })
            return
          }
        } else if (type == 2) { // close dialog
          this.cartsBody.selectOptions.title = ''
          this.cartsBody.selectOptions.dialogOpened = false
          this.cartsBody.selectOptions.books = []
          this.$message({
            message: '删除图书成功',
            type: 'success'
          })
          return
        }
        this.cartsBody.selectOptions.title = '删除图书'
        this.cartsBody.selectOptions.dialogOpened = true
        this.cartsBody.selectOptions.oeprator_type = 2
      },
      moveToBookMark: function (item, type) {
        if (type == 0) { // remove sigle Item
          this.$message({
            message: '移入书本到收藏夹成功',
            type: 'success'
          })
          this.cartsBody.selectOptions.books = []
        } else if (type == 1) {
          if (this.cartsBody.selectOptions.books.length == 0) {
            this.$message({
              message: '当前没有任何书籍被选定,无法移入对应的收藏夹',
              type: 'warning'
            })
            return
          } else {
            this.cartsBody.selectOptions.title = '移入收藏夹'
            this.cartsBody.selectOptions.dialogOpened = true
            this.cartsBody.selectOptions.operator_type = 1
          }
        } else if (type == 2) { // close dialog
          this.$message({
            message: '移入书本到收藏夹成功',
            type: 'success'
          })
          this.cartsBody.selectOptions.dialogOpened = false
          this.cartsBody.selectOptions.title = ''
          this.cartsBody.selectOptions.books = []
          this.cartsBody.selectOptions.operator_type = 0
        }
      }
      ,
      handleHideEdition: function (item, val) {
        item.book_des.operator_hide = val
      },
      submitBooks: function () {
        if (this.cartsBody.selectOptions.books.length == 0) {
          this.$alert('当前提交的数据为空,无法提交', '套书斋提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${action}`
              })
            }
          })
        } else {
					this.$router.push({
						path:'/submit'
					});
        }
      }
    }
    ,
    watch: {
      checkAll (newVal, oldVal) {
        this.handleCheckedChange(0, newVal, undefined)
      }
      ,
      'cartsBody.selectOptions.books': {
        handler (newVal, oldVal) {
          this.cartsBody.selectOptions.price = 0
          this.cartsBody.selectOptions.count = 0
          newVal.forEach((book) => {
            this.cartsBody.selectOptions.count += book.book_des.num
            this.cartsBody.selectOptions.price += (parseFloat(book.book_des.dis_price) * parseFloat(book.book_des.num))
          })
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

	.book-advertisement {
		padding: 0 10px;
		word-break: break-all;
		-webkit-box-orient: vertical; /**设置或检索伸缩盒子对象的子元素的排列方式**/
		-webkit-line-clamp: 2; /**显示的行数**/
		overflow: hidden; /**隐藏超出的内容**/
		height: 40%;
		font-size: 16px;
		line-height: 25px;
		margin-top: 10px;
	}

	.book-advertisement:hover {
		color: orange;
	}

	.bold {
		font-size: 20px;
		font-weight: 600;
		cursor: pointer;
	}

	.books-display {
		padding: 0 10px 10px 10px;
		font-size: 16px;
		font-weight: 400;
	}

	.books-display:hover {
		border-bottom: 3px solid #ff5600;
		cursor: pointer;
	}

	.price_info {
		color: #f40;
		font-size: 20px;
	}

	.price_info_del {
		opacity: .7;
		font-size: 10px;
		margin-left: 10px;
		margin-top: 6px;
	}

	.book_info_mid {
		margin-top: 10px;
	}

	.book_info_mid p {
		font-size: 12px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.book_tail a {
		font-family: serif;
		color: #fff;
		background: #49cc00;
		padding: 1px;
		line-height: 16px;
	}

	.daily_hot_card:hover {
		border: 1px solid orange;
		cursor: pointer;
	}

	.cart-body-title {
		font-size: 1.15em;
		font-weight: 700;
		padding-bottom: 5px;
		cursor: pointer;
	}

	.cart-body-title-hovered {
		border-bottom: 3px solid orange;
	}

	.coupon-amount {
		float: left;
		width: 55px;
		height: 25px;
		line-height: 25px;
		background-position: -125px -25px;
		font-size: 14px;
		font-weight: 700;
		font-family: Arial;
		padding-left: 8px;
		background: transparent url(/static/images/favor.png) no-repeat;
	}

	.coupon-amount .rmb {
		font-weight: 400;
		padding-right: 2px;
		font-size: 12px;
	}

	.coupon-detail .coupon-info {
		float: left;
		width: 166px;
		line-height: 1;
		margin-left: 10px;
	}

	.coupon-detail .coupon-info .coupon-title {
		font-size: 12px;
		margin-bottom: 5px;
		color: #6d6d6d;
	}

	.coupon-detail .coupon-info .coupon-time {
		font-size: 12px;
		color: #a5a5a5;
		font-family: Tahoma;
	}

	.coupon-op .coupon-button {
		float: right;
		color: #666;
		display: block;
		width: auto;
		height: 23px;
		border: 1px solid #e9e9e9;
		line-height: 23px;
		text-align: center;
		margin-right: 25px;
	}

	.close-coupon {
		position: absolute;
		right: 20px;
	}

	.cart-body-operation {
		padding: 0 15px;
	}

	.link-operation {
		color: black;
	}

	.link-operation:hover {
		color: red;
		list-style: none;
	}

	li.book-description-list {
		list-style: none;
		margin: 0;
		height: 20px;
	}

	.book-description {
		padding-left: 10px;
		height: 150px;
	}

	.book-description:hover {
		border: 1px dashed red;
	}

	.book-description-edit {
		width: 40px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		height: 20px;
		right: 0;
		background: orange;
		font-size: 12px;
		text-align: center;
		float: right;
		line-height: 20px;
		cursor: pointer;
	}
</style>