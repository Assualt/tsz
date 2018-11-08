#all_book.json  -- 所有图书json

- @ img_url: 图书相对路径
- @ price_before: 图书的原价
- @ book_edition: 图书版次
- @ book_store_name: 图书的售卖店家
- @ book_description: 图书的详细介绍
- @ price_now: 图书的现价
- @ book_seller_id: 图书的售卖店家ID
- @ book_name: 图书名
- @ book_uni: 图书的收藏学校
- @ book_author: 图书的作者
- @ book_seller: 图书的售卖店家名
- @ book_tags: [] 图书的标签

# area_university.json -- 地名和大学json

- @ city: 省/直辖市/自治区/特别行政区
- @ university:[] 所在城市的大学列表

# book-discount.json -- 打折书 

- @ "book_name":"卡耐基魅力口才"  图书名
- @ "img_url":"dist/res/book_img/卡耐基.jpg" 图书地址
- @ "price_now":"5.00" 图书现价
- @ "price_before":"33.00" 图书原价
- @ "book_author":"卡耐基" 图书作者
- @ "book_edition":"第3版" 图书版次
- @ "book_publisher":"机械工业出版社" 图书出版社
- @ "book_seller":"陈" 图书售卖人名
- @ "book_uni":"海南大学" 图书售卖的大学
- @ "book_description":"" 图书描述信息

# book-new-comment.json -- 最新评论书 

- @ "book_name":"卡耐基魅力口才"  图书名
- @ "img_url":"dist/res/book_img/卡耐基.jpg" 图书地址
- @ "price_now":"5.00" 图书现价
- @ "price_before":"33.00" 图书原价
- @ "book_author":"卡耐基" 图书作者
- @ "book_edition":"第3版" 图书版次
- @ "book_publisher":"机械工业出版社" 图书出版社
- @ "book_seller":"陈" 图书售卖人名
- @ "book_uni":"海南大学" 图书售卖的大学
- @ "book_description":"" 图书描述信息

# book-popular.json -- 最新流行书 

- @ "book_name":"卡耐基魅力口才"  图书名
- @ "img_url":"dist/res/book_img/卡耐基.jpg" 图书地址
- @ "price_now":"5.00" 图书现价
- @ "price_before":"33.00" 图书原价
- @ "book_author":"卡耐基" 图书作者
- @ "book_edition":"第3版" 图书版次
- @ "book_publisher":"机械工业出版社" 图书出版社
- @ "book_seller":"陈" 图书售卖人名
- @ "book_uni":"海南大学" 图书售卖的大学
- @ "book_description":"" 图书描述信息


# book-recommend.json -- 最新推荐书籍 

- @ "book_name":"卡耐基魅力口才"  图书名
- @ "img_url":"dist/res/book_img/卡耐基.jpg" 图书地址
- @ "price_now":"5.00" 图书现价
- @ "price_before":"33.00" 图书原价
- @ "book_author":"卡耐基" 图书作者
- @ "book_edition":"第3版" 图书版次
- @ "book_publisher":"机械工业出版社" 图书出版社
- @ "book_seller":"陈" 图书售卖人名
- @ "book_uni":"海南大学" 图书售卖的大学
- @ "book_description":"" 图书描述信息


# cart.json -- 购物车.json

- @ id: 购买人ID
- @ id_name: 购买人姓名
- @ address:  
    [  {     购买人收件地址
-      "add_province":"重庆市",    收件地址省份
       "add_district":"南岸区",    收件地址区
       "add_more_detail":"重庆交通大学南岸校区学府大道66号知园小区1栋3单元", 收件地址详细地址
       "add_contact_phone":"13752913198",   收件人电话
       "add_contact_name":"侯鑫",           收件人姓名
       "add_default":true                   默认地址
       }]
      
- @ goods :[] 商品信息

        "goods_store_id":"123456",          图书书店ID
        "goods_store_name":"兴文图书",       图书书店店名
        "goods_info":[{                     图书信息
            "book_name": "何以笙箫默",       图书书名
            "book_img": "../dist/res/book_img/何以笙箫默.jpg", 图书图片
            "book_ad":"这是个广告"           图书广告词
            "book_des": [                   图书详细信息
                "num":"1"                   图书余量
                "size":"110*200*10（mm)"    图书规格
                "publisher":"人民出版社"     图书出版社
                "author":"王多多"            图书作者
                "edition":"第二版"           图书版次
                "old_price":"25.98",        图书原价
                "dis_price":"12.98"         图书打折价格
        }]

# daily_interest.json -- 每日推荐
- @ "name": "daily_hot",
- @ "item": [
-       "book_name": "历年考研英语真题解析及复习思路(基础试卷版)",
        "book_img_url": "../dist/res/book_img/历年考研英语真题解析及复习思路(基础试卷版).jpg",
        "book_title": "励志书本就选历年考研英语真题解析及复习思路(基础试卷版)",
        "book_price_now":"12.00",
        "book_price_before":"23.00",
        "book_sell_num":"30",
        "book_else_des":"优惠促销"


# hot-topic.json -- 每日热点

- @ "name": "hot-topic" 热点属性
- @ "value":[]          热点值

-       eg
        "name":"hot-bookstore",
        "value":[
        {
            "bookstore_name":"西部第1",
            "bookstore_img_url":"dist/res/user_img/5.jpg",
            "bookstore_id":"1"
        }

# user-book.json -- 个人书籍统计
- @ "name":"sunshine",
- @ "name_id":"1234561",
- @ "books":[
-      {
        "book_id":"10001",
        "book_store_id":"1234561",
        "book_store_name":"我的书店",
        "book_name":"一千零一夜",
        "book_img_url":"../dist/res/book_img/一千零一夜.jpg",
        "book_ads":"大卖特卖卖到无法或",
        "book_publish":"人民教育出版社",
        "book_author":"奥斯特洛夫斯基",
        "book_edition":"第一版",
        "book_price_before":"28",
        "book_price_now":"15",
        "book_left":"123",
        "book_else":"-"
      }

